import { gameRulesDictionary } from "../config/schedulerRules";

/**
 * 获取周三 5 点的时间戳（Aion2 周期基准）
 */
const getWednesday5amTimestamp = (date: Date = new Date()): number => {
  const d = new Date(date);
  const day = d.getDay();
  const hour = d.getHours();
  let diffDays = day - 3;
  if (diffDays < 0 || (diffDays === 0 && hour < 5)) {
    diffDays += 7;
  }
  d.setDate(d.getDate() - diffDays);
  d.setHours(5, 0, 0, 0);
  return d.getTime();
};

/**
 * 获取某个时间戳对应的“本周周期所属的周三5点时间戳”
 */
const getWeekPeriodTimestamp = (timestamp: number): number => {
  return getWednesday5amTimestamp(new Date(timestamp));
};

/**
 * 获取今天 5 点的时间戳
 */
const getToday5amTimestamp = (): number => {
  const now = new Date();
  const today5am = new Date(now);
  today5am.setHours(5, 0, 0, 0);
  if (now.getTime() < today5am.getTime()) {
    today5am.setDate(today5am.getDate() - 1);
  }
  return today5am.getTime();
};

/**
 * 【核心】通用规则解释执行器：读取 gameRulesDictionary 并自动刷新游戏数据
 */
export const executeRulesByDictionary = (gameData: any) => {
  const now = Date.now();
  const today5amTime = getToday5amTimestamp();
  const currentWednesday5am = getWednesday5amTimestamp(new Date(now));

  let hasChanges = false;

  // 建立一个分组查找映射表，方便角色快速找到自己所属的分组
  const groupMap = new Map();
  if (Array.isArray(gameData.groups)) {
    gameData.groups.forEach((g: any) => {
      groupMap.set(g.id, g);
      if (g.sort !== undefined) groupMap.set(g.sort, g);
    });
  }

  gameRulesDictionary.forEach((rule: any) => {
    const { dimension, refreshType } = rule;

    // ==========================================
    // 场景 A：服务器共享维度规则 (应用到每个 Group)
    // ==========================================
    if (dimension === "server" && Array.isArray(gameData.groups)) {
      gameData.groups.forEach((group: any) => {
        const timeField = rule.lastTimeField || "lastUpdatedAt";
        const lastTimeStr = group[timeField] || group.lastUpdatedAt || 0;
        const lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 每周三 5点 重置类规则
        if (refreshType === "weekly") {
          const lastPeriod = getWeekPeriodTimestamp(lastTime);
          if (lastPeriod < currentWednesday5am) {
            if (rule.action) {
              rule.action(group, gameData.characters);
            } else if (rule.targetField) {
              setNestedProperty(group, rule.targetField, rule.resetValue);
            }
            group[timeField] = now;
            hasChanges = true;
          }
        }

        // 2. 每天 5点 恢复/重置类规则
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.action) {
            rule.action(group);
          } else if (rule.incrementCount !== undefined) {
            const effectiveLastTime = Math.max(lastTime, group.createdAt || 0);
            const daysPassed = Math.floor(
              (today5amTime - Math.min(effectiveLastTime, today5amTime)) /
                (24 * 3600 * 1000),
            );

            if (daysPassed > 0) {
              const addTotal = daysPassed * rule.incrementCount;
              const currentCount =
                getNestedProperty(group, rule.targetField!) || 0;
              const max = rule.maxCount || 14;
              const storedMax = rule.storedMaxCount || 30;
              const storedField = rule.storedTargetField;

              let newCurrent = currentCount + addTotal;
              let currentStored = storedField
                ? getNestedProperty(group, storedField) || 0
                : 0;

              if (newCurrent > max) {
                const overflow = newCurrent - max;
                newCurrent = max;
                if (storedField) {
                  currentStored = Math.min(storedMax, currentStored + overflow);
                }
              }

              setNestedProperty(group, rule.targetField!, newCurrent);
              if (storedField) {
                setNestedProperty(group, storedField, currentStored);
              }
            }
          } else if (rule.resetValue !== undefined) {
            setNestedProperty(group, rule.targetField!, rule.resetValue);
          }

          group[timeField] = now;
          hasChanges = true;
        }
      });
    }

    // ==========================================
    // 场景 B：角色单独维度规则 (应用到每个 Character)
    // ==========================================
    if (dimension === "character" && Array.isArray(gameData.characters)) {
      gameData.characters.forEach((char: any) => {
        const ownerGroup = groupMap.get(char.group) || {};

        const ruleContext = {
          ...char,
          premiumMember: !!ownerGroup.premiumMember,
        };

        if (rule.condition && !rule.condition(ruleContext)) return;

        const timeField = rule.lastTimeField || "createDate";
        const lastTimeStr = char[timeField] || char.createDate || 0;
        const lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 固定整点触发类规则（如奥德能量：固定 2点, 5点, 8点, 11点, 14点, 17点, 20点, 23点）
        if (refreshType === "interval" && rule.increment) {
          // 有效基准时间：防止新号刚建好时把历史时间算进来
          const effectiveLastTime = Math.max(lastTime, char.createDate || 0);

          // 计算从有效上次更新时间到当前，跨越了多少个整点（3小时一个档位）
          // 我们以每天凌晨 2 点作为3小时循环的绝对锚点基准
          const anchorBase = new Date(effectiveLastTime);
          anchorBase.setHours(2, 0, 0, 0);
          let anchorTime = anchorBase.getTime();
          if (anchorTime > effectiveLastTime) {
            anchorTime -= 3 * 3600 * 1000;
          }

          let periodsPassed = 0;
          const threeHoursMs = 3 * 3600 * 1000;

          // 往后推演，统计有多少个 3 小时整点介于 effectiveLastTime 和 now 之间
          while (anchorTime + threeHoursMs <= now) {
            anchorTime += threeHoursMs;
            if (anchorTime > effectiveLastTime) {
              periodsPassed++;
            }
          }

          if (periodsPassed > 0) {
            const added = periodsPassed * rule.increment;
            const currentVal = char[rule.targetField!] || 0;
            const maxVal = ownerGroup.premiumMember
              ? 840
              : rule.maxValue || 560;
            const storedMax = rule.storedMaxValue || 2000;
            const storedField = rule.storedTargetField || "storedEnergy";

            let total = currentVal + added;
            let currentStored = char[storedField] || 0;

            if (total > maxVal) {
              const overflow = total - maxVal;
              total = maxVal;
              currentStored = Math.min(storedMax, currentStored + overflow);
            }

            char[rule.targetField!] = total;
            char[storedField] = currentStored;

            // 更新时间戳为最新对齐的整点时间（或者直接设为 now）
            char[timeField] = now;
            hasChanges = true;
          }
        }

        // 2. 每天 5点 恢复类规则（如噩梦副本）
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.incrementCount !== undefined) {
            const effectiveLastTime = Math.max(lastTime, char.createDate || 0);
            const daysPassed = Math.floor(
              (today5amTime - Math.min(effectiveLastTime, today5amTime)) /
                (24 * 3600 * 1000),
            );

            if (daysPassed > 0) {
              const addTotal = daysPassed * rule.incrementCount;
              const currentCount = char[rule.targetField!] || 0;
              const max = rule.maxCount || 14;
              const storedMax = rule.storedMaxCount || 30;
              const storedField = rule.storedTargetField;

              let newCurrent = currentCount + addTotal;
              let currentStored = storedField ? char[storedField] || 0 : 0;

              if (newCurrent > max) {
                const overflow = newCurrent - max;
                newCurrent = max;
                if (storedField) {
                  currentStored = Math.min(storedMax, currentStored + overflow);
                }
              }

              char[rule.targetField!] = newCurrent;
              if (storedField) {
                char[storedField] = currentStored;
              }
            }
          }
          char[timeField] = now;
          hasChanges = true;
        }

        // 3. 每周三 5点 重置/恢复类规则（如觉醒战、战场、圣域）
        if (refreshType === "weekly") {
          const lastPeriod = getWeekPeriodTimestamp(lastTime);
          if (lastPeriod < currentWednesday5am) {
            if ((char.createDate || 0) < currentWednesday5am) {
              if (rule.incrementCount !== undefined) {
                const max = rule.maxValue || rule.maxCount || 3;
                char[rule.targetField!] = Math.min(
                  max,
                  (char[rule.targetField!] || 0) + rule.incrementCount,
                );
              } else if (rule.resetValue !== undefined) {
                setNestedProperty(char, rule.targetField!, rule.resetValue);
              }
            }
            char[timeField] = now;
            hasChanges = true;
          }
        }
      });
    }
  });

  return hasChanges;
};

// 辅助方法：支持点号路径（如 "sanctuaryRuns.s1"）读写深层对象属性
function getNestedProperty(obj: any, path: string) {
  return path
    .split(".")
    .reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

function setNestedProperty(obj: any, path: string, value: any) {
  const parts = path.split(".");
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]]) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

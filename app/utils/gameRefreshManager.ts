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

  gameRulesDictionary.forEach((rule: any) => {
    const { dimension, refreshType } = rule;

    // ==========================================
    // 场景 A：服务器共享维度规则 (应用到每个 Group)
    // ==========================================
    if (dimension === "server" && Array.isArray(gameData.groups)) {
      gameData.groups.forEach((group: any) => {
        // 兼容兜底：如果规则指定的时间字段在数据里找不到，降级使用 lastUpdatedAt
        const timeField = rule.lastTimeField || "lastUpdatedAt";
        const lastTimeStr = group[timeField] || group.lastUpdatedAt || 0;
        const lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 每周三 5点 重置类规则
        if (refreshType === "weekly") {
          const lastPeriod = getWeekPeriodTimestamp(lastTime);
          // 只要上次更新的所属周期 < 当前周三5点周期，就代表本周还没重置过
          if (lastPeriod < currentWednesday5am) {
            if (rule.action) {
              rule.action(group, gameData.characters);
            } else if (rule.targetField) {
              setNestedProperty(group, rule.targetField, rule.resetValue);
            }
            group[timeField] = new Date(now).toISOString();
            hasChanges = true;
          }
        }

        // 2. 每天 5点 恢复/重置类规则
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.action) {
            rule.action(group);
          } else if (rule.incrementCount !== undefined) {
            // 计算距离上次更新过去了几天
            const daysPassed = Math.floor((today5amTime - Math.min(lastTime, today5amTime)) / (24 * 3600 * 1000));
            if (daysPassed > 0) {
              const addTotal = daysPassed * rule.incrementCount;
              const currentCount = getNestedProperty(group, rule.targetField!) || 0;
              const max = rule.maxCount || 14;
              const storedMax = rule.storedMaxCount || 30;
              const storedField = rule.storedTargetField;

              let newCurrent = currentCount + addTotal;
              let currentStored = storedField ? (getNestedProperty(group, storedField) || 0) : 0;

              // 如果超过主上限，溢出部分存入存储池，主上限卡死
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

          group[timeField] = new Date(now).toISOString();
          hasChanges = true;
        }
      });
    }

    // ==========================================
    // 场景 B：角色单独维度规则 (应用到每个 Character)
    // ==========================================
    if (dimension === "character" && Array.isArray(gameData.characters)) {
      gameData.characters.forEach((char: any) => {
        if (rule.condition && !rule.condition(char)) return;

        const timeField = rule.lastTimeField || "createDate";
        const lastTimeStr = char[timeField] || char.createDate || 0;
        const lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 时间间隔动态恢复类规则（如奥德能量：每3小时恢复）
        if (refreshType === "interval" && rule.intervalHours && rule.increment) {
          const hoursPassed = (now - lastTime) / (3600 * 1000);
          if (hoursPassed >= rule.intervalHours) {
            const intervals = Math.floor(hoursPassed / rule.intervalHours);
            const added = intervals * rule.increment;
            
            const currentVal = char[rule.targetField!] || 0;
            const maxVal = rule.maxValue || 560;
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

            // 保留未满一个周期的余数时间，确保计时精准
            const consumedHours = intervals * rule.intervalHours;
            char[timeField] = new Date(lastTime + consumedHours * 3600 * 1000).toISOString();
            hasChanges = true;
          }
        }

        // 2. 每天 5点 恢复类规则（如噩梦副本）
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.incrementCount !== undefined) {
            const daysPassed = Math.floor((today5amTime - Math.min(lastTime, today5amTime)) / (24 * 3600 * 1000));
            if (daysPassed > 0) {
              const addTotal = daysPassed * rule.incrementCount;
              const currentCount = char[rule.targetField!] || 0;
              const max = rule.maxCount || 14;
              const storedMax = rule.storedMaxCount || 30;
              const storedField = rule.storedTargetField;

              let newCurrent = currentCount + addTotal;
              let currentStored = storedField ? (char[storedField] || 0) : 0;

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
          char[timeField] = new Date(now).toISOString();
          hasChanges = true;
        }

        // 3. 每周三 5点 重置/恢复类规则（如觉醒战、战场、圣域）
        if (refreshType === "weekly") {
          const lastPeriod = getWeekPeriodTimestamp(lastTime);
          // 采用周期比较，彻底免疫时间戳带有秒数/毫秒数导致的误判
          if (lastPeriod < currentWednesday5am) {
            if (rule.incrementCount !== undefined) {
              const max = rule.maxValue || rule.maxCount || 3;
              char[rule.targetField!] = Math.min(
                max,
                (char[rule.targetField!] || 0) + rule.incrementCount,
              );
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
            }
            char[timeField] = new Date(now).toISOString();
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
  return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
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
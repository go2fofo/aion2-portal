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
 * 获取指定时间所在日期的 5 点时间戳
 * @param {Number} [baseTime=Date.now()] - 基准时间戳
 */
const getToday5amTimestamp = (baseTime: number = Date.now()): number => {
  const date = new Date(baseTime);
  const today5am = new Date(date);
  today5am.setHours(5, 0, 0, 0);

  // 如果基准时间还没到当天 5 点，说明它属于“上一天”的 5 点
  if (date.getTime() < today5am.getTime()) {
    today5am.setDate(today5am.getDate() - 1);
  }
  return today5am.getTime();
};
/**
 * 获取某个时间戳对应的“当天 5 点的时间戳”（用于每日固定周期判断）
 */
const getDaily5amTimestamp = (timestamp: number): number => {
  const d = new Date(timestamp);
  const fiveAm = new Date(d);
  fiveAm.setHours(5, 0, 0, 0);
  if (d.getTime() < fiveAm.getTime()) {
    fiveAm.setDate(fiveAm.getDate() - 1);
  }
  return fiveAm.getTime();
};
/**
 * 获取当前时间点之前（或刚好等于）最近的一个“周三或周六 22:10”的时间戳
 */
function getLatestArtifactCloisterResetTarget(currentTime: any) {
  let checkDate = new Date(currentTime);
  checkDate.setHours(22, 10, 0, 0);

  // 如果当前时间还没到今天22:10，先把指针拨回昨天
  if (currentTime < checkDate.getTime()) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // 往回最多推 7 天，找到最近的周三(3)或周六(6)
  for (let i = 0; i < 7; i++) {
    const day = checkDate.getDay();
    if (day === 3 || day === 6) {
      if (checkDate.getTime() <= currentTime) {
        return checkDate.getTime();
      }
    }
    checkDate.setDate(checkDate.getDate() - 1);
    checkDate.setHours(22, 10, 0, 0);
  }
  return 0;
}
/**
 * 【核心】通用规则解释执行器：读取 gameRulesDictionary 并自动刷新游戏数据
 */
export const executeRulesByDictionary = (gameData: any, mockNow?: number) => {
  const now = mockNow !== undefined ? mockNow : Date.now();
  const today5amTime = getToday5amTimestamp(now);
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
        let groupChanged = false;
        const timeField = rule.lastTimeField || "lastUpdatedAt";
        const lastTimeVal =
          group[timeField] !== undefined
            ? group[timeField]
            : group.lastUpdatedAt || 0;
        let lastTime =
          typeof lastTimeVal === "number"
            ? lastTimeVal
            : new Date(lastTimeVal).getTime();

        // 1. 每周三 5点 重置类规则（服务器共享）- 改造成多周追赶循环
        if (refreshType === "weekly") {
          const isFirstInit =
            group[timeField] === undefined ||
            group[timeField] === null ||
            group[timeField] === "";

          if (isFirstInit) {
            lastTime = 0; // 设为 0 确保触发第一次全量追赶
          }

          let lastPeriod = getWeekPeriodTimestamp(lastTime);
          const oneWeekMs = 7 * 24 * 3600 * 1000;

          // 循环追赶多个漏掉的周
          while (
            lastPeriod < currentWednesday5am &&
            (group.createdAt || 0) < currentWednesday5am
          ) {
            if (rule.incrementCount !== undefined && rule.targetField) {
              const max = rule.maxValue || rule.maxCount || 14;
              const currentCount =
                getNestedProperty(group, rule.targetField) || 0;

              setNestedProperty(
                group,
                rule.targetField,
                Math.min(max, currentCount + rule.incrementCount),
              );
            } else if (rule.resetValue !== undefined && rule.targetField) {
              setNestedProperty(group, rule.targetField, rule.resetValue);
            } else if (rule.action) {
              rule.action(group, now, gameData.characters);
            }

            groupChanged = true;
            // 时间指针向后推一周，防止死循环
            lastPeriod += oneWeekMs;
            if (rule.action) break; // 自定义 action 视为一次性全量，通常跑一次即可
          }

          if (groupChanged || isFirstInit) {
            group[timeField] = currentWednesday5am; // 对齐到最近一次周三
            hasChanges = true;
          }
        }

        // 2. 每天 5点 恢复/重置类规则（服务器共享）
        if (refreshType === "daily") {
          let currentLastTime = lastTime || group.createdAt || now;
          let lastDailyPeriod = getDaily5amTimestamp(currentLastTime);
          const oneDayMs = 24 * 60 * 60 * 1000;
          let dailyChanged = false;

          while (
            lastDailyPeriod < today5amTime &&
            (group.createdAt || 0) < today5amTime
          ) {
            if (rule.action) {
              rule.action(group);
              dailyChanged = true;
              break;
            } else if (rule.incrementCount !== undefined) {
              const currentCount =
                getNestedProperty(group, rule.targetField!) || 0;
              const max = rule.maxCount || 14;

              // 核心修改：加上每天的恢复量，如果超出上限直接等于最大值（丢弃溢出，不存 storedField）
              let newCurrent = currentCount + rule.incrementCount;
              if (newCurrent > max) {
                newCurrent = max;
              }

              setNestedProperty(group, rule.targetField!, newCurrent);
              dailyChanged = true;
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(group, rule.targetField!, rule.resetValue);
              dailyChanged = true;
            }

            lastDailyPeriod += oneDayMs;
          }

          if (dailyChanged || lastTime === 0) {
            group[timeField] = today5amTime;
            hasChanges = true;
          }
        }

        if (groupChanged || hasChanges) {
          group.lastUpdatedAt = now;
        }
      });
    }

    // ==========================================
    // 场景 B：角色单独维度规则 (应用到每个 Character)
    // ==========================================
    if (dimension === "character" && Array.isArray(gameData.characters)) {
      gameData.characters.forEach((char: any) => {
        let charChanged = false;
        const ownerGroup = groupMap.get(char.group) || {};

        const ruleContext = {
          ...char,
          premiumMember: !!ownerGroup.premiumMember,
        };

        if (rule.condition && !rule.condition(ruleContext)) return;

        const timeField = rule.lastTimeField || "createDate";
        const lastTimeStr = char[timeField] || char.createDate || 0;
        let lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 固定整点触发类规则（如奥德能量：每 3 小时）本身自带 periodsPassed 循环，无需改动
        if (refreshType === "interval" && rule.increment) {
          const effectiveLastTime = Math.max(lastTime, char.createDate || 0);

          const anchorBase = new Date(effectiveLastTime);
          anchorBase.setHours(2, 0, 0, 0);
          let anchorTime = anchorBase.getTime();
          if (anchorTime > effectiveLastTime) {
            anchorTime -= 3 * 3600 * 1000;
          }

          let periodsPassed = 0;
          const threeHoursMs = 3 * 3600 * 1000;

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

            char[timeField] = now;
            charChanged = true;
            hasChanges = true;
          }
        }

        // 2. 每天 5点 固定恢复类规则（如噩梦副本）- 改造成多天追赶循环
        if (refreshType === "daily") {
          let lastDailyPeriod = getDaily5amTimestamp(lastTime);
          const oneDayMs = 24 * 60 * 60 * 1000;
          let dailyCharChanged = false;

          while (
            lastDailyPeriod < today5amTime &&
            (char.createDate || 0) < today5amTime
          ) {
            if (rule.incrementCount !== undefined) {
              const currentCount = char[rule.targetField!] || 0;
              const max = rule.maxCount || 14;
              const storedMax = rule.storedMaxCount || 30;
              const storedField = rule.storedTargetField;

              let newCurrent = currentCount + rule.incrementCount;
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
              dailyCharChanged = true;
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
              dailyCharChanged = true;
            }

            lastDailyPeriod += oneDayMs;
          }

          if (dailyCharChanged) {
            char[timeField] = today5amTime;
            charChanged = true;
            hasChanges = true;
          }
        }

        // 2. 每天 5点 固定恢复类规则
        if (refreshType === "daily") {
          let lastDailyPeriod = getDaily5amTimestamp(lastTime);
          const oneDayMs = 24 * 60 * 60 * 1000;
          let dailyCharChanged = false;

          while (
            lastDailyPeriod < today5amTime &&
            (char.createDate || 0) < today5amTime
          ) {
            if (rule.incrementCount !== undefined) {
              const currentCount = char[rule.targetField!] || 0;
              const max = rule.maxCount || 14;

              // 核心修改：加上每天的恢复量，如果超出上限直接等于最大值（丢弃溢出，不存 storedField）
              let newCurrent = currentCount + rule.incrementCount;
              if (newCurrent > max) {
                newCurrent = max;
              }

              char[rule.targetField!] = newCurrent;
              dailyCharChanged = true;
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
              dailyCharChanged = true;
            }

            lastDailyPeriod += oneDayMs;
          }

          if (dailyCharChanged) {
            char[timeField] = today5amTime;
            charChanged = true;
            hasChanges = true;
          }
        }

        // 4. 每周三、周六 22:10 固定时间重置类规则
        if (refreshType === "artifact-cloister-fixed") {
          const effectiveLastTime = Math.max(lastTime, char.createDate || 0);
          const currentResetTarget = getLatestArtifactCloisterResetTarget(now);

          if (
            effectiveLastTime < currentResetTarget &&
            (char.createDate || 0) < currentResetTarget
          ) {
            if (rule.action) {
              rule.action(char);
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
            }

            char[timeField] = currentResetTarget;
            charChanged = true;
            hasChanges = true;
          }
        }

        if (charChanged) {
          char.lastUpdatedAt = now;
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

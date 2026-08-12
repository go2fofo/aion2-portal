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
  const today5amTime = getToday5amTimestamp(now); // 建议让时间获取函数也支持传入当前时间戳（见下方说明）
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
        const lastTimeVal =
          group[timeField] !== undefined
            ? group[timeField]
            : group.lastUpdatedAt || 0;
        const lastTime =
          typeof lastTimeVal === "number"
            ? lastTimeVal
            : new Date(lastTimeVal).getTime();

        // 1. 每周三 5点 重置类规则（服务器共享）
        if (refreshType === "weekly") {
          const timeField = rule.lastTimeField || "lastUpdatedAt";

          // 💡 如果原本没有该字段，标记一下是首次初始化，需要触发本次刷新
          const isFirstInit =
            group[timeField] === undefined ||
            group[timeField] === null ||
            group[timeField] === "";

          if (isFirstInit) {
            group[timeField] = 0; // 设为 0，确保下面的 lastPeriod 计算远小于当前周三，从而必然触发第一次重置！
          }

          const lastTimeVal = group[timeField];
          const lastTime =
            typeof lastTimeVal === "number"
              ? lastTimeVal
              : new Date(lastTimeVal).getTime();

          const lastPeriod = getWeekPeriodTimestamp(lastTime);

          if (
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
              rule.action(group, gameData.characters);
            }

            group[timeField] = now;
            hasChanges = true;
          } else if (isFirstInit) {
            // 如果虽然是首次初始化，但因为创建时间等原因没进上面的重置，也把时间更新为 now 避免重复判定
            group[timeField] = now;
          }
        }

        // 2. 每天 5点 恢复/重置类规则（服务器共享）
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.action) {
            rule.action(group);
          } else if (rule.incrementCount !== undefined) {
            const lastDailyPeriod = getDaily5amTimestamp(lastTime);
            if (
              lastDailyPeriod < today5amTime &&
              (group.createdAt || 0) < today5amTime
            ) {
              const currentCount =
                getNestedProperty(group, rule.targetField!) || 0;
              const max = rule.maxCount || 14;
              const storedMax = rule.storedMaxCount || 30;
              const storedField = rule.storedTargetField;

              let newCurrent = currentCount + rule.incrementCount;
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
            hasChanges = true;
          }
        }

        // 2. 每天 5点 固定恢复类规则（如噩梦副本）
        if (refreshType === "daily") {
          const lastDailyPeriod = getDaily5amTimestamp(lastTime);

          if (
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
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
            }

            char[timeField] = now;
            hasChanges = true;
          }
        }

        // 3. 每周三 5点 重置/恢复类规则（如觉醒战、战场、圣域）
        if (refreshType === "weekly") {
          const lastPeriod = getWeekPeriodTimestamp(lastTime);

          if (
            lastPeriod < currentWednesday5am &&
            (char.createDate || 0) < currentWednesday5am
          ) {
            if (rule.incrementCount !== undefined) {
              const max = rule.maxValue || rule.maxCount || 3;
              char[rule.targetField!] = Math.min(
                max,
                (char[rule.targetField!] || 0) + rule.incrementCount,
              );
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
            }

            char[timeField] = now;
            hasChanges = true;
          }
        }
        // 4. 每周三、周六 22:10 固定时间重置类规则
        if (refreshType === "artifact-cloister-fixed") {
          const effectiveLastTime = Math.max(lastTime, char.createDate || 0);

          // 获取当前周期对应的那个“周三/周六 22:10”的绝对时间戳
          const currentResetTarget = getLatestArtifactCloisterResetTarget(now);

          // 如果上次更新时间小于这个重置目标点，且角色创建时间也在该点之前，说明需要重置
          if (
            effectiveLastTime < currentResetTarget &&
            (char.createDate || 0) < currentResetTarget
          ) {
            if (rule.action) {
              rule.action(char);
            } else if (rule.resetValue !== undefined) {
              setNestedProperty(char, rule.targetField!, rule.resetValue);
            }

            // 更新最后重置/更新时间为当前周期锚点（或者设为 now 均可）
            char[timeField] = currentResetTarget;
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

/*
 * @Author: fofo
 * @Date: 2026-08-03
 * @Description: 游戏日常规则配置字典通用解析与执行器
 */
import { gameRulesDictionary } from "../config/schedulerRules"; // 引入你的配置字典

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
 * @param gameData 完整的游戏数据对象（包含 groups 和 characters）
 */
export const executeRulesByDictionary = (gameData: any) => {
  const now = Date.now();
  const today5amTime = getToday5amTimestamp();
  const currentWednesday5am = getWednesday5amTimestamp(new Date(now));

  let hasChanges = false;

  // 遍历配置字典中的每一条规则
  gameRulesDictionary.forEach((rule: any) => {
    const { dimension, refreshType } = rule;

    // ==========================================
    // 场景 A：服务器共享维度规则 (应用到每个 Group)
    // ==========================================
    if (dimension === "server" && Array.isArray(gameData.groups)) {
      gameData.groups.forEach((group: any) => {
        const lastTimeStr =
          group[rule.lastTimeField || "lastUpdatedAt"] || group.lastUpdatedAt;
        const lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 每周三 5点 重置类规则
        if (refreshType === "weekly" && lastTime < currentWednesday5am) {
          if (rule.action) {
            // 如果规则自带自定义动作（例如清空微风商店、深渊指令书等）
            rule.action(group, gameData.characters);
          } else if (rule.targetField) {
            // 字段赋值重置
            setNestedProperty(group, rule.targetField, rule.resetValue);
          }
          group.lastUpdatedAt = new Date(now).toISOString();
          hasChanges = true;
        }

        // 2. 每天 5点 恢复/重置类规则（如古树、次元、使命任务）
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.action) {
            rule?.action(group);
          } else if (rule.incrementCount) {
            // 每天恢复 X 次，严格受上限控制，stored 存储池绝不自动累加
            const daysPassed =
              Math.floor(
                (today5amTime - Math.min(lastTime, today5amTime)) /
                  (24 * 3600 * 1000),
              ) + 1;
            const addCount = daysPassed * rule.incrementCount;

            const currentCount =
              getNestedProperty(group, rule.targetField!) || 0;
            const max = rule.maxValue || rule.maxCount || 14;

            let total = currentCount + addCount;
            // 达到上限即卡住，不向存储池溢出
            setNestedProperty(group, rule.targetField!, Math.min(max, total));
          } else if (rule.resetValue !== undefined) {
            setNestedProperty(group, rule.targetField!, rule.resetValue);
          }

          if (rule.lastTimeField) {
            group[rule.lastTimeField] = new Date(now).toISOString();
          }
          hasChanges = true;
        }
      });
    }

    // ==========================================
    // 场景 B：角色单独维度规则 (应用到每个 Character)
    // ==========================================
    if (dimension === "character" && Array.isArray(gameData.characters)) {
      gameData.characters.forEach((char: any) => {
        // 如果有生效条件限制（例如：奥德能量区分会员与非会员）
        if (rule.condition && !rule.condition(char)) return;

        const lastTimeStr = char[rule.lastTimeField || "createDate"] || 0;
        const lastTime = lastTimeStr ? new Date(lastTimeStr).getTime() : 0;

        // 1. 时间间隔动态恢复类规则（例如：奥德能量每3小时恢复，同样去除存储池溢出，上限卡死）
        if (
          refreshType === "interval" &&
          rule.intervalHours &&
          rule.increment
        ) {
          const hoursPassed = (now - (lastTime || now)) / (3600 * 1000);
          if (hoursPassed >= rule.intervalHours) {
            const intervals = Math.floor(hoursPassed / rule.intervalHours);
            const added = intervals * rule.increment;
            const currentVal = char[rule.targetField!] || 0;
            const maxVal = rule.maxValue || 560;

            let total = currentVal + added;
            // 达到能量上限直接卡住，storedEnergy 保持不变，不自动增加
            char[rule.targetField!] = Math.min(maxVal, total);

            // 保留未满一个周期的余数时间
            const remainingMs =
              (hoursPassed % rule.intervalHours) * 3600 * 1000;
            char[rule.lastTimeField!] = new Date(
              now - remainingMs,
            ).toISOString();
            hasChanges = true;
          }
        }

        // 2. 每天 5点 恢复类规则（如噩梦副本）
        if (refreshType === "daily" && lastTime < today5amTime) {
          if (rule.incrementCount) {
            const daysPassed =
              Math.floor(
                (today5amTime - Math.min(lastTime, today5amTime)) /
                  (24 * 3600 * 1000),
              ) + 1;
            const addCount = daysPassed * rule.incrementCount;
            const currentCount = char[rule.targetField!] || 0;
            const max = rule.maxValue || rule.maxCount || 14;

            let total = currentCount + addCount;
            // 达到上限即卡住，stored 存储池不自动回复
            char[rule.targetField!] = Math.min(max, total);
          }
          if (rule.lastTimeField) {
            char[rule.lastTimeField] = new Date(now).toISOString();
          }
          hasChanges = true;
        }

        // 3. 每周三 5点 重置/恢复类规则（如觉醒战、战场、圣域）
        if (refreshType === "weekly" && lastTime < currentWednesday5am) {
          if (rule.incrementCount) {
            const max = rule.maxValue || rule.maxCount || 3;
            char[rule.targetField!] = Math.min(
              max,
              (char[rule.targetField!] || 0) + rule.incrementCount,
            );
          } else if (rule.resetValue !== undefined) {
            setNestedProperty(char, rule.targetField!, rule.resetValue);
          }
          if (rule.lastTimeField) {
            char[rule.lastTimeField] = new Date(now).toISOString();
          }
          hasChanges = true;
        }
      });
    }
  });

  return hasChanges;
};

// 辅助方法：支持安全地通过点号路径（如 "dailyRuns.count" 或 "sanctuaryRuns.s1"）读写深层对象属性
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
import { getLocalGameData, saveLocalGameData } from "@/utils/indexedDb";
import { executeRulesByDictionary } from "@/utils/gameRefreshManager";
import { useSupabaseClient, useSupabaseUser } from "#imports";

// 辅助函数：格式化日期为 YYYY-MM-DD HH:mm 或 YYYY-MM-DD
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 1. 当前角色自主输入剩余天数时，动态计算开通日期
const calculatedStartTime = (premiumMemberDay: any) => {
  const remainingDays = Number(premiumMemberDay) || 0;
  if (remainingDays < 0 || remainingDays > 28) return "剩余天数应在 0~28 之间";

  const totalDays = 28;
  const passedDays = totalDays - remainingDays; // 已经过去的天数

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - passedDays);
  return formatDate(startDate);
};

// 2. 当前角色自主输入剩余天数时，动态计算结束（到期）日期
const calculatedEndTime = (premiumMemberDay: any) => {
  const remainingDays = Number(premiumMemberDay) || 0;
  if (remainingDays < 0 || remainingDays > 28) return "无效范围";

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + remainingDays);
  return formatDate(endDate);
};

/**
 * 1. 判断一个值是否为有效的时间戳（支持 13位毫秒 或 10位秒）
 * @param {any} value 需要检测的值
 * @returns {boolean}
 */
export const isTimestamp = (value: any) => {
  if (value === null || value === undefined) return false;

  let num = null;
  if (typeof value === "number" && !isNaN(value)) {
    num = value;
  } else if (typeof value === "string" && /^\d{10,13}$/.test(value.trim())) {
    num = Number(value.trim());
  }

  if (num === null) return false;

  // 如果是 10 位秒级时间戳，转成毫秒进行校验
  if (num.toString().length === 10) {
    num *= 1000;
  }

  // 合理的时间戳范围限制（约 2000年 ~ 2100年 之间）
  return num >= 946684800000 && num <= 4102444800000;
};

/**
 * 2. 全能时间转时间戳方法（支持时间戳、Date对象、标准ISO字符串、带中文“下午/上午”及斜杠的自定义格式）
 * @param {any} input 输入的时间（可以是数字、字符串、Date对象或包含时间字段的日志对象）
 * @returns {number} 返回毫秒级时间戳，若解析失败返回 0
 */
export const convertToTimestamp: any = (input: any) => {
  if (!input) return 0;

  // A. 如果输入本身是一个对象（比如传进来的是整个 log 对象）
  if (typeof input === "object" && !(input instanceof Date)) {
    // 优先检查对象里有没有自带的 timestamp 字段
    if (isTimestamp(input.timestamp))
      return Number(
        input.timestamp.toString().length === 10
          ? input.timestamp * 1000
          : input.timestamp,
      );
    if (isTimestamp(input.createdAt))
      return Number(
        input.createdAt.toString().length === 10
          ? input.createdAt * 1000
          : input.createdAt,
      );
    if (isTimestamp(input.date))
      return Number(
        input.date.toString().length === 10 ? input.date * 1000 : input.date,
      );

    // 如果没有，则依次尝试取对象的 createdAt 或 date 字段去解析
    const targetStr = input.createdAt || input.date;
    return convertToTimestamp(targetStr);
  }

  // B. 如果本身已经是 Date 对象
  if (input instanceof Date) {
    const time = input.getTime();
    return isNaN(time) ? 0 : time;
  }

  // C. 如果本身就是数字或纯数字字符串形式的时间戳
  if (isTimestamp(input)) {
    let num = Number(input);
    return num.toString().length === 10 ? num * 1000 : num;
  }

  // D. 如果是字符串，处理各种复杂文本格式
  if (typeof input === "string") {
    let raw = input.trim();

    // 1. 处理带中文“下午/上午”的格式（如 "6/8/2026 下午10:11:44"）
    if (raw.includes("下午") || raw.includes("上午")) {
      const isPM = raw.includes("下午");
      const nums = raw.match(/\d+/g);

      if (nums && nums.length >= 6) {
        let month = parseInt(nums[0], 10);
        let day = parseInt(nums[1], 10);
        let year = parseInt(nums[2], 10);
        let hour = parseInt(nums[3], 10);
        let minute = parseInt(nums[4], 10);
        let second = parseInt(nums[5], 10);

        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        const standardizedStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
        const time = new Date(standardizedStr).getTime();
        if (!isNaN(time)) return time;
      }
    }

    // 2. 尝试用标准 JS 原生 Date 解析（支持 ISO 格式如 "2026-08-07T05:00:00.000Z" 或 "2026-08-07"）
    const standardTime = new Date(raw).getTime();
    if (!isNaN(standardTime)) return standardTime;
  }

  return 0;
};
/**
 * 🛠️ 数据自愈与平滑迁移方法：修复历史版本中数据缺失或者变更修补数据
 * @param {Object} gameData 原始游戏数据对象
 * @returns {boolean} 返回是否有数据被修复/变动过
 */
const sanitizeGameData = (gameData: any) => {
  if (!gameData || !gameData.groups || !Array.isArray(gameData.groups)) {
    return false;
  }

  let hasModified = false;
  const nowIso = Date.now();

  let groupsTimes = [
    "lastRunsUpdate",

    "lastTranscendRunsUpdate",

    "lastDailyRunsUpdate",
    "lastMinigameUpdate",
    "lastDimensionalUpdate",

    "lastUpdatedAt",
    "updatedAt",
    "createdAt",
  ];
  let runLogsTimes = ["createdAt", "updatedAt"];
  let charactersTimes = [
    "lastSanctuaryRunsUpdate",
    "lastBattlefieldUpdate",

    "lastAwakeningUpdate",
    "lastNightmareUpdate",

    "lastEnergyUpdate",

    "breezeCharOdDate",
    "materialCharOdDate",
    "dailyMissionDate",

    "createDate",
  ];

  // 遍历所有分组进行清洗
  gameData?.groups.forEach((group: any) => {
    //判断分组时间
    // A. 清洗分组自身的时间字段
    groupsTimes.forEach((field) => {
      if (
        group[field] !== undefined &&
        group[field] !== null &&
        !isTimestamp(group[field])
      ) {
        group[field] = convertToTimestamp(group[field]);
        hasModified = true;
      }
    });

    // B. 清洗分组内的日志流水 (runLogs)
    if (Array.isArray(group.runLogs)) {
      group.runLogs.forEach((log: any) => {
        runLogsTimes.forEach((field) => {
          if (
            log[field] !== undefined &&
            log[field] !== null &&
            !isTimestamp(log[field])
          ) {
            log[field] = convertToTimestamp(log[field]);
            hasModified = true;
          }
        });
      });
    }

    // 假设次元袭击挑战次数的上限阈值是 7
    const MAX_DIMENSIONAL_LIMIT = 7;

    // 判断当前分组的 dimensionalCount 是否存在且超过了 7
    if (
      group.dimensionalCount !== undefined &&
      group.dimensionalCount !== null &&
      Number(group.dimensionalCount) > MAX_DIMENSIONAL_LIMIT
    ) {
      console.log(
        `[DataMigration] 分组 [${group.name || group.id}] 的次元袭击次数 (${group.dimensionalCount}) 超过上限，已自动平滑修正为 ${MAX_DIMENSIONAL_LIMIT}`,
      );

      group.dimensionalCount = MAX_DIMENSIONAL_LIMIT;
      group.lastDimensionalUpdate = nowIso; // 同步更新时间戳
      // 标记为有变动
      hasModified = true;
    }
    // 会员相关时间赋值
    if (
      group?.premiumMember &&
      !group.premiumStartTime &&
      !group.premiumEndTime
    ) {
      group.premiumStartTime = calculatedStartTime(group.premiumMemberDay);
      group.premiumEndTime = calculatedEndTime(group.premiumMemberDay);
      console.log(
        `[DataMigration] 分组 [${group.name || group.id}] 的会员时间已更新`,
      );
      // 标记为有变动
      hasModified = true;
    }
    //

    //判断会员是否过期了

    if (
      group.premiumEndTime &&
      group.premiumStartTime &&
      group.premiumEndTime
    ) {
      // 1. 获取今天本地日期的 00:00:00 时间戳
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();

      // 2. 将会员结束时间（"2026-08-24"）安全转换为本地 00:00:00 时间戳
      // 最佳实践：通过分割字符串创建日期，避免 JS 引擎的时区误解
      let endTimestamp = 0;
      if (group.premiumEndTime) {
        const [year, month, day] = group.premiumEndTime.split("-").map(Number);
        // 注意：month 从 0 开始，所以要 -1
        const endDate = new Date(year, month - 1, day);
        endDate.setHours(0, 0, 0, 0);
        endTimestamp = endDate.getTime();
      }

      // 3. 判断会员是否过期（结束时间戳小于今天零点时间戳，即为已过期）
      if (
        group.premiumMember &&
        endTimestamp > 0 &&
        endTimestamp < todayTimestamp
      ) {
        group.premiumMember = false;
        group.premiumStartTime = "";
        group.premiumEndTime = "";
        group.premiumMemberDay = 0;

        console.log(
          `[DataMigration] 分组 [${group.name || group.id}] 的会员已过期，已自动重置`,
        );

        // 相关组下的角色处理...
        gameData.characters.forEach((char: any) => {
          if (char.energy > 560 && char.group == group.id) {
            char.energy = 560;
            char.lastEnergyUpdate = new Date().toISOString();
          }
        });

        hasModified = true;
      }
    }

    // ================角色周常时间戳异常自愈逻辑 ====================
    if (Array.isArray(gameData.characters)) {
      const safePastDate = new Date(
        Date.now() - 7 * 24 * 3600 * 1000,
      ).toISOString();

      // 计算本周三 5 点的基准时间戳
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

      const currentWednesday5am = getWednesday5amTimestamp();

      gameData.characters.forEach((char: any) => {
        const updateTime = char.lastBattlefieldUpdate
          ? new Date(char.lastBattlefieldUpdate).getTime()
          : 0;

        // 判定条件1：时间格式本身无效（NaN 或空）
        const isInvalidFormat = !updateTime || isNaN(updateTime);

        // 判定条件2：时间落在了“本周三 5 点整”到“5点零5分”之间（精准捕获那个因初始化产生的错误时间戳）
        // 你的错误时间是 05:00:40，正好落在这个危险区间内
        const isBuggyTimestamp =
          updateTime >= currentWednesday5am &&
          updateTime <= currentWednesday5am + 5 * 60 * 1000;

        if (isInvalidFormat || isBuggyTimestamp) {
          console.log(
            `[DataMigration] 角色 [${char.characterName || char.id}] 的战场更新时间异常（检测到临界点死锁时间），已自动自愈`,
          );
          char.lastBattlefieldUpdate = safePastDate;
          hasModified = true;
        }
      });
    }
  });

  //遍历所有角色进行清洗
  gameData?.characters?.length &&
    gameData?.characters.forEach((char: any) => {
      charactersTimes.forEach((field) => {
        if (
          char[field] !== undefined &&
          char[field] !== null &&
          !isTimestamp(char[field])
        ) {
          char[field] = convertToTimestamp(char[field]);
          hasModified = true;
        }
      });

      // 如果角色身上也有自己的 runLogs，同样进行清洗
      if (Array.isArray(char.runLogs)) {
        char.runLogs.forEach((log: any) => {
          runLogsTimes.forEach((field) => {
            if (
              log[field] !== undefined &&
              log[field] !== null &&
              !isTimestamp(log[field])
            ) {
              log[field] = convertToTimestamp(log[field]);
              hasModified = true;
            }
          });
        });
      }
    });

  return { gameData, hasModified };
};

export const useGameRefresh = () => {
  const client: any = useSupabaseClient();
  const user = useSupabaseUser();

  // 保存定时器句柄的引用
  let timer: number | NodeJS.Timeout | null = null;

  /**
   * 加载游戏数据（优先云端，降级本地）
   */
  const loadGameData = async () => {
    try {
      if (user?.value && client) {
        const { data }: any = await client
          .from("user_game_data")
          .select("data")
          .eq("user_id", user.value.id)
          .single();

        if (data && data?.data) {
          return data.data;
        }
      }

      // 降级读取本地 IndexedDB（注意带上你项目里的数据key，如 'current_data'）
      const localData = await getLocalGameData("current_data");
      if (localData) {
        return localData;
      }
      return null;
    } catch (error) {
      console.error("[GameRefresh] 加载数据异常:", error);
      // 异常时尝试从本地兜底
      return await getLocalGameData("current_data");
    }
  };

  /**
   * 保存游戏数据（同步云端或本地）
   */
  const saveGameData = async (gameData: any) => {
    try {
      if (gameData) {
        gameData.exportDate = new Date().toLocaleString();
      }

      if (user?.value && client) {
        await client.from("user_game_data")?.upsert(
          {
            user_id: user.value.id,
            data: gameData,
            updated_at: new Date(),
          },
          { onConflict: "user_id" },
        );
      } else {
        const cleanData = JSON.parse(JSON.stringify(gameData));
        if (typeof saveLocalGameData === "function") {
          await saveLocalGameData(cleanData, "current_data");
        } else {
          localStorage.setItem(
            "aion2_portal_game_data",
            JSON.stringify(cleanData),
          );
        }
      }
    } catch (error) {
      console.error("[GameRefresh] 保存数据失败:", error);
    }
  };

  /**
   * 执行数据规则刷新核心方法
   */
  const executeDataRefresh = async () => {
    try {
      // 1. 获取最新数据
      let loadGameDataRes = await loadGameData();
      if (!loadGameDataRes) return false;
      // 由于结构变化或者更改，需要重新补充或者更改数据所以在此需要处理数据
      const { gameData, hasModified }: any = sanitizeGameData(
        JSON.parse(JSON.stringify(loadGameDataRes)),
      );

      //表示有规则变动触发刷新
      let hasRulesModified = executeRulesByDictionary(gameData);
      if (hasRulesModified) {
        console.log(
          `🔍 [useGameRefresh:170] %c executeRulesByDictionary有规则变动: `,
          "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
          hasRulesModified,
        );
      }
      //  有变动则持久化并同步
      if (hasModified || hasRulesModified) {
        await saveGameData(gameData);
        return true;
      }

      return false;
    } catch (error) {
      console.error("[GameRefresh] 刷新失败:", error);
      return false;
    }
  };

  /**
   * 启动自动刷新定时器（每分钟执行一次跨天/跨周/能量溢出监测）
   */
  const initAutoRefreshTimer = () => {
    if (timer) clearInterval(timer);

    timer = setInterval(async () => {
      console.log("[GameRefresh] 执行后台定时刷新监测...");
      await executeDataRefresh();
    }, 60 * 1000); // 每 60 秒触发一次
  };

  /**
   * 停止自动刷新定时器（在页面卸载时调用，防止内存泄漏）
   */
  const stopAutoRefreshTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      console.log("[GameRefresh] 后台定时刷新监测已停止");
    }
  };

  return {
    executeDataRefresh,
    initAutoRefreshTimer,
    stopAutoRefreshTimer,
  };
};

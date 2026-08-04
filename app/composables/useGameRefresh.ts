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
 * 🛠️ 数据自愈与平滑迁移方法：修复历史版本中超限的“次元袭击”等字段
 * @param {Object} gameData 原始游戏数据对象
 * @returns {boolean} 返回是否有数据被修复/变动过
 */
const sanitizeGameData = (gameData: any) => {
  if (!gameData || !gameData.groups || !Array.isArray(gameData.groups)) {
    return false;
  }

  let hasModified = false;
  const nowIso = new Date().toISOString();

  // 遍历所有分组进行清洗
  gameData.groups.forEach((group: any) => {
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
    if (group.premiumMember) {
      group.premiumStartTime = calculatedStartTime(group.premiumMemberDay);
      group.premiumEndTime = calculatedEndTime(group.premiumMemberDay);
        console.log(
        `[DataMigration] 分组 [${group.name || group.id}] 的会员时间已更新`,
      );
      // 标记为有变动
      hasModified = true;
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
      const { gameData, hasModified } :any= sanitizeGameData(JSON.parse(JSON.stringify(loadGameDataRes)));

      //  有变动则持久化并同步
      if (hasModified) {
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

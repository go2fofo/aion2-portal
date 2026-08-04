import { ref } from "vue";
import { getLocalGameData, saveLocalGameData } from "@/utils/indexedDb";
import { executeRulesByDictionary } from "@/utils/gameRefreshManager";
import { useSupabaseClient, useSupabaseUser } from "#imports";

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
      const localData = await getLocalGameData('current_data');
      if (localData) {
        return localData;
      }
      return null;
    } catch (error) {
      console.error("[GameRefresh] 加载数据异常:", error);
      // 异常时尝试从本地兜底
      return await getLocalGameData('current_data');
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
          await saveLocalGameData(cleanData, 'current_data');
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
      const gameData = await loadGameData();
      if (!gameData) return false;

      // 2. 丢给规则配置解释器，自动比对并批量刷新
      const hasChanges = executeRulesByDictionary(gameData);

      // 3. 有变动则持久化并同步
      if (hasChanges) {
        await saveGameData(gameData);
        console.log(
          "[GameRefresh] 配置字典驱动：日常与副本数据已按规则自动刷新",
        );
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
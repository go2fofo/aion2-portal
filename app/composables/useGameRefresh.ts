import { ref } from "vue";
import { getLocalGameData, saveLocalGameData } from "@/utils/indexedDb";
import { executeRulesByDictionary } from "@/utils/gameRefreshManager";
const client:any = useSupabaseClient();
const user = useSupabaseUser();

export const useGameRefresh = () => {
  // 保存定时器句柄的引用
  let timer: number | NodeJS.Timeout | null = null;

  const executeDataRefresh = async () => {
    try {
      // 加载数据
      const loadData = async () => {
        if (user.value) {
          const { data }: any = await client
            .from("user_game_data")
            .select("data")
            .eq("user_id", user.value.id)
            .single();

          if (data && data?.data) {
            return data?.data;
          } else {
            const localData = await getLocalGameData();
            if (localData) {
              return localData;
            }
          }
        } else {
          const localData = await getLocalGameData();
          if (localData) {
            return localData;
          }
        }
      };
      const gameData = await loadData();

      if (!gameData) return false;

      // 数据持久化
      const saveData = async () => {
        if (gameData) {
          gameData.exportDate = new Date().toLocaleString();
        }

        try {
          if (
            typeof user !== "undefined" &&
            user.value &&
            typeof client !== "undefined"
          ) {
            await client.from("user_game_data")?.upsert(
              {
                user_id: user.value.id,
                data: gameData,
                updated_at: new Date(),
              },
              { onConflict: "user_id" },
            );
          } else if (typeof saveLocalGameData === "function") {
            const cleanData = JSON.parse(JSON.stringify(gameData));
            await saveLocalGameData(cleanData);
          } else {
            localStorage.setItem(
              "aion2_portal_game_data",
              JSON.stringify(gameData),
            );
          }
        } catch (error) {
          console.error("保存数据失败:", error);
        } finally {
        }
      };

      // 2. 丢给规则配置解释器，它会自动比对规则并批量刷新
      const hasChanges = executeRulesByDictionary(gameData);
      // 3. 有变动则持久化并同步
      if (hasChanges) {
        gameData.exportDate = new Date().toLocaleString();
        // 如果需要同步到 本地数据库或者云端
        await saveData();

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
    // 防止重复绑定多个定时器
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

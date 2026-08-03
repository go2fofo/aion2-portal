import { getLocalGameData, saveLocalGameData } from '@/utils/indexedDb';
import { executeRulesByDictionary } from '@/utils/gameRefreshManager'; // 导入上面写好的字典解释器

export const useGameRefresh = () => {
  const executeDataRefresh = async () => {
    try {
      // 1. 读取本地 IndexedDB
      const gameData = await getLocalGameData('current_data');
      if (!gameData) return false;

      // 2. 丢给规则配置解释器，它会自动比对 gameRulesDictionary 并批量刷新
      const hasChanges = executeRulesByDictionary(gameData);

      // 3. 有变动则持久化并同步
      if (hasChanges) {
        gameData.exportDate = new Date().toISOString();
        await saveLocalGameData(gameData, 'current_data');
        
        // 同步到 Supabase 云端
        // await syncToSupabase(gameData);
        
        console.log('[GameRefresh] 配置字典驱动：日常与副本数据已按规则自动刷新');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[GameRefresh] 刷新失败:', error);
      return false;
    }
  };

  return { executeDataRefresh };
};
/*
 * @Author: fofo
 * @Date: 2026-09-03 09:21:17
 * @LastEditTime: 2026-09-11 09:44:38
 * @LastEditors: fofo
 * @Description:
 * @FilePath: /aion2-portal/app/stores/useGameStore.ts
 */
// stores/useGameStore.ts
import { defineStore } from "pinia";
import cloneDeep from "lodash/cloneDeep";
import { saveLocalGameData, getLocalGameData } from "@/utils/indexedDb";
export const useGameStore = defineStore("game", {
  state: () => ({
    gameData: null as any,
  }),
  actions: {
    // 初始化时从本地 IndexedDB 加载数据
    async initGameData() {
      try {
        const localData = await getLocalGameData();
        this.gameData = localData ? cloneDeep(localData) : null;
      } catch (error) {
        console.error("初始化加载本地游戏数据失败:", error);
        this.gameData = null;
      }
    },
    async setGameData(data: any, source: string = 'unknown') {
      console.log(`🔍 [useGameStore:29] %c 执行setGameData: `,'font-size:14px; background:#26A08F; color:#fff;font-weight: bold;', );
      const cloned = cloneDeep(data);
      this.gameData = cloned;
      await saveLocalGameData(cloned, 'current_data', "piain==setGameData==="+source);
    },
  },
});

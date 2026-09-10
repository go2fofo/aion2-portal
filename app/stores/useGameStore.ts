/*
 * @Author: fofo
 * @Date: 2026-09-03 09:21:17
 * @LastEditTime: 2026-09-10 15:05:05
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
      const cloned = cloneDeep(data);
      this.gameData = cloned;
      await saveLocalGameData(cloned, 'current_data', "piain==setGameData==="+source);
    },
  },
});

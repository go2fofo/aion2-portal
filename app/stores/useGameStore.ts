/*
 * @Author: fofo
 * @Date: 2026-09-03 09:21:17
 * @LastEditTime: 2026-09-03 09:21:45
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/stores/useGameStore.ts
 */
// stores/useGameStore.ts
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 你的全局游戏核心数据
    gameData: null as any,
  }),
  actions: {
    // 设置或更新数据的方法
    setGameData(data: any) {
      this.gameData = data
    },
  },
})
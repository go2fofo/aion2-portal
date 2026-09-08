/*
 * @Author: fofo
 * @Date: 2026-09-03 09:21:17
 * @LastEditTime: 2026-09-08 11:08:14
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/stores/useGameStore.ts
 */
// stores/useGameStore.ts
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameData: null as any,
  }),
  actions: {
    setGameData(data: any) {
      this.gameData = data
    },
  },
})
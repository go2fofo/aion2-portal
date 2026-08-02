/*
 * @Author: fofo
 * @Date: 2026-07-27 16:03:34
 * @LastEditTime: 2026-08-02 22:27:39
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/utils/indexedDb.ts
 */
// utils/indexedDb.ts

const DB_NAME = 'aion2_portal_db'
const STORE_NAME = 'game_data'
const DB_VERSION = 2

export const STORES = {
  GAME_DATA: 'game_data',
  SETTINGS: 'settings',
  BACKUP_HISTORY: 'backup_history'
} as const

/**
 * 打开或初始化 IndexedDB 数据库
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB 不支持当前环境'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      Object.values(STORES).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName)
        }
      })
    }
  })
}

/**
 * 获取本地存储的游戏 JSON 数据
 */
export const getLocalGameData = async <T = any>(key: string = 'current_data'): Promise<T | null> => {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve((request.result as T) || null)
    })
  } catch (error) {
    console.log('获取本地存储的游戏 JSON 数据失败 IndexedDB:', error)
    return null
  }
}

/**
 * 保存游戏 JSON 数据到本地
 */
export const saveLocalGameData = async <T = any>(data: T, key: string = 'current_data'): Promise<IDBValidKey | void> => {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(data, key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  } catch (error) {
    console.log('保存游戏 JSON 数据到本地失败 IndexedDB:', error)
  }
}

/**
 * 清除本地游戏数据
 */
export const clearLocalGameData = async (key: string = 'current_data'): Promise<void> => {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.log('清除本地游戏数据失败 IndexedDB:', error)
  }
}

// ==================== 卡片布局配置专用持久化方法 ====================

const CARD_CONFIG_KEY = 'card_layout_config'

/**
 * 获取持久化的卡片布局配置
 */
export const getLocalCardConfig = async <T = any>(): Promise<T | null> => {
  return getLocalGameData<T>(CARD_CONFIG_KEY)
}

/**
 * 保存卡片布局配置到本地
 */
export const saveLocalCardConfig = async <T = any>(config: T): Promise<IDBValidKey | void> => {
  return saveLocalGameData<T>(config, CARD_CONFIG_KEY)
}
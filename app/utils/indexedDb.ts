/*
 * @Author: fofo
 * @Date: 2026-07-27 16:03:34
 * @LastEditTime: 2026-07-27 16:06:00
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/utils/indexedDb.ts
 */
// utils/indexedDb.ts

const DB_NAME = 'aion2_portal_db'
const STORE_NAME = 'game_data'
const DB_VERSION = 1

/**
 * 打开或初始化 IndexedDB 数据库
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB 不支持当前环境环境'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

/**
 * 获取本地存储的游戏 JSON 数据
 */
export const getLocalGameData = async <T = any>(): Promise<T | null> => {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('current_data')

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
export const saveLocalGameData = async <T = any>(data: T): Promise<IDBValidKey | void> => {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(data, 'current_data')

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
export const clearLocalGameData = async (): Promise<void> => {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete('current_data')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.log('清除本地游戏数据失败 IndexedDB:', error)
  }
}
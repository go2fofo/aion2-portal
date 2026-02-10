/*
 * @Author: whq
 * @Date: 2026-02-10 16:25:14
 * @LastEditTime: 2026-02-10 16:25:15
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/types/database.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: { [key: string]: any }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
      }
    }
    Views: {
      [key: string]: {
        Row: { [key: string]: any }
      }
    }
    Functions: {
      [key: string]: {
        Args: { [key: string]: any }
        Returns: any
      }
    }
    Enums: {
      [key: string]: any
    }
  }
}

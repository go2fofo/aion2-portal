export interface Database {
  public: {
    Tables: {
      site_config: {
        Row: {
          id: number
          key: string
          value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: any
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          title: string
          content: string
          type: 'news' | 'fresh' | 'analysis' | 'rank' // 对应 Tab 类型
          is_pinned: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          type: 'news' | 'fresh' | 'analysis' | 'rank'
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          type?: 'news' | 'fresh' | 'analysis' | 'rank'
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}

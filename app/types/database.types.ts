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
      legion_members: {
        Row: {
          id: number
          created_at: string
          updated_at: string | null
          character_id: string
          name: string
          server_id: number | null
          race_id: number | null
          level: number | null
          class_name: string | null
          profile_url: string | null
          role: string | null
          join_date: string | null
          note: string | null
          gender: string | null
          item_level: number | null
          title_name: string | null
          abyss_rank: string | null
          server_name: string | null
          region_name: string | null
          pc_id: number | null
          gender_name: string | null
          title_id: number | null
          title_grade: string | null
          race_name: string | null
          stat_list: any | null
          board_list: any | null
          ranking_list: any | null
          title_list: any | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string | null
          character_id: string
          name: string
          server_id?: number | null
          race_id?: number | null
          level?: number | null
          class_name?: string | null
          profile_url?: string | null
          role?: string | null
          join_date?: string | null
          note?: string | null
          gender?: string | null
          item_level?: number | null
          title_name?: string | null
          abyss_rank?: string | null
          server_name?: string | null
          region_name?: string | null
          pc_id?: number | null
          gender_name?: string | null
          title_id?: number | null
          title_grade?: string | null
          race_name?: string | null
          stat_list?: any | null
          board_list?: any | null
          ranking_list?: any | null
          title_list?: any | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string | null
          character_id?: string
          name?: string
          server_id?: number | null
          race_id?: number | null
          level?: number | null
          class_name?: string | null
          profile_url?: string | null
          role?: string | null
          join_date?: string | null
          note?: string | null
          gender?: string | null
          item_level?: number | null
          title_name?: string | null
          abyss_rank?: string | null
          server_name?: string | null
          region_name?: string | null
          pc_id?: number | null
          gender_name?: string | null
          title_id?: number | null
          title_grade?: string | null
          race_name?: string | null
          stat_list?: any | null
          board_list?: any | null
          ranking_list?: any | null
          title_list?: any | null
        }
      }
    }
  }
}

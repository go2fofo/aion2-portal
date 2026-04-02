import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const query = getQuery(event)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50))

  const { data, error } = await client
    .from('dungeon_plans')
    .select('*')
    .order('start_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data || [], viewer: { id: user?.id || null } }
})


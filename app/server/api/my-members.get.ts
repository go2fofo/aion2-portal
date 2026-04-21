import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return { success: false, error: 'Unauthorized' }

  const query = getQuery(event)
  const limit = Math.min(500, Math.max(1, Number(query.limit) || 200))

  const { data, error } = await client
    .from('my_members')
    .select('*')
    .order('updated_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { success: false, error: error.message }
  return { success: true, data: data || [] }
})


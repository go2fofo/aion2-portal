import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const query = getQuery(event)

  const view = String(query.view || 'public')
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50))

  let q = client.from('dungeon_plans').select('*')

  if (view === 'mine') {
    if (!user?.id) return { success: true, data: [], viewer: { id: null } }
    q = q.eq('created_by', user.id)
  } else {
    q = q.eq('is_public', true)
  }

  const { data, error } = await q
    .order('start_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { success: false, error: error.message, viewer: { id: user?.id || null } }
  return { success: true, data: data || [], viewer: { id: user?.id || null } }
})


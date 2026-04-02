import { defineEventHandler, getRouterParam } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'Missing id' }

  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  const { data, error } = await client.from('dungeon_plans').select('*').eq('id', id).maybeSingle()
  if (error) return { success: false, error: error.message }
  if (!data) return { success: false, error: 'Not found' }

  if (!data.is_public && user?.id && data.created_by && data.created_by !== user.id) {
    return { success: false, error: 'Not found' }
  }

  if (!data.is_public && !user?.id) {
    return { success: false, error: 'Not found' }
  }

  return { success: true, data, viewer: { id: user?.id || null } }
})


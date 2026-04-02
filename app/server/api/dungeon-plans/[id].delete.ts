import { defineEventHandler, getRouterParam } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'Missing id' }

  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return { success: false, error: 'Unauthorized' }

  const { error } = await client.from('dungeon_plans').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
})


import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'Missing id' }

  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return { success: false, error: 'Unauthorized' }

  const body: any = await readBody(event)
  const payload: any = { updated_at: new Date().toISOString() }

  if (body?.remark !== undefined) payload.remark = body.remark ? String(body.remark) : null
  if (body?.character_name !== undefined) payload.character_name = String(body.character_name || '').trim()

  const { data, error } = await client.from('my_members').update(payload).eq('id', id).select('*').maybeSingle()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
})


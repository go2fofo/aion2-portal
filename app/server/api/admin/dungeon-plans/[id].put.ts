import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'Missing id' }

  const client = await serverSupabaseClient(event)
  const body: any = await readBody(event)

  const payload = {
    title: body?.title !== undefined ? String(body.title || '').trim() : undefined,
    start_at: body?.start_at !== undefined ? String(body.start_at || '') : undefined,
    notes: body?.notes !== undefined ? (body.notes ? String(body.notes) : null) : undefined,
    teams: body?.teams !== undefined ? body.teams : undefined,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await client
    .from('dungeon_plans')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
})


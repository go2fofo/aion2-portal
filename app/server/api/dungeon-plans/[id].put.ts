/*
 * @Author: whq
 * @Date: 2026-04-02 10:32:24
 * @LastEditTime: 2026-04-08 13:15:59
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2/aion2-portal/app/server/api/dungeon-plans/[id].put.ts
 */
import { defineEventHandler, readBody, getRouterParam } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'Missing id' }

  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return { success: false, error: 'Unauthorized' }

  const body: any = await readBody(event)

  const payload: any = {
    updated_at: new Date().toISOString(),
  }

  if (body?.title !== undefined) payload.title = String(body.title || '').trim()
  if (body?.start_at !== undefined) payload.start_at = String(body.start_at || '')
  if (body?.notes !== undefined) payload.notes = body.notes ? String(body.notes) : null
  if (body?.groups !== undefined) payload.groups = body.groups
  if (body?.is_public !== undefined) payload.is_public = !!body.is_public
  if (body?.tags !== undefined) payload.tags = Array.isArray(body.tags) ? body.tags : []
  if (body?.status !== undefined) payload.status = String(body.status || 'active')
  if (body?.completed_at !== undefined) payload.completed_at = body.completed_at ? String(body.completed_at) : null

  const { data, error } = await client
    .from('dungeon_plans')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
})


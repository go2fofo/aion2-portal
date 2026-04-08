/*
 * @Author: whq
 * @Date: 2026-04-02 09:55:33
 * @LastEditTime: 2026-04-08 13:15:53
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2/aion2-portal/app/server/api/admin/dungeon-plans.post.ts
 */
import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const body: any = await readBody(event)

  const payload = {
    title: String(body?.title || '').trim(),
    start_at: body?.start_at ? String(body.start_at) : null,
    notes: body?.notes ? String(body.notes) : null,
    groups: body?.groups ?? [],
    created_by: user?.id || null,
    updated_at: new Date().toISOString(),
  }

  if (!payload.title) {
    return { success: false, error: 'Missing title' }
  }
  if (!payload.start_at) {
    return { success: false, error: 'Missing start_at' }
  }

  const { data, error } = await client.from('dungeon_plans').insert(payload).select('*').maybeSingle()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
})


import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user?.id) return { success: false, error: 'Unauthorized' }

  const body: any = await readBody(event)
  const title = String(body?.title || '').trim()
  const start_at = body?.start_at ? String(body.start_at) : null

  if (!title) return { success: false, error: 'Missing title' }
  if (!start_at) return { success: false, error: 'Missing start_at' }

  const payload = {
    title,
    start_at,
    notes: body?.notes ? String(body.notes) : null,
    teams: body?.teams ?? [],
    is_public: !!body?.is_public,
    tags: Array.isArray(body?.tags) ? body.tags : [],
    status: 'active',
    completed_at: null,
    created_by: user.id,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await client.from('dungeon_plans').insert(payload).select('*').maybeSingle()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
})


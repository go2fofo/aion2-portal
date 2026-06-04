import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { ensureAion2UpdatesSyncedIfDue } from '../utils/aion2Updates'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = getQuery(event)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 18))

  try {
    await ensureAion2UpdatesSyncedIfDue(client)
  } catch {}

  const { data, error } = await client
    .from('aion2_update_articles')
    .select(
      'id,title,summary,posted_at,updated_at,thumbnail_urls,view_count,scrap_count,reply_count,comment_count',
    )
    .order('posted_at', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) return { success: false, error: error.message, data: [] }
  return { success: true, data: data || [] }
})


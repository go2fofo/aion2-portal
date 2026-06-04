import { defineEventHandler, getRouterParam, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { fetchAion2UpdateDetail } from '../../utils/aion2Updates'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return { success: false, error: 'Missing id' }

  const query = getQuery(event)
  const force = String(query.force || '') === '1'

  const client = await serverSupabaseClient(event)

  const { data: row, error } = await client
    .from('aion2_update_articles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return { success: false, error: error.message }

  if (!row) {
    return { success: false, error: 'Not found' }
  }

  if (force || !row.detail_html) {
    try {
      const detail = await fetchAion2UpdateDetail(id)
      const html = detail?.article?.content?.content
        ? String(detail.article.content.content)
        : null
      const meta = detail?.article?.contentMeta || null

      const payload: any = {
        detail_html: html,
        detail_json: detail,
        fetched_at: new Date().toISOString(),
      }
      if (meta?.timestamps?.postedAt) payload.posted_at = String(meta.timestamps.postedAt)
      if (meta?.timestamps?.updatedAt) payload.updated_at = String(meta.timestamps.updatedAt)
      if (meta?.summary !== undefined) payload.summary = meta.summary ? String(meta.summary) : null
      if (meta?.title) payload.title = String(meta.title)
      if (meta?.thumbnailUrlList) {
        payload.thumbnail_urls = Array.isArray(meta.thumbnailUrlList)
          ? meta.thumbnailUrlList
          : []
      }
      if (meta?.reactions) {
        payload.view_count = Number(meta.reactions.viewCount) || 0
        payload.scrap_count = Number(meta.reactions.scrapCount) || 0
        payload.reply_count = Number(meta.reactions.replyCount) || 0
        payload.comment_count = Number(meta.reactions.commentCount) || 0
      }

      const { data: updated, error: upErr } = await client
        .from('aion2_update_articles')
        .update(payload)
        .eq('id', id)
        .select('*')
        .maybeSingle()

      if (!upErr && updated) return { success: true, data: updated }
    } catch {}
  }

  return { success: true, data: row }
})


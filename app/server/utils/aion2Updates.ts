export const AION2_UPDATE_LIST_URL =
  'https://api-tw-community.ncsoft.com/aion2_tw/board/update_zh/article/search/moreArticle?isVote=true&moreSize=18&moreDirection=BEFORE&previousArticleId=0'

export const aion2UpdateDetailUrl = (articleId: string) =>
  `https://api-tw-community.ncsoft.com/aion2_tw/board/update_zh/article/${encodeURIComponent(articleId)}`

const headers = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  referer: 'https://tw.ncsoft.com/aion2/',
  accept: 'application/json, text/plain, */*',
}

export const fetchAion2UpdateList = async () => {
  const res = await fetch(AION2_UPDATE_LIST_URL, { headers })
  if (!res.ok) throw new Error(`fetch list failed: ${res.status}`)
  return await res.json()
}

export const fetchAion2UpdateDetail = async (articleId: string) => {
  const res = await fetch(aion2UpdateDetailUrl(articleId), { headers })
  if (!res.ok) throw new Error(`fetch detail failed: ${res.status}`)
  return await res.json()
}

export const shouldAutoSyncThisWeek = (
  lastSyncAt: Date | null,
  now: Date,
) => {
  const day = now.getDay()
  const diffToWednesday = (day + 7 - 3) % 7
  const thisWed = new Date(now)
  thisWed.setHours(0, 0, 0, 0)
  thisWed.setDate(now.getDate() - diffToWednesday)
  if (now.getTime() < thisWed.getTime()) return false
  if (!lastSyncAt) return true
  return lastSyncAt.getTime() < thisWed.getTime()
}

export const getAion2UpdateLastSyncAt = async (client: any) => {
  const { data } = await client
    .from('site_config')
    .select('value')
    .eq('key', 'aion2_updates_last_sync_at')
    .maybeSingle()

  const v = data?.value
  const raw = typeof v === 'string' ? v : v?.at
  if (!raw) return null
  const d = new Date(String(raw))
  if (Number.isNaN(d.getTime())) return null
  return d
}

export const setAion2UpdateLastSyncAt = async (client: any, nowIso: string) => {
  await client
    .from('site_config')
    .upsert(
      { key: 'aion2_updates_last_sync_at', value: { at: nowIso } },
      { onConflict: 'key' },
    )
}

export const syncAion2Updates = async (
  client: any,
  opts?: { force?: boolean },
) => {
  const now = new Date()
  const nowIso = now.toISOString()

  if (!opts?.force) {
    const last = await getAion2UpdateLastSyncAt(client)
    if (!shouldAutoSyncThisWeek(last, now)) {
      return { success: true, skipped: true, syncedAt: last?.toISOString() || null }
    }
  }

  const list = await fetchAion2UpdateList()
  const contentList: any[] = Array.isArray(list?.contentList) ? list.contentList : []

  const rows = contentList.map((c) => {
    const reactions = c?.reactions || {}
    const t = c?.timestamps || {}
    const postedAt = t.postedAt || t.publishedAt || null
    const updatedAt = t.updatedAt || null

    return {
      id: String(c.id),
      title: String(c.title || ''),
      summary: c.summary ? String(c.summary) : null,
      posted_at: postedAt ? String(postedAt) : null,
      updated_at: updatedAt ? String(updatedAt) : null,
      thumbnail_urls: Array.isArray(c.thumbnailUrlList) ? c.thumbnailUrlList : [],
      view_count: Number(reactions.viewCount) || 0,
      scrap_count: Number(reactions.scrapCount) || 0,
      reply_count: Number(reactions.replyCount) || 0,
      comment_count: Number(reactions.commentCount) || 0,
      raw: c,
      fetched_at: nowIso,
    }
  })

  if (rows.length) {
    const { error } = await client
      .from('aion2_update_articles')
      .upsert(rows, { onConflict: 'id' })

    if (error) throw new Error(error.message)
  }

  await setAion2UpdateLastSyncAt(client, nowIso)

  return { success: true, skipped: false, count: rows.length, syncedAt: nowIso }
}

export const ensureAion2UpdatesSyncedIfDue = async (client: any) => {
  const last = await getAion2UpdateLastSyncAt(client)
  const now = new Date()
  if (!shouldAutoSyncThisWeek(last, now)) return { attempted: false }
  await syncAion2Updates(client, { force: true })
  return { attempted: true }
}

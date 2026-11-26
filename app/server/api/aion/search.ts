/*
 * @Author: whq
 * @Date: 2026-02-11 17:29:12
 * @LastEditTime: 2026-11-26 00:00:00
 * @LastEditors: fofo
 * @Description: 台服角色搜索代理
 * @FilePath: /aion2-portal/app/server/api/aion/search.ts
 */

// 台服官方角色搜索接口（按优先级依次尝试）
// 2026-11 官方页面已迁移到独立搜索域名 api-search.plaync.com/aion2tw/search/v2/character
const SEARCH_ENDPOINTS = [
  'https://api-search.plaync.com/aion2tw/search/v2/character',
  'https://tw.ncsoft.com/aion2/api/search/character'
]

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Referer': 'https://tw.ncsoft.com/aion2/characters/index'
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword, race = '2', serverId = '2015', page = '1', size = '30' } = query

  const kw = String(keyword ?? '').trim()
  const p = Math.max(1, Number(page) || 1)
  const s = Math.min(100, Math.max(1, Number(size) || 30))

  if (!kw) {
    return { list: [], pagination: { page: p, size: s, total: 0, endPage: 1 } }
  }

  // race 只接受 1（天族）/2（魔族）；all、空值等一律不下发（= 全部种族）
  const raceRaw = String(race ?? '').trim().toLowerCase()
  const raceId = raceRaw === '1' || raceRaw === '2' ? raceRaw : ''

  // serverId 只在为合法数字时下发（空值 = 全部服务器）
  const serverRaw = String(serverId ?? '').trim()
  const serverIdVal = /^\d+$/.test(serverRaw) && serverRaw !== '0' ? serverRaw : ''

  const searchParams = new URLSearchParams()
  searchParams.set('keyword', kw)
  if (raceId) searchParams.set('race', raceId)
  if (serverIdVal) searchParams.set('serverId', serverIdVal)
  searchParams.set('page', String(p))
  searchParams.set('size', String(s))

  let lastError: unknown = null

  for (const endpoint of SEARCH_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}?${searchParams.toString()}`, {
        headers: REQUEST_HEADERS
      })

      if (!response.ok) {
        console.warn('[aion/search] endpoint failed:', endpoint, response.status)
        continue
      }

      const data = await response.json()
      if (data && Array.isArray(data.list)) {
        return data
      }
      console.warn('[aion/search] unexpected payload:', endpoint)
    } catch (e) {
      lastError = e
      console.warn('[aion/search] endpoint error:', endpoint, e)
    }
  }

  if (lastError) console.error('Search API Error:', lastError)
  return { list: [], pagination: { page: p, size: s, total: 0, endPage: 1 } }
})

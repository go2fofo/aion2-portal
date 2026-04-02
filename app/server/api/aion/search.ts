/*
 * @Author: whq
 * @Date: 2026-02-11 17:29:12
 * @LastEditTime: 2026-02-11 17:54:02
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/server/api/aion/search.ts
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword, race = '2', serverId = '2015', page = '1', size = '30' } = query

  if (!keyword) {
    return { list: [] }
  }

  try {
    const raceId = String(race) === '1' ? 1 : 2
    const sid = Number(serverId)
    const p = Math.max(1, Number(page) || 1)
    const s = Math.min(100, Math.max(1, Number(size) || 30))

    const response = await fetch(
      `https://tw.ncsoft.com/aion2/api/search/aion2tw/search/v2/character?keyword=${encodeURIComponent(String(keyword))}&race=${raceId}&serverId=${sid}&page=${p}&size=${s}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://tw.ncsoft.com/aion2'
        }
      }
    )
    return await response.json()
  } catch (e) {
    console.error('Search API Error:', e)
    return { list: [] }
  }
})

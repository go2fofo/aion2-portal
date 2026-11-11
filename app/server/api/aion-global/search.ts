/*
 * @Description: 永恒之塔2（国际服/全球服）角色搜索代理
 * 接口: https://api-search.plaync.com/aion2global/search/v2/character
 * 参数: keyword / race / serverId / page / size / region(必填: naw|nae|eu|la|as) / localeInfo(必填: en-US)
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword, region = 'naw', localeInfo = 'en-US', race = '1', serverId = '', page = '1', size = '30' } = query

  if (!keyword) {
    return { list: [] }
  }

  try {
    const raceId = String(race) === '2' ? 2 : 1
    const sid = Number(serverId) || ''
    const p = Math.max(1, Number(page) || 1)
    const s = Math.min(100, Math.max(1, Number(size) || 30))

    const targetUrl = new URL('https://api-search.plaync.com/aion2global/search/v2/character')
    targetUrl.searchParams.append('keyword', String(keyword))
    targetUrl.searchParams.append('region', String(region))
    targetUrl.searchParams.append('localeInfo', String(localeInfo))
    targetUrl.searchParams.append('race', String(raceId))
    if (sid) {
      targetUrl.searchParams.append('serverId', String(sid))
    }
    targetUrl.searchParams.append('page', String(p))
    targetUrl.searchParams.append('size', String(s))

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://aion2.plaync.com/',
        'Accept': 'application/json',
      },
    })
    return await response.json()
  } catch (e) {
    console.error('Global Search API Error:', e)
    return { list: [] }
  }
})

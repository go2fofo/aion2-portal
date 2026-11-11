/*
 * @Description: 永恒之塔2（韩服）角色搜索代理
 * 文档: docs/永恒之塔2韩服角色查询接口.md
 *
 * ⚠️ 原文档接口 https://aion2.plaync.com/api/search/character 已下线（302→404）。
 * 韩服官网（ko-kr/characters 页面 JS）显示搜索服务已迁移至独立搜索域名：
 *   https://api-search.plaync.com/aion2/search/v2/character
 *   参数: keyword / race / serverId / page / size
 *   返回: { list: [{ characterId(URL编码), name(HTML), race, pcId, level, serverId, serverName, ... }] }
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword, race = '1', serverId = '', page = '1', size = '30' } = query

  if (!keyword) {
    return { list: [] }
  }

  try {
    const raceId = String(race) === '2' ? 2 : 1
    const sid = Number(serverId) || ''
    const p = Math.max(1, Number(page) || 1)
    const s = Math.min(100, Math.max(1, Number(size) || 30))

    const targetUrl = new URL('https://api-search.plaync.com/aion2/search/v2/character')
    targetUrl.searchParams.append('keyword', String(keyword))
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
    console.error('KR Search API Error:', e)
    return { list: [] }
  }
})


/*
 * @Description: 永恒之塔2（韩服）角色详情代理
 * 文档: docs/永恒之塔2韩服角色查询接口.md
 * 示例: https://aion2.plaync.com/api/character/info?lang=ko&characterId=xxx&serverId=1008
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId } = query

  if (!characterId) {
    return { error: 'Missing characterId' }
  }

  try {
    // characterId 是加密后的 Base64（结尾 =），前端传来时可能被多次 URL 编码，解码到底
    let decodedId = String(characterId)
    while (decodedId.includes('%')) {
      try {
        decodedId = decodeURIComponent(decodedId)
      } catch (e) {
        break
      }
    }

    const targetUrl = new URL('https://aion2.plaync.com/api/character/info')
    targetUrl.searchParams.append('lang', 'ko')
    targetUrl.searchParams.append('characterId', decodedId)
    targetUrl.searchParams.append('serverId', String(serverId || ''))

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://aion2.plaync.com',
      },
    })
    return await response.json()
  } catch (e) {
    console.error('KR Info API Error:', e)
    return { error: e }
  }
})

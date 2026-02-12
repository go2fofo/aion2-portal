export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId } = query

  if (!characterId) {
    return { error: 'Missing characterId' }
  }

  try {
    // 1. 获取最原始的 characterId (解码直到没有 %，或者解一层)
    let decodedId = String(characterId)
    while (decodedId.includes('%')) {
      try {
        decodedId = decodeURIComponent(decodedId)
      } catch (e) {
        break
      }
    }

    // 2. 使用 URL 对象构建请求，自动处理编码
    const targetUrl = new URL('https://tw.ncsoft.com/aion2/api/character/equipment')
    targetUrl.searchParams.append('lang', 'zh')
    targetUrl.searchParams.append('characterId', decodedId)
    targetUrl.searchParams.append('serverId', String(serverId))

    const response = await fetch(
      targetUrl.toString(),
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://tw.ncsoft.com/aion2'
        }
      }
    )
    return await response.json()
  } catch (e) {
    console.error('Equipment API Error:', e)
    return { error: 'Failed to fetch equipment info' }
  }
})
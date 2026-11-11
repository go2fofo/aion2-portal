/*
 * @Description: 永恒之塔2（国际服/全球服）角色详情代理
 * 接口: https://aion2.plaync.com/api/character/info?lang=en-US&region=xxx&characterId=xxx&serverId=xxx
 * ⚠️ 国际服必须携带 region 参数（naw|nae|eu|la|as），lang 使用 en-US 格式
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId, region = 'naw' } = query

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
    targetUrl.searchParams.append('lang', 'en-US')
    targetUrl.searchParams.append('region', String(region))
    targetUrl.searchParams.append('characterId', decodedId)
    targetUrl.searchParams.append('serverId', String(serverId || ''))

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
    console.error('Global Info API Error:', e)
    return { error: e }
  }
})

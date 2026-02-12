/*
 * @Author: whq
 * @Date: 2026-02-11 17:29:12
 * @LastEditTime: 2026-02-12 13:40:46
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/server/api/aion/info.ts
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId = '2015' } = query

  if (!characterId) {
    return { error: 'Missing characterId' }
  }

  try {
    // 1. 获取最原始的 characterId (解码直到没有 %，或者解一层)
    // 前端传来时可能已经被编码过多次（例如 %253D -> %3D -> =）
    // 为了确保正确，我们先解码到底，拿到原始的 Base64 字符串（结尾是 =）
    let decodedId = String(characterId)
    while (decodedId.includes('%')) {
      try {
        decodedId = decodeURIComponent(decodedId)
      } catch (e) {
        // 如果解码失败（例如非法的 % 序列），就停止解码，使用当前值
        break
      }
    }

    // 2. 使用 URL 对象构建请求，自动处理编码
    const targetUrl = new URL('https://tw.ncsoft.com/aion2/api/character/info')
    targetUrl.searchParams.append('lang', 'zh')
    targetUrl.searchParams.append('characterId', decodedId) // 这里会自动编码，= 会变成 %3D
    targetUrl.searchParams.append('serverId', String(serverId))

    const response = await fetch(
      targetUrl.toString(),
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://tw.ncsoft.com/aion2'
        },
   
      }
    )
    return await response.json()
  } catch (e) {
    console.error('错误信息Info API Error:', e)
    return { error: e }
  }
})

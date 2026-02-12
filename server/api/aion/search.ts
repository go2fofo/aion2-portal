/*
 * @Author: whq
 * @Date: 2026-02-11 17:17:45
 * @LastEditTime: 2026-02-11 17:40:09
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/server/api/aion/search.ts
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword } = query

  if (!keyword) {
    return { list: [] }
  }

  // 固定获取本区的查询角色，如果想知道别的区的 暂时没扩展 serverId
  try {
    const response = await fetch(
      `https://tw.ncsoft.com/aion2/api/search/aion2tw/search/v2/character?keyword=${encodeURIComponent(String(keyword))}&race=2&serverId=2015&page=1&size=99`,
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

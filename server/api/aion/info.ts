export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId } = query

  if (!characterId) {
    return { error: 'Missing characterId' }
  }

  try {
    const response = await fetch(
      `https://tw.ncsoft.com/aion2/api/character/info?characterId=${encodeURIComponent(String(characterId))}&serverId=${serverId}&lang=zh`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://tw.ncsoft.com/aion2'
        }
      }
    )
    return await response.json()
  } catch (e) {
    console.error('Info API Error:', e)
    return { error: 'Failed to fetch info' }
  }
})

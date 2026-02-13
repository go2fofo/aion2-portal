export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId } = query

  if (!characterId || !serverId) {
    return { error: 'Missing parameters: characterId or serverId' }
  }

  try {
    // 1. 解码 characterId
    let decodedId = String(characterId)
    while (decodedId.includes('%')) {
      try {
        decodedId = decodeURIComponent(decodedId)
      } catch (e) {
        break
      }
    }

    const commonHeaders = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://tw.ncsoft.com/aion2'
    }

    // 2. 获取基础信息 (info)
    const infoUrl = new URL('https://tw.ncsoft.com/aion2/api/character/info')
    infoUrl.searchParams.append('lang', 'zh')
    infoUrl.searchParams.append('characterId', decodedId)
    infoUrl.searchParams.append('serverId', String(serverId))

    const infoRes = await fetch(infoUrl.toString(), { headers: commonHeaders })
    const infoData = await infoRes.json()
    
    // 提取核心信息
    const profile = infoData.profile || {}
    const statList = infoData.stat?.statList || []
    const itemLevelEntry = statList.find((s: any) => s.type === 'ItemLevel')
    const itemLevel = itemLevelEntry ? itemLevelEntry.value : 0

    // 3. 获取装备列表
    const listUrl = new URL('https://tw.ncsoft.com/aion2/api/character/equipment')
    listUrl.searchParams.append('lang', 'zh')
    listUrl.searchParams.append('characterId', decodedId)
    listUrl.searchParams.append('serverId', String(serverId))

    const listRes = await fetch(listUrl.toString(), { headers: commonHeaders })
    const listData = await listRes.json()

    if (!listData.equipment || !listData.equipment.equipmentList) {
      return { error: 'Failed to fetch equipment list', details: listData }
    }

    const equipmentList = listData.equipment.equipmentList

    // 4. 并发获取每个装备的详情
    const detailPromises = equipmentList.map(async (item: any) => {
      try {
        const detailUrl = new URL('https://tw.ncsoft.com/aion2/api/character/equipment/item')
        detailUrl.searchParams.append('id', String(item.id))
        detailUrl.searchParams.append('enchantLevel', String(item.enchantLevel || 0))
        detailUrl.searchParams.append('characterId', decodedId)
        detailUrl.searchParams.append('serverId', String(serverId))
        detailUrl.searchParams.append('slotPos', String(item.slotPos))
        detailUrl.searchParams.append('lang', 'zh')

        const detailRes = await fetch(detailUrl.toString(), { headers: commonHeaders })
        const detailData = await detailRes.json()
        
        return {
          ...item,
          fullDetail: detailData
        }
      } catch (e) {
        console.error(`Failed to fetch detail for item ${item.id}:`, e)
        return item
      }
    })

    const aggregatedEquipment = await Promise.all(detailPromises)

    // 5. 整合所有数据 (返回结构与 legion_members 表中的 equipment_data 保持一致)
    const previewData = {
      updated_at: new Date().toISOString(),
      equipment: {
        equipmentList: aggregatedEquipment,
        skinList: listData.equipment?.skinList || []
      },
      petwing: listData.petwing || null,
      skill: listData.skill || null,
      raw_info: infoData,
      // 为了方便 preview 页面使用，把基础 profile 也带上
      profile: {
        ...profile,
        level: profile.characterLevel,
        itemLevel: itemLevel,
        gender: profile.gender === 2 ? 'female' : 'male'
      }
    }

    return { 
      success: true, 
      data: previewData
    }

  } catch (e:any) {
    console.error('Preview API Error:', e)
    return { error: 'Failed to fetch preview data', message: e.message }
  }
})

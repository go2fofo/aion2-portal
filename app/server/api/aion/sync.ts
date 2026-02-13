import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { characterId, serverId, memberId } = query

  if (!characterId || !serverId || !memberId) {
    return { error: 'Missing parameters: characterId, serverId, or memberId' }
  }

  const supabase = await serverSupabaseClient(event)

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

    // 3. 并发获取每个装备的详情
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

    // 4. 整合所有数据
    const syncData = {
      updated_at: new Date().toISOString(),
      // 存储聚合了详情的装备列表
      equipment: {
        equipmentList: aggregatedEquipment,
        skinList: listData.equipment?.skinList || []
      },
      // 宠物与翅膀
      petwing: listData.petwing || null,
      // 技能列表
      skill: listData.skill || null,
      // 完整原始属性
      raw_info: infoData
    }

    // 5. 存入 Supabase
    const { data: updateData, error: updateError } = await supabase
      .from('legion_members')
      .update({ 
        equipment_data: syncData,
        level: profile.characterLevel || undefined,
        item_level: itemLevel || undefined,
        class_name: profile.className || undefined,
        profile_url: profile.profileImage || undefined,
        title_name: profile.titleName || undefined,
        title_list: infoData.title?.titleList || undefined,
        gender: profile.gender === 2 ? 'female' : 'male'
      })
      .eq('id', memberId)

    if (updateError) {
      throw updateError
    }

    return { 
      success: true, 
      message: 'Sync completed',
      data: syncData
    }

  } catch (e:any) {
    console.error('Sync API Error:', e)
    return { error: 'Failed to sync member data', message: e.message }
  }
})

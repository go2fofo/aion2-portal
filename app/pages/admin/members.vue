<script setup>
import { ref, onMounted, computed } from 'vue'
const supabase = useSupabaseClient()
const { $alert, $confirm, $loading } = useNuxtApp()

// 状态
const loading = ref(false)
const searching = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const members = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedMember = ref(null)

// 职业映射
const classMap = {
  'Gladiator': '劍星',
  'Templar': '守護星',
  'Assassin': '殺星',
  'Ranger': '弓星',
  'Sorcerer': '魔道星',
  'SpiritMaster': '精靈星',
  'Cleric': '治癒星',
  'Chanter': '護法星',
  'Artist': '吟遊星', 
  'Muse': '藝人',
  'Technist': '機甲星',
  'Rider': '機甲星',
}

// 1. 搜索角色 (调用官方接口)
const handleSearch = async () => {
  if (!searchQuery.value) return
  searching.value = true
  searchResults.value = [] // 先清空旧数据
  
  try {
    const data = await $fetch('/api/aion/search', {
      params: { keyword: searchQuery.value }
    })
    
    // API 返回结构如果是直接数组 [...]
    if (Array.isArray(data)) {
      searchResults.value = data
    } 
    // 或者是 { list: [...] }
    else if (data && data.list) {
      searchResults.value = data.list
    } else {
      searchResults.value = []
    }
  } catch (e) {
    $alert('搜索失败', e.message || '未知错误')
  } finally {
    searching.value = false
  }
}

// 辅助函数：处理头像 URL
const getProfileUrl = (url) => {
  if (!url) return '/bbbswz.png'
  // 如果已经是完整路径，直接返回
  if (url.startsWith('http')) return url
  // 如果是相对路径，拼接官方域名
  return `https://profileimg.plaync.com${url}`
}

// 辅助函数：清洗名字中的 HTML 标签
const cleanName = (name) => {
  return name.replace(/<[^>]+>/g, '')
}

// 2. 添加成员 (保存到 Supabase)
const addMember = async (char) => {
  // 先检查是否已存在
  if (members.value.some(m => m.character_id === char.characterId)) {
    $alert('重复添加', '该成员已在列表中')
    return
  }

  $loading.show('正在招募新成员...')
  
  const cleanCharName = cleanName(char.name)
  const fullProfileUrl = getProfileUrl(char.profileImageUrl)

  const newMember = {
    character_id: char.characterId,
    name: cleanCharName,
    server_id: char.serverId,
    race_id: char.race,
    level: char.level,
    class_name: char.className || '', // 搜索接口可能不返回职业，需要详情接口补充
    profile_url: fullProfileUrl,
    role: 'member', // 默认为普通成员
    join_date: new Date().toISOString()
  }

  // 尝试获取详情补充更多信息
  if (!char.className || !char.guildName) {
    try {
      // 1. 获取基本详情
      const detail = await $fetch('/api/aion/info', { 
        params: { characterId: char.characterId, serverId: char.serverId } 
      })
      
      // 2. 获取装备详情 (用于获取宠物、翅膀、时装等外观数据，虽然目前不存入DB，但可以为未来预留或校验)
      // 注意：目前数据库字段主要依赖 info 接口返回的 profile/stat 等
      // 如果将来要在列表中显示时装图标，可以在这里获取并存入 equipment_data 字段(需先在DB建字段)
      // const equipDetail = await $fetch('/api/aion/equipment', {
      //   params: { characterId: char.characterId, serverId: char.serverId }
      // })
      
      if (detail && detail.profile) {
        newMember.level = detail.profile.characterLevel
        newMember.race_id = detail.profile.raceId
        // 性别: 1=男, 2=女 (根据 API 返回推断)
        newMember.gender = detail.profile.gender === 1 ? 'male' : 'female'
        newMember.title_name = detail.profile.titleName
        
        // 新增：完整的档案信息
        newMember.server_name = detail.profile.serverName
        newMember.region_name = detail.profile.regionName
        newMember.pc_id = detail.profile.pcId
        newMember.gender_name = detail.profile.genderName
        newMember.title_id = detail.profile.titleId
        newMember.title_grade = detail.profile.titleGrade
        newMember.race_name = detail.profile.raceName

        // 存储复杂数据结构 (JSONB)
        if (detail.stat && detail.stat.statList) {
           newMember.stat_list = detail.stat.statList
        }
        if (detail.daevanion && detail.daevanion.boardList) {
           newMember.board_list = detail.daevanion.boardList
        }
        if (detail.ranking && detail.ranking.rankingList) {
           newMember.ranking_list = detail.ranking.rankingList
        }
        if (detail.title && detail.title.titleList) {
           newMember.title_list = detail.title.titleList
        }

        if (detail.profile.profileImage) {
           newMember.profile_url = getProfileUrl(detail.profile.profileImage)
        }
        
        // 自动提取装备分数 (ItemLevel)
        if (detail.stat && detail.stat.statList) {
           const itemLevelStat = detail.stat.statList.find(s => s.type === 'ItemLevel')
           if (itemLevelStat) {
             // 注意：接口返回的 value 可能是字符串 "2,964"，需要处理千分位
             const rawValue = String(itemLevelStat.value).replace(/,/g, '')
             newMember.item_level = parseInt(rawValue, 10) || 0
           }
        }

        // 提取军衔/段位 (优先取 RankingType=0 的 gradeName)
        if (detail.ranking && detail.ranking.rankingList) {
          // 尝试找深渊排行或总榜
          const mainRank = detail.ranking.rankingList.find(r => r.rankingContentsType === 1) || detail.ranking.rankingList[0]
          if (mainRank) {
             newMember.abyss_rank = mainRank.gradeName
          }
        }

        // 优先使用 classMap 映射，如果映射不到（可能是新职业或英文不匹配），则使用详情里的原始 className
        if (detail.profile.className) {
           if (classMap[detail.profile.className]) {
              newMember.class_name = classMap[detail.profile.className]
           } else {
              // 如果映射表里没有，暂时存入原始值（通常是英文），让管理员后续手动改，或者就这样显示
              newMember.class_name = detail.profile.className
           }
        }
      }
    } catch (e) {
      console.error('获取详情失败，将使用基础信息', e)
    }
  }

  try {
    const { error } = await supabase.from('legion_members').insert(newMember)
    
    if (error) {
      // 捕获数据库唯一约束冲突 (Postgres error code 23505)
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        $alert('添加失败', '该成员已存在于数据库中')
      } else {
        $alert('添加失败', error.message)
      }
    } else {
      $alert('添加成功', `欢迎 ${newMember.name} 加入军团！`)
      showAddModal.value = false
      searchQuery.value = ''
      searchResults.value = []
      fetchMembers()
    }
  } finally {
    $loading.hide()
  }
}

// 3. 获取成员列表
const fetchMembers = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('legion_members')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (data) {
    members.value = data
  }
  loading.value = false
}

const syncLoading = ref({}) // 记录正在同步的成员ID

// 4. 更新成员信息 (同步官方最新数据)
const syncMember = async (member) => {
  if (syncLoading.value[member.id]) return
  const confirmed = await $confirm('同步确认', `确定要同步更新 ${member.name} 的最新数据吗？`)
  if (!confirmed) return
  
  syncLoading.value[member.id] = true
  try {
    // 1. 同步基本信息
    const detail = await $fetch('/api/aion/info', { 
      params: { characterId: member.character_id, serverId: member.server_id } 
    })
    
    // 2. 同步装备/外观信息 (目前虽然不存库，但为了保持逻辑一致性，这里也可以调用一下，或者为将来存库做准备)
    // 实际场景：如果我们要把最新的战力(ItemLevel)更新准确，通常 info 接口已经包含了 statList
    // 而 equipment 接口主要包含具体穿戴的装备ID和强化等级。
    // 如果您希望在同步时也把装备数据拉取并更新（即使现在没地方存），可以取消下面注释
    /*
    const equipDetail = await $fetch('/api/aion/equipment', { 
      params: { characterId: member.character_id, serverId: member.server_id } 
    })
    */
    
    if (detail && detail.profile) {
      const updates = {
        level: detail.profile.characterLevel,
        class_name: detail.profile.className, // 注意：如果这里同步可能会覆盖中文职业，建议根据情况调整
        profile_url: detail.profile.profileImage,
        gender: detail.profile.gender === 1 ? 'male' : 'female',
        title_name: detail.profile.titleName,
        
        // 新增：完整的档案信息更新
        server_name: detail.profile.serverName,
        region_name: detail.profile.regionName,
        pc_id: detail.profile.pcId,
        gender_name: detail.profile.genderName,
        title_id: detail.profile.titleId,
        title_grade: detail.profile.titleGrade,
        race_name: detail.profile.raceName,
        
        updated_at: new Date().toISOString()
      }

      // 更新复杂数据结构
      if (detail.stat && detail.stat.statList) {
         updates.stat_list = detail.stat.statList
      }
      if (detail.daevanion && detail.daevanion.boardList) {
         updates.board_list = detail.daevanion.boardList
      }
      if (detail.ranking && detail.ranking.rankingList) {
         updates.ranking_list = detail.ranking.rankingList
      }
      if (detail.title && detail.title.titleList) {
         updates.title_list = detail.title.titleList
      }

      // 提取装备分数
      if (detail.stat && detail.stat.statList) {
         const itemLevelStat = detail.stat.statList.find(s => s.type === 'ItemLevel')
         if (itemLevelStat) {
           const rawValue = String(itemLevelStat.value).replace(/,/g, '')
           updates.item_level = parseInt(rawValue, 10) || 0
         }
      }

      // 提取军衔
      if (detail.ranking && detail.ranking.rankingList) {
         const mainRank = detail.ranking.rankingList.find(r => r.rankingContentsType === 1) || detail.ranking.rankingList[0]
         if (mainRank) {
            updates.abyss_rank = mainRank.gradeName
         }
      }
      
      // 更新职业：优先用映射，没有映射用原值
      if (detail.profile.className) {
         updates.class_name = classMap[detail.profile.className] || detail.profile.className
      }
      
      // 更新性别
      if (detail.profile.gender !== undefined) {
         updates.gender = detail.profile.gender === 1 ? 'male' : 'female'
      }

      const { error } = await supabase
        .from('legion_members')
        .update(updates)
        .eq('id', member.id)

      if (error) throw error
      $alert('同步成功', '成员数据已更新为最新状态')
      fetchMembers()
    } else {
      $alert('数据异常', '未查询到官方数据')
    }
  } catch (e) {
    $alert('同步失败', e.message)
  } finally {
    syncLoading.value[member.id] = false
  }
}

// 5. 删除成员
const deleteMember = async (id) => {
  const confirmed = await $confirm('移除成员', '确定要将该成员移除出军团列表吗？此操作不可撤销。')
  if (!confirmed) return
  
  const { error } = await supabase
    .from('legion_members')
    .delete()
    .eq('id', id)

  if (error) {
    $alert('删除失败', error.message)
  } else {
    $alert('已移除', '成员已离开军团')
    fetchMembers()
  }
}

// 6. 编辑备注/职位
const openEdit = (member) => {
  selectedMember.value = { ...member }
  showEditModal.value = true
}

const saveEdit = async () => {
  const { error } = await supabase
    .from('legion_members')
    .update({
      role: selectedMember.value.role,
      note: selectedMember.value.note,
      class_name: selectedMember.value.class_name // 允许更新职业
    })
    .eq('id', selectedMember.value.id)

  if (error) {
    $alert('保存失败', error.message)
  } else {
    $alert('保存成功', '成员信息已更新')
    showEditModal.value = false
    fetchMembers()
  }
}

onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h3 class="font-black text-slate-800 text-lg">军团成员列表</h3>
        <p class="text-sm text-slate-400 mt-1">管理军团成员，同步官方数据</p>
      </div>
      <button 
        @click="showAddModal = true" 
        class="bg-[#45a6d5] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3b95c0] transition-colors shadow-md flex items-center gap-2"
      >
        <span>+</span> 添加成员
      </button>
    </div>

    <!-- 成员列表 -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-bold text-slate-500">角色信息</th>
              <th class="px-6 py-4 text-left text-sm font-bold text-slate-500">职业/等级/战力</th>
              <th class="px-6 py-4 text-left text-sm font-bold text-slate-500">军团职位</th>
              <th class="px-6 py-4 text-left text-sm font-bold text-slate-500">备注</th>
              <th class="px-6 py-4 text-right text-sm font-bold text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="p-8 text-slate-400">加载中...</td>
            </tr>
            <tr v-else-if="members.length === 0" class="text-center">
              <td colspan="5" class="p-8 text-slate-400">暂无成员，请先添加</td>
            </tr>
            <tr v-for="member in members" :key="member.id" class="hover:bg-slate-50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="member.profile_url || '/bbbswz.png'" class="w-10 h-10 rounded-full bg-slate-100 object-cover border border-slate-200" />
                  <div>
                    <div class="font-bold text-slate-800">{{ member.name }}</div>
                    <div class="text-xs text-slate-400">{{ member.race_id === 1 ? '天族' : '魔族' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <div>
                    <span class="inline-block px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold mr-2">{{ member.class_name }}</span>
                    <span class="text-sm text-slate-600 font-bold">Lv.{{ member.level }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-slate-500">
                    <span v-if="member.item_level" class="text-[#f9b11d] font-bold" title="装备分数">⚔️ {{ member.item_level }}</span>
                    <span v-if="member.abyss_rank" class="bg-slate-100 px-1.5 rounded">{{ member.abyss_rank }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-black"
                  :class="{
                    'bg-yellow-100 text-yellow-600': member.role === 'leader',
                    'bg-purple-100 text-purple-600': member.role === 'officer',
                    'bg-slate-100 text-slate-600': member.role === 'member'
                  }"
                >
                  {{ member.role === 'leader' ? '军团长' : (member.role === 'officer' ? '百夫长' : '军团兵') }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">
                {{ member.note || '-' }}
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click="syncMember(member)" 
                  class="text-blue-500 hover:bg-blue-50 p-2 rounded-lg relative" 
                  :disabled="syncLoading[member.id]"
                  title="同步官方数据"
                >
                  <span v-if="syncLoading[member.id]" class="animate-spin inline-block">⏳</span>
                  <span v-else>🔄</span>
                </button>
                <button @click="openEdit(member)" class="text-slate-500 hover:bg-slate-100 p-2 rounded-lg" title="编辑">✏️</button>
                <button @click="deleteMember(member.id)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="删除">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 添加成员弹窗 -->
    <Transition name="modal">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showAddModal = false"></div>
        
        <!-- 弹窗主体 -->
        <div class="relative bg-white w-full max-w-2xl rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
          <!-- 头部装饰 -->
          <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#45a6d5] to-[#AEE2F9] opacity-10 pointer-events-none"></div>
          <div class="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#f9b11d] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          
          <div class="relative p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h3 class="font-black text-2xl text-slate-800 tracking-tight">招募新战友</h3>
              <p class="text-slate-500 font-medium mt-1">搜索角色名，一键加入军团（搜索功能暂时只支持当前服务器简卡卡）</p>
            </div>
            <button 
              @click="showAddModal = false" 
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-8 pt-2 flex-1 flex flex-col min-h-0 z-10">
            <!-- 搜索栏 -->
            <div class="flex gap-3 mb-6 relative group">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
                <input 
                  v-model="searchQuery" 
                  @keyup.enter="handleSearch"
                  type="text" 
                  class="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400" 
                  placeholder="输入完整的角色名称..."
                />
              </div>
              <button 
                @click="handleSearch" 
                :disabled="searching"
                class="px-8 py-4 bg-[#45a6d5] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <span v-if="searching" class="animate-spin">⏳</span>
                <span>{{ searching ? '搜索中' : '搜索' }}</span>
              </button>
            </div>

            <!-- 搜索结果列表 -->
            <div class="flex-1 overflow-y-auto custom-scroll -mx-2 px-2 space-y-3">
              <div v-if="searchResults.length === 0 && !searching && searchQuery" class="flex flex-col items-center justify-center py-12 text-slate-400">
                <span class="text-4xl mb-3 opacity-50">👻</span>
                <span class="font-bold">未找到相关角色</span>
                <span class="text-xs mt-1 opacity-70">请确认角色名拼写正确</span>
              </div>
              
              <div v-else-if="!searchQuery && searchResults.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-300">
                <span class="text-4xl mb-3 opacity-50">⌨️</span>
                <span class="font-bold">等待搜索...</span>
              </div>

              <div 
                v-for="char in searchResults" 
                :key="char.characterId"
                class="group flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-[#AEE2F9] hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer"
                @click="addMember(char)"
              >
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <img :src="getProfileUrl(char.profileImageUrl)" class="w-14 h-14 rounded-full bg-slate-50 object-cover border-2 border-white shadow-sm" />
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[10px] border border-slate-100">
                      {{ char.level }}
                    </div>
                  </div>
                  <div>
                    <div class="font-black text-slate-800 text-lg flex items-center gap-2">
                      <span v-html="char.name"></span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold" 
                        :class="char.race === 1 ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'">
                        {{ char.race === 1 ? '天族' : '魔族' }}
                      </span>
                    </div>
                    <div class="text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{{ char.className || '未知职业' }}</span>
                      <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{{ char.serverName }}</span>
                    </div>
                  </div>
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-50 text-[#45a6d5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 编辑弹窗 -->
    <Transition name="modal">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showEditModal = false"></div>
        
        <div class="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 z-10 overflow-hidden">
          <!-- 装饰 -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-100 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>

          <h3 class="font-black text-2xl text-slate-800 mb-6 relative z-10">档案编辑</h3>
          
          <div class="space-y-5 relative z-10">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">职业 Designation</label>
              <div class="relative">
                <input 
                  v-model="selectedMember.class_name" 
                  type="text" 
                  class="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#45a6d5] focus:bg-white font-bold text-slate-700 transition-all" 
                  placeholder="请输入职业，如：守护星"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">军团职位 Rank</label>
              <div class="relative">
                <select v-model="selectedMember.role" class="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#45a6d5] focus:bg-white font-bold text-slate-700 appearance-none transition-all">
                  <option value="member">🛡️ 军团兵 (Member)</option>
                  <option value="officer">⚔️ 百夫长 (Officer)</option>
                  <option value="leader">👑 军团长 (Leader)</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">备注 Note</label>
              <textarea 
                v-model="selectedMember.note" 
                rows="3"
                class="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#45a6d5] focus:bg-white font-bold text-slate-700 transition-all resize-none"
                placeholder="填写一些备注信息..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
              <button 
                @click="showEditModal = false" 
                class="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
              >
                取消
              </button>
              <button 
                @click="saveEdit" 
                class="px-8 py-3 bg-[#45a6d5] text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
              >
                保存变更
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-enter-to .bg-white,
.modal-leave-from .bg-white {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>

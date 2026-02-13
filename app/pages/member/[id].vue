<template>
  <div class="min-h-screen bg-watercolor font-sans custom-scroll">
    <!-- 顶部导航栏 -->
    <nav class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-sky-600 font-black hover:text-sky-800 transition-colors group"
      >
        <span class="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 group-active:scale-90 transition-all flex items-center justify-center">
          <svg class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="tracking-wider">返回首页</span>
      </button>
      <div class="text-xl font-black text-[#45a6d5] tracking-widest">角色档案</div>
      <div class="w-10"></div> <!-- 占位保持居中 -->
    </nav>

    <div v-if="loading" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="relative w-32 h-32 mb-6">
        <img src="/xiaoji1.png" class="w-full h-full object-contain animate-bounce-slow" />
        <div class="absolute -bottom-2 inset-x-0 h-2 bg-slate-200/30 blur-md rounded-full scale-x-75 animate-pulse"></div>
      </div>
      <div class="text-sky-600 font-black text-xl tracking-widest animate-pulse">正在读取档案...</div>
    </div>

    <div v-else-if="!member" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="text-6xl mb-4">👻</div>
      <div class="text-slate-400 font-bold text-xl">查无此人</div>
      <button @click="router.back()" class="mt-8 bg-[#45a6d5] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform">返回列表</button>
    </div>

    <CharacterDetailView 
      v-else 
      :member="member"
      :equipment-list="equipmentList"
      :skill-list="skillList"
      :pet="pet"
      :wing="wing"
      :skin-list="skinList"
      :loading-equipment="loadingEquipment"
      :syncing="syncing"
      @sync="syncMemberData"
      @update:analysis="(data) => member.ai_analysis_data = data"
    />

    <!-- 底部动态草地层 -->
    <div class="relative w-full h-32 md:h-48 pointer-events-none overflow-hidden z-0 opacity-80 mt-10">
      <!-- 远景草坡 -->
      <svg class="absolute bottom-0 w-[120%] -left-[10%] h-full text-[#A3D95B]" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,20 1200,60 L1200,120 L0,120 Z" fill="currentColor"/>
      </svg>
      
      <!-- 近景草坡 (带波浪动画) -->
      <svg class="absolute -bottom-4 w-[150%] -left-[25%] h-[80%] text-[#B2E455] animate-grass-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,60 C300,20 600,100 900,40 C1050,10 1200,80 1200,80 L1200,150 L0,150 Z" fill="currentColor"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { $alert, $loading } = useNuxtApp()

const loading = ref(true)
const syncing = ref(false)
const member = ref(null)

// 装备技能相关状态
const loadingEquipment = ref(false)
const skillList = ref([])
const equipmentList = ref([])
const pet = ref(null)
const wing = ref(null)
const skinList = ref([])

const fetchMemberDetail = async () => {
  loading.value = true
  $loading.show('正在调取档案中...')
  
  const { data, error } = await supabase
    .from('legion_members')
    .select('*')
    .eq('id', route.params.id)
    .maybeSingle()
  
  if (data) {
    member.value = data
    
    // 1. 优先从缓存读取数据并展示 (秒开)
    if (data.equipment_data) {
      applyCachedData(data.equipment_data)
      $loading.hide()
      loading.value = false
    }

    // 2. 执行自动同步
    backgroundSync()
  } else {
    console.error('Member not found', error)
    $loading.hide()
    loading.value = false
  }
}

// 应用缓存数据
const applyCachedData = (cached) => {
  if (!cached) return
  
  if (cached.skill?.skillList) skillList.value = cached.skill.skillList
  if (cached.equipment?.equipmentList) equipmentList.value = cached.equipment.equipmentList
  else if (Array.isArray(cached.equipment)) equipmentList.value = cached.equipment
  
  if (cached.petwing) {
    pet.value = cached.petwing.pet || null
    wing.value = cached.petwing.wing || null
  } else {
    pet.value = cached.pet || null
    wing.value = cached.wing || null
  }
  
  if (cached.equipment?.skinList) skinList.value = cached.equipment.skinList
  else if (cached.skinList) skinList.value = cached.skinList
}

// 静默后台同步
const backgroundSync = async () => {
  if (!member.value) return
  if (!member.value.equipment_data) loadingEquipment.value = true

  try {
    const res = await $fetch('/api/aion/sync', {
      query: {
        memberId: member.value.id,
        characterId: member.value.character_id,
        serverId: member.value.server_id
      }
    })
    
    if (res.success && res.data) {
      applyCachedData(res.data)
      member.value.equipment_data = res.data
      if (res.data.raw_info?.title?.titleList) member.value.title_list = res.data.raw_info.title.titleList
      if (res.data.raw_info?.profile?.titleName) member.value.title_name = res.data.raw_info.profile.titleName
    }
  } catch (e) {
    console.error('Background Sync Error:', e)
  } finally {
    loadingEquipment.value = false
    loading.value = false
    $loading.hide()
  }
}

// 手动同步数据
const syncMemberData = async () => {
  if (!member.value || syncing.value) return
  
  syncing.value = true
  $loading.show('正在同步最新全量数据...')
  
  try {
    const res = await $fetch('/api/aion/sync', {
      query: {
        memberId: member.value.id,
        characterId: member.value.character_id,
        serverId: member.value.server_id
      }
    })
    
    if (res.success && res.data) {
      applyCachedData(res.data)
      member.value.equipment_data = res.data
      if (res.data.raw_info?.title?.titleList) member.value.title_list = res.data.raw_info.title.titleList
      if (res.data.raw_info?.profile?.titleName) member.value.title_name = res.data.raw_info.profile.titleName
      $alert('同步成功', '成员档案及装备详情已更新至最新状态')
    } else {
      $alert('同步失败', res.error || '无法获取官方数据')
    }
  } catch (e) {
    console.error('Sync Error:', e)
    $alert('同步出错', '网络请求失败，请稍后再试')
  } finally {
    syncing.value = false
    $loading.hide()
  }
}

onMounted(() => {
  fetchMemberDetail()
})
</script>

<style scoped>
.bg-watercolor {
  background-color: #C7F3FE;
  background-image: 
    radial-gradient(at 10% 10%, rgba(255,255,255,0.5) 0%, transparent 40%),
    radial-gradient(at 90% 90%, rgba(174,226,249,0.3) 0%, transparent 40%);
}

.custom-scroll { scrollbar-width: thin; scrollbar-color: #AEE2F9 #E6F7FF; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #E6F7FF; }
::-webkit-scrollbar-thumb { background: #AEE2F9; border-radius: 9999px; }

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes grass-wave {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-20px); }
}
.animate-grass-wave { animation: grass-wave 8s ease-in-out infinite alternate; }
</style>

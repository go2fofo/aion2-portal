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
        <span class="tracking-wider">返回搜索</span>
      </button>
      <div class="flex flex-col items-center">
        <div class="text-xl font-black text-[#45a6d5] tracking-widest">即时档案预览</div>
        <div class="text-[9px] font-black text-amber-500 bg-amber-50 px-2 rounded-full border border-amber-100 uppercase tracking-tighter">Live Preview Mode</div>
      </div>
      <div class="w-10"></div> <!-- 占位保持居中 -->
    </nav>

    <div v-if="loading" class="flex flex-col items-center justify-center h-[80vh]">
      <div class="relative w-32 h-32 mb-6">
        <img src="/xiaoji1.png" class="w-full h-full object-contain animate-bounce-slow" />
        <div class="absolute -bottom-2 inset-x-0 h-2 bg-slate-200/30 blur-md rounded-full scale-x-75 animate-pulse"></div>
      </div>
      <div class="text-sky-600 font-black text-xl tracking-widest animate-pulse">正在链接官方服务器...</div>
    </div>

    <CharacterDetailView 
      v-else-if="characterData"
      :member="characterData"
      :equipment-list="equipmentList"
      :skill-list="skillList"
      :pet="pet"
      :wing="wing"
      :skin-list="skinList"
      :show-ai-analysis="false"
    />

    <div v-else class="flex flex-col items-center justify-center h-[80vh]">
      <div class="text-6xl mb-4">🏜️</div>
      <div class="text-slate-400 font-bold text-xl">获取档案失败</div>
      <button @click="router.back()" class="mt-8 bg-[#45a6d5] text-white px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform">重新查询</button>
    </div>

    <!-- 底部动态草地层 -->
    <div class="relative w-full h-32 md:h-48 pointer-events-none overflow-hidden z-0 opacity-80 mt-10">
      <svg class="absolute bottom-0 w-[120%] -left-[10%] h-full text-[#A3D95B]" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,20 1200,60 L1200,120 L0,120 Z" fill="currentColor"/>
      </svg>
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
const { $loading, $alert } = useNuxtApp()

const loading = ref(true)
const characterData = ref(null)
const equipmentList = ref([])
const skillList = ref([])
const pet = ref(null)
const wing = ref(null)
const skinList = ref([])

const fetchPreviewData = async () => {
  const { characterId, serverId } = route.query
  if (!characterId || !serverId) {
    $alert('缺少必要参数')
    return
  }

  loading.value = true
  // 这里不使用全局 $loading，改用页面内的 loading 状态以保持背景一致性
  
  try {
    const res = await $fetch('/api/aion/preview', {
      query: { characterId, serverId }
    })

    if (res.success && res.data) {
      characterData.value = {
        id: characterId,
        name: res.data.profile.characterName,
        character_id: characterId,
        server_id: serverId,
        server_name: res.data.raw_info?.profile?.serverName,
        class_name: res.data.profile.className,
        level: res.data.profile.level,
        item_level: res.data.profile.itemLevel,
        profile_url: res.data.profile.profileImage,
        title_name: res.data.profile.titleName,
        title_list: res.data.raw_info?.title?.titleList || [],
        gender: res.data.profile.gender,
        equipment_data: res.data
      }
      
      const cached = res.data
      if (cached.skill?.skillList) skillList.value = cached.skill.skillList
      if (cached.equipment?.equipmentList) equipmentList.value = cached.equipment.equipmentList
      if (cached.petwing) {
        pet.value = cached.petwing.pet || null
        wing.value = cached.petwing.wing || null
      }
      if (cached.equipment?.skinList) skinList.value = cached.equipment.skinList
    } else {
      $alert(res.error || '获取数据失败')
    }
  } catch (e) {
    console.error('Preview error:', e)
    $alert('请求出错')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPreviewData()
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

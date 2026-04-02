<script setup>
import { ref, computed, watch } from 'vue'
import { getServersByRace } from '~/utils/aionServers'

const keyword = ref('')
const loading = ref(false)
const results = ref([])
const searched = ref(false)
const raceId = ref(2)
const serverId = ref(2015)

const serverOptions = computed(() => getServersByRace(raceId.value))

watch(raceId, () => {
  const list = serverOptions.value
  serverId.value = list[0]?.serverId || (raceId.value === 1 ? 1001 : 2001)
})

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  
  loading.value = true
  searched.value = true
  try {
    const res = await $fetch('/api/aion/search', {
      query: { keyword: keyword.value, race: raceId.value, serverId: serverId.value, page: 1, size: 30 }
    })
    results.value = res.list || []
  } catch (e) {
    console.error('Search error:', e)
    results.value = []
  } finally {
    loading.value = false
  }
}

// 格式化职业名称
const getClassName = (pcId) => {
  const map = {
    1: '劍星', 2: '劍星', 3: '守護星', 4: '守護星', 5: '殺星', 6: '殺星',
    7: '弓星', 8: '弓星', 9: '魔道星', 10: '魔道星', 11: '精靈星', 12: '精靈星',
    13: '治癒星', 14: '治癒星', 15: '護法星', 16: '護法星', 24: '藝人', 36: '機甲星'
  }
  return map[pcId] || '未知职业'
}

const formatIconUrl = (url) => {
  if (!url) return '/bbbswz.png'
  if (url.startsWith('http')) return url
  return `https://profileimg.plaync.com${url}`
}

const cleanName = (name) => {
  if (!name) return ''
  return name.replace(/<[^>]+>/g, '')
}
</script>

<template>
  <div class="space-y-8 w-full">
    <!-- 搜索栏 -->
    <div class="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-[2.5rem] border-4 border-white shadow-xl flex flex-col md:flex-row gap-4">
      <div class="flex gap-3 flex-wrap md:flex-nowrap">
        <select
          v-model.number="raceId"
          class="px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-sky-400 focus:bg-white outline-none font-black text-slate-700"
        >
          <option :value="1">天族</option>
          <option :value="2">魔族</option>
        </select>
        <select
          v-model.number="serverId"
          class="min-w-[10rem] px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-sky-400 focus:bg-white outline-none font-black text-slate-700"
        >
          <option v-for="s in serverOptions" :key="s.serverId" :value="s.serverId">
            {{ s.serverName }}
          </option>
        </select>
      </div>
      <div class="flex-1 relative">
        <input 
          v-model="keyword"
          type="text" 
          placeholder="输入 AION2 角色名称关键词..."
          class="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-sky-400 focus:bg-white transition-all font-bold text-slate-700 outline-none"
          @keyup.enter="handleSearch"
        />
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      </div>
      <button 
        @click="handleSearch"
        :disabled="loading"
        class="px-10 py-4 bg-sky-500 text-white rounded-2xl font-black shadow-lg shadow-sky-100 hover:bg-sky-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        {{ loading ? '查询中...' : '开始查询' }}
      </button>
    </div>

    <!-- 结果列表 -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="w-16 h-16 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 font-black tracking-widest uppercase text-sm">正在链接 AION 官方数据服务器...</p>
    </div>

    <div v-else-if="searched && results.length === 0" class="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-12 md:p-20 text-center border-4 border-white shadow-xl">
      <div class="text-6xl mb-6 animate-bounce">🏜️</div>
      <h3 class="text-xl font-black text-slate-800 mb-2">未找到匹配角色</h3>
      <p class="text-slate-400 font-bold">请检查名称是否正确，或尝试更换关键词</p>
    </div>

    <div v-else-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="item in results" 
        :key="item.characterId"
        class="bg-white rounded-[2.5rem] border-4 border-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden flex flex-col"
      >
        <!-- 卡片头部背景 -->
        <div class="h-16 bg-gradient-to-r from-slate-50 to-slate-100 relative overflow-hidden shrink-0">
          <div class="absolute inset-0 opacity-10 font-black text-2xl flex items-center justify-center pointer-events-none select-none italic">
            {{ item.serverName }}
          </div>
        </div>

        <!-- 角色信息主体 -->
        <div class="px-6 pb-6 -mt-8 flex-1 flex flex-col items-center">
          <!-- 头像 -->
          <div class="relative mb-3 group-hover:scale-110 transition-transform duration-500">
            <div class="w-20 h-20 rounded-[1.8rem] border-4 border-white shadow-xl overflow-hidden bg-white">
              <img :src="formatIconUrl(item.profileImageUrl)" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
              <div 
                class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                :class="item.race === 1 ? 'bg-sky-500' : 'bg-rose-500'"
              >
                {{ item.race === 1 ? '天' : '魔' }}
              </div>
            </div>
          </div>

          <div class="text-center mb-4 min-w-0 w-full">
            <h3 class="text-lg font-black text-slate-800 mb-1 group-hover:text-sky-500 transition-colors truncate px-2" :title="cleanName(item.name)">
              {{ cleanName(item.name) }}
            </h3>
            <div class="flex items-center justify-center gap-2">
              <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
              <!-- <span class="text-[10px] font-black text-slate-400 uppercase">{{ getClassName(item.pcId) }}</span> -->
              <span class="text-[10px] font-black text-slate-400 uppercase">等级</span> 
              <span class="text-[10px] font-black text-sky-500">Lv.{{ item.level }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <NuxtLink 
            :to="{ path: '/preview', query: { characterId: item.characterId, serverId: item.serverId } }"
            class="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-sm hover:bg-sky-500 hover:text-white transition-all text-center flex items-center justify-center gap-2 shadow-inner"
          >
            查看即时档案
            <span class="text-xs">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 默认提示 -->
    <div v-else class="flex flex-col items-center justify-center py-16 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
      <div class="w-32 h-32 mb-6 transform group-hover:rotate-12 transition-transform duration-500">
        <img src="/bbbswz.png" class="w-full h-full object-contain" />
      </div>
      <p class="text-sky-900 font-black text-xl tracking-widest">寻找你的冒险伙伴...</p>
    </div>
  </div>
</template>

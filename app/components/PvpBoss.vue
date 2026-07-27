<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 如果你项目里配了 Supabase 客户端模块，直接用 useSupabaseClient()
// 或者用 $fetch 调用你的 API 接口。这里演示直接使用 Supabase 客户端：
const client = useSupabaseClient()

const bossList = ref([])
const loading = ref(true)
let timer = null

// 核心计算与自动循环逻辑
const calculateBossStatus = (boss) => {
  const now = new Date()
  let lastRefresh = new Date(boss.last_refresh_time)
  const intervalMs = boss.interval_minutes * 60 * 1000

  // 如果当前时间已经超过了预计刷新时间，自动向后滚动周期
  while (now.getTime() >= lastRefresh.getTime() + intervalMs) {
    lastRefresh = new Date(lastRefresh.getTime() + intervalMs)
    boss.last_refresh_time = lastRefresh.toISOString()
    // 可选：你也可以在这里异步调用 Supabase 更新数据库里的 last_refresh_time
  }

  const nextRefreshTime = new Date(lastRefresh.getTime() + intervalMs)
  const remainingMs = nextRefreshTime.getTime() - now.getTime()
  
  if (remainingMs <= 0) {
    return { countdown: '已刷新！', realTime: '刚刚', isReady: true }
  }

  const totalSeconds = Math.floor(remainingMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const realTimeStr = `${String(nextRefreshTime.getHours()).padStart(2, '0')}:${String(nextRefreshTime.getMinutes()).padStart(2, '0')}:${String(nextRefreshTime.getSeconds()).padStart(2, '0')}`

  return {
    countdown: `${hours}小时${minutes}分${seconds}秒`,
    realTime: realTimeStr,
    isReady: false
  }
}

// 渲染展示用的响应式数据
const displayBosses = ref([])

const fetchBosses = async () => {
  const { data, error } = await client.from('boss_list').select('*')
  if (!error && data) {
    bossList.value = data
    updateDisplay()
  }
  loading.value = false
}

const updateDisplay = () => {
  displayBosses.value = bossList.value.map(boss => {
    const status = calculateBossStatus(boss)
    return {
      ...boss,
      ...status
    }
  })
}

onMounted(async () => {
  await fetchBosses()
  // 每秒刷新一次倒计时
  timer = setInterval(() => {
    updateDisplay()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-black text-sky-900 mb-6 flex items-center gap-2">
      <span>✨ 深渊 BOSS 实时刷新监控</span>
    </h2>

    <div v-if="loading" class="text-slate-500 py-4">加载中...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="boss in displayBosses" 
        :key="boss.id"
        class="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-all"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-bold text-slate-800">{{ boss.name }}</h3>
          <span 
            class="px-2.5 py-1 text-xs font-semibold rounded-full"
            :class="boss.isReady ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-sky-50 text-sky-700'"
          >
            {{ boss.isReady ? '已刷新' : '倒计时中' }}
          </span>
        </div>

        <div class="space-y-2 text-sm text-slate-600">
          <div class="flex justify-between items-center bg-sky-50/50 p-2.5 rounded-xl">
            <span class="text-slate-500">剩余时间：</span>
            <span class="font-mono font-bold text-sky-900 text-base">{{ boss.countdown }}</span>
          </div>
          <div class="flex justify-between items-center px-1">
            <span class="text-slate-500">预计刷新时刻：</span>
            <span class="font-mono font-semibold text-slate-700">{{ boss.realTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const client = useSupabaseClient()

const bossList = ref([])
const loading = ref(true)
let timer = null
const displayBosses = ref([])

const calculateBossStatus = (boss) => {
  const now = new Date()
  let lastRefresh = new Date(boss.last_refresh_time)
  const intervalMs = boss.interval_minutes * 60 * 1000

  while (now.getTime() >= lastRefresh.getTime() + intervalMs) {
    lastRefresh = new Date(lastRefresh.getTime() + intervalMs)
    boss.last_refresh_time = lastRefresh.toISOString()
  }

  const nextRefreshTime = new Date(lastRefresh.getTime() + intervalMs)
  const remainingMs = nextRefreshTime.getTime() - now.getTime()
  
  if (remainingMs <= 0) {
    return { 
      countdown: '已刷新', 
      realTime: '刚刚', 
      isReady: true, 
      isUrgent: false, 
      isFinalCountdown: false,
      remainingMs: 0
    }
  }

  const totalSeconds = Math.floor(remainingMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  // 强制使用中国北京时间（Asia/Shanghai）格式化预计刷新时刻
  const realTimeStr = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(nextRefreshTime)

  const isUrgent = totalSeconds <= 300 && totalSeconds > 10 
  const isFinalCountdown = totalSeconds <= 10 

  return {
    countdown: `${hours > 0 ? hours + '小时' : ''}${minutes}分${seconds}秒`,
    realTime: realTimeStr,
    isReady: false,
    isUrgent,
    isFinalCountdown,
    remainingMs
  }
}

const fetchBosses = async () => {
  const { data, error } = await client.from('boss_list').select('*')
  if (!error && data) {
    bossList.value = data
    updateDisplay()
  }
  loading.value = false
}

const updateDisplay = () => {
  const mapped = bossList.value.map(boss => {
    const status = calculateBossStatus(boss)
    return {
      ...boss,
      ...status
    }
  })

  // 临近刷新自动置顶排序
  mapped.sort((a, b) => a.remainingMs - b.remainingMs)

  displayBosses.value = mapped
}

onMounted(async () => {
  await fetchBosses()
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
    <div class="mb-6 border-b border-slate-100 pb-4">
      <h2 class="text-2xl font-bold tracking-tight text-slate-900">
        深渊 BOSS 刷新监控
      </h2>
      <p class="text-sm text-slate-500 mt-1">实时追踪各区域首领刷新周期（北京时间）与倒计时，临近刷新自动置顶</p>
    </div>

    <div v-if="loading" class="text-slate-400 py-8 text-sm">加载数据中...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="boss in displayBosses" 
        :key="boss.id"
        class="bg-white rounded-xl p-5 border shadow-sm transition-all duration-300"
        :class="[
          boss.isFinalCountdown ? 'border-rose-500 ring-2 ring-rose-400/30 bg-rose-50/20 animate-bounce' :
          boss.isUrgent ? 'border-amber-400 ring-2 ring-amber-300/30 bg-amber-50/20 animate-pulse' :
          boss.isReady ? 'border-emerald-300 bg-emerald-50/10' :
          'border-slate-200 hover:border-slate-300'
        ]"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-semibold text-slate-800 text-base">{{ boss.name }}</h3>
          <span 
            class="px-2.5 py-0.5 text-xs font-medium rounded-full"
            :class="[
              boss.isFinalCountdown ? 'bg-rose-100 text-rose-700 font-bold' :
              boss.isUrgent ? 'bg-amber-100 text-amber-700 font-bold' :
              boss.isReady ? 'bg-emerald-100 text-emerald-700' :
              'bg-slate-100 text-slate-600'
            ]"
          >
            {{ boss.isFinalCountdown ? '即将刷新' : boss.isUrgent ? '即将登场' : boss.isReady ? '已刷新' : '倒计时中' }}
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
            <span class="text-slate-500 text-xs uppercase tracking-wider font-medium">剩余时间</span>
            <span 
              class="font-mono font-bold text-base"
              :class="[
                boss.isFinalCountdown ? 'text-rose-600 scale-105 transition-transform' :
                boss.isUrgent ? 'text-amber-600' :
                'text-slate-800'
              ]"
            >
              {{ boss.countdown }}
            </span>
          </div>

          <div class="flex justify-between items-center px-1 pt-1">
            <span class="text-slate-400 text-xs">预计刷新时刻 (北京时间)</span>
            <span class="font-mono text-xs font-medium text-slate-600">{{ boss.realTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
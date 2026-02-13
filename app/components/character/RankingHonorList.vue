<script setup>
const props = defineProps({
  rankingList: {
    type: Array,
    default: () => []
  }
})

const formatIconUrl = (url) => {
  if (!url) return ''
  return url.replace(/`/g, '').trim()
}

const getRankIcon = (type) => {
  const map = {
    1: '🌌',
    3: '⚔️',
    4: '🏰',
    5: '👹',
    6: '🤝',
    20: '🏅',
    21: '🎖️'
  }
  return map[type] || '🏆'
}

const getRankColor = (rank) => {
  if (rank <= 100) return 'text-amber-500'
  if (rank <= 1000) return 'text-purple-500'
  if (rank <= 3000) return 'text-blue-500'
  return 'text-slate-600'
}
</script>

<template>
  <div v-if="rankingList.length > 0" class="space-y-4">
    <h3 class="font-black text-sky-900 text-lg flex items-center gap-2 px-2">
      <span class="bg-white p-1.5 rounded-xl shadow-sm">🏆</span> 竞技与排名荣誉
    </h3>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="rank in rankingList" 
        :key="rank.rankingContentsType"
        class="bg-white/70 backdrop-blur-sm p-6 rounded-[3rem] border-4 border-white shadow-lg hover:shadow-xl transition-all group overflow-hidden relative flex flex-col items-center text-center"
      >
        <!-- 背景装饰图标 (Emoji) -->
        <div class="absolute -bottom-2 -right-2 text-5xl opacity-5 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">
          {{ getRankIcon(rank.rankingContentsType) }}
        </div>

        <!-- 等级图标 (API 提供的图片) -->
        <div v-if="rank.gradeIcon" class="w-16 h-16 mb-4 relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-500">
          <img :src="formatIconUrl(rank.gradeIcon)" class="w-full h-full object-contain" />
        </div>
        
        <div class="relative z-10">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{{ rank.displayName }}</span>
          <div class="text-4xl font-black italic mb-2 flex items-center justify-center gap-1" :class="getRankColor(rank.rank)">
            <span class="text-base font-bold not-italic">#</span>{{ rank.rank }}
            <!-- 排名变动提示 -->
            <span v-if="rank.changeType !== 'stable'" class="text-xs not-italic font-black flex items-center gap-0.5" :class="rank.changeType === 'up' ? 'text-emerald-500' : 'text-rose-500'">
              {{ rank.changeType === 'up' ? '↑' : '↓' }}{{ rank.absChange }}
            </span>
          </div>
          
          <div class="flex flex-col gap-1">
            <div class="text-[11px] font-black text-slate-700 bg-slate-100/80 px-3 py-1 rounded-xl border border-slate-100 shadow-inner">
              {{ rank.gradeName || '未定级' }}
            </div>
            <div class="text-[10px] font-bold text-sky-600/70">
              {{ rank.point?.toLocaleString() }} 积分
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

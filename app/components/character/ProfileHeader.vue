<script setup>
const props = defineProps({
  member: {
    type: Object,
    required: true
  },
  syncing: {
    type: Boolean,
    default: false
  },
  coreCombatStats: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['sync'])

const onSync = () => {
  emit('sync')
}
</script>

<template>
  <div class="relative bg-white/70 backdrop-blur-sm rounded-[3rem] p-6 md:p-10 shadow-xl border-4 border-white overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-sky-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    
    <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
      <!-- 头像区 -->
      <div class="relative group shrink-0">
        <div class="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] border-4 border-white shadow-[0_12px_30px_rgba(69,166,213,0.15)] overflow-hidden bg-sky-50 transition-all group-hover:shadow-[0_12px_40px_rgba(69,166,213,0.25)]">
          <img :src="member.profile_url || '/bbbswz.png'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <!-- 等级徽章 -->
        <div class="absolute -bottom-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-black text-2xl px-5 py-2 rounded-2xl border-4 border-white shadow-lg z-20">
          Lv.{{ member.level }}
        </div>
      </div>

      <!-- 信息与核心数值区 -->
      <div class="flex-1 w-full space-y-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">{{ member.name }}</h1>
            <div class="flex items-center gap-2">
              <span v-if="member.role === 'leader'" class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-md animate-bounce">👑 军团长</span>
              <span v-else-if="member.role === 'officer'" class="bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-md">⚔️ 精英军官</span>
              <span v-else-if="member.role === 'member'" class="bg-gradient-to-r from-slate-400 to-slate-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-md">🛡️ 军团兵</span>
            </div>
          </div>

          <!-- 刷新按钮 -->
          <button 
            @click="onSync" 
            :disabled="syncing"
            class="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-sky-100 text-sky-600 font-black text-sm shadow-sm hover:border-sky-300 hover:text-sky-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-sky-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span class="relative flex items-center justify-center">
              <svg v-if="syncing" class="w-5 h-5 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4522" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="opacity-75"></path>
              </svg>
              <svg v-else class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C4 7.58172 7.58172 4 12 4C14.5 4 16.7341 5.14722 18.2002 6.94444M18.2002 6.94444V3M18.2002 6.94444H14.5M20 12C20 16.4183 16.4183 20 12 20C9.5 20 7.26595 18.8528 5.7998 17.0556M5.7998 17.0556V21M5.7998 17.0556H9.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="relative">{{ syncing ? '同步中...' : '刷新数据' }}</span>
          </button>
        </div>

        <div class="bg-sky-50/50 p-4 rounded-3xl border border-sky-100/50 inline-block md:block">
          <p class="text-slate-600 font-black italic text-lg leading-relaxed">
            "{{ member.title_name || member.note || '这只宝宝很懒，什么都没留下~' }}"
          </p>
        </div>

        <!-- 核心档案数值网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <!-- 基础信息 -->
          <div class="bg-white/80 p-3 rounded-2xl border-2 border-sky-100 shadow-sm flex items-center gap-3">
            <span class="text-xl bg-sky-50 p-2 rounded-xl">🛡️</span>
            <div>
              <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">职业</div>
              <div class="text-sky-800 font-black text-xs">{{ member.class_name }}</div>
            </div>
          </div>
          <div class="bg-white/80 p-3 rounded-2xl border-2 border-yellow-100 shadow-sm flex items-center gap-3">
            <span class="text-xl bg-yellow-50 p-2 rounded-xl">⚔️</span>
            <div>
              <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">装等</div>
              <div class="text-yellow-600 font-black text-xs">{{ member.item_level || 'N/A' }}</div>
            </div>
          </div>
          <div class="bg-white/80 p-3 rounded-2xl border-2 border-pink-100 shadow-sm flex items-center gap-3">
            <span class="text-xl bg-pink-50 p-2 rounded-xl">{{ member.gender === 'female' ? '♀' : '♂' }}</span>
            <div>
              <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">性别</div>
              <div class="text-pink-600 font-black text-xs">{{ member.gender === 'female' ? '女' : '男' }}</div>
            </div>
          </div>
          <div class="bg-white/80 p-3 rounded-2xl border-2 border-indigo-100 shadow-sm flex items-center gap-3">
            <span class="text-xl bg-indigo-50 p-2 rounded-xl">🏳️</span>
            <div>
              <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">种族</div>
              <div class="text-indigo-800 font-black text-xs">{{ member.race_id === 1 ? '天族' : '魔族' }}</div>
            </div>
          </div>

          <!-- 核心战斗数值 -->
          <div 
            v-for="stat in coreCombatStats" 
            :key="stat.type"
            class="bg-white/80 p-3 rounded-2xl border-2 shadow-sm flex items-center gap-3 border-slate-50"
            :class="stat.bg"
          >
            <span class="text-xl p-2 rounded-xl bg-white/50">{{ stat.icon }}</span>
            <div>
              <div class="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">{{ stat.label }}</div>
              <div class="font-black text-xs" :class="stat.color">{{ stat.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

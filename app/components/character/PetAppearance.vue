<script setup>
const props = defineProps({
  loadingEquipment: {
    type: Boolean,
    default: false
  },
  pet: {
    type: Object,
    default: null
  },
  wing: {
    type: Object,
    default: null
  },
  skinList: {
    type: Array,
    default: () => []
  }
})

const formatIconUrl = (url) => {
  if (!url) return ''
  return url.replace(/`/g, '').trim()
}
</script>

<template>
  <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
    <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center gap-3">
      <span class="bg-pink-100 p-2 rounded-2xl">🦋</span> 宠物与外观
    </h3>
    <div v-if="loadingEquipment" class="text-center py-8 text-slate-400 font-bold">读取外观信息中...</div>
    <div v-else-if="!pet && !wing && skinList.length === 0" class="text-center py-8 text-slate-400 font-bold">暂无相关数据</div>
    <div v-else class="space-y-10">
      <!-- 宠物伙伴 -->
      <div v-if="pet">
        <div class="flex items-center gap-3 mb-4">
          <span class="w-1.5 h-5 bg-sky-400 rounded-full"></span>
          <h4 class="font-black text-sky-800 text-sm">宠物伙伴</h4>
        </div>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-4 bg-[#F0F9FF] p-4 rounded-3xl border-2 border-white shadow-sm min-w-[240px] hover:scale-[1.02] transition-transform">
            <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-sky-100 shadow-inner shrink-0">
              <img :src="formatIconUrl(pet.icon)" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="text-[10px] text-sky-400 font-black uppercase mb-0.5 tracking-tighter">Companion</div>
              <div class="text-sky-900 font-black text-lg leading-tight">{{ pet.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 飞行翅膀 -->
      <div v-if="wing">
        <div class="flex items-center gap-3 mb-4">
          <span class="w-1.5 h-5 bg-pink-400 rounded-full"></span>
          <h4 class="font-black text-pink-800 text-sm">飞行翅膀</h4>
        </div>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center gap-4 bg-[#FDF2F8] p-4 rounded-3xl border-2 border-white shadow-sm min-w-[240px] hover:scale-[1.02] transition-transform">
            <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-pink-100 shadow-inner shrink-0">
              <img :src="formatIconUrl(wing.icon)" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="text-[10px] text-pink-400 font-black uppercase mb-0.5 tracking-tighter">Wings</div>
              <div class="text-pink-900 font-black text-lg leading-tight">{{ wing.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时装外观 -->
      <div v-if="skinList.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <span class="w-1.5 h-5 bg-purple-400 rounded-full"></span>
          <h4 class="font-black text-purple-800 text-sm">时装外观</h4>
          <span class="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-bold">{{ skinList.length }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="skin in skinList" :key="skin.id" class="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border-2 border-white shadow-sm hover:scale-[1.02] transition-transform group">
            <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-inner shrink-0">
              <img :src="formatIconUrl(skin.icon)" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div class="text-[10px] text-slate-400 font-black uppercase mb-0.5 tracking-tighter">Costume</div>
              <div class="text-slate-800 font-black text-base leading-tight">{{ skin.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

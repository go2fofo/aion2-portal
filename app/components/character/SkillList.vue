<script setup>
const props = defineProps({
  loadingEquipment: {
    type: Boolean,
    default: false
  },
  skillList: {
    type: Array,
    default: () => []
  },
  activeSkills: {
    type: Array,
    default: () => []
  },
  passiveSkills: {
    type: Array,
    default: () => []
  },
  stigmaSkills: {
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
      <span class="bg-purple-100 p-2 rounded-2xl">⚡</span> 角色技能
    </h3>
    
    <div v-if="loadingEquipment" class="text-center py-8 text-slate-400 font-bold">读取技能信息中...</div>
    <div v-else-if="skillList.length === 0" class="text-center py-8 text-slate-400 font-bold">暂无技能数据</div>
    
    <div v-else class="space-y-12">
      <!-- 主动技能 -->
      <div v-if="activeSkills.length > 0">
        <div class="flex items-center gap-3 mb-6">
          <span class="w-1.5 h-6 bg-[#45a6d5] rounded-full"></span>
          <h4 class="font-black text-sky-800 text-lg">主动技能</h4>
          <span class="text-xs bg-sky-50 text-sky-600 px-3 py-1 rounded-xl font-black shadow-sm">{{ activeSkills.length }}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-x-4 gap-y-8">
          <div 
            v-for="skill in activeSkills" 
            :key="skill.id" 
            class="flex flex-col items-center gap-2 group cursor-pointer"
            :title="skill.name"
          >
            <div 
              class="relative w-full aspect-square rounded-2xl border-2 transition-all overflow-hidden"
              :class="[
                skill.skillLevel === 0 ? 'opacity-40 grayscale border-slate-200' : 'border-white shadow-md group-hover:border-sky-300 group-hover:-translate-y-1'
              ]"
            >
              <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 left-0 right-0 py-1 text-[10px] font-black text-center text-white" :class="skill.skillLevel === 0 ? 'bg-slate-400' : 'bg-[#45a6d5]/90'">
                Lv.{{ skill.skillLevel }}
              </div>
              <div v-if="skill.equip === 1" class="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div class="text-[10px] font-black text-slate-600 text-center leading-tight truncate w-full px-1" :class="{ 'text-slate-400': skill.skillLevel === 0 }">
              {{ skill.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 烙印技能 -->
      <div v-if="stigmaSkills.length > 0">
        <div class="flex items-center gap-3 mb-6">
          <span class="w-1.5 h-6 bg-purple-500 rounded-full"></span>
          <h4 class="font-black text-purple-800 text-lg">烙印技能</h4>
          <span class="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-xl font-black shadow-sm">{{ stigmaSkills.length }}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-x-4 gap-y-8">
          <div 
            v-for="skill in stigmaSkills" 
            :key="skill.id" 
            class="flex flex-col items-center gap-2 group cursor-pointer"
            :title="skill.name"
          >
            <div 
              class="relative w-full aspect-square rounded-2xl border-2 transition-all overflow-hidden"
              :class="[
                skill.skillLevel === 0 ? 'opacity-40 grayscale border-slate-200' : 'border-purple-200 shadow-md group-hover:border-purple-400 group-hover:-translate-y-1'
              ]"
            >
              <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 left-0 right-0 py-1 text-[10px] font-black text-center text-white" :class="skill.skillLevel === 0 ? 'bg-slate-400' : 'bg-purple-500/90'">
                Lv.{{ skill.skillLevel }}
              </div>
              <div v-if="skill.equip === 1" class="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <div class="text-[10px] font-black text-purple-700 text-center leading-tight truncate w-full px-1" :class="{ 'text-slate-400': skill.skillLevel === 0 }">
              {{ skill.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 被动技能 -->
      <div v-if="passiveSkills.length > 0">
        <div class="flex items-center gap-3 mb-6">
          <span class="w-1.5 h-6 bg-slate-400 rounded-full"></span>
          <h4 class="font-black text-slate-700 text-lg">被动技能</h4>
          <span class="text-xs bg-slate-50 text-slate-500 px-3 py-1 rounded-xl font-black shadow-sm">{{ passiveSkills.length }}</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-x-4 gap-y-8">
          <div 
            v-for="skill in passiveSkills" 
            :key="skill.id" 
            class="flex flex-col items-center gap-2 group cursor-pointer"
            :title="skill.name"
          >
            <div 
              class="relative w-full aspect-square rounded-2xl border-2 transition-all overflow-hidden"
              :class="[
                skill.skillLevel === 0 ? 'opacity-40 grayscale border-slate-200' : 'border-slate-100 shadow-sm group-hover:border-slate-300 group-hover:-translate-y-1'
              ]"
            >
              <img :src="formatIconUrl(skill.icon)" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 left-0 right-0 py-1 text-[10px] font-black text-center text-white" :class="skill.skillLevel === 0 ? 'bg-slate-400' : 'bg-slate-500/90'">
                Lv.{{ skill.skillLevel }}
              </div>
            </div>
            <div class="text-[10px] font-black text-slate-500 text-center leading-tight truncate w-full px-1" :class="{ 'text-slate-400': skill.skillLevel === 0 }">
              {{ skill.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

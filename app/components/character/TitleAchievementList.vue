<script setup>
const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})

// 装备品级配置映射
const gradeConfig = {
  Common: { name: '普通', color: 'slate', desc: '基础材料装', bg: 'bg-slate-500', border: 'border-slate-100', light: 'bg-slate-400', gradient: 'from-slate-400 to-slate-600' },
  Superior: { name: '优秀', color: 'emerald', desc: '入门级', bg: 'bg-emerald-500', border: 'border-emerald-100', light: 'bg-emerald-400', gradient: 'from-emerald-400 to-emerald-600' },
  Heroic: { name: '英雄', color: 'blue', desc: '进阶级', bg: 'bg-blue-500', border: 'border-blue-100', light: 'bg-blue-400', gradient: 'from-blue-400 to-blue-600' },
  Fabled: { name: '传承', color: 'amber', desc: '中端主流', bg: 'bg-amber-500', border: 'border-amber-100', light: 'bg-amber-400', gradient: 'from-amber-400 to-amber-600' },
  Unique: { name: '唯一', color: 'orange', desc: '中端主流', bg: 'bg-orange-500', border: 'border-orange-100', light: 'bg-orange-400', gradient: 'from-orange-400 to-orange-600' },
  Eternal: { name: '永恒', color: 'indigo', desc: '高端核心', bg: 'bg-indigo-500', border: 'border-indigo-100', light: 'bg-indigo-400', gradient: 'from-indigo-400 to-indigo-600' },
  Mythic: { name: '神话', color: 'purple', desc: '高端核心', bg: 'bg-purple-500', border: 'border-purple-100', light: 'bg-purple-400', gradient: 'from-purple-400 to-purple-600' },
  Epic: { name: '史诗', color: 'red', desc: '顶级毕业装备', bg: 'bg-red-500', border: 'border-red-100', light: 'bg-red-400', gradient: 'from-red-400 to-red-600' }
}

const getGradeInfo = (grade) => gradeConfig[grade] || gradeConfig.Common

// 翻译佩戴分类
const getEquipCategoryLabel = (cat) => {
  const map = {
    Attack: '攻击',
    Defense: '防御',
    Etc: '其他'
  }
  return map[cat] || cat
}
</script>

<template>
  <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
    <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center gap-3">
      <span class="bg-amber-100 p-2 rounded-2xl">🏆</span> 称号成就馆
    </h3>
    <div v-if="!member.title_list?.length" class="text-center py-12 text-slate-400 font-black">暂无称号档案</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="title in member.title_list" 
        :key="title.id"
        class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-lg group relative overflow-hidden"
        :class="[
          title.equipCategory ? 'border-sky-200 shadow-md scale-[1.02]' : 'border-slate-50 opacity-80 hover:opacity-100'
        ]"
      >
        <!-- 佩戴角标 -->
        <div v-if="title.equipCategory" class="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl shadow-sm z-20">
          已佩戴 ({{ getEquipCategoryLabel(title.equipCategory) }})
        </div>

        <!-- 称号标题 -->
        <div class="px-6 pt-6 pb-4">
          <div class="flex items-center gap-2 mb-2">
            <span 
              class="px-2 py-0.5 rounded-md text-[9px] font-black text-white uppercase tracking-widest"
              :class="getGradeInfo(title.grade).bg"
            >
              {{ getGradeInfo(title.grade).name }}
            </span>
            <span v-if="title.ownedPercent" class="text-[9px] font-bold text-slate-300">持有率 {{ title.ownedPercent }}%</span>
          </div>
          <h4 class="text-lg font-black text-slate-800 leading-tight">{{ title.name }}</h4>
        </div>

        <!-- 属性列表 -->
        <div class="px-6 pb-6 space-y-3">
          <!-- 基础属性 -->
          <div v-if="title.statList?.length" class="space-y-1">
            <div class="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">基础加成</div>
            <div v-for="(stat, sIdx) in title.statList" :key="sIdx" class="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              {{ stat.desc }}
            </div>
          </div>

          <!-- 佩戴属性 -->
          <div v-if="title.equipStatList?.length" class="space-y-1">
            <div class="text-[9px] font-black text-sky-400 uppercase tracking-tighter mb-1">佩戴额外加成</div>
            <div class="grid grid-cols-1 gap-1">
              <div v-for="(stat, sIdx) in title.equipStatList" :key="sIdx" class="text-xs font-black text-sky-700 bg-sky-50/50 px-3 py-1.5 rounded-xl border border-sky-100">
                {{ stat.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

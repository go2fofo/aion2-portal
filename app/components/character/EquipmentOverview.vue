<script setup>
const props = defineProps({
  loadingEquipment: {
    type: Boolean,
    default: false
  },
  equipmentList: {
    type: Array,
    default: () => []
  },
  groupedEquipment: {
    type: Array,
    default: () => []
  },
  runeRow: {
    type: Array,
    default: () => []
  },
  arcanaList: {
    type: Array,
    default: () => []
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
  Legend: { name: '传说', color: 'rose', desc: '顶级核心', bg: 'bg-rose-500', border: 'border-rose-100', light: 'bg-rose-400', gradient: 'from-rose-400 to-rose-600' },
  Epic: { name: '史诗', color: 'red', desc: '顶级毕业装备', bg: 'bg-red-500', border: 'border-red-100', light: 'bg-red-400', gradient: 'from-red-400 to-red-600' }
}

const getGradeInfo = (grade) => gradeConfig[grade] || gradeConfig.Common

// 获取品级对应的文字颜色类
const getGradeTextColor = (grade) => {
  const config = gradeConfig[grade] || gradeConfig.Common
  // 史诗品级特殊处理，使用更深的红色
  if (grade === 'Epic') return 'text-red-600'
  return `text-${config.color}-500`
}

const formatIconUrl = (url) => {
  if (!url) return ''
  return url.replace(/`/g, '').trim()
}

const slotMap = {
  'MainHand': '主手武器',
  'SubHand': '副手武器',
  'Helmet': '头部防具',
  'Torso': '胸部防具',
  'Pants': '腿部防具',
  'Gloves': '手部防具',
  'Boots': '脚部防具',
  'Shoulder': '肩部防具',
  'Cape': '披风/背饰',
  'Belt': '腰带饰品',
  'Earring1': '左耳环',
  'Earring2': '右耳环',
  'Ring1': '左戒指',
  'Ring2': '右戒指',
  'Necklace': '项链饰品',
  'Bracelet1': '左手镯',
  'Bracelet2': '右手镯',
  'Amulet': '护身符',
  'Rune1': '符文槽位1',
  'Rune2': '符文槽位2',
  'Arcana1': '阿卡纳1',
  'Arcana2': '阿卡纳2',
  'Arcana3': '阿卡纳3',
  'Arcana4': '阿卡纳4',
  'Arcana5': '阿卡纳5'
}
</script>

<template>
  <div class="space-y-8">
    <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white">
      <h3 class="font-black text-sky-900 text-xl mb-6 flex items-center gap-3">
        <span class="bg-yellow-100 p-2 rounded-2xl">🎒</span> 装备概览
      </h3>
      
      <div v-if="loadingEquipment" class="text-center py-12">
        <div class="inline-flex flex-col items-center gap-3">
          <svg class="w-12 h-12 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4522" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="opacity-75"></path>
          </svg>
          <span class="text-slate-400 font-black">正在解析深度装备数据...</span>
        </div>
      </div>
      
      <div v-else-if="equipmentList.length === 0" class="text-center py-12 text-slate-400 font-black">暂无装备档案</div>
      
      <div v-else class="space-y-16">
        <!-- 普通装备分组 -->
        <div v-for="group in groupedEquipment" :key="group.label" class="space-y-8">
          <div class="flex items-center gap-3">
            <span class="p-2 rounded-2xl text-xl" :class="group.theme">{{ group.icon }}</span>
            <h4 class="font-black text-sky-900 text-xl tracking-widest">{{ group.label }}</h4>
            <div class="flex-1 h-px bg-slate-100 ml-4"></div>
          </div>
          
          <div v-for="(row, rIdx) in group.rows" :key="rIdx" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <template v-for="item in row" :key="item.isPlaceholder ? item.slotPosName : item.id">
              <!-- 装备卡片 -->
              <div 
                v-if="!item.isPlaceholder"
                class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                :class="getGradeInfo(item.grade).border"
              >
                <div class="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" :class="getGradeInfo(item.grade).light"></div>
                <div class="px-6 pt-6 flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
                      {{ slotMap[item.slotPosName] || item.slotPosName }}
                    </span>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <div class="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-widest bg-gradient-to-r" :class="getGradeInfo(item.grade).gradient">
                      {{ getGradeInfo(item.grade).name }}
                    </div>
                    <div class="text-[8px] font-bold text-slate-400 opacity-60">{{ getGradeInfo(item.grade).desc }}</div>
                  </div>
                </div>

                <div class="px-6 flex items-start gap-5 mb-6">
                  <div class="relative shrink-0 group-hover:scale-105 transition-transform">
                    <div class="w-20 h-20 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-slate-50 relative z-10">
                      <img :src="formatIconUrl(item.icon)" class="w-full h-full object-cover p-2" />
                    </div>
                    <div v-if="item.fullDetail?.level" class="absolute -top-2 -left-2 z-20 bg-sky-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white shadow-md flex items-center gap-0.5">
                      <span>Lv.{{ item.fullDetail.level }}</span>
                      <span v-if="item.fullDetail?.levelValue" class="text-emerald-300">+{{ item.fullDetail.levelValue }}</span>
                    </div>
                    <div class="absolute inset-0 blur-xl opacity-30 rounded-full" :class="getGradeInfo(item.grade).light"></div>
                  </div>

                  <div class="min-w-0 pt-1">
                    <div v-if="item.exceedLevel > 0 || item.enchantLevel > 0" class="flex items-center gap-2 mb-2">
                      <div v-if="item.exceedLevel > 0" class="flex items-center bg-sky-50 rounded-lg overflow-hidden border border-sky-100 shadow-sm">
                        <span class="bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">突破</span>
                        <span class="px-1.5 text-sky-700 font-black text-xs">{{ item.exceedLevel }}</span>
                      </div>
                      <div v-if="item.enchantLevel > 0" class="flex items-center bg-rose-50 rounded-lg overflow-hidden border border-rose-100 shadow-sm">
                        <span class="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">强化</span>
                        <span class="px-1.5 text-rose-700 font-black text-xs">+{{ item.enchantLevel }}</span>
                      </div>
                    </div>
                    <h4 class="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-2" :title="item.name">{{ item.name }}</h4>
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-[10px] font-mono text-slate-300">#{{ item.id }}</span>
                      <span v-if="item.fullDetail?.categoryName" class="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        {{ item.fullDetail.categoryName }}
                      </span>
                      <span v-if="item.fullDetail?.equipLevel" class="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        需求等级 {{ item.fullDetail.equipLevel }}
                      </span>
                      <span v-if="item.fullDetail?.level" class="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1">
                        <span>道具等级 {{ item.fullDetail.level }}</span>
                        <span v-if="item.fullDetail?.levelValue" class="text-emerald-600 bg-emerald-100/50 px-1 rounded-sm">+{{ item.fullDetail.levelValue }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 详情 -->
                <div class="px-6 pb-6 space-y-4">
                  <div v-if="item.fullDetail?.mainStats?.length" class="space-y-2">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="w-1 h-3 bg-sky-400 rounded-full"></span>
                      <span class="text-[10px] font-black text-slate-400 uppercase">基础属性</span>
                    </div>
                    <div class="grid grid-cols-1 gap-1.5">
                      <div v-for="(stat, sIdx) in item.fullDetail.mainStats" :key="sIdx" class="flex items-center justify-between bg-white border border-slate-50 p-2 rounded-xl shadow-sm">
                        <span class="text-xs text-slate-500 font-bold">{{ stat.name }}</span>
                        <div class="flex items-center gap-1.5">
                          <span class="text-xs text-slate-800 font-black">{{ stat.value }}</span>
                          <span v-if="stat.extra && stat.extra !== '0' && stat.extra !== '0%'" class="text-[10px] text-red-500 font-black">
                            (+{{ stat.extra }})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="item.fullDetail?.subStats?.length" class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-inner">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="w-1 h-3 bg-purple-400 rounded-full"></span>
                      <span class="text-[10px] font-black text-slate-400 uppercase">随机属性</span>
                    </div>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div v-for="(stat, sIdx) in item.fullDetail.subStats" :key="sIdx" class="flex items-center justify-between">
                        <span class="text-[11px] text-slate-400 font-bold truncate">{{ stat.name }}</span>
                        <span class="text-[11px] text-slate-600 font-black">+{{ stat.value }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 随机技能展示 -->
                  <div v-if="item.fullDetail?.subSkills?.length" class="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 shadow-inner mt-3">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="w-1 h-3 bg-indigo-400 rounded-full"></span>
                      <span class="text-[10px] font-black text-indigo-400 uppercase">随机技能</span>
                    </div>
                    <div class="space-y-3">
                      <div v-for="(skill, sIdx) in item.fullDetail.subSkills" :key="sIdx" class="flex flex-col gap-1">
                        <div class="flex items-center gap-2">
                          <span class="text-[11px] text-indigo-700 font-black">{{ skill.name }}</span>
                          <span v-if="skill.level" class="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-black">Lv.{{ skill.level }}</span>
                        </div>
                        <p v-if="skill.desc" class="text-[10px] text-slate-500 font-medium leading-relaxed bg-white/50 p-2 rounded-lg border border-indigo-50/50">
                          {{ skill.desc }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 魔石展示 -->
                  <div v-if="item.fullDetail?.magicStoneStat?.length" class="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 shadow-inner mt-3">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="w-1 h-3 bg-emerald-400 rounded-full"></span>
                      <span class="text-[10px] font-black text-emerald-400 uppercase">魔石插槽</span>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                      <div v-for="(stone, sIdx) in item.fullDetail.magicStoneStat" :key="sIdx" class="flex items-center justify-between bg-white/60 p-2 rounded-xl border border-emerald-50/50">
                        <div class="flex items-center gap-2">
                          <img :src="stone.icon" class="w-5 h-5 object-contain" />
                          <span class="text-[11px] font-bold" :class="getGradeTextColor(stone.grade)">{{ stone.name }}</span>
                        </div>
                        <span class="text-[11px] font-black" :class="getGradeTextColor(stone.grade)">{{ stone.value }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 来源展示 -->
                  <div v-if="item.fullDetail?.sources?.length" class="mt-6 pt-4 border-t border-slate-50">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">获取来源</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <div v-for="(source, sIdx) in item.fullDetail.sources" :key="sIdx" class="flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-white text-slate-500 hover:text-indigo-600 rounded-full border border-slate-100 hover:border-indigo-100 shadow-sm transition-all cursor-default group/src">
                        <span class="w-1 h-1 rounded-full bg-slate-300 group-hover/src:bg-indigo-400 transition-colors"></span>
                        <span class="text-[10px] font-black uppercase tracking-wider">{{ source }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 更多详情按需显示 (技能, 来源, 神石, 魔石) -->
                </div>
              </div>

              <!-- 占位卡片 -->
              <div v-else class="flex flex-col bg-slate-50/50 rounded-[2.5rem] border-4 border-dashed border-slate-100 opacity-60">
                <div class="px-6 pt-6 flex items-center justify-between mb-4">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white text-slate-300 border border-slate-100 shadow-sm">
                    {{ slotMap[item.slotPosName] || item.slotPosName }}
                  </span>
                </div>
                <div class="px-6 flex flex-col items-center justify-center py-12 gap-4">
                  <div class="w-16 h-16 rounded-3xl border-4 border-white shadow-inner bg-white flex items-center justify-center text-slate-100">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span class="text-xs font-black text-slate-200 tracking-widest uppercase">待装备</span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 符文专区 -->
        <div class="space-y-8">
          <div class="flex items-center gap-3">
            <span class="w-2 h-6 bg-amber-400 rounded-full"></span>
            <h4 class="font-black text-amber-900 text-lg tracking-widest">古代符文</h4>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <template v-for="item in runeRow" :key="item.isPlaceholder ? item.slotPosName : item.id">
              <div 
                v-if="!item.isPlaceholder"
                class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
                :class="getGradeInfo(item.grade).border"
              >
                <div class="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" :class="getGradeInfo(item.grade).light"></div>
                <div class="px-6 pt-6 flex items-center justify-between mb-4">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-50 text-amber-500 border border-amber-100 shadow-sm">
                    {{ slotMap[item.slotPosName] || item.slotPosName }}
                  </span>
                  <div class="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-widest bg-gradient-to-r" :class="getGradeInfo(item.grade).gradient">
                    {{ getGradeInfo(item.grade).name }}
                  </div>
                </div>

                <div class="px-6 flex items-start gap-5 mb-6">
                  <div class="relative shrink-0 group-hover:scale-105 transition-transform">
                    <div class="w-20 h-20 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-slate-50 relative z-10">
                      <img :src="formatIconUrl(item.icon)" class="w-full h-full object-cover p-2" />
                    </div>
                    <div v-if="item.fullDetail?.level" class="absolute -top-2 -left-2 z-20 bg-sky-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white shadow-md flex items-center gap-0.5">
                      <span>Lv.{{ item.fullDetail.level }}</span>
                      <span v-if="item.fullDetail?.levelValue" class="text-emerald-300">+{{ item.fullDetail.levelValue }}</span>
                    </div>
                    <div class="absolute inset-0 blur-xl opacity-30 rounded-full" :class="getGradeInfo(item.grade).light"></div>
                  </div>
                  <div class="min-w-0 pt-1">
                    <div v-if="item.exceedLevel > 0 || item.enchantLevel > 0" class="flex items-center gap-2 mb-2">
                      <div v-if="item.exceedLevel > 0" class="flex items-center bg-sky-50 rounded-lg overflow-hidden border border-sky-100 shadow-sm">
                        <span class="bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">突破</span>
                        <span class="px-1.5 text-sky-700 font-black text-xs">{{ item.exceedLevel }}</span>
                      </div>
                      <div v-if="item.enchantLevel > 0" class="flex items-center bg-amber-50 rounded-lg overflow-hidden border border-amber-100 shadow-sm">
                        <span class="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">强化</span>
                        <span class="px-1.5 text-amber-700 font-black text-xs">+{{ item.enchantLevel }}</span>
                      </div>
                    </div>
                    <h4 class="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-2">{{ item.name }}</h4>
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-[10px] font-mono text-slate-300">#{{ item.id }}</span>
                      <span v-if="item.fullDetail?.level" class="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1">
                        <span>道具等级 {{ item.fullDetail.level }}</span>
                        <span v-if="item.fullDetail?.levelValue" class="text-emerald-600 bg-emerald-100/50 px-1 rounded-sm">+{{ item.fullDetail.levelValue }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="item.fullDetail" class="px-6 pb-6 space-y-3">
                  <div v-if="item.fullDetail.mainStats?.length" class="grid grid-cols-1 gap-1.5">
                    <div v-for="(stat, sIdx) in item.fullDetail.mainStats" :key="sIdx" class="flex items-center justify-between bg-amber-50/30 border border-amber-50 p-2 rounded-xl">
                      <span class="text-xs text-amber-600 font-bold">{{ stat.name }}</span>
                      <span class="text-xs text-amber-900 font-black">{{ stat.value }}</span>
                    </div>
                  </div>

                  <!-- 符文随机技能 -->
                  <div v-if="item.fullDetail.subSkills?.length" class="space-y-2 pt-2 border-t border-amber-100/50">
                    <div v-for="(skill, sIdx) in item.fullDetail.subSkills" :key="sIdx" class="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/30">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-[11px] text-indigo-700 font-black">{{ skill.name }}</span>
                        <span v-if="skill.level" class="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-black">Lv.{{ skill.level }}</span>
                      </div>
                      <p v-if="skill.desc" class="text-[10px] text-slate-500 leading-tight">{{ skill.desc }}</p>
                    </div>
                  </div>

                  <!-- 符文魔石 -->
                  <div v-if="item.fullDetail?.magicStoneStat?.length" class="space-y-1.5">
                    <div v-for="(stone, sIdx) in item.fullDetail.magicStoneStat" :key="sIdx" class="flex items-center justify-between bg-emerald-50/20 p-1.5 rounded-lg border border-emerald-100/30">
                      <div class="flex items-center gap-1.5">
                        <img :src="stone.icon" class="w-4 h-4 object-contain" />
                        <span class="text-[10px] font-bold" :class="getGradeTextColor(stone.grade)">{{ stone.name }}</span>
                      </div>
                      <span class="text-[10px] font-black" :class="getGradeTextColor(stone.grade)">{{ stone.value }}</span>
                    </div>
                  </div>

                  <!-- 符文来源 -->
                  <div v-if="item.fullDetail?.sources?.length" class="flex flex-wrap gap-1.5 pt-2 border-t border-amber-50">
                    <span 
                      v-for="(source, sIdx) in item.fullDetail.sources" 
                      :key="sIdx" 
                      class="text-[9px] font-black text-amber-600/60 bg-amber-50/50 px-2 py-0.5 rounded-lg border border-amber-100/50 hover:bg-amber-100/50 hover:text-amber-700 transition-all cursor-default"
                    >
                      # {{ source }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-else class="flex flex-col bg-amber-50/20 rounded-[2.5rem] border-4 border-dashed border-amber-100 opacity-40">
                <div class="px-6 pt-6 flex items-center justify-between mb-4">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white text-amber-200 border border-amber-50 shadow-sm">
                    {{ slotMap[item.slotPosName] || item.slotPosName }}
                  </span>
                </div>
                <div class="px-6 flex flex-col items-center justify-center py-12 gap-4">
                  <div class="w-16 h-16 rounded-3xl border-4 border-white shadow-inner bg-white flex items-center justify-center text-amber-50">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span class="text-xs font-black text-amber-100 tracking-widest uppercase">未开启</span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 阿卡纳专区 -->
        <div v-if="arcanaList.length > 0" class="pt-8">
          <div class="flex items-center gap-3 mb-8">
            <span class="bg-indigo-100 p-2 rounded-2xl text-xl">✨</span>
            <h3 class="font-black text-indigo-900 text-xl">阿卡纳组合</h3>
            <span class="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl font-black shadow-sm">{{ arcanaList.length }} / 5</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <div 
              v-for="item in arcanaList" 
              :key="item.id" 
              class="flex flex-col bg-white rounded-[2.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
              :class="getGradeInfo(item.grade).border"
            >
              <div class="px-6 pt-6 flex items-center justify-between mb-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-500 border border-indigo-100 shadow-sm">
                  {{ slotMap[item.slotPosName] || item.slotPosName }}
                </span>
                <div class="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-widest bg-gradient-to-r" :class="getGradeInfo(item.grade).gradient">
                  {{ getGradeInfo(item.grade).name }}
                </div>
              </div>

              <div class="px-6 flex flex-col items-center text-center gap-4 mb-6 relative z-10">
                <!-- 立绘展示 -->
                <div v-if="item.fullDetail?.illust" class="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-2 shadow-inner bg-slate-100 group-hover:shadow-2xl transition-all duration-500">
                  <img :src="formatIconUrl(item.fullDetail.illust)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <!-- 小图标浮层 -->
                  <div class="absolute bottom-2 right-2 w-10 h-10 rounded-xl border-2 border-white/50 backdrop-blur-sm shadow-lg overflow-hidden z-20">
                    <img :src="formatIconUrl(item.icon)" class="w-full h-full object-contain p-1" />
                  </div>
                </div>

                <!-- 原有的图标展示 (作为备选) -->
                <div v-else class="relative shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <div class="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-slate-50 relative z-10 p-2">
                    <img :src="formatIconUrl(item.icon)" class="w-full h-full object-contain" />
                  </div>
                  <div class="absolute inset-0 blur-2xl opacity-40 rounded-full" :class="getGradeInfo(item.grade).light"></div>
                </div>

                <div v-if="item.fullDetail?.level" class="absolute -top-2 -left-2 z-20 bg-sky-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white shadow-md flex items-center gap-0.5">
                  <span>Lv.{{ item.fullDetail.level }}</span>
                  <span v-if="item.fullDetail?.levelValue" class="text-emerald-300">+{{ item.fullDetail.levelValue }}</span>
                </div>

                <div class="min-w-0 w-full">
                  <div v-if="item.exceedLevel > 0 || item.enchantLevel > 0" class="flex items-center justify-center gap-2 mb-2">
                    <div v-if="item.exceedLevel > 0" class="flex items-center bg-sky-50 rounded-lg overflow-hidden border border-sky-100 shadow-sm">
                      <span class="bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">突破</span>
                      <span class="px-1.5 text-sky-700 font-black text-xs">{{ item.exceedLevel }}</span>
                    </div>
                    <div v-if="item.enchantLevel > 0" class="flex items-center bg-indigo-50 rounded-lg overflow-hidden border border-indigo-100 shadow-sm">
                      <span class="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">强化</span>
                      <span class="px-1.5 text-indigo-700 font-black text-xs">+{{ item.enchantLevel }}</span>
                    </div>
                  </div>
                  <h4 class="text-base font-black text-slate-800 leading-tight mb-1">{{ item.name }}</h4>
                  <div class="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <span class="text-[10px] font-mono text-slate-300">#{{ item.id }}</span>
                    <span v-if="item.fullDetail?.level" class="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1">
                      <span>道具等级 {{ item.fullDetail.level }}</span>
                      <span v-if="item.fullDetail?.levelValue" class="text-emerald-600 bg-emerald-100/50 px-1 rounded-sm">+{{ item.fullDetail.levelValue }}</span>
                    </span>
                  </div>

                  <!-- 基础属性 -->
                  <div v-if="item.fullDetail?.mainStats?.length" class="mb-4 space-y-1">
                    <div v-for="(stat, sIdx) in item.fullDetail.mainStats" :key="sIdx" class="flex items-center justify-between px-3 py-1.5 bg-indigo-50/30 rounded-lg border border-indigo-100/30">
                      <span class="text-[10px] font-bold text-indigo-700">{{ stat.name }}</span>
                      <div class="flex items-center gap-1">
                        <span class="text-[10px] font-black text-indigo-900">{{ stat.value }}</span>
                        <span v-if="stat.extra" class="text-[9px] font-black text-emerald-500">(+{{ stat.extra }})</span>
                      </div>
                    </div>
                  </div>

                  <!-- 套装信息 -->
                  <div v-if="item.fullDetail?.set" class="mb-4 bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 text-left">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-black text-amber-700 uppercase tracking-wider">Set: {{ item.fullDetail.set.name }}</span>
                      <span class="text-[9px] bg-amber-200/50 text-amber-800 px-1.5 py-0.5 rounded font-black">{{ item.fullDetail.set.equippedCount }} 件已装备</span>
                    </div>
                    <div v-if="item.fullDetail.set.bonuses?.length" class="space-y-1">
                      <div v-for="(bonus, bIdx) in item.fullDetail.set.bonuses" :key="bIdx" 
                        class="text-[9px] leading-tight transition-colors"
                        :class="item.fullDetail.set.equippedCount >= bonus.degree ? 'text-amber-900 font-bold' : 'text-slate-400 opacity-60'"
                      >
                        <div v-for="(desc, dIdx) in bonus.descriptions" :key="dIdx" class="flex items-start gap-1">
                          <span>•</span>
                          <span>{{ desc }} ({{ bonus.degree }}件)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 装备随机技能 -->
                  <div v-if="item.fullDetail?.subSkills?.length" class="space-y-2 px-2">
                    <div v-for="(skill, sIdx) in item.fullDetail.subSkills" :key="sIdx" class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left hover:bg-white transition-colors group/skill">
                      <div class="flex items-center gap-2 mb-1">
                        <img v-if="skill.icon" :src="formatIconUrl(skill.icon)" class="w-5 h-5 rounded-md border border-slate-200 shadow-sm" />
                        <span class="text-[10px] text-indigo-600 font-black">{{ skill.name }}</span>
                        <span v-if="skill.level" class="text-[8px] bg-indigo-50 text-indigo-500 px-1 rounded font-black">Lv.{{ skill.level }}</span>
                      </div>
                      <p v-if="skill.desc" class="text-[9px] text-slate-400 leading-tight group-hover/skill:text-slate-500">{{ skill.desc }}</p>
                    </div>
                  </div>

                  <!-- 装备来源 -->
                  <div v-if="item.fullDetail?.sources?.length" class="mt-4 pt-3 border-t border-slate-50 flex flex-col items-center gap-2">
                    <div class="flex items-center gap-1">
                      <span class="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Source</span>
                    </div>
                    <div class="flex flex-wrap justify-center gap-1.5">
                      <span 
                        v-for="(source, sIdx) in item.fullDetail.sources" 
                        :key="sIdx" 
                        class="px-2.5 py-0.5 bg-slate-50/80 text-[9px] font-black text-slate-500 rounded-full border border-slate-100 shadow-sm hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default flex items-center gap-1"
                      >
                        <span class="w-1 h-1 rounded-full bg-indigo-400"></span>
                        {{ source }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

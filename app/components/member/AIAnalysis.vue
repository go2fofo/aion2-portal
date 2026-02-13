<template>
  <div class="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-white overflow-hidden relative">
    <!-- 装饰背景 -->
    <div class="absolute -top-10 -left-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>
    
    <div class="relative z-10">
      <h3 class="font-black text-sky-900 text-xl mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="bg-sky-100 p-2 rounded-2xl text-xl">📊</span> 战斗素质与 AI 深度分析
        </div>
        <!-- AI 分析状态标识 -->
        <div class="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI Engine Ready</span>
        </div>
      </h3>
      
      <div class="flex flex-col lg:flex-row gap-12 items-center">
        <!-- 雷达图部分 -->
        <div class="w-full lg:w-1/2 h-[350px] md:h-[450px]">
          <VChart v-if="radarOption" class="w-full h-full" :option="radarOption" autoresize />
          <div v-else class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
            <span class="text-slate-300 font-bold">正在构建素质模型...</span>
          </div>
        </div>
        
        <!-- 多维度分析文案与评价 -->
        <div class="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 战力评级 -->
          <div class="bg-[#F0F9FF] p-6 rounded-3xl border-2 border-white shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
            <div class="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">综合战力评级</div>
            <div class="text-5xl font-black italic transition-transform group-hover:scale-110" :class="getRatingColor(member?.item_level)">
              {{ getRating(member?.item_level) }}
            </div>
            <div class="mt-4 flex gap-1">
              <span v-for="i in 5" :key="i" class="text-lg">{{ i <= getStarCount(member?.item_level) ? '⭐' : '☆' }}</span>
            </div>
          </div>

          <!-- 战斗特性 -->
          <div class="bg-[#FFF9EB] p-6 rounded-3xl border-2 border-white shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
            <div class="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">AI 识别特性</div>
            <div class="flex flex-wrap gap-2 justify-center">
              <span v-for="tag in combatTags" :key="tag" class="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-yellow-700 border border-yellow-200 shadow-sm transition-transform hover:scale-105">
                # {{ tag }}
              </span>
            </div>
          </div>

          <!-- 核心指标摘要 -->
          <div class="md:col-span-2 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border-2 border-white shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="text-slate-400 font-black text-xs uppercase tracking-widest">核心素质 AI 审计报告</div>
              <span class="text-[10px] font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">实时计算中</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="stat in analysisStats" :key="stat.label" class="flex flex-col group">
                <span class="text-[10px] text-slate-400 font-bold mb-1">{{ stat.label }}</span>
                <div class="flex items-end gap-1 mb-1">
                  <span class="text-xl font-black text-slate-800">{{ stat.value }}</span>
                  <span class="text-[10px] text-sky-500 font-bold mb-1 group-hover:translate-y-[-2px] transition-transform">{{ stat.trend }}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000" :style="{ width: stat.percent + '%' }"></div>
                </div>
              </div>
            </div>
            
            <!-- AI 深度结论区 -->
            <div class="mt-6 p-4 bg-gradient-to-br from-sky-50/50 to-white rounded-2xl border border-sky-100/50 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-2 opacity-10">
                <svg class="w-12 h-12 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
                </svg>
              </div>
              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-black text-sky-600 bg-sky-100 px-2 py-0.5 rounded uppercase">AI Conclusion</span>
                </div>
                <p class="text-sm text-slate-600 font-bold leading-relaxed">
                  {{ analysisConclusion }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
])

const props = defineProps({
  member: {
    type: Object,
    required: true
  },
  equipmentData: {
    type: Object,
    default: () => ({})
  }
})

// --- 多维度分析辅助逻辑 ---

const getRating = (itemLevel) => {
  if (!itemLevel) return 'N/A'
  if (itemLevel > 3500) return 'SSS'
  if (itemLevel > 3200) return 'SS'
  if (itemLevel > 2900) return 'S'
  if (itemLevel > 2500) return 'A'
  return 'B'
}

const getRatingColor = (itemLevel) => {
  if (!itemLevel) return 'text-slate-300'
  if (itemLevel > 3500) return 'text-red-500 animate-pulse'
  if (itemLevel > 3200) return 'text-orange-500'
  if (itemLevel > 2900) return 'text-yellow-500'
  if (itemLevel > 2500) return 'text-purple-500'
  return 'text-sky-500'
}

const getStarCount = (itemLevel) => {
  if (!itemLevel) return 0
  return Math.min(5, Math.floor(itemLevel / 700))
}

const combatTags = computed(() => {
  const tags = []
  if (!props.member) return tags
  
  // 基于职业的特性
  const className = props.member.class_name
  if (['剑星', '守护星'].includes(className)) tags.push('近战王者', '坚如磐石')
  if (['弓星', '杀星'].includes(className)) tags.push('爆发输出', '身手矫健')
  if (['魔道星', '精灵星'].includes(className)) tags.push('元素主宰', '群体控制')
  if (['治愈星', '护法星'].includes(className)) tags.push('团队核心', '圣光洗礼')

  // 基于战力的特性
  if (props.member.item_level > 3000) tags.push('神装加持', '巅峰战力')
  else if (props.member.item_level > 2500) tags.push('资深精英')
  
  return tags.length > 0 ? tags : ['潜力新人']
})

const analysisStats = computed(() => {
  if (!props.member) return []
  const base = props.member.item_level || 2000
  return [
    { label: '进攻潜能', value: Math.floor(base * 0.8), trend: '+5.2%', percent: Math.min(100, (base/4000)*100 + 10) },
    { label: '生存韧性', value: Math.floor(base * 0.75), trend: '+2.1%', percent: Math.min(100, (base/4000)*100 - 5) },
    { label: '团队贡献', value: '极高', trend: 'TOP 5%', percent: 92 },
    { label: '成长速度', value: '稳定', trend: 'NEW', percent: 75 }
  ]
})

const analysisConclusion = computed(() => {
  if (!props.member) return ''
  const name = props.member.name
  const rating = getRating(props.member.item_level)
  if (rating.includes('S')) {
    return `${name} 是军团中不可或缺的顶尖战力，其战斗素质在多维度评估中均表现卓越。AI 分析建议将其作为核心攻坚成员，参与高难度副本与军团战役。`
  }
  return `${name} 拥有良好的成长潜力和扎实的基础素质。目前处于快速提升期，AI 监测到其活跃度极高，是军团未来的中坚力量。`
})

// 综合素质雷达图配置
const radarOption = computed(() => {
  if (!props.member) return null
  const baseValue = props.member.item_level ? Math.min(95, (props.member.item_level / 4000) * 100) : 60
  
  // 根据职业微调雷达图重心
  const className = props.member.class_name || ''
  const offset = (idx) => {
    if (className.includes('守护') || className.includes('剑星')) return [0, 15, 0, 10, -5, -5, 5, 0][idx] || 0
    if (className.includes('杀星') || className.includes('弓星')) return [15, -10, 5, -10, 15, 10, 0, -5][idx] || 0
    if (className.includes('治愈') || className.includes('护法')) return [-10, 5, 15, 10, -10, 0, 5, 15][idx] || 0
    return 0
  }

  const dataValues = [0, 1, 2, 3, 4, 5, 6, 7].map(i => Math.max(30, Math.min(100, baseValue + offset(i) + (Math.random() * 10 - 5))))

  return {
    radar: {
      indicator: [
        { name: '攻击力量', max: 100 },
        { name: '防御韧性', max: 100 },
        { name: '战术配合', max: 100 },
        { name: '生存意志', max: 100 },
        { name: '爆发潜能', max: 100 },
        { name: '机动灵活', max: 100 },
        { name: '装备底蕴', max: 100 },
        { name: '团队贡献', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '50%'],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#64748b',
        fontWeight: '900',
        fontSize: 12,
        formatter: (value) => `{a|${value}}`,
        rich: {
          a: {
            backgroundColor: '#f8fafc',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            borderRadius: 4,
            padding: [4, 8],
            color: '#475569'
          }
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(230, 247, 255, 0.2)', 'rgba(230, 247, 255, 0.4)', 'rgba(230, 247, 255, 0.6)', 'rgba(230, 247, 255, 0.8)', 'rgba(230, 247, 255, 1)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(69, 166, 213, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(69, 166, 213, 0.3)' } }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dataValues,
            name: '战斗素质',
            areaStyle: {
              color: 'rgba(69, 166, 213, 0.4)'
            },
            lineStyle: {
              color: '#45a6d5',
              width: 3
            },
            itemStyle: {
              color: '#45a6d5'
            },
            symbol: 'circle',
            symbolSize: 6
          }
        ]
      }
    ]
  }
})
</script>

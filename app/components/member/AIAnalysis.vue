<template>
  <div class="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-xl border-4 border-white overflow-hidden relative">
    <!-- 装饰背景 -->
    <div class="absolute -top-10 -left-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50"></div>
    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>
    
    <div class="relative z-10">
      <h3 class="font-black text-sky-900 text-lg md:text-xl mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="bg-sky-100 p-2 rounded-2xl text-xl">📊</span> 战斗素质与 AI 深度分析
        </div>
        
        <!-- 分析按钮 -->
        <div class="flex items-center">
          <button 
            @click="runAIAnalysis" 
            :disabled="isAnalyzing"
            class="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#45a6d5] to-blue-600 text-white font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <span v-if="isAnalyzing" class="animate-spin text-lg">🌀</span>
            <span v-else class="group-hover:rotate-12 transition-transform">🤖</span>
            <span>{{ isAnalyzing ? '正在进行深度扫描...' : '启动 AI 核心分析' }}</span>
          </button>
        </div>
      </h3>
      
      <div class="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
        <!-- 雷达图部分 -->
        <div class="w-full lg:w-1/2 flex flex-col items-center">
          <div class="w-full h-[300px] md:h-[400px] relative">
            <VChart v-if="radarOption" class="w-full h-full" :option="radarOption" autoresize />
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
              <span class="text-slate-300 font-bold">正在构建素质模型...</span>
            </div>
            
            <!-- 分析中遮罩 -->
            <div v-if="isAnalyzing" class="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center z-20">
              <div class="scanner-line"></div>
              <div class="relative w-16 h-16 md:w-24 md:h-24 mb-4">
                <div class="absolute inset-0 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin"></div>
                <div class="absolute inset-3 md:inset-4 rounded-full border-4 border-blue-50 border-t-blue-400 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <img src="/sikao.png" class="w-6 h-6 md:w-10 md:h-10 object-contain animate-pulse" />
                </div>
              </div>
              <div class="text-sky-600 font-black text-xs md:text-sm animate-pulse">AI 正在深度扫描角色数据...</div>
            </div>
          </div>

          <!-- 维度分值明细 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-4 px-2 md:px-4">
            <div 
              v-for="item in radarIndicators" 
              :key="item.name"
              class="bg-slate-50/50 border border-slate-100 p-2 rounded-xl flex flex-col items-center group hover:bg-white hover:shadow-sm transition-all"
            >
              <div class="text-[9px] text-slate-400 font-black truncate w-full text-center">{{ item.name }}</div>
              <div class="text-xs md:text-sm font-black text-sky-700 group-hover:scale-110 transition-transform">{{ item.value }}</div>
            </div>
          </div>
        </div>
        
        <!-- 多维度分析文案与评价 -->
        <div class="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <!-- 战力评级 -->
          <div class="bg-[#F0F9FF] p-5 md:p-6 rounded-[2rem] md:rounded-3xl border-2 border-white shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
            <div class="text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">综合战力评级</div>
            <div class="text-4xl md:text-5xl font-black italic transition-transform group-hover:scale-110" :class="getRatingColor(member?.item_level)">
              {{ getRating(member?.item_level) }}
            </div>
            <div class="mt-2 md:mt-4 flex gap-1">
              <span v-for="i in 5" :key="i" class="text-base md:text-lg">{{ i <= getStarCount(member?.item_level) ? '⭐' : '☆' }}</span>
            </div>
          </div>

          <!-- 战斗特性 -->
          <div class="bg-[#FFF9EB] p-5 md:p-6 rounded-[2rem] md:rounded-3xl border-2 border-white shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
            <div class="text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">AI 识别特性</div>
            <div class="flex flex-wrap gap-1.5 md:gap-2 justify-center">
              <span v-for="tag in combatTags" :key="tag" class="bg-white/80 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold text-yellow-700 border border-yellow-200 shadow-sm transition-transform hover:scale-105">
                # {{ tag }}
              </span>
            </div>
          </div>

          <!-- 核心指标摘要 -->
          <div class="sm:col-span-2 bg-white/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] md:rounded-3xl border-2 border-white shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div class="text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest">核心素质 AI 审计报告</div>
              <div class="flex items-center gap-2">
                <span v-if="aiContent" class="text-[9px] md:text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">AI 报告已生成</span>
                <span v-else class="text-[9px] md:text-[10px] font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">实时计算中</span>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="stat in analysisStats" :key="stat.label" class="flex flex-col group">
                <span class="text-[9px] md:text-[10px] text-slate-400 font-bold mb-1">{{ stat.label }}</span>
                <div class="flex items-end gap-1 mb-1">
                  <span class="text-lg md:text-xl font-black text-slate-800">{{ stat.value }}</span>
                  <span class="text-[9px] md:text-[10px] text-sky-500 font-bold mb-1 group-hover:translate-y-[-2px] transition-transform">{{ stat.trend }}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000" :style="{ width: stat.percent + '%' }"></div>
                </div>
              </div>
            </div>
            
            <!-- AI 深度结论区 -->
            <div class="mt-6 p-4 md:p-5 bg-gradient-to-br from-sky-50/50 to-white rounded-2xl border border-sky-100/50 relative overflow-hidden group/conclusion">
              <div class="absolute top-0 right-0 p-2 opacity-10 group-hover/conclusion:scale-110 group-hover/conclusion:rotate-12 transition-transform">
                <svg class="w-12 h-12 md:w-16 md:h-16 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
                </svg>
              </div>
              <div class="relative z-10">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] md:text-[10px] font-black text-sky-600 bg-sky-100 px-2 py-0.5 rounded uppercase tracking-widest">AI 深度分析结论</span>
                  </div>
                </div>
                <div 
                  class="text-xs md:text-sm text-slate-600 font-medium leading-relaxed min-h-[80px] md:min-h-[100px] prose prose-sky prose-sm max-w-none prose-headings:text-sky-900 prose-headings:font-black prose-strong:text-sky-800 prose-strong:font-black"
                  v-html="renderedAIContent"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
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


const { $alert, $loading } = useNuxtApp()
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

// --- AI 分析状态 ---
const isAnalyzing = ref(false)
const aiContent = ref('')

// 渲染 Markdown 内容
const renderedAIContent = computed(() => {
  const content = aiContent.value || analysisConclusion.value
  return marked.parse(content)
})

// 初始化加载已存的分析结果
const initStoredAnalysis = () => {
  if (props.member?.ai_analysis_data?.content) {
    aiContent.value = props.member.ai_analysis_data.content
  } else {
    aiContent.value = ''
  }
}

// 自动触发逻辑：如果该角色从未分析过，且数据已准备好，则自动执行
const checkAndAutoAnalyze = () => {
  // 条件：没有分析内容 + 有成员数据 + 有装备数据 (非空) + 不在分析中
  const hasEquipment = props.equipmentData && Object.keys(props.equipmentData).length > 0
  
  if (!aiContent.value && props.member && hasEquipment && !isAnalyzing.value) {
    runAIAnalysis()
  }
}

onMounted(() => {
  initStoredAnalysis()
  // 延迟一小会儿执行，确保其他组件初始化完成
  setTimeout(checkAndAutoAnalyze, 500)
})

// 当成员切换时重新加载分析
watch(() => props.member?.id, () => {
  initStoredAnalysis()
  checkAndAutoAnalyze()
})

// 监听装备数据加载（因为父组件是异步同步数据的）
watch(() => props.equipmentData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    checkAndAutoAnalyze()
  }
}, { deep: true })

const emit = defineEmits(['update:analysis'])

const runAIAnalysis = async () => {
  if (isAnalyzing.value) return
  
  // 1. 检查冷却逻辑 (10分钟)
  const lastUpdate = props.member?.ai_analysis_data?.updated_at
  const now = new Date().getTime()
  const COOL_DOWN = 10 * 60 * 1000 // 10分钟，单位毫秒
  
  if (lastUpdate && (now - new Date(lastUpdate).getTime() < COOL_DOWN)) {
    // 进入“假”请求模拟过程
    isAnalyzing.value = true
    // 模拟 3 秒深度扫描
    await new Promise(resolve => setTimeout(resolve, 3000))
    isAnalyzing.value = false
    return // 直接结束，不请求接口，保持原有数据展示
  }
  
  // 2. 正常请求逻辑
  isAnalyzing.value = true
  try {
    const response = await $fetch('/api/aion/ai-analysis', {
      method: 'POST',
      body: {
        member: props.member,
        equipmentData: props.equipmentData
      }
    })
    
    if (response.success) {
      aiContent.value = response.content
      // 通知父组件同步更新，确保“AI 报告已生成”状态实时变化
      emit('update:analysis', {
        content: response.content,
        model: response.model,
        updated_at: new Date().toISOString()
      })
    } else {
      $alert(response.message || '分析失败，请稍后重试')
    }
  } catch (error) {
    console.error('AI Analysis Error:', error)
    $alert('请求出错，请检查 API 接口')
  } finally {
    isAnalyzing.value = false
  }
}

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

// 核心雷达维度分值计算
const radarIndicators = computed(() => {
  if (!props.member) return []
  const baseValue = props.member.item_level ? Math.min(95, (props.member.item_level / 4000) * 100) : 60
  
  // 根据职业微调雷达图重心
  const className = props.member.class_name || ''
  const offset = (idx) => {
    if (className.includes('守护') || className.includes('剑星')) return [0, 15, 0, 10, -5, -5, 5, 0][idx] || 0
    if (className.includes('杀星') || className.includes('弓星')) return [15, -10, 5, -10, 15, 10, 0, -5][idx] || 0
    if (className.includes('治愈') || className.includes('护法')) return [-10, 5, 15, 10, -10, 0, 5, 15][idx] || 0
    return 0
  }

  const names = ['攻击力量', '防御韧性', '战术配合', '生存意志', '爆发潜能', '机动灵活', '装备底蕴', '团队贡献']
  return names.map((name, i) => ({
    name,
    max: 100,
    value: Math.max(30, Math.min(100, Math.floor(baseValue + offset(i) + (Math.random() * 10 - 5))))
  }))
})

// 综合素质雷达图配置
const radarOption = computed(() => {
  if (radarIndicators.value.length === 0) return null
  
  return {
    radar: {
      indicator: radarIndicators.value.map(i => ({ name: i.name, max: i.max })),
      radius: '65%',
      center: ['50%', '50%'],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#64748b',
        fontWeight: '900',
        fontSize: 11,
        formatter: (name) => {
          const item = radarIndicators.value.find(i => i.name === name)
          return `{a|${name}}\n{b|${item ? item.value : 0}}`
        },
        rich: {
          a: {
            color: '#64748b',
            lineHeight: 20
          },
          b: {
            backgroundColor: '#f0f9ff',
            borderColor: '#bae6fd',
            borderWidth: 1,
            borderRadius: 6,
            padding: [2, 6],
            color: '#0369a1',
            fontWeight: '900',
            fontSize: 12,
            align: 'center'
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
            value: radarIndicators.value.map(i => i.value),
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

<style scoped>
@keyframes scanner {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.scanner-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  box-shadow: 0 0 15px #3b82f6;
  z-index: 30;
  animation: scanner 2s linear infinite;
}
</style>

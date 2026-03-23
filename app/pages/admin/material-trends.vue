<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 class="font-black text-slate-800 text-lg">材料价格走势分析</h3>
        <p class="text-sm text-slate-400 mt-1">根据历史造价记录，追踪各材料的市场价格波动趋势</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <!-- 材料选择器 -->
        <div class="relative min-w-[200px]">
          <select 
            v-model="selectedMaterialId" 
            class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-sky-400 outline-none font-bold text-slate-700 text-sm appearance-none transition-all"
            @change="fetchPriceData"
          >
            <option value="">-- 请选择材料 --</option>
            <option v-for="m in materialList" :key="m.id" :value="m.id">{{ m.name }}</option>
          </select>
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
        </div>

        <button 
          @click="fetchPriceData" 
          :disabled="loading || !selectedMaterialId"
          class="bg-[#45a6d5] text-white px-6 py-2.5 rounded-xl font-black shadow-md hover:bg-[#3b95c0] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>查询走势</span>
        </button>
      </div>
    </div>

    <!-- 图表展示区 -->
    <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px] flex flex-col relative overflow-hidden">
      <div v-if="!selectedMaterialId" class="flex-1 flex flex-col items-center justify-center text-slate-300">
        <span class="text-6xl mb-4">📈</span>
        <p class="font-black text-lg">请先选择一个材料查看其价格走势</p>
      </div>
      
      <div v-else-if="loading" class="flex-1 flex flex-col items-center justify-center text-sky-400">
        <div class="w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mb-4"></div>
        <p class="font-black">正在调取历史数据...</p>
      </div>

      <div v-else-if="priceHistory.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-300">
        <span class="text-6xl mb-4">🏜️</span>
        <p class="font-black text-lg">暂无该材料的历史价格记录</p>
      </div>

      <div v-else class="flex-1 w-full h-full min-h-[450px]">
        <VChart class="w-full h-full" :option="chartOption" autoresize />
      </div>

      <!-- 背景装饰 -->
      <div class="absolute -bottom-10 -right-10 text-[12rem] opacity-[0.02] font-black italic pointer-events-none select-none">CHART</div>
    </div>

    <!-- 最近 10 条明细 -->
    <div v-if="priceHistory.length > 0" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
        <h4 class="font-black text-slate-700 text-sm">最近价格变动明细</h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th class="px-6 py-3">记录时间</th>
              <th class="px-6 py-3">记录单价 (万基纳)</th>
              <th class="px-6 py-3">关联计算记录</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="record in priceHistory.slice(0, 10)" :key="record.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-3 text-xs font-mono text-slate-500">{{ formatDate(record.created_at) }}</td>
              <td class="px-6 py-3 text-sm font-black text-sky-600">{{ record.price_w }}w</td>
              <td class="px-6 py-3 text-xs text-slate-400 italic">ID: {{ record.calculation_id || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
])

const supabase = useSupabaseClient()

const loading = ref(false)
const materialList = ref([])
const selectedMaterialId = ref('')
const priceHistory = ref([])

// 加载材料列表 (从 site_config)
const fetchMaterials = async () => {
  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'equipment_cost_config')
    .maybeSingle()
  
  if (data?.value?.materials) {
    materialList.value = data.value.materials
  }
}

// 加载选定材料的价格走势
const fetchPriceData = async () => {
  if (!selectedMaterialId.value) return
  
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('material_price_history')
      .select('*')
      .eq('material_id', selectedMaterialId.value)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    priceHistory.value = data || []
  } catch (err) {
    console.error('Fetch failed:', err)
  } finally {
    loading.value = false
  }
}

// ECharts 配置
const chartOption = computed(() => {
  if (priceHistory.value.length === 0) return {}

  const xData = priceHistory.value.map(h => formatDate(h.created_at, true))
  const yData = priceHistory.value.map(h => h.price_w)
  const matName = materialList.value.find(m => m.id === selectedMaterialId.value)?.name || '材料'

  return {
    title: {
      text: `${matName} 价格走势 (万基纳)`,
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontWeight: '900',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#475569' },
      formatter: (params) => {
        const p = params[0]
        return `
          <div class="p-2">
            <div class="text-[10px] font-black text-slate-400 uppercase mb-1">${p.name}</div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-sky-500"></div>
              <span class="font-black text-slate-800 text-lg">${p.value}w</span>
            </div>
          </div>
        `
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontWeight: 'bold' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f8fafc', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontWeight: 'bold' }
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, height: 20, bottom: 20, borderColor: 'transparent', backgroundColor: '#f8fafc', fillerColor: 'rgba(69, 166, 213, 0.1)', handleStyle: { color: '#45a6d5' } }
    ],
    series: [
      {
        name: '单价',
        data: yData,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: '#45a6d5' },
        lineStyle: { width: 4, color: '#45a6d5' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(69, 166, 213, 0.2)' },
              { offset: 1, color: 'rgba(69, 166, 213, 0)' }
            ]
          }
        }
      }
    ]
  }
})

const formatDate = (dateStr, short = false) => {
  const date = new Date(dateStr)
  if (short) {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchMaterials()
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>

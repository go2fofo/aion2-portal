<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h3 class="font-black text-slate-800 text-lg">材料库</h3>
        <p class="text-sm text-slate-400 mt-1">管理材料并记录每日价格，用于造价计算与走势分析</p>
      </div>
      <div class="flex gap-3">
        <button @click="addMaterial" class="bg-[#45a6d5] text-white px-6 py-3 rounded-xl font-black shadow-md hover:bg-[#3b95c0] transition-all">
          + 新增材料
        </button>
        <button @click="saveMaterials" :disabled="saving" class="bg-[#f9b11d] text-white px-6 py-3 rounded-xl font-black shadow-md hover:bg-[#fbc02d] transition-all disabled:opacity-50 flex items-center gap-2">
          <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ saving ? '保存中...' : '保存材料库' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h4 class="font-black text-slate-700 flex items-center gap-2">
            <span>💎</span> 材料列表
          </h4>
          <button @click="reloadAll" class="p-2 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-white transition-all" :class="{ 'animate-spin': loading }">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div class="p-4 border-b border-slate-100 bg-white">
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索材料名称 / ID..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-slate-100 focus:border-[#45a6d5] outline-none text-slate-700 font-bold bg-slate-50 transition-colors"
            />
            <button
              v-if="searchQuery"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all flex items-center justify-center"
              @click="searchQuery = ''"
              title="清空搜索"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="searchQuery" class="mt-2 text-[10px] font-bold text-slate-400">
            共 {{ filteredMaterials.length }} 条结果
          </div>
        </div>

        <div class="p-4 max-h-[660px] overflow-y-auto custom-scroll space-y-3">
          <div v-if="config.materials.length === 0" class="text-center py-10 text-slate-400 text-sm">
            暂无材料，请先添加
          </div>

          <div
            v-for="(m, index) in filteredMaterials"
            :key="m.id"
            class="p-4 rounded-2xl border-2 transition-all cursor-pointer"
            :class="selectedMaterialId === m.id ? 'border-[#f9b11d] bg-[#fff7e6]' : 'border-slate-50 hover:border-[#AEE2F9] bg-white'"
            @click="selectMaterial(m.id)"
          >
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center text-xs font-mono shrink-0">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <input
                    v-model="m.name"
                    class="w-full bg-transparent border-none focus:ring-0 font-black text-slate-800 text-sm truncate"
                    placeholder="材料名称"
                    @click.stop
                  />
                  <button
                    @click.stop="removeMaterial(index)"
                    class="w-8 h-8 rounded-full bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center shrink-0"
                    title="删除材料"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="text-[10px] text-slate-400 font-bold mt-1">
                  ID: <span class="font-mono text-slate-500">{{ m.id }}</span>
                </div>

                <div v-if="recentPrices[m.id]" class="mt-2 flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">近期价格</div>
                  <div class="text-sm font-mono font-black text-sky-600">
                    {{ recentPrices[m.id].price_w }}w
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 md:p-8 bg-gradient-to-br from-sky-50 to-white border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div class="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-2">Material Detail</div>
              <h4 class="text-2xl font-black text-slate-800">
                {{ selectedMaterial?.name || '请选择左侧材料' }}
              </h4>
              <div v-if="selectedMaterial" class="text-xs text-slate-400 font-bold mt-1">
                ID: <span class="font-mono">{{ selectedMaterial.id }}</span>
              </div>
            </div>

            <div v-if="selectedMaterial" class="w-full md:w-auto bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl border-2 border-sky-100 shadow-sm flex flex-col gap-2">
              <div class="flex items-center justify-between gap-3">
                <span class="text-xs font-black text-slate-500">记录今日价格</span>
                <span v-if="recentPrices[selectedMaterialId]" class="text-[10px] font-bold text-slate-400">
                  ⏱️ 近期: {{ recentPrices[selectedMaterialId].price_w }}w
                </span>
              </div>
              <div class="flex items-center gap-3">
                <div class="relative flex-1">
                  <input
                    v-model.number="todayPriceW"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-sky-400 outline-none font-mono font-black text-slate-700 text-right"
                    placeholder="输入单价"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">w</span>
                </div>
                <button
                  @click="recordTodayPrice"
                  :disabled="recordingToday || !todayPriceW || todayPriceW <= 0"
                  class="px-5 py-2.5 rounded-xl bg-[#f9b11d] hover:bg-[#fbc02d] text-white font-black shadow-md transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
                >
                  <span v-if="recordingToday" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  记录
                </button>
              </div>
            </div>
          </div>

          <div v-if="!selectedMaterial" class="p-12 text-center text-slate-300">
            <div class="text-6xl mb-4">📦</div>
            <div class="font-black text-lg">请选择一个材料查看近期价格与走势</div>
          </div>

          <div v-else class="p-6 md:p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">近期价格</div>
                <div class="text-2xl font-mono font-black text-sky-600">
                  {{ recentPrices[selectedMaterialId]?.price_w || '-' }}w
                </div>
              </div>
              <div class="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">记录条数</div>
                <div class="text-2xl font-mono font-black text-slate-700">{{ priceHistory.length }}</div>
              </div>
              <div class="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">最近记录</div>
                <div class="text-sm font-mono font-black text-slate-600">
                  {{ latestRecordTime || '-' }}
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest">价格走势折线图</h5>
                <button @click="fetchPriceData" class="text-xs font-black text-sky-500 hover:underline" :disabled="loadingChart">刷新走势</button>
              </div>
              <div class="p-4 h-[420px]">
                <div v-if="loadingChart" class="h-full flex flex-col items-center justify-center text-sky-400">
                  <div class="w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mb-3"></div>
                  <div class="font-black">加载中...</div>
                </div>
                <div v-else-if="priceHistory.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300">
                  <div class="text-6xl mb-4">🏜️</div>
                  <div class="font-black text-lg">暂无价格记录</div>
                </div>
                <div v-else class="h-full">
                  <VChart class="w-full h-full" :option="chartOption" autoresize />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest">最近 20 条价格记录</h5>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th class="px-6 py-3">记录时间</th>
                      <th class="px-6 py-3">单价(万基纳)</th>
                      <th class="px-6 py-3">来源</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-for="row in priceHistory.slice(-20).reverse()" :key="row.id" class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-3 text-xs font-mono text-slate-500">{{ formatDate(row.created_at) }}</td>
                      <td class="px-6 py-3 text-sm font-mono font-black text-sky-600">{{ row.price_w }}w</td>
                      <td class="px-6 py-3 text-xs text-slate-400 font-bold">
                        {{ row.calculation_id ? '造价记录' : '手动记录' }}
                      </td>
                    </tr>
                    <tr v-if="priceHistory.length === 0">
                      <td colspan="3" class="px-6 py-10 text-center text-slate-300 font-bold">暂无数据</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent, DataZoomComponent])

const supabase = useSupabaseClient()
const { $alert, $confirm, $loading } = useNuxtApp()

const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')

const config = ref({
  materials: [],
  equipment: []
})

const recentPrices = ref({})

const selectedMaterialId = ref('')
const todayPriceW = ref(null)
const recordingToday = ref(false)

const priceHistory = ref([])
const loadingChart = ref(false)

const selectedMaterial = computed(() => config.value.materials.find(m => m.id === selectedMaterialId.value) || null)

const filteredMaterials = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return config.value.materials
  return config.value.materials.filter(m => {
    const name = (m.name || '').toLowerCase()
    const id = (m.id || '').toLowerCase()
    return name.includes(q) || id.includes(q)
  })
})

const latestRecordTime = computed(() => {
  if (priceHistory.value.length === 0) return ''
  return formatDate(priceHistory.value[priceHistory.value.length - 1].created_at)
})

const fetchMaterialsConfig = async () => {
  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'equipment_cost_config')
    .maybeSingle()

  if (data?.value) {
    config.value = data.value
  } else {
    config.value = { materials: [], equipment: [] }
  }
}

const fetchRecentPrices = async () => {
  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'material_recent_prices')
    .maybeSingle()

  recentPrices.value = data?.value || {}
}

const reloadAll = async () => {
  loading.value = true
  await Promise.all([fetchMaterialsConfig(), fetchRecentPrices()])
  loading.value = false

  if (selectedMaterialId.value) {
    await fetchPriceData()
  }
}

const saveMaterials = async () => {
  saving.value = true
  $loading.show('正在保存材料库...')

  const { data: existing } = await supabase
    .from('site_config')
    .select('id')
    .eq('key', 'equipment_cost_config')
    .maybeSingle()

  let error
  if (existing) {
    const res = await supabase
      .from('site_config')
      .update({ value: config.value, updated_at: new Date().toISOString() })
      .eq('key', 'equipment_cost_config')
    error = res.error
  } else {
    const res = await supabase
      .from('site_config')
      .insert({ key: 'equipment_cost_config', value: config.value })
    error = res.error
  }

  $loading.hide()
  saving.value = false

  if (error) {
    $alert('保存失败', error.message)
  } else {
    $alert('保存成功', '材料库已更新，造价配置页会自动同步展示')
  }
}

const addMaterial = () => {
  const id = 'm' + Date.now()
  config.value.materials.push({ id, name: '' })
  selectedMaterialId.value = id
}

const removeMaterial = async (index) => {
  const target = config.value.materials[index]
  if (!target) return

  const usedBy = config.value.equipment
    .filter(eq => Array.isArray(eq.materials) && eq.materials.some(r => r.materialId === target.id))
    .map(eq => eq.name || '未命名装备')

  if (usedBy.length > 0) {
    const confirmed = await $confirm('删除材料', `该材料被 ${usedBy.length} 个装备配方使用，删除将同时从这些配方中移除。是否继续？`)
    if (!confirmed) return
    config.value.equipment.forEach(eq => {
      if (!Array.isArray(eq.materials)) return
      eq.materials = eq.materials.filter(r => r.materialId !== target.id)
    })
  } else {
    const confirmed = await $confirm('删除材料', '确定删除该材料吗？')
    if (!confirmed) return
  }

  config.value.materials.splice(index, 1)
  if (selectedMaterialId.value === target.id) selectedMaterialId.value = ''
}

const selectMaterial = async (id) => {
  selectedMaterialId.value = id
  todayPriceW.value = null
  await fetchPriceData()
}

const fetchPriceData = async () => {
  if (!selectedMaterialId.value) return
  loadingChart.value = true
  try {
    const { data, error } = await supabase
      .from('material_price_history')
      .select('*')
      .eq('material_id', selectedMaterialId.value)
      .order('created_at', { ascending: true })

    if (error) throw error
    priceHistory.value = data || []
  } catch (e) {
    console.error(e)
    priceHistory.value = []
  } finally {
    loadingChart.value = false
  }
}

const upsertRecentPrice = async (materialId, priceW) => {
  const updated = { ...(recentPrices.value || {}) }
  updated[materialId] = { price_w: priceW, updated_at: new Date().toISOString() }

  const { error } = await supabase
    .from('site_config')
    .upsert(
      { key: 'material_recent_prices', value: updated, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

  if (error) throw error
  recentPrices.value = updated
}

const recordTodayPrice = async () => {
  if (!selectedMaterial.value) return
  if (!todayPriceW.value || todayPriceW.value <= 0) return

  recordingToday.value = true
  $loading.show('正在记录今日价格...')
  try {
    const { error } = await supabase
      .from('material_price_history')
      .insert({
        material_id: selectedMaterial.value.id,
        material_name: selectedMaterial.value.name,
        price_w: todayPriceW.value,
        calculation_id: null
      })

    if (error) throw error

    await upsertRecentPrice(selectedMaterial.value.id, todayPriceW.value)
    await fetchPriceData()

    $alert('记录成功', '今日价格已写入，可用于走势分析与造价计算参考')
  } catch (e) {
    console.error(e)
    $alert('记录失败', e.message)
  } finally {
    $loading.hide()
    recordingToday.value = false
  }
}

const chartOption = computed(() => {
  if (!selectedMaterial.value || priceHistory.value.length === 0) return {}

  const xData = priceHistory.value.map(h => formatDate(h.created_at, true))
  const yData = priceHistory.value.map(h => h.price_w)

  return {
    title: {
      text: `${selectedMaterial.value.name} 价格走势 (万基纳)`,
      left: 'center',
      textStyle: { color: '#1e293b', fontWeight: '900', fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#475569' }
    },
    grid: { left: '5%', right: '5%', bottom: '15%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: xData, axisLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#94a3b8', fontWeight: 'bold' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f8fafc', type: 'dashed' } }, axisLabel: { color: '#94a3b8', fontWeight: 'bold' } },
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
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  reloadAll()
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

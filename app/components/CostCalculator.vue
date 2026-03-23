<template>
  <div class="h-full flex flex-col gap-6">
    <!-- 上方：装备选择区 (搜索 + 列表) -->
    <div class="space-y-4 shrink-0">
      <div class="flex flex-col md:flex-row gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border-2 border-white">
        <div class="relative flex-1">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索装备名称..." 
            class="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#E6F7FF] rounded-2xl focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all"
          />
        </div>
        <div class="flex gap-2 overflow-x-auto pb-1 md:pb-0 items-center">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            class="px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2"
            :class="selectedCategory === cat ? 'bg-[#45a6d5] text-white border-[#45a6d5]' : 'bg-white text-slate-500 border-white hover:border-[#E6F7FF]'"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- 装备网格 (横向滚动或紧凑型网格) -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
          <span class="text-sky-800 font-black text-xs">加载中...</span>
        </div>
      </div>
      
      <div v-else-if="filteredEquipment.length === 0" class="flex flex-col items-center justify-center py-8 text-slate-400">
        <span class="text-2xl mb-2">📦</span>
        <span class="font-bold text-sm">未找到相关装备</span>
      </div>

      <div v-else class="flex gap-4 overflow-x-auto custom-scroll pb-4 px-1">
        <div 
          v-for="eq in filteredEquipment" 
          :key="eq.id"
          @click="selectEquipment(eq)"
          class="shrink-0 w-48 group p-4 bg-white/80 backdrop-blur-sm rounded-3xl border-2 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg"
          :class="selectedEq?.id === eq.id ? 'border-[#f9b11d] bg-white shadow-md' : 'border-white hover:border-sky-200'"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              {{ eq.category === '武器' ? '⚔️' : (eq.category === '防具' ? '🛡️' : '💍') }}
            </div>
            <span class="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest">
              {{ eq.category }}
            </span>
          </div>
          <h4 class="font-black text-slate-800 text-sm truncate mb-1">{{ eq.name }}</h4>
          <div class="text-[10px] font-bold text-slate-400">{{ eq.materials.length }} 种材料</div>
        </div>
      </div>
    </div>

    <!-- 下方：详情 & 计算区 (横跨全宽) -->
    <div class="flex-1 min-h-0">
      <div class="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden h-full flex flex-col relative">
        <!-- 面板头部与汇率 -->
        <div class="p-6 md:p-8 bg-gradient-to-br from-sky-50 to-white border-b-2 border-sky-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div v-if="selectedEq" class="relative z-10">
            <div class="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-1">Cost Analysis</div>
            <h3 class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">{{ selectedEq.name }}</h3>
          </div>
          <div v-else class="relative z-10">
            <div class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Select Item</div>
            <h3 class="text-xl font-black text-slate-300">请选择上方一件装备查看详情</h3>
          </div>

          <!-- 汇率设置区 (在头部并列显示) -->
          <div class="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl border-2 border-sky-100 flex items-center gap-4 z-10 shadow-sm">
            <span class="text-xs font-black text-slate-500 whitespace-nowrap">当前基纳汇率</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-400">1 元 = </span>
              <div class="relative">
                <input 
                  type="number" 
                  v-model.number="kinahRate"
                  class="w-24 px-3 py-1.5 bg-slate-50 border-2 border-slate-100 rounded-lg text-right font-mono text-sm font-black text-sky-600 focus:border-[#45a6d5] outline-none transition-all"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">万</span>
              </div>
            </div>
          </div>
          <!-- 装饰图标 -->
          <div class="absolute -bottom-4 -right-4 text-9xl opacity-5 pointer-events-none font-black italic">B.B.B.S</div>
        </div>

        <!-- 内容区域 -->
        <div v-if="selectedEq" class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll">
            <div class="flex justify-between items-center px-2 mb-4">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest">所需材料明细</span>
              <span class="text-[10px] font-bold text-sky-500">手动输入持有量与单价</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="req in selectedEq.materials" 
                :key="req.materialId"
                class="p-5 bg-white rounded-[2rem] border-2 border-slate-100 group hover:border-[#45a6d5]/40 hover:shadow-xl transition-all duration-300"
                :class="{ 'bg-emerald-50/20 border-emerald-100': (userOwned[req.materialId] || 0) >= req.count }"
              >
                <!-- 材料头部：名称和所需总数 -->
                <div class="flex justify-between items-start mb-4">
                  <div class="font-black text-slate-800 text-lg leading-tight truncate pr-4 flex-1" :title="getMaterial(req.materialId)?.name">
                    <span v-if="(userOwned[req.materialId] || 0) >= req.count" class="mr-1">✅</span>
                    {{ getMaterial(req.materialId)?.name }}
                  </div>
                  <div class="flex flex-col items-end shrink-0">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">目标需求</span>
                    <span class="text-base font-mono font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                      {{ req.count }}
                    </span>
                  </div>
                </div>

                <!-- 输入区：已持有 & 单价 -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-black text-emerald-500 uppercase tracking-wider ml-1">已持有数量</label>
                    <div class="relative">
                      <input 
                        type="number" 
                        v-model.number="userOwned[req.materialId]"
                        min="0"
                        class="w-full bg-emerald-50/30 border-2 border-emerald-100/50 rounded-2xl px-4 py-2.5 text-center font-mono text-base font-black text-emerald-600 focus:border-emerald-400 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center ml-1">
                      <label class="block text-[10px] font-black text-sky-500 uppercase tracking-wider">单价(万基纳)</label>
                      <span v-if="recentPrices[req.materialId]" class="text-[9px] font-bold text-slate-400">⏱️ 近期: {{ recentPrices[req.materialId].price_w }}w</span>
                    </div>
                    <div class="relative">
                      <input 
                        type="number" 
                        v-model.number="userPrices[req.materialId]"
                        min="0"
                        class="w-full bg-sky-50/30 border-2 border-sky-100/50 rounded-2xl px-4 py-2.5 text-right font-mono text-base font-black text-sky-600 focus:border-sky-400 focus:bg-white outline-none transition-all pr-8"
                        :placeholder="recentPrices[req.materialId]?.price_w || '0'"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black text-sky-300 pointer-events-none">w</span>
                    </div>
                  </div>
                </div>
                
                <!-- 底部计算区 -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-0.5">尚需补足</span>
                    <span class="text-lg font-mono font-black text-rose-500">
                      {{ Math.max(0, req.count - (userOwned[req.materialId] || 0)) }}
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">缺口预估 (基纳)</span>
                    <div class="text-xl font-mono font-black text-slate-800">
                      {{ formatNumber(Math.max(0, req.count - (userOwned[req.materialId] || 0)) * (userPrices[req.materialId] || 0) * 10000) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 成本汇总 (固定在底部，左右排列) -->
          <div class="p-6 md:p-8 bg-slate-900 rounded-t-[2.5rem] text-white shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)] relative overflow-hidden group shrink-0">
            <div class="relative z-10 flex flex-col md:flex-row justify-around items-center gap-6">
              <!-- 全额价值 -->
              <div class="text-center md:text-left opacity-60">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">装备全额价值 (Full Value)</div>
                <div class="flex items-end gap-2 justify-center md:justify-start">
                  <span class="text-xl md:text-2xl font-mono font-black text-slate-300">
                    ¥ {{ fullRmbValue }}
                  </span>
                </div>
                <div class="text-[9px] font-bold text-slate-500 mt-1">{{ formatNumber(fullMarketValue) }} Kinah</div>
              </div>

              <div class="h-12 w-[1px] bg-slate-800 hidden md:block"></div>

              <div class="text-center md:text-left">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">实际所需支出 (To Spend)</div>
                <div class="flex items-end gap-2 justify-center md:justify-start">
                  <span class="text-3xl md:text-5xl font-mono font-black text-[#f9b11d] truncate">
                    ¥ {{ totalRmbCost }}
                  </span>
                  <span class="text-sm font-bold text-slate-500 mb-2">元</span>
                </div>
                <div class="text-[10px] font-black text-emerald-400 mt-1">{{ formatNumber(totalKinahCost) }} Kinah</div>
              </div>

              <!-- 记录按钮 -->
              <div class="shrink-0 w-full md:w-auto">
                <button 
                  @click="recordCalculation"
                  :disabled="recording || !hasPricesEntered"
                  class="w-full md:w-auto px-8 py-4 bg-[#f9b11d] hover:bg-[#fbc02d] disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span v-if="recording" class="w-5 h-5 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                  <span>💾 记录本次计算</span>
                </button>
              </div>
            </div>
            <!-- 背景光晕 -->
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-sky-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-[#f9b11d] rounded-full blur-[80px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          </div>
        </div>

        <!-- 未选择状态 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <span class="text-4xl">📊</span>
          </div>
          <p class="text-slate-400 font-black text-lg max-w-md">请选择上方想要制作的装备，我们将为您精确计算所需成本与缺口。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const supabase = useSupabaseClient()
const { $alert, $loading } = useNuxtApp()

const loading = ref(true)
const config = ref({
  materials: [],
  equipment: []
})
const recentPrices = ref({}) // 近期价格缓存
const searchQuery = ref('')
const selectedCategory = ref('全部')
const selectedEq = ref(null)

// 用户输入的状态
const kinahRate = ref(0) // 默认 1元 = 0万基纳
const userPrices = ref({}) // 存储用户填写的材料价格 { materialId: price_w }
const userOwned = ref({}) // 存储用户持有的材料数量 { materialId: count }

// 保存记录的状态
const recording = ref(false)

const categories = computed(() => {
  const cats = new Set(config.value.equipment.map(e => e.category))
  return ['全部', ...Array.from(cats).sort()]
})

const filteredEquipment = computed(() => {
  return config.value.equipment.filter(eq => {
    const matchSearch = eq.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat = selectedCategory.value === '全部' || eq.category === selectedCategory.value
    return matchSearch && matchCat
  })
})

const fetchConfig = async () => {
  loading.value = true
  
  // 1. 获取配方
  const { data: configData } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'equipment_cost_config')
    .maybeSingle()
  
  if (configData?.value) {
    config.value = configData.value
  }

  // 2. 获取近期价格
  const { data: priceData } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'material_recent_prices')
    .maybeSingle()
  
  if (priceData?.value) {
    recentPrices.value = priceData.value
  }

  loading.value = false
}

const getMaterial = (id) => {
  return config.value.materials.find(m => m.id === id) || { name: '未知材料' }
}

const calculateTotal = (eq) => {
  if (!eq) return 0
  return eq.materials.reduce((total, req) => {
    // 实际支出：计算缺失数量 (所需数量 - 持有数量，最小为0)
    const owned = userOwned.value[req.materialId] || 0
    const missingCount = Math.max(0, req.count - owned)
    return total + (missingCount * (userPrices.value[req.materialId] || 0) * 10000)
  }, 0)
}

// 装备全额市场价值 (不扣除持有量)
const fullMarketValue = computed(() => {
  if (!selectedEq.value) return 0
  return selectedEq.value.materials.reduce((total, req) => {
    return total + (req.count * (userPrices.value[req.materialId] || 0) * 10000)
  }, 0)
})

// 检查是否有输入价格 (用于判断是否允许记录)
const hasPricesEntered = computed(() => {
  return Object.values(userPrices.value).some(p => p !== null && p > 0)
})

// 记录本次计算结果
const recordCalculation = async () => {
  if (!selectedEq.value) return
  if (!hasPricesEntered.value) {
    $alert('提示', '请先输入材料单价后再进行记录')
    return
  }

  recording.value = true
  $loading.show('正在保存计算历史...')

  try {
    // 1. 准备材料详情数据
    const materialsData = selectedEq.value.materials.map(req => {
      const material = getMaterial(req.materialId)
      const price_w = userPrices.value[req.materialId] || 0
      const owned = userOwned.value[req.materialId] || 0
      const missing = Math.max(0, req.count - owned)
      return {
        id: req.materialId,
        name: material.name,
        price_w: price_w,
        quantity: req.count,
        owned: owned,
        missing: missing,
        subtotal: missing * price_w * 10000
      }
    })

    // 2. 插入历史记录表
    const { data: historyData, error: historyError } = await supabase
      .from('crafting_history')
      .insert({
        equipment_id: selectedEq.value.id,
        equipment_name: selectedEq.value.name,
        kinah_rate: kinahRate.value,
        total_kinah: totalKinahCost.value,
        total_rmb: parseFloat(totalRmbCost.value),
        materials_data: materialsData
      })
      .select('id')
      .single()

    if (historyError) throw historyError

    // 2.1 插入材料价格历史表 (用于走势图)
    const priceHistoryData = materialsData
      .filter(m => m.price_w > 0)
      .map(m => ({
        material_id: m.id,
        material_name: m.name,
        price_w: m.price_w,
        calculation_id: historyData.id
      }))

    if (priceHistoryData.length > 0) {
      const { error: priceHistoryError } = await supabase
        .from('material_price_history')
        .insert(priceHistoryData)
      
      if (priceHistoryError) throw priceHistoryError
    }

    // 3. 更新“近期价格”缓存 (site_config)
    // 先获取现有缓存
    const { data: configData } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'material_recent_prices')
      .maybeSingle()
    
    const recentPrices = configData?.value || {}
    // 更新本次涉及到的材料价格
    materialsData.forEach(m => {
      if (m.price_w > 0) {
        recentPrices[m.id] = {
          price_w: m.price_w,
          updated_at: new Date().toISOString()
        }
      }
    })

    // 更新回数据库
    const { error: updateError } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'material_recent_prices', 
        value: recentPrices,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })

    if (updateError) throw updateError

    $alert('保存成功', '计算历史已记录，近期价格已更新')
  } catch (err) {
    console.error('Record failed:', err)
    $alert('保存失败', err.message)
  } finally {
    recording.value = false
    $loading.hide()
  }
}

// 选中装备时的实际基纳成本
const totalKinahCost = computed(() => {
  return calculateTotal(selectedEq.value)
})

// 根据汇率计算的 RMB 成本
const totalRmbCost = computed(() => {
  if (!kinahRate.value || kinahRate.value <= 0) return 0
  const rateInKinah = kinahRate.value * 10000
  return (totalKinahCost.value / rateInKinah).toFixed(2)
})

// 根据汇率计算的全额 RMB 成本
const fullRmbValue = computed(() => {
  if (!kinahRate.value || kinahRate.value <= 0) return 0
  const rateInKinah = kinahRate.value * 10000
  return (fullMarketValue.value / rateInKinah).toFixed(2)
})

const selectEquipment = (eq) => {
  selectedEq.value = eq
  // 初始化该装备未设置的价格和持有数量为 0
  eq.materials.forEach(req => {
    if (userPrices.value[req.materialId] === undefined) {
      userPrices.value[req.materialId] = null
    }
    if (userOwned.value[req.materialId] === undefined) {
      userOwned.value[req.materialId] = 0
    }
  })
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

onMounted(() => {
  fetchConfig()
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
  background: rgba(174, 226, 249, 0.4);
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(69, 166, 213, 0.4);
}
</style>

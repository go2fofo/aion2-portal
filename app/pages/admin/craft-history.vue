<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h3 class="font-black text-slate-800 text-lg">装备造价历史记录</h3>
        <p class="text-sm text-slate-400 mt-1">查看和分析全站用户的造价计算历史，掌握市场价格趋势</p>
      </div>
      <button @click="fetchHistory" class="p-2 text-slate-400 hover:text-sky-500 transition-colors">
        <svg :class="{ 'animate-spin': loading }" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- 列表展示 -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">计算时间</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">装备名称</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">基纳成本</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">RMB 预估</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">材料详情</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="history.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-12 text-slate-400 text-sm italic">
                暂无历史记录
              </td>
            </tr>
            <tr v-for="item in history" :key="item.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4 text-xs font-mono text-slate-500">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="px-6 py-4 font-black text-slate-700">
                {{ item.equipment_name }}
              </td>
              <td class="px-6 py-4 text-sm font-mono font-bold text-sky-600">
                {{ formatNumber(item.total_kinah) }}
              </td>
              <td class="px-6 py-4 text-sm font-mono font-bold text-emerald-600">
                ¥ {{ item.total_rmb }}
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-1 flex-wrap max-w-xs">
                  <span 
                    v-for="(m, idx) in item.materials_data.slice(0, 3)" 
                    :key="idx"
                    class="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-bold"
                  >
                    {{ m.name }}: {{ m.price_w }}w
                  </span>
                  <span v-if="item.materials_data.length > 3" class="text-[10px] text-slate-300 font-bold">...</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="showDetail(item)"
                  class="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold hover:bg-sky-50 hover:text-sky-600 transition-all"
                >
                  详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selectedRecord" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="selectedRecord = null"></div>
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- 头部 -->
        <div class="p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 flex justify-between items-start shrink-0">
          <div>
            <div class="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-2">Calculation Detail</div>
            <h4 class="text-2xl font-black text-slate-800">{{ selectedRecord.equipment_name }}</h4>
            <p class="text-xs text-slate-400 mt-1">计算时间: {{ formatDate(selectedRecord.created_at) }}</p>
          </div>
          <button @click="selectedRecord = null" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 内容 -->
        <div class="p-8 overflow-y-auto custom-scroll space-y-8">
          <!-- 统计概览 -->
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100">
              <div class="text-[10px] font-black text-sky-400 uppercase mb-1">基纳总成本</div>
              <div class="text-lg font-mono font-black text-sky-600">{{ formatNumber(selectedRecord.total_kinah) }}</div>
            </div>
            <div class="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
              <div class="text-[10px] font-black text-emerald-400 uppercase mb-1">RMB 预估</div>
              <div class="text-lg font-mono font-black text-emerald-600">¥ {{ selectedRecord.total_rmb }}</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
              <div class="text-[10px] font-black text-slate-400 uppercase mb-1">基纳汇率</div>
              <div class="text-lg font-mono font-black text-slate-600">{{ selectedRecord.kinah_rate }}w</div>
            </div>
          </div>

          <!-- 材料明细 -->
          <div class="space-y-4">
            <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest">所用材料单价与数量</h5>
            <div class="space-y-2">
              <div 
                v-for="m in selectedRecord.materials_data" 
                :key="m.id"
                class="flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl"
              >
                <div class="flex-1">
                  <div class="font-black text-slate-700 text-sm">{{ m.name }}</div>
                  <div class="text-[10px] text-slate-400 font-bold mt-0.5">数量: {{ m.quantity }} | 已持有: {{ m.owned }} | 差额: {{ m.missing }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-mono font-black text-sky-600">{{ m.price_w }}w <span class="text-[10px] text-slate-300">/ 个</span></div>
                  <div class="text-[10px] font-bold text-slate-300 mt-0.5">小计: {{ formatNumber(m.subtotal) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()
const loading = ref(false)
const history = ref([])
const selectedRecord = ref(null)

const fetchHistory = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('crafting_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  
  if (data) {
    history.value = data
  }
  loading.value = false
}

const showDetail = (item) => {
  selectedRecord.value = item
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

onMounted(() => {
  fetchHistory()
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

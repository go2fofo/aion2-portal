<script setup>
import { ref, reactive, computed } from 'vue'
import { executeRulesByDictionary } from '@/utils/gameRefreshManager' // 根据实际路径调整

const mockTimeType = ref('next_wednesday_morning')

// 动态计算模拟时间（自动推算下一个周三和周四）
const timePresets = computed(() => {
  const now = new Date()
  const currentDay = now.getDay()
  const daysUntilWednesday = (3 - currentDay + 7) % 7 || 7
  
  const nextWed = new Date(now)
  nextWed.setDate(now.getDate() + daysUntilWednesday)
  nextWed.setHours(8, 0, 0, 0)

  const nextThu = new Date(nextWed)
  nextThu.setDate(nextWed.getDate() + 1)
  nextThu.setHours(14, 0, 0, 0)

  return {
    current: {
      label: '当前真实时间',
      value: now.getTime(),
      desc: '使用设备当前真实时间戳'
    },
    next_wednesday_morning: {
      label: `模拟下周三 08:00 (${nextWed.toLocaleDateString()})`,
      value: nextWed.getTime(),
      desc: '自动计算下周三 05:00 分界线，触发周重置规则'
    },
    next_thursday_afternoon: {
      label: `模拟下周四 14:00 (${nextThu.toLocaleDateString()})`,
      value: nextThu.getTime(),
      desc: '测试周四无重置事件发生时的状态保持'
    }
  }
})

// 当前输入框内的游戏数据源
const customGameDataInput = ref('')

const testResult = reactive({
  hasChanges: false,
  before: null,
  after: null,
  executedTime: null
})

// 初始化生成一段默认的测试数据
const loadDefaultPresetData = () => {
  const selectedTime = timePresets.value[mockTimeType.value].value
  const defaultData = {
    groups: [
      {
        id: 'group_1',
        createdAt: selectedTime - 14 * 24 * 3600 * 1000,
        dailyRuns: 2, 
        lastDailyRunsUpdate: selectedTime - 5 * 24 * 3600 * 1000, 
        minigameCount: 10, 
        lastMinigameUpdate: selectedTime - 5 * 24 * 3600 * 1000
      }
    ],
    characters: [
      {
        id: 'char_1',
        name: '测试战士A',
        createDate: selectedTime - 14 * 24 * 3600 * 1000,
        energy: 100,
        lastEnergyUpdate: selectedTime - 4 * 3600 * 1000,
        
        nightmareCount: 4,
        lastNightmareUpdate: selectedTime - 25 * 3600 * 1000,
        
        dailyTaskCount: 0,
        dailyMissionDate: selectedTime - 25 * 3600 * 1000,

        isCloister: true,
        cloisterUpdateTime: selectedTime - 5 * 24 * 3600 * 1000
      }
    ]
  }
  customGameDataInput.value = JSON.stringify(defaultData, null, 2)
}

// 首次加载初始化默认数据
loadDefaultPresetData()

// 运行规则测试
const runTest = () => {
  try {
    const selectedTime = timePresets.value[mockTimeType.value].value
    
    // 解析当前输入框内的 JSON 数据
    const parsedData = JSON.parse(customGameDataInput.value)

    testResult.before = JSON.parse(JSON.stringify(parsedData))
    testResult.hasChanges = executeRulesByDictionary(parsedData, selectedTime)
    testResult.after = JSON.parse(JSON.stringify(parsedData))
    testResult.executedTime = new Date(selectedTime).toLocaleString()

    console.clear()
    console.log('%c [Test Success] 规则刷新测试完成', 'color: #10b981; font-weight: bold; font-size: 14px;')
    console.log('基准模拟时间:', testResult.executedTime)
    console.log('刷新前:', testResult.before)
    console.log('刷新后:', testResult.after)
  } catch (error) {
    alert('JSON 解析失败，请检查数据格式是否正确：\n' + error.message)
  }
}

// 💾 导出功能优化：优先导出“刷新后结果数据”，若未执行过测试则导出输入框当前数据
const exportJsonFile = () => {
  try {
    let dataToExport = customGameDataInput.value

    if (testResult.after) {
      // 如果已经执行过测试，导出“刷新后的结果”
      dataToExport = JSON.stringify(testResult.after, null, 2)
    }

    const blob = new Blob([dataToExport], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aion2-refreshed-data-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    alert('导出文件失败: ' + error.message)
  }
}

// 导入本地 JSON 文件
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target.result
      const formatted = JSON.stringify(JSON.parse(content), null, 2)
      customGameDataInput.value = formatted
    } catch (err) {
      alert('导入的文件不是合法的 JSON 格式！')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}
</script>

<template>
  <div class="min-h-screen w-full bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 py-8 transition-colors duration-200">
    <!-- 撑满 95% 宽度的响应式主体容器 -->
    <div class="w-[95%] max-w-[1800px] mx-auto space-y-6">
      
      <!-- 顶部 Header -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 class="text-2xl font-bold tracking-tight flex items-center gap-3">
            <span>🎮</span>
            <span>AION 2 自动化刷新规则测试台</span>
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            支持时间模拟、动态计算下周三、存档导入与刷新后结果导出
          </p>
        </div>
        
        <div class="flex items-center gap-3 self-start md:self-auto">
          <!-- 导入按钮 -->
          <label class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all cursor-pointer">
            <span>📂</span>
            <span>导入存档</span>
            <input type="file" accept=".json" class="hidden" @change="handleFileUpload" />
          </label>

          <!-- 导出按钮（优先导出刷新后数据） -->
          <button 
            @click="exportJsonFile"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all cursor-pointer"
            title="导出当前测试后的最新数据"
          >
            <span>💾</span>
            <span>导出刷新后数据</span>
          </button>

          <!-- 运行测试按钮 -->
          <button 
            @click="runTest" 
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span>🚀</span>
            <span>运行规则测试</span>
          </button>
        </div>
      </header>

      <!-- 时间选择器与输入区配置面板 -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- 左侧：时间预设选择 (占1列) -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span>⏱️</span>
              <span>选择模拟测试基准时间</span>
            </h2>

            <div class="space-y-3">
              <label 
                v-for="(item, key) in timePresets" 
                :key="key"
                :class="[
                  'relative flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                  mockTimeType === key 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-xs">{{ item.label }}</span>
                  <input 
                    type="radio" 
                    name="timePreset" 
                    :value="key" 
                    v-model="mockTimeType" 
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700" 
                  />
                </div>
                <span class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                  {{ new Date(item.value).toLocaleString() }}
                </span>
              </label>
            </div>
          </div>

          <button 
            @click="loadDefaultPresetData" 
            class="mt-6 w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl transition-all"
          >
            🔄 重置为默认测试数据
          </button>
        </div>

        <!-- 右侧：可编辑存档 JSON 输入框 (占2列) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📝</span>
              <span>待测试输入数据 (可直接在此修改或粘贴 JSON)</span>
            </h2>
            <span class="text-xs text-slate-400 font-mono">Editable JSON</span>
          </div>

          <div class="flex-1">
            <textarea 
              v-model="customGameDataInput"
              spellcheck="false"
              class="w-full h-[240px] font-mono text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>

      </section>

      <!-- 测试对比结果区域 -->
      <section v-if="testResult.after" class="space-y-6">
        
        <!-- 结果状态 Banner -->
        <div class="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 px-6 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="text-lg">📊</span>
            <div>
              <span class="font-semibold text-sm">测试执行完毕</span>
              <span class="text-xs text-slate-500 dark:text-slate-400 ml-2">基准时间: {{ testResult.executedTime }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-slate-400">检测结果：</span>
            <span 
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                testResult.hasChanges 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              ]"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="testResult.hasChanges ? 'bg-emerald-500' : 'bg-slate-400'"></span>
              {{ testResult.hasChanges ? '数据已被成功刷新/重置' : '无需触发数据更新' }}
            </span>
          </div>
        </div>

        <!-- 95% 宽屏下的左右对齐对比面板 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- 刷新前卡片 -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div class="bg-slate-100/70 dark:bg-slate-800/50 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span class="font-semibold text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span>📌</span> 刷新前原始数据
              </span>
              <span class="text-xs font-mono text-slate-400">Before</span>
            </div>
            <div class="p-4 flex-1 bg-slate-50/50 dark:bg-slate-950/50">
              <pre class="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto max-h-[500px] p-2 whitespace-pre-wrap break-all">{{ JSON.stringify(testResult.before, null, 2) }}</pre>
            </div>
          </div>

          <!-- 刷新后卡片 (高亮显示) -->
          <div class="bg-white dark:bg-slate-900 border-2 border-emerald-500/80 dark:border-emerald-500/60 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div class="bg-emerald-50 dark:bg-emerald-950/30 px-5 py-3 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
              <span class="font-semibold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <span>✨</span> 刷新后结果数据 (点击右上角可一键导出)
              </span>
              <span class="text-xs font-mono text-emerald-600/70 dark:text-emerald-400/70">After</span>
            </div>
            <div class="p-4 flex-1 bg-slate-50/50 dark:bg-slate-950/50">
              <pre class="font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto max-h-[500px] p-2 whitespace-pre-wrap break-all">{{ JSON.stringify(testResult.after, null, 2) }}</pre>
            </div>
          </div>

        </div>

        <!-- 校验断言指南 -->
        <div class="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-5 text-blue-900 dark:text-blue-200">
          <h3 class="font-semibold text-sm flex items-center gap-2 mb-3">
            <span>🔍</span>
            <span>预期结果校验指南：</span>
          </h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs leading-relaxed text-blue-800 dark:text-blue-300/90">
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span><strong>古树庆典/副本 (weekly)</strong>：跨越周三 05:00 应恢复至最大值 14。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span><strong>噩梦副本 (daily)</strong>：跨越每日 05:00 应正确重置/恢复进入次数。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span><strong>奥德能量 (interval)</strong>：每满 3 小时累加 10 点，不超过动态上限。</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500">•</span>
              <span><strong>神器回廊 (artifact-cloister)</strong>：跨越周三/周六 22:10 应被重置为未完成状态。</span>
            </li>
          </ul>
        </div>

      </section>

    </div>
  </div>
</template>
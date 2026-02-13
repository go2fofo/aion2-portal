<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
        <div>
          <h3 class="text-xl font-black text-slate-800">AI 分析模型配置</h3>
          <p class="text-sm text-slate-400 font-bold mt-1">设置全站统一使用的 AI 分析引擎</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="model in availableModels" 
          :key="model.id"
          @click="selectedModel = model.id"
          class="relative p-6 rounded-[2rem] border-4 transition-all cursor-pointer group"
          :class="selectedModel === model.id ? 'border-[#45a6d5] bg-sky-50/30' : 'border-slate-50 bg-white hover:border-slate-200'"
        >
          <!-- 选中状态标记 -->
          <div v-if="selectedModel === model.id" class="absolute -top-3 -right-3 w-8 h-8 bg-[#45a6d5] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce-short">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="flex flex-col items-center text-center gap-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-white border border-slate-100">
              {{ model.icon }}
            </div>
            <div>
              <div class="font-black text-slate-800 uppercase tracking-widest text-sm mb-1">{{ model.name }}</div>
              <div class="text-[10px] font-bold text-slate-400 leading-tight">{{ model.desc }}</div>
            </div>
            <div 
              class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-colors"
              :class="selectedModel === model.id ? 'bg-[#45a6d5] text-white' : 'bg-slate-100 text-slate-400'"
            >
              {{ selectedModel === model.id ? '当前使用中' : '点击切换' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 新增：密钥配置区域 -->
      <div class="mt-12 space-y-6">
        <div class="flex items-center gap-3 px-2">
          <div class="w-1 h-6 bg-[#45a6d5] rounded-full"></div>
          <h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">各模型 API Key 配置</h4>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="model in availableModels" :key="model.id" class="space-y-2">
            <label class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {{ model.icon }} {{ model.name }} API KEY
            </label>
            <div class="relative">
              <input 
                v-model="modelKeys[model.id]"
                :type="showKeys[model.id] ? 'text' : 'password'"
                class="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-sm font-bold text-slate-600 focus:border-[#45a6d5] focus:bg-white outline-none transition-all pr-12"
                :placeholder="`请输入 ${model.name} 的密钥...`"
              />
              <button 
                @click="showKeys[model.id] = !showKeys[model.id]"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <span v-if="showKeys[model.id]">👁️</span>
                <span v-else>🔒</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-xs font-bold text-slate-500">配置保存后将立即对所有用户生效</span>
        </div>
        <button 
          @click="saveConfig" 
          :disabled="loading"
          class="px-8 py-3 bg-[#f9b11d] text-white rounded-xl font-black shadow-md hover:bg-[#fbc02d] transition-all transform active:scale-95 disabled:opacity-50"
        >
          {{ loading ? '保存中...' : '应用全局配置' }}
        </button>
      </div>
    </div>

    <!-- 调试信息 (仅管理员可见) -->
    <div class="bg-slate-900 rounded-3xl p-6 text-xs font-mono text-slate-400">
      <div class="flex items-center gap-2 mb-2 text-slate-500">
        <span class="w-2 h-2 rounded-full bg-slate-700"></span>
        <span>Runtime Context</span>
      </div>
      <div>Active Model ID: {{ selectedModel }}</div>
      <div>Last Updated: {{ lastUpdated || 'Never' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const supabase = useSupabaseClient()
const { $alert, $loading } = useNuxtApp()

const loading = ref(false)
const selectedModel = ref('deepseek')
const lastUpdated = ref('')
const modelKeys = ref({
  deepseek: '',
  siliconflow: '',
  'gpt-4o': '',
  gemini: ''
})
const showKeys = ref({
  deepseek: false,
  siliconflow: false,
  'gpt-4o': false,
  gemini: false
})

const availableModels = [
  { id: 'deepseek', name: 'DeepSeek', icon: '🔍', desc: '深度思考模型，逻辑分析能力强，适合高阶解析' },
  { id: 'siliconflow', name: 'DeepSeek(SF)', icon: '⚡', desc: '基于 SiliconFlow 架构，极速响应，适合即时同步' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: '🤖', desc: 'OpenAI 旗舰模型，语言表达更自然，综合素质最高' },
  { id: 'gemini', name: 'Gemini', icon: '♊', desc: 'Google 最新模型，多模态理解力强，视角独特' }
]

const fetchConfig = async () => {
  try {
    const { data: res } = await useFetch('/api/admin/ai-config')
    if (res.value?.success) {
      const config = res.value.data
      selectedModel.value = config.modelId || 'deepseek'
      if (config.keys) {
        modelKeys.value = { ...modelKeys.value, ...config.keys }
      }
      lastUpdated.value = config.updated_at
    }
  } catch (e) {
    console.error('Fetch config error:', e)
  }
}

const saveConfig = async () => {
  loading.value = true
  $loading.show('正在下发全局指令...')
  
  const configValue = { 
    modelId: selectedModel.value,
    keys: modelKeys.value
  }
  
  const { data: existing } = await supabase
    .from('site_config')
    .select('id')
    .eq('key', 'ai_model_config')
    .maybeSingle()

  let error
  if (existing) {
    const { error: updateError } = await supabase
      .from('site_config')
      .update({ value: configValue, updated_at: new Date().toISOString() })
      .eq('key', 'ai_model_config')
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('site_config')
      .insert({ key: 'ai_model_config', value: configValue })
    error = insertError
  }

  $loading.hide()
  loading.value = false

  if (error) {
    $alert('配置失败', error.message)
  } else {
    $alert('同步成功', `全站已切换至 ${selectedModel.value.toUpperCase()} 引擎`)
    await fetchConfig()
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.animate-bounce-short {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
</style>

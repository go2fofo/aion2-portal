<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div>
        <h3 class="font-black text-slate-800 text-lg">装备造价计算管理</h3>
        <p class="text-sm text-slate-400 mt-1">配置材料价格和装备配方，用于前台造价计算器</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="saveConfig" 
          :disabled="saving"
          class="bg-[#f9b11d] text-white px-8 py-3 rounded-xl font-black shadow-md hover:bg-[#fbc02d] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ saving ? '保存中...' : '保存配置' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：材料价格管理 -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 class="font-black text-slate-700 flex items-center gap-2">
              <span>💎</span> 材料库
            </h4>
            <button @click="addMaterial" class="text-xs bg-[#45a6d5] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#3b95c0] transition-colors">
              + 新增材料
            </button>
          </div>
          
          <div class="p-4 max-h-[600px] overflow-y-auto custom-scroll space-y-3">
            <div v-if="config.materials.length === 0" class="text-center py-8 text-slate-400 text-sm">
              暂无材料，请先添加
            </div>
            <div 
              v-for="(m, index) in config.materials" 
              :key="m.id"
              class="group p-3 bg-white border-2 border-slate-50 rounded-xl hover:border-[#AEE2F9] transition-all flex items-center gap-2"
            >
              <div class="w-6 h-6 bg-slate-100 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
                {{ index + 1 }}
              </div>
              <input 
                v-model="m.name" 
                placeholder="材料名称" 
                class="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 text-sm"
              />
              <button @click="removeMaterial(index)" class="text-slate-300 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：装备配方管理 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
            <h4 class="font-black text-slate-700 flex items-center gap-2 w-48 shrink-0">
              <span>⚔️</span> 装备配方
            </h4>
            <div class="flex gap-3">
              <button @click="importExample" class="text-xs bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-900 transition-colors shadow-sm">
                导入示例(夔龙王)
              </button>
              <button @click="addEquipment" class="text-xs bg-[#45a6d5] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#3b95c0] transition-colors shadow-sm flex items-center gap-1">
                <span>+</span> 新增装备
              </button>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <div v-if="config.equipment.length === 0" class="text-center py-12 text-slate-400">
              暂无装备配置，点击上方按钮开始添加
            </div>
            
            <div 
              v-for="(eq, eqIdx) in config.equipment" 
              :key="eq.id"
              class="bg-white border-2 border-slate-100 rounded-2xl hover:border-[#45a6d5]/30 transition-all relative group overflow-hidden"
            >
              <!-- 头部：折叠控制和标题 -->
              <div 
                class="flex items-center justify-between p-4 cursor-pointer bg-slate-50/30 hover:bg-slate-50 transition-colors"
                @click="toggleEquipmentCollapse(eq.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-lg">
                    {{ eq.category === '武器' ? '⚔️' : (eq.category === '防具' ? '🛡️' : '💍') }}
                  </div>
                  <div>
                    <h5 class="font-black text-slate-800">{{ eq.name || '未命名装备' }}</h5>
                    <span class="text-[10px] text-slate-400 font-bold">{{ eq.materials.length }} 种材料</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-4">
                  <!-- 删除按钮 (阻止冒泡，避免触发折叠) -->
                  <button 
                    @click.stop="removeEquipment(eqIdx)"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    title="删除该装备"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  
                  <!-- 折叠图标 -->
                  <svg 
                    class="w-5 h-5 text-slate-400 transition-transform duration-300"
                    :class="{ 'rotate-180': !collapsedEquipment[eq.id] }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              <!-- 折叠内容区域 -->
              <div 
                v-show="!collapsedEquipment[eq.id]"
                class="p-6 border-t border-slate-100"
              >
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <!-- 基本信息 -->
                  <div class="md:col-span-1 space-y-3">
                    <div>
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">装备名称</label>
                      <input 
                        v-model="eq.name" 
                        class="w-full px-3 py-2 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700 text-sm transition-all"
                        placeholder="如：军团长长剑"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">分类</label>
                      <select 
                        v-model="eq.category"
                        class="w-full px-3 py-2 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-600 text-xs appearance-none transition-all"
                      >
                        <option value="武器">⚔️ 武器</option>
                        <option value="防具">🛡️ 防具</option>
                        <option value="首饰">💍 首饰</option>
                        <option value="其他">📦 其他</option>
                      </select>
                    </div>
                  </div>

                  <!-- 材料配方 -->
                  <div class="md:col-span-3">
                    <div class="flex justify-between items-center mb-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">所需材料</label>
                      <button @click="addMaterialToEquipment(eq)" class="text-[10px] font-black text-[#45a6d5] hover:underline">+ 添加材料</button>
                    </div>
                    
                    <div class="space-y-2">
                      <div 
                        v-for="(req, reqIdx) in eq.materials" 
                        :key="reqIdx"
                        class="flex items-center gap-2 group/item"
                      >
                        <select 
                          v-model="req.materialId"
                          class="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-600 text-xs appearance-none transition-all"
                        >
                          <option value="">请选择材料</option>
                          <option v-for="m in config.materials" :key="m.id" :value="m.id">{{ m.name }}</option>
                        </select>
                        <div class="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border-2 border-slate-50">
                          <span class="text-[10px] font-black text-slate-400">数量</span>
                          <input 
                            v-model.number="req.count" 
                            type="number"
                            class="w-20 bg-transparent border-none focus:ring-0 text-right font-mono text-sm font-bold text-slate-700"
                          />
                        </div>
                        <button 
                          @click="removeMaterialFromEquipment(eq, reqIdx)"
                          class="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                        >
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div v-if="eq.materials.length === 0" class="text-center py-4 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100 text-xs text-slate-400">
                        尚未添加任何材料
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()
const { $alert, $loading } = useNuxtApp()

const saving = ref(false)
const config = ref({
  materials: [],
  equipment: []
})

// 折叠状态管理
const collapsedEquipment = ref({})

const toggleEquipmentCollapse = (id) => {
  collapsedEquipment.value[id] = !collapsedEquipment.value[id]
}

// 加载配置
const fetchConfig = async () => {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'equipment_cost_config')
    .maybeSingle()
  
  if (data?.value) {
    config.value = data.value
    // 初始化折叠状态，默认全部折叠
    if (data.value.equipment) {
      data.value.equipment.forEach(eq => {
        collapsedEquipment.value[eq.id] = true
      })
    }
  } else {
    // 初始默认数据
    config.value = {
      materials: [],
      equipment: []
    }
  }
}

// 导入示例数据 (夔龙王长剑)
const importExample = () => {
  const exampleMaterials = [
    { id: "13", name: "达人最上級提炼石" },
    { id: "15", name: "愤怒思念" },
    { id: "16", name: "灿烂的奧里哈康石" },
    { id: "17", name: "灿烂的奧德" },
    { id: "19", name: "愤怒意志" },
    { id: "21", name: "愤怒自我" },
    { id: "22", name: "提炼的強固龙族角" },
    { id: "23", name: "发狂的愤怒巫蠱" },
    { id: "26", name: "达人闪耀的奧里哈康长剑" }
  ];

  const exampleRecipe = [
    { materialId: "13", count: 50 },
    { materialId: "15", count: 18 },
    { materialId: "16", count: 121 },
    { materialId: "17", count: 70 },
    { materialId: "19", count: 27 },
    { materialId: "21", count: 42 },
    { materialId: "22", count: 122 },
    { materialId: "23", count: 19 },
    { materialId: "26", count: 5 }
  ];

  // 合并材料库 (避免重复)
  exampleMaterials.forEach(em => {
    if (!config.value.materials.find(m => m.name === em.name)) {
      config.value.materials.push(em);
    }
  });

  // 确保使用最新的 ID 映射
  const mappedRecipe = exampleRecipe.map(er => {
    const mat = config.value.materials.find(m => m.name === exampleMaterials.find(e => e.id === er.materialId).name);
    return { materialId: mat.id, count: er.count };
  });

  config.value.equipment.push({
    id: 'e' + Date.now(),
    name: '夔龙王长剑',
    category: '武器',
    materials: mappedRecipe
  });
  
  $alert('导入成功', '已添加示例装备：夔龙王长剑及相关材料');
}

// 保存配置
const saveConfig = async () => {
  saving.value = true
  $loading.show('正在保存配置...')

  const { data: existing } = await supabase
    .from('site_config')
    .select('id')
    .eq('key', 'equipment_cost_config')
    .maybeSingle()

  let error
  if (existing) {
    const { error: updateError } = await supabase
      .from('site_config')
      .update({ 
        value: config.value, 
        updated_at: new Date().toISOString() 
      })
      .eq('key', 'equipment_cost_config')
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('site_config')
      .insert({ 
        key: 'equipment_cost_config', 
        value: config.value 
      })
    error = insertError
  }

  $loading.hide()
  saving.value = false

  if (error) {
    $alert('保存失败', error.message)
  } else {
    $alert('保存成功', '装备造价配置已更新')
  }
}

// 材料操作
const addMaterial = () => {
  config.value.materials.push({
    id: 'm' + Date.now(),
    name: ''
  })
}

const removeMaterial = (index) => {
  config.value.materials.splice(index, 1)
}

// 装备操作
const addEquipment = () => {
  const newId = 'e' + Date.now()
  config.value.equipment.push({
    id: newId,
    name: '',
    category: '武器',
    materials: []
  })
  // 默认展开新添加的装备
  collapsedEquipment.value[newId] = false
}

const removeEquipment = (index) => {
  config.value.equipment.splice(index, 1)
}

const addMaterialToEquipment = (eq) => {
  eq.materials.push({
    materialId: '',
    count: 0
  })
}

const removeMaterialFromEquipment = (eq, index) => {
  eq.materials.splice(index, 1)
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>

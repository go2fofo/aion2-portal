<!--
 * @Author: whq
 * @Date: 2026-02-11 09:54:16
 * @LastEditTime: 2026-02-11 09:57:17
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/pages/admin/tabs.vue
-->
<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 class="font-black text-slate-800">Tab 菜单管理</h3>
      <button @click="addTab" class="text-sm bg-[#45a6d5] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#3b95c0] transition-colors">
        + 新增 Tab
      </button>
    </div>
    
    <div class="divide-y divide-slate-100">
      <TransitionGroup name="list" tag="div">
        <div 
          v-for="(tab, index) in tabs" 
          :key="tab._uid || tab.id" 
          class="p-4 flex items-center gap-4 group hover:bg-slate-50 transition-all duration-300 relative bg-white"
          :class="{ 'opacity-50 scale-95 z-10 shadow-lg': draggingIndex === index }"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent="handleDragOver($event, index)"
          @dragend="handleDragEnd"
        >
          <!-- 拖拽手柄 -->
          <div class="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#45a6d5] transition-colors p-1">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="5" r="1"/>
              <circle cx="9" cy="12" r="1"/>
              <circle cx="9" cy="19" r="1"/>
              <circle cx="15" cy="5" r="1"/>
              <circle cx="15" cy="12" r="1"/>
              <circle cx="15" cy="19" r="1"/>
            </svg>
          </div>

          <!-- 排序按钮 (保留作为辅助) -->
          <div class="flex flex-col gap-1 shrink-0">
            <button 
              @click="moveTabUp(index)" 
              :disabled="index === 0"
              class="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-400 hover:bg-[#45a6d5] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              title="上移"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
            <button 
              @click="moveTabDown(index)" 
              :disabled="index === tabs.length - 1"
              class="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-400 hover:bg-[#45a6d5] hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              title="下移"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>

          <div class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-slate-400 font-mono text-xs shrink-0">
            {{ index + 1 }}
          </div>
          
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-xs font-bold text-slate-400 block mb-1">ID (英文标识)</label>
              <input v-model="tab.id" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-[#45a6d5] outline-none" placeholder="如: news" />
            </div>
            <div>
              <label class="text-xs font-bold text-slate-400 block mb-1">显示名称</label>
              <input v-model="tab.name" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-[#45a6d5] outline-none" placeholder="如: 最新公告" />
            </div>
            <div class="flex items-end pb-1">
              <button 
                @click="tab.hidden = !tab.hidden"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black transition-all border-2"
                :class="tab.hidden ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'"
              >
                <!-- 眼睛图标 (SVG 设计) -->
                <svg v-if="!tab.hidden" class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <!-- 闭眼/隐藏图标 (SVG 设计) -->
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94C16.19 18.99 14.16 19.63 12 19.63C7.03 19.63 3.06 15.66 3.06 10.69C3.06 9.8 3.2 8.94 3.44 8.14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22.54 12.04C21.94 13.84 20.84 15.44 19.44 16.74M9.88 9.88C9.33 10.43 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.57 14.67 14.12 14.12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 2L22 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ tab.hidden ? '已隐藏' : '显示中' }}
              </button>
            </div>
          </div>

          <button @click="removeTab(index)" class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
      <button @click="saveTabs" :disabled="loading" class="px-6 py-3 bg-[#f9b11d] text-white rounded-xl font-black shadow-md hover:bg-[#fbc02d] transition-colors disabled:opacity-50">
        {{ loading ? '保存中...' : '保存配置' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const supabase = useSupabaseClient()
const { $alert, $confirm, $loading } = useNuxtApp()

const tabs = ref([])
const loading = ref(false)
const draggingIndex = ref(null)

// 拖拽逻辑
const handleDragStart = (e, index) => {
  draggingIndex.value = index
  e.dataTransfer.effectAllowed = 'move'
  // 设置拖拽图像的透明度或自定义样式
  if (e.target.classList) {
    setTimeout(() => {
      e.target.classList.add('dragging-item')
    }, 0)
  }
}

const handleDragOver = (e, index) => {
  if (draggingIndex.value === null || draggingIndex.value === index) return
  
  // 执行排序交换
  const item = tabs.value.splice(draggingIndex.value, 1)[0]
  tabs.value.splice(index, 0, item)
  draggingIndex.value = index
}

const handleDragEnd = (e) => {
  draggingIndex.value = null
  if (e.target.classList) {
    e.target.classList.remove('dragging-item')
  }
}

// 读取 Tab 配置
const fetchTabs = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'home_tabs')
    .maybeSingle()
  
  if (data?.value) {
    tabs.value = data.value.map(t => ({ ...t, _uid: Math.random().toString(36).slice(2, 9) }))
  } else if (!data) {
    // 初始化默认值
    tabs.value = [
      { id: 'news', name: '军团伴说', hidden: false, _uid: 't1' },
      { id: 'fresh', name: '军团鲜哒', hidden: false, _uid: 't2' },
      { id: 'analysis', name: '战力解析', hidden: false, _uid: 't3' },
      { id: 'rank', name: '战力排行', hidden: false, _uid: 't4' },
      { id: 'join', name: '入团手续', hidden: false, _uid: 't5' }
    ]
  }
  loading.value = false
}

// 保存 Tab 配置
const saveTabs = async () => {
  $loading.show('正在保存配置...')
  // 检查是否已存在配置
  const { data: existing } = await supabase
    .from('site_config')
    .select('id')
    .eq('key', 'home_tabs')
    .maybeSingle()

  // 准备保存的数据，移除内部使用的 _uid
  const dataToSave = tabs.value.map(({ _uid, ...rest }) => rest)

  let error
  if (existing) {
    const { error: updateError } = await supabase
      .from('site_config')
      .update({ value: dataToSave, updated_at: new Date().toISOString() })
      .eq('key', 'home_tabs')
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('site_config')
      .insert({ key: 'home_tabs', value: dataToSave })
    error = insertError
  }
  
  $loading.hide()

  if (error) {
    $alert('保存失败', error.message)
  } else {
    $alert('保存成功', '首页菜单已更新')
  }
}

const addTab = () => {
  tabs.value.push({ 
    id: '', 
    name: '', 
    hidden: false, 
    _uid: Math.random().toString(36).slice(2, 9) 
  })
}

const moveTabUp = (index) => {
  if (index > 0) {
    const item = tabs.value.splice(index, 1)[0]
    tabs.value.splice(index - 1, 0, item)
  }
}

const moveTabDown = (index) => {
  if (index < tabs.value.length - 1) {
    const item = tabs.value.splice(index, 1)[0]
    tabs.value.splice(index + 1, 0, item)
  }
}

const removeTab = async (index) => {
  const confirmed = await $confirm('删除确认', '确定要删除这个 Tab 吗？')
  if (confirmed) {
    tabs.value.splice(index, 1)
  }
}

onMounted(() => {
  fetchTabs()
})
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.dragging-item {
  opacity: 0;
}
</style>

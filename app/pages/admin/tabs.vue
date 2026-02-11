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
      <div v-for="(tab, index) in tabs" :key="index" class="p-4 flex items-center gap-4 group hover:bg-slate-50 transition-colors">
        <div class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-slate-400 font-mono text-xs">
          {{ index + 1 }}
        </div>
        
        <div class="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-400 block mb-1">ID (英文标识)</label>
            <input v-model="tab.id" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-[#45a6d5] outline-none" placeholder="如: news" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-400 block mb-1">显示名称</label>
            <input v-model="tab.name" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-[#45a6d5] outline-none" placeholder="如: 最新公告" />
          </div>
        </div>

        <button @click="removeTab(index)" class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          🗑️
        </button>
      </div>
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

const tabs = ref([])
const loading = ref(false)

// 读取 Tab 配置
const fetchTabs = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'home_tabs')
    .single()
  
  if (data?.value) {
    tabs.value = data.value
  } else if (!data) {
    // 初始化默认值
    tabs.value = [
      { id: 'news', name: '军团伴说' },
      { id: 'fresh', name: '军团鲜哒' },
      { id: 'analysis', name: '战力解析' },
      { id: 'rank', name: '战力排行' },
      { id: 'join', name: '入团手续' }
    ]
  }
  loading.value = false
}

// 保存 Tab 配置
const saveTabs = async () => {
  loading.value = true
  // 检查是否已存在配置
  const { data: existing } = await supabase
    .from('site_config')
    .select('id')
    .eq('key', 'home_tabs')
    .single()

  let error
  if (existing) {
    const { error: updateError } = await supabase
      .from('site_config')
      .update({ value: tabs.value, updated_at: new Date().toISOString() })
      .eq('key', 'home_tabs')
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('site_config')
      .insert({ key: 'home_tabs', value: tabs.value })
    error = insertError
  }

  if (error) {
    alert('保存失败: ' + error.message)
  } else {
    alert('保存成功！')
  }
  loading.value = false
}

const addTab = () => {
  tabs.value.push({ id: '', name: '' })
}

const removeTab = (index) => {
  if (confirm('确定要删除这个 Tab 吗？')) {
    tabs.value.splice(index, 1)
  }
}

onMounted(() => {
  fetchTabs()
})
</script>

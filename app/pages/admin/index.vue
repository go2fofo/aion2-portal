<!--
 * @Author: whq
 * @Date: 2026-02-11 09:54:01
 * @LastEditTime: 2026-02-11 09:54:02
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/pages/admin/index.vue
-->
<script setup>
import { ref, onMounted } from 'vue'
const supabase = useSupabaseClient()

const memberCount = ref(0)
const loading = ref(true)

const fetchStats = async () => {
  const { count, error } = await supabase
    .from('legion_members')
    .select('*', { count: 'exact', head: true })
  
  if (count !== null) {
    memberCount.value = count
  }
  loading.value = false
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="text-slate-400 font-bold text-sm mb-2">总访问量</div>
        <div class="text-3xl font-black text-slate-800">1,280</div>
        <div class="text-green-500 text-xs font-bold mt-2">↑ 12% 较上周</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="text-slate-400 font-bold text-sm mb-2">注册军团成员</div>
        <div class="text-3xl font-black text-slate-800">
          {{ loading ? '...' : memberCount }}
        </div>
        <div class="text-green-500 text-xs font-bold mt-2">实时同步</div>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="text-slate-400 font-bold text-sm mb-2">当前在线</div>
        <div class="text-3xl font-black text-slate-800">16</div>
        <div class="text-slate-400 text-xs font-bold mt-2">实时数据</div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <h2 class="text-lg font-black text-slate-800 mb-4">快捷操作</h2>
      <div class="flex gap-4">
        <NuxtLink to="/admin/content" class="px-6 py-3 bg-[#45a6d5] text-white rounded-xl font-bold shadow-md hover:bg-[#3b95c0] transition-colors">
          发布新公告
        </NuxtLink>
        <NuxtLink to="/admin/tabs" class="px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:border-[#45a6d5] hover:text-[#45a6d5] transition-colors">
          调整菜单顺序
        </NuxtLink>
        <NuxtLink to="/admin/search" class="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-md hover:bg-amber-600 transition-colors flex items-center gap-2">
          <span>🔍</span> 角色快速查询
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

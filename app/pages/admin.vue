<!--
 * @Author: whq
 * @Date: 2026-02-11 09:53:45
 * @LastEditTime: 2026-02-11 10:07:31
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/pages/admin.vue
-->
<template>
  <div class="h-screen bg-slate-50 flex overflow-hidden">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
      <div class="p-6 border-b border-slate-100 flex items-center gap-3">
        <div class="w-8 h-8 bg-[#45a6d5] rounded-lg flex items-center justify-center text-white font-black">A</div>
        <span class="font-black text-slate-800 text-lg">军团控制台</span>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scroll">
        <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>📊</span>
          概览
        </NuxtLink>
        <NuxtLink to="/admin/content" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>📝</span>
          内容管理
        </NuxtLink>
        <NuxtLink to="/admin/members" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>👥</span>
          成员管理
        </NuxtLink>
        <NuxtLink to="/admin/tabs" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>📑</span>
          Tab配置
        </NuxtLink>
        <NuxtLink to="/admin/ai" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>🤖</span>
          AI 模型配置
        </NuxtLink>
        <NuxtLink to="/admin/cost-calculator" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>💰</span>
          造价计算配置
        </NuxtLink>
        <NuxtLink to="/admin/craft-history" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>📜</span>
          造价历史记录
        </NuxtLink>
        <NuxtLink to="/admin/material-trends" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:text-[#45a6d5] transition-colors" exact-active-class="bg-[#E6F7FF] text-[#45a6d5]">
          <span>📈</span>
          材料价格走势
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <button @click="logout" class="flex items-center gap-2 text-red-500 font-bold text-sm px-4 py-2 hover:bg-red-50 rounded-lg w-full transition-colors">
          <span>🚪</span> 退出管理
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col min-w-0 h-full">
      <!-- 顶部 Header (固定) -->
      <header class="h-16 px-8 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex justify-between items-center shrink-0 z-10 sticky top-0">
        <h1 class="text-2xl font-black text-slate-800">{{ pageTitle }}</h1>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-sm font-bold text-slate-500 hover:text-[#45a6d5]">返回前台 ↗</NuxtLink>
          <div class="w-10 h-10 bg-[#AEE2F9] rounded-full flex items-center justify-center text-white font-black shadow-sm">
            {{ user?.email?.[0].toUpperCase() || 'A' }}
          </div>
        </div>
      </header>

      <!-- 页面内容 (独立滚动) -->
      <div class="flex-1 overflow-y-auto p-8 custom-scroll">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

// 简单的页面标题映射
const pageTitle = computed(() => {
  if (route.path === '/admin') return '仪表盘'
  if (route.path.includes('/content')) return '首页内容管理'
  if (route.path.includes('/members')) return '军团成员管理'
  if (route.path.includes('/tabs')) return 'Tab 菜单配置'
  if (route.path.includes('/ai')) return 'AI 分析模型配置'
  if (route.path.includes('/cost-calculator')) return '装备造价配置'
  if (route.path.includes('/craft-history')) return '装备造价历史'
  if (route.path.includes('/material-trends')) return '材料价格走势'
  return '管理后台'
})

// 权限检查：如果没登录，踢出去
watchEffect(() => {
  if (!user.value) {
    router.push('/login')
  }
})

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

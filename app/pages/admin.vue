<!--
 * @Author: whq
 * @Date: 2026-02-11 09:53:45
 * @LastEditTime: 2026-02-11 10:07:31
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/pages/admin.vue
-->
<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div class="p-6 border-b border-slate-100 flex items-center gap-3">
        <div class="w-8 h-8 bg-[#45a6d5] rounded-lg flex items-center justify-center text-white font-black">A</div>
        <span class="font-black text-slate-800 text-lg">军团控制台</span>
      </div>
      
      <nav class="flex-1 p-4 space-y-1">
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
      </nav>

      <div class="p-4 border-t border-slate-100">
        <button @click="logout" class="flex items-center gap-2 text-red-500 font-bold text-sm px-4 py-2 hover:bg-red-50 rounded-lg w-full transition-colors">
          <span>🚪</span> 退出管理
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-y-auto p-8">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-black text-slate-800">{{ pageTitle }}</h1>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-sm font-bold text-slate-500 hover:text-[#45a6d5]">返回前台 ↗</NuxtLink>
          <div class="w-10 h-10 bg-[#AEE2F9] rounded-full flex items-center justify-center text-white font-black shadow-sm">
            {{ user?.email?.[0].toUpperCase() || 'A' }}
          </div>
        </div>
      </header>

      <NuxtPage />
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

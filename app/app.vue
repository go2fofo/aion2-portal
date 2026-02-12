<template>
  <NuxtLayout>
    <NuxtPage />
    <GlobalFeedback />
  </NuxtLayout>
</template>

<script setup>
/**
 * 这里可以放置一些全局逻辑，比如：
 * 1. 全局的主题控制
 * 2. 初始化的权限检查
 * 3. 统计脚本
 */

// 例如：设置全局的 SEO 标题
useHead({
  title: 'AION2 Portal - 你的卡通冒险门户',
  meta: [
    { name: 'description', content: '基于 Nuxt 4 和 Supabase 构建的 AION2 玩家社区门户' }
  ],
  // 如果你想给整个身体加一个基础背景色，防止切页闪白
  bodyAttrs: {
    class: 'bg-sky-300'
  }
})
</script>
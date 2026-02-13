<!--
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-02-13 16:39:53
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/app.vue
-->
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
  title: 'AION2 宝宝巴士军团',
  meta: [
    { name: 'description', content: '' }
  ],
  // 如果你想给整个身体加一个基础背景色，防止切页闪白
  bodyAttrs: {
    class: 'bg-sky-300'
  }
})
</script>
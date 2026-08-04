<!--
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-08-04 09:40:33
 * @LastEditors: fofo
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
import { onMounted, onUnmounted } from 'vue';
/**
 * 这里可以放置一些全局逻辑，比如：
 * 1. 全局的主题控制
 * 2. 初始化的权限检查
 * 3. 统计脚本
 */

// 例如：设置全局的 SEO 标题
useHead({
  title: 'AION2 宝宝巴士',
  meta: [
    { name: 'description', content: 'AION2 宝宝巴士门户网站' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/bbbswz.png' }
  ],
  // 如果你想给整个身体加一个基础背景色，防止切页闪白
  bodyAttrs: {
    class: 'bg-sky-300'
  }
})
import { useGameRefresh } from '@/composables/useGameRefresh';

const { executeDataRefresh, initAutoRefreshTimer, stopAutoRefreshTimer } = useGameRefresh();

// 1. 页面加载挂载时：启动后台自动定时监测与计算
onMounted(async () => {
  // 页面打开瞬间先执行一次手动/即时刷新校验
  await executeDataRefresh();
  
  // 开启定时器（每分钟自动检查是否跨天/跨周/能量是否溢出）
  initAutoRefreshTimer();
});

// 2. 页面卸载时清理定时器
onUnmounted(() => {
  stopAutoRefreshTimer();
});
</script>
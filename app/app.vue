<!--
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-08-05 11:04:56
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/app.vue
-->
<template>
  <!-- 根节点或者通过 bodyAttrs 动态绑定 dark 类 -->
  <NuxtLayout>
    <NuxtPage />
    <GlobalFeedback />
  </NuxtLayout>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

// 主题状态：从 localStorage 读取，默认浅色
const isDark = ref(false);

// 切换主题方法（可以绑定到你的 UI 按钮上，或者导出去给其他组件用）
const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateThemeClass();
};

// 更新 DOM 的 dark 类
const updateThemeClass = () => {
  if (typeof window !== 'undefined') {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

// 初始化检查本地存储
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
  }
  updateThemeClass();
});

// 动态修改 body 背景色（适配黑夜与白天）
useHead({
  title: 'AION2 宝宝巴士',
  meta: [
    { name: 'description', content: 'AION2 宝宝巴士门户网站' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/bbbswz.png' }
  ],
  bodyAttrs: {
    // 白天是 sky-300，黑夜自动变成深灰色/Slate色（配合 tailwind 的 dark: 前缀）
    class: 'bg-sky-300 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300'
  }
});

import { useGameRefresh } from '@/composables/useGameRefresh';
const { executeDataRefresh, initAutoRefreshTimer, stopAutoRefreshTimer } = useGameRefresh();

onMounted(async () => {
  await executeDataRefresh();
  initAutoRefreshTimer();
});

onUnmounted(() => {
  stopAutoRefreshTimer();
});

// 可选：将 toggleTheme 暴露给全局（如果其他地方的导航栏按钮要用）
provide('theme', { isDark, toggleTheme });
</script>
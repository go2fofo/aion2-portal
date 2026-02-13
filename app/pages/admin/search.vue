<!--
 * @Author: whq
 * @Date: 2026-02-13 18:42:57
 * @LastEditTime: 2026-02-13 19:05:56
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/pages/admin/search.vue
-->
<script setup>
// 使用通用搜索模块重构
</script>

<template>
  <div class="space-y-6 max-w-6xl mx-auto py-8 px-4">
    <!-- 标题区 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">角色快速查询 (管理端)</h1>
        <p class="text-slate-400 font-bold mt-1">即时查询全服角色数据，无需存入数据库</p>
      </div>
      <NuxtLink 
        to="/admin" 
        class="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
      >
        <span>← 返回后台</span>
      </NuxtLink>
    </div>

    <CharacterSearchModule />
  </div>
</template>

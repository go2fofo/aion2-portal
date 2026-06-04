<script setup>
const { data, pending, refresh } = useFetch('/api/aion2-updates?limit=18')
const list = computed(() => (data.value?.success ? data.value.data || [] : []))
</script>

<template>
  <div class="h-full">
    <div v-if="pending" class="h-full flex items-center justify-center text-slate-400 font-bold">
      加载中...
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <a
        v-for="item in list"
        :key="item.id"
        :href="`/update-aion2/${item.id}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-left p-4 bg-[#F0F9FF] rounded-2xl border-2 border-white hover:-translate-y-1 transition-transform"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sky-900 font-bold line-clamp-2">{{ item.title }}</p>
            <p class="text-xs text-sky-400 mt-2">
              {{ item.posted_at ? new Date(item.posted_at).toLocaleDateString() : '' }}
            </p>
          </div>
          <div class="shrink-0 text-[10px] font-black text-sky-700 bg-white/70 border border-white px-2 py-1 rounded-lg">
            {{ (item.view_count || 0).toLocaleString() }}
          </div>
        </div>
      </a>

      <div v-if="list.length === 0" class="col-span-full flex flex-col items-center justify-center text-slate-400 py-10">
        <span class="font-bold">暂无更新动态</span>
        <button class="mt-3 px-4 py-2 rounded-xl bg-white border border-slate-100 font-black text-sm text-slate-600" @click="refresh">
          刷新
        </button>
      </div>
    </div>
  </div>
</template>

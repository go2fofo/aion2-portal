<script setup>
const route = useRoute()
const id = computed(() => String(route.params.id || ''))

const { data, pending, refresh } = useFetch(() => `/api/aion2-updates/${encodeURIComponent(id.value)}`)

const article = computed(() => (data.value?.success ? data.value.data : null))
const title = computed(() => article.value?.title || '')
const postedAt = computed(() => article.value?.posted_at || null)
const html = computed(() => article.value?.detail_html || '')
const officialUrl = computed(() =>
  id.value ? `https://tw.ncsoft.com/aion2/board/update/view?articleId=${encodeURIComponent(id.value)}` : 'https://tw.ncsoft.com/aion2',
)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between gap-3 mb-6">
        <div class="min-w-0">
          <div class="text-xl md:text-2xl font-black text-slate-900 break-words">{{ title }}</div>
          <div class="text-xs font-bold text-slate-400 mt-2">
            {{ postedAt ? new Date(postedAt).toLocaleString() : '' }}
          </div>
        </div>
        <div class="shrink-0 flex items-center gap-2">
          <NuxtLink to="/" class="px-4 py-2 rounded-xl bg-white border border-slate-200 font-black text-sm text-slate-700 hover:bg-slate-100">
            返回首页
          </NuxtLink>
          <a :href="officialUrl" target="_blank" class="px-4 py-2 rounded-xl bg-white border border-slate-200 font-black text-sm text-slate-700 hover:bg-slate-100">
            官方页面
          </a>
          <button class="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 font-black text-sm text-slate-600 hover:bg-slate-200" @click="refresh">
            刷新
          </button>
        </div>
      </div>

      <div v-if="pending" class="py-16 text-center text-slate-400 font-bold">加载中...</div>
      <div v-else-if="!article" class="py-16 text-center text-slate-400 font-bold">未找到</div>
      <div v-else class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 md:p-10">
          <div v-if="!html" class="text-slate-400 font-bold text-center py-10">暂无正文</div>
          <div v-else class="text-slate-800 leading-7" v-html="html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

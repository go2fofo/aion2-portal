<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="text-lg font-black text-slate-800">公开副本编排</div>
            <div class="text-xs font-bold text-slate-500 mt-1">可查看与复用其他玩家公开的编排</div>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="searchText"
              class="w-56 md:w-72 px-4 py-2 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
              placeholder="搜索标题/备注/标签..."
            />
            <button
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
              :disabled="loading"
              @click="fetchPlans"
            >
              {{ loading ? '刷新中...' : '刷新' }}
            </button>
          </div>
        </div>

        <div class="p-6">
          <div v-if="loading" class="py-12 text-center text-slate-400 font-bold">加载中...</div>
          <div v-else-if="filtered.length === 0" class="py-12 text-center text-slate-400 font-bold">暂无公开编排</div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NuxtLink
              v-for="p in filtered"
              :key="p.id"
              :to="`/dungeon-plans/${p.id}`"
              class="block p-5 rounded-3xl border border-slate-100 bg-white hover:border-sky-200 hover:shadow-md transition-all"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <div class="font-black text-slate-800 truncate">{{ p.title }}</div>
                    <span class="text-[10px] font-black px-2 py-1 rounded-lg" :class="statusBadgeClass(p.status)">
                      {{ statusLabel(p.status) }}
                    </span>
                  </div>
                  <div class="text-xs font-bold text-slate-500 mt-1">
                    {{ formatDateTime(p.start_at) }} · {{ (p.groups || []).length }} 组 · {{ (p.groups || []).reduce((acc, g) => acc + (g.teams || []).length, 0) }} 队
                  </div>
                </div>
                <div class="text-xs font-black text-sky-600 shrink-0">查看 →</div>
              </div>

              <div class="mt-3 text-sm text-slate-600 font-bold line-clamp-2">
                {{ p.notes || '—' }}
              </div>

              <div v-if="(p.tags || []).length" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="tag in p.tags"
                  :key="tag"
                  class="text-[10px] font-black px-2 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100"
                >
                  #{{ tag }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-center">
        <NuxtLink to="/" class="text-xs font-black text-slate-400 hover:text-slate-600">返回首页</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const loading = ref(false)
const plans = ref([])
const searchText = ref('')

const formatDateTime = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${mi}`
}

const statusLabel = (s) => {
  if (s === 'completed') return '完成'
  if (s === 'overdue') return '逾期'
  if (s === 'canceled') return '作废'
  return '进行中'
}

const statusBadgeClass = (s) => {
  if (s === 'completed') return 'bg-emerald-50 text-emerald-700'
  if (s === 'overdue') return 'bg-amber-50 text-amber-700'
  if (s === 'canceled') return 'bg-rose-50 text-rose-700'
  return 'bg-sky-50 text-sky-700'
}

const filtered = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return plans.value
  return plans.value.filter((p) => {
    const title = String(p.title || '').toLowerCase()
    const notes = String(p.notes || '').toLowerCase()
    const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : ''
    return title.includes(q) || notes.includes(q) || tags.includes(q)
  })
})

const fetchPlans = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/dungeon-plans', { query: { view: 'public', limit: 50 } })
    plans.value = res?.success ? (res.data || []) : []
  } catch {
    plans.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>


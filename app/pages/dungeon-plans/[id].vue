<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink to="/dungeon-plans" class="text-sm font-black text-slate-500 hover:text-slate-700">← 返回列表</NuxtLink>
        <NuxtLink to="/" class="text-sm font-black text-slate-500 hover:text-slate-700">首页</NuxtLink>
      </div>

      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <div v-if="loading" class="text-slate-400 font-bold">加载中...</div>
          <div v-else-if="!plan" class="text-slate-400 font-bold">未找到该编排</div>
          <div v-else class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <div class="text-xl font-black text-slate-800">{{ plan.title }}</div>
              <span class="text-[10px] font-black px-2 py-1 rounded-lg" :class="statusBadgeClass(plan.status)">
                {{ statusLabel(plan.status) }}
              </span>
              <span class="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">公开</span>
            </div>
            <div class="text-xs font-bold text-slate-500">
              {{ formatDateTime(plan.start_at) }} · {{ (plan.teams || []).length }} 队
            </div>
            <div v-if="plan.completed_at" class="text-[10px] font-bold text-slate-400">
              完成时间：{{ formatDateTime(plan.completed_at) }}
            </div>
            <div v-if="(plan.tags || []).length" class="pt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in plan.tags"
                :key="tag"
                class="text-[10px] font-black px-2 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="plan" class="p-6 space-y-6">
          <div class="text-sm text-slate-700 font-bold whitespace-pre-wrap break-words">
            {{ plan.notes || '—' }}
          </div>

          <div class="space-y-4">
            <div v-for="(t, tIndex) in (plan.teams || [])" :key="t.id || `${plan.id}_${tIndex}`" class="p-5 rounded-3xl border border-slate-100 bg-slate-50">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="font-black text-slate-800">{{ t.title || `第${tIndex + 1}队` }}</div>
                  <div class="text-xs font-bold text-slate-500 mt-1">{{ t.note || '—' }}</div>
                </div>
                <div class="text-[10px] font-black bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg shrink-0">
                  {{ (t.members || []).length }}/4
                </div>
              </div>

              <div v-if="(t.members || []).length" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="m in (t.members || [])" :key="m.key || `${m.characterId}_${m.serverId}`" class="p-3 rounded-2xl bg-white border border-slate-100">
                  <div class="flex items-center justify-between gap-3">
                    <div class="font-black text-slate-800 truncate">{{ m.characterName }}</div>
                    <div class="text-[10px] font-black text-slate-500 shrink-0">Lv.{{ m.characterLevel }}</div>
                  </div>
                  <div class="mt-1 text-xs font-bold text-slate-500 flex items-center gap-2 flex-wrap">
                    <span>{{ m.className }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{{ m.serverName }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span :class="m.raceId === 1 ? 'text-sky-600' : 'text-rose-600'">{{ m.raceName }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>战 {{ formatCombatPower(m.combatPower) }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="mt-4 text-xs text-slate-400 font-bold">暂无队员</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { formatCombatPower } from '~/utils/formatCombatPower'

const route = useRoute()
const loading = ref(false)
const plan = ref(null)

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

const fetchPlan = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await $fetch(`/api/dungeon-plans/${id}`)
    plan.value = res?.success ? res.data : null
  } catch {
    plan.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPlan()
})
</script>


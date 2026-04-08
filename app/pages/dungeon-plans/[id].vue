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
              {{ formatDateTime(plan.start_at) }} · {{ (plan.groups || []).length }} 组 · {{ (plan.groups || []).reduce((acc, g) => acc + (g.teams || []).length, 0) }} 队
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

          <div class="space-y-8">
            <div v-for="(g, gIndex) in (plan.groups || [])" :key="g.id || `${plan.id}_g_${gIndex}`" class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-sm">
                  {{ gIndex + 1 }}
                </div>
                <div class="font-black text-slate-800 text-lg">{{ g.title || `第${gIndex + 1}组` }}</div>
                <div v-if="g.note" class="text-xs font-bold text-slate-400">{{ g.note }}</div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(t, tIndex) in (g.teams || [])" :key="t.id || `${plan.id}_g_${gIndex}_t_${tIndex}`" class="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div class="flex items-center justify-between gap-4 mb-4">
                    <div class="font-black text-slate-800">{{ t.title || `队伍 ${tIndex + 1}` }}</div>
                    <div class="text-[10px] font-black bg-slate-50 border border-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                      {{ (t.members || []).length }}/4
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div v-for="slotIndex in 4" :key="`${plan.id}_${gIndex}_${tIndex}_slot_${slotIndex}`">
                      <div v-if="t.members?.[slotIndex - 1]" class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                        <div class="min-w-0">
                          <div class="flex items-center gap-2 flex-wrap">
                            <div class="font-black text-slate-800 text-base">{{ t.members[slotIndex - 1].characterName }}</div>
                            <span class="text-[11px] font-black text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shrink-0">
                              {{ t.members[slotIndex - 1].className }}
                            </span>
                            <span class="text-[10px] font-medium text-slate-400">
                              ({{ t.members[slotIndex - 1].raceName }})
                            </span>
                          </div>
                          <div class="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                            <span>Lv.{{ t.members[slotIndex - 1].characterLevel }}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{{ t.members[slotIndex - 1].serverName }}</span>
                          </div>
                          <div v-if="t.members[slotIndex - 1].remark" class="mt-1.5 p-1.5 rounded-lg bg-amber-50/50 border border-amber-100/50 text-[10px] font-bold text-amber-700 leading-relaxed break-words">
                            <span class="opacity-60 mr-1">备注:</span>{{ t.members[slotIndex - 1].remark }}
                          </div>
                        </div>
                        <div class="text-right shrink-0">
                          <div class="text-[10px] font-black text-slate-400 mb-0.5">能力评分</div>
                          <div class="text-sm font-black text-[#45a6d5]">战 {{ formatCombatPower(t.members[slotIndex - 1].combatPower) }}</div>
                          <div class="text-xs font-black text-[#45a6d5]/80">评 {{ t.members[slotIndex - 1].itemLevel || '-' }}</div>
                        </div>
                      </div>
                      <div v-else class="p-4 rounded-2xl bg-white border border-dashed border-slate-200 flex items-center justify-between gap-3 opacity-80 shadow-sm">
                        <div class="min-w-0">
                          <div class="text-xs font-black text-slate-400 mb-1 uppercase tracking-tight">空位待组</div>
                          <div class="text-sm font-black text-slate-400 italic">
                            {{ t.slot_remarks?.[slotIndex - 1] || '待组（虚位以待）' }}
                          </div>
                        </div>
                        <div class="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-300 font-black text-[10px] uppercase">
                          待组 {{ slotIndex }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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


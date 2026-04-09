<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="text-lg font-black text-slate-800">副本队伍编排</div>
          <div class="text-xs font-bold text-slate-500 mt-1">
            新建副本计划、编排队伍与队员（每队 4 人）
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-100">
            <button
              class="px-3 py-1.5 rounded-lg font-black text-xs transition-colors"
              :class="viewMode === 'mine' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
              @click="setViewMode('mine')"
            >
              我的
            </button>
            <button
              class="px-3 py-1.5 rounded-lg font-black text-xs transition-colors"
              :class="viewMode === 'public' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
              @click="setViewMode('public')"
            >
              公开
            </button>
          </div>
          <input
            v-model="searchText"
            class="w-48 md:w-64 px-4 py-2 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
            placeholder="搜索标题/备注/标签..."
          />
          <button
            @click="fetchPlans"
            class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
            :disabled="loading"
          >
            {{ loading ? '刷新中...' : '刷新' }}
          </button>
          <button
            @click="openCreate"
            class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors"
          >
            新建计划
          </button>
        </div>
      </div>

      <div class="p-6">
        <div v-if="loading" class="py-12 text-center text-slate-400 font-bold">加载中...</div>
        <div v-else-if="plans.length === 0" class="py-12 text-center text-slate-400 font-bold">暂无计划</div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="p in filteredPlans"
            :key="p.id"
            class="p-5 rounded-3xl border bg-white transition-all"
            :class="planCardClass(p)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <div class="font-black text-slate-800 truncate">{{ p.title }}</div>
                  <span
                    class="text-[10px] font-black px-2 py-1 rounded-lg"
                    :class="statusBadgeClass(p.status)"
                  >
                    {{ statusLabel(p.status) }}
                  </span>
                  <span
                    class="text-[10px] font-black px-2 py-1 rounded-lg"
                    :class="p.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ p.is_public ? '公开' : '仅我' }}
                  </span>
                </div>
                <div class="text-xs font-bold text-slate-500 mt-1">
                  {{ formatDateTime(p.start_at) }} · {{ (p.groups || []).length }} 组 · {{ (p.groups || []).reduce((acc, g) => acc + (g.teams || []).length, 0) }} 队
                </div>
                <div v-if="p.completed_at" class="text-[10px] font-bold text-slate-400 mt-1">
                  完成时间：{{ formatDateTime(p.completed_at) }}
                </div>
                <div v-if="p.status === 'overdue'" class="mt-2 text-[10px] font-black text-amber-700">
                  已逾期：建议重新安排时间
                </div>
                <div v-if="p.status === 'canceled'" class="mt-2 text-[10px] font-black text-rose-700">
                  已作废：可删除该编排
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-if="canEdit(p)"
                  class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-colors"
                  @click="openStatus(p)"
                >
                  状态
                </button>
                <button
                  v-if="canEdit(p)"
                  class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-colors"
                  @click="openEdit(p)"
                >
                  编辑
                </button>
                <button
                  v-if="canEdit(p)"
                  class="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-black text-xs hover:bg-rose-100 transition-colors"
                  @click="removePlan(p)"
                >
                  删除
                </button>
              </div>
            </div>
            <div class="mt-4 text-sm text-slate-600 font-bold whitespace-pre-wrap break-words">
              {{ p.notes || '—' }}
            </div>
            <div v-if="(p.tags || []).length" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="tag in p.tags"
                :key="tag"
                class="text-[10px] font-black px-2 py-1 rounded-lg bg-white/70 text-slate-700 border border-slate-200"
              >
                #{{ tag }}
              </span>
            </div>
            <div v-if="(p.groups || []).length" class="mt-4 space-y-4">
              <div
                v-for="(g, gIndex) in (p.groups || [])"
                :key="g.id || `${p.id}_g_${gIndex}`"
                class="p-4 rounded-2xl bg-slate-50/50 border border-slate-100"
              >
                <div class="flex items-center justify-between gap-4 mb-3">
                  <div class="font-black text-slate-800 text-sm">
                    {{ g.title || `第${gIndex + 1}组` }}
                  </div>
                  <div v-if="g.note" class="text-[10px] font-bold text-slate-400">
                    {{ g.note }}
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="(t, tIndex) in (g.teams || [])"
                    :key="t.id || `${p.id}_g_${gIndex}_t_${tIndex}`"
                    class="p-3 rounded-xl bg-white border border-slate-100"
                  >
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <div class="font-black text-slate-700 text-xs truncate">
                        {{ t.title || `第${tIndex + 1}队` }}
                      </div>
                      <div class="text-[10px] font-black text-slate-400">
                        {{ (t.members || []).filter((m) => m).length }}/4
                      </div>
                    </div>

                    <div class="space-y-1.5">
                      <div v-for="slotIndex in 4" :key="`${p.id}_${gIndex}_${tIndex}_slot_${slotIndex}`">
                        <div
                          v-if="t.members?.[slotIndex - 1]"
                          class="p-2 rounded-lg border flex items-center justify-between gap-2 transition-all bg-slate-50/50 border-slate-100"
                        >
                          <div class="min-w-0">
                            <div class="flex items-center gap-2">
                              <div class="font-black text-[10px] truncate text-slate-800">
                                {{ formatNameWithServerShort(t.members[slotIndex - 1]) }}
                              </div>
                              <span class="text-[8px] font-black px-1 py-0.5 rounded shrink-0 bg-slate-100 text-slate-600">
                                {{ t.members[slotIndex - 1].className }}
                              </span>
                            </div>
                            <div class="text-[8px] font-black flex items-center gap-1.5 mt-0.5 text-[#45a6d5]">
                              <span>战 {{ formatCombatPower(t.members[slotIndex - 1].combatPower) }}</span>
                              <span class="w-0.5 h-0.5 rounded-full bg-slate-200"></span>
                              <span>评 {{ t.members[slotIndex - 1].itemLevel || '-' }}</span>
                            </div>
                            <div v-if="t.members[slotIndex - 1].remark" class="mt-0.5 text-[8px] font-bold italic truncate max-w-[120px] text-slate-400">
                              # {{ t.members[slotIndex - 1].remark }}
                            </div>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <div class="text-[8px] font-black text-slate-400">
                              {{ t.members[slotIndex - 1].raceName }}
                            </div>
                            <button
                              type="button"
                              class="p-1 rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                              @click.stop="copyText(formatNameWithServerShort(t.members[slotIndex - 1]))"
                              title="复制角色名"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                          </div>
                        </div>
                        <div
                          v-else
                          class="p-2 rounded-lg border border-dashed flex items-center justify-between gap-2 opacity-80 transition-all"
                          :class="t.slot_remarks?.[slotIndex - 1] ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'"
                        >
                          <div class="font-black text-[10px] truncate italic" :class="t.slot_remarks?.[slotIndex - 1] ? 'text-emerald-400' : 'text-rose-400'">
                            {{ t.slot_remarks?.[slotIndex - 1] || '等待组队' }}
                          </div>
                          <div class="text-[8px] font-black shrink-0 uppercase tracking-tighter" :class="t.slot_remarks?.[slotIndex - 1] ? 'text-emerald-300' : 'text-rose-300'">
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

    <Transition name="modal">
      <div v-if="statusOpen" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <div class="font-black text-slate-800 text-lg">选择状态</div>
              <div class="text-xs font-bold text-slate-500 mt-1 truncate">{{ statusTarget?.title || '' }}</div>
            </div>
            <button
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
              @click="statusOpen = false"
              :disabled="statusSaving"
            >
              关闭
            </button>
          </div>
          <div class="p-6 space-y-3">
            <button
              class="w-full p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left"
              @click="setStatus('completed')"
              :disabled="statusSaving"
            >
              <div class="font-black text-slate-800">完成</div>
              <div class="text-xs font-bold text-slate-500 mt-1">记录完成时间</div>
            </button>
            <button
              class="w-full p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left"
              @click="setStatus('overdue')"
              :disabled="statusSaving"
            >
              <div class="font-black text-slate-800">逾期</div>
              <div class="text-xs font-bold text-slate-500 mt-1">提醒重新安排时间</div>
            </button>
            <button
              class="w-full p-4 rounded-2xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 transition-colors text-left"
              @click="setStatus('canceled')"
              :disabled="statusSaving"
            >
              <div class="font-black text-rose-700">作废</div>
              <div class="text-xs font-bold text-rose-600/80 mt-1">可选择删除该编排</div>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="editorOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div class="min-w-0 flex items-center gap-4">
              <div>
                <div class="font-black text-slate-800 text-lg">{{ editingId ? '编辑计划' : '新建计划' }}</div>
                <div v-if="editingId" class="text-[10px] font-bold text-slate-400 mt-1 truncate">{{ editingId }}</div>
              </div>
              <div v-if="selectedSwap" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 animate-pulse shrink-0">
                <div class="w-2 h-2 rounded-full bg-sky-500"></div>
                <div class="text-[11px] font-black text-sky-700 truncate max-w-[120px]">正在移动: {{ selectedSwap.name }}</div>
                <button @click="selectedSwap = null" class="ml-1 p-0.5 rounded-full hover:bg-sky-200 text-sky-400 hover:text-sky-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="selectedSwap"
                @click="selectedSwap = null"
                class="px-4 py-2 rounded-xl bg-rose-500 text-white font-black text-sm hover:bg-rose-600 transition-colors shadow-sm animate-in fade-in zoom-in duration-200"
              >
                取消选中
              </button>
              <button
                v-else
                @click="addGroup"
                class="px-4 py-2 rounded-xl bg-slate-800 text-white font-black text-sm hover:bg-slate-700 transition-colors shadow-sm"
              >
                添加组
              </button>
              <div class="w-px h-8 bg-slate-100 mx-1"></div>
              <button
                class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                @click="editorOpen = false"
                :disabled="!!selectedSwap"
              >
                关闭
              </button>
              <button
                class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="savePlan"
                :disabled="saving || !!selectedSwap"
              >
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scroll">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">标题 *</div>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="例如：周六副本/圣域等"
                />
              </div>
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">时间 *</div>
                <input
                  v-model="form.start_at"
                  type="datetime-local"
                  class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                />
                <div class="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-colors"
                    @click="setStartAtPreset('next')"
                  >
                    下个整点
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-colors"
                    @click="setStartAtPreset('today20')"
                  >
                    今天 20:00
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-colors"
                    @click="setStartAtPreset('tomorrow20')"
                  >
                    明天 20:00
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-colors"
                    @click="setStartAtPreset('sat20')"
                  >
                    周六 20:00
                  </button>
                </div>
                <div class="mt-2 text-[10px] font-bold text-slate-400">
                  当前选择：{{ startAtPreview }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="flex items-center justify-between gap-3">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">保存方式</div>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-xl font-black text-xs border-2 transition-all"
                    :class="form.is_public ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200'"
                    @click="form.is_public = !form.is_public"
                  >
                    {{ form.is_public ? '公开' : '仅我' }}
                  </button>
                </div>
                <div class="mt-2 text-xs font-bold text-slate-500">
                  {{ form.is_public ? '公开后其他玩家可查看使用' : '仅自己可查看使用' }}
                </div>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">公开标签（逗号分隔）</div>
                <input
                  v-model="tagInput"
                  :disabled="!form.is_public"
                  type="text"
                  class="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all disabled:opacity-50 disabled:bg-slate-100"
                  placeholder="例如：圣域,副本,周六,固定队"
                />
                <div class="mt-2 text-[10px] font-bold text-slate-400">
                  {{ form.is_public ? '用于公开列表搜索与筛选' : '仅公开时可填写' }}
                </div>
              </div>
            </div>

            <div :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">备注</div>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all resize-none"
                placeholder="计划说明、集合时间、注意事项..."
              ></textarea>
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="font-black text-slate-800">编排组</div>
            </div>

            <div class="space-y-8">
              <div
                v-for="(g, gIndex) in form.groups"
                :key="g.id"
                class="p-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50/30"
              >
                <!-- Group Header -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-sm">
                      {{ gIndex + 1 }}
                    </div>
                    <div class="font-black text-slate-800 text-lg">{{ g.title || `第${gIndex + 1}组` }}</div>
                  </div>
                  <div class="flex items-center gap-2" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
                    <button
                      class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 transition-colors disabled:opacity-50"
                      :disabled="gIndex === 0"
                      @click="moveGroup(gIndex, -1)"
                    >
                      上移
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 transition-colors disabled:opacity-50"
                      :disabled="gIndex === form.groups.length - 1"
                      @click="moveGroup(gIndex, 1)"
                    >
                      下移
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-black text-xs hover:bg-rose-100 transition-colors"
                      @click="removeGroup(gIndex)"
                    >
                      删除组
                    </button>
                  </div>
                </div>

                <!-- Group Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
                  <div>
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">组标题</div>
                    <input
                      v-model="g.title"
                      type="text"
                      class="w-full px-4 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all shadow-sm"
                      placeholder="例如：主队/副队/..."
                    />
                  </div>
                  <div>
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">组备注</div>
                    <input
                      v-model="g.note"
                      type="text"
                      class="w-full px-4 py-3 rounded-2xl bg-white border-2 border-transparent focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all shadow-sm"
                      placeholder="组任务说明..."
                    />
                  </div>
                </div>

                <!-- Teams within Group -->
                <div class="flex items-center justify-between gap-4 mb-4">
                  <div class="text-xs font-black text-slate-500 uppercase tracking-wider">包含队伍（最多 2 队）</div>
                  <button
                    v-if="g.teams.length < 2"
                    @click="addTeamToGroup(gIndex)"
                    class="px-3 py-1.5 rounded-lg bg-[#45a6d5] text-white font-black text-xs hover:bg-[#3b95c0] transition-colors shadow-sm"
                    :class="{ 'opacity-20 pointer-events-none': selectedSwap }"
                  >
                    添加队伍
                  </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    v-for="(t, tIndex) in g.teams"
                    :key="t.id"
                    class="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm"
                  >
                    <div class="flex items-center justify-between gap-3 mb-4">
                      <div class="flex items-center gap-2">
                        <div class="font-black text-slate-800 text-sm">{{ t.title || `队伍 ${tIndex + 1}` }}</div>
                        <span class="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                          {{ (t.members || []).filter((m) => m).length }}/4
                        </span>
                      </div>
                      <div class="flex items-center gap-1" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
                        <button
                          class="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30"
                          :disabled="tIndex === 0"
                          @click="moveTeamInGroup(gIndex, tIndex, -1)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button
                          class="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30"
                          :disabled="tIndex === g.teams.length - 1"
                          @click="moveTeamInGroup(gIndex, tIndex, 1)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                        <button
                          class="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors ml-1"
                          @click="removeTeamFromGroup(gIndex, tIndex)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    </div>

                    <div class="space-y-3 mb-4" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
                      <input
                        v-model="t.title"
                        type="text"
                        class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-xs text-slate-700 transition-all"
                        placeholder="队伍名..."
                      />
                    </div>

                    <div class="space-y-2">
                      <div
                        v-for="slotIndex in 4"
                        :key="`slot_${t.id}_${slotIndex}`"
                        class="p-2.5 rounded-xl border bg-white flex items-center justify-between gap-3 group transition-all"
                        :class="slotMember(t, slotIndex - 1) ? (isSelectedSwap(gIndex, tIndex, slotIndex - 1) ? 'ring-2 ring-sky-300 border-sky-200 bg-sky-50/30 cursor-pointer' : 'border-slate-100 hover:border-sky-200 hover:shadow-sm cursor-pointer') : (selectedSwap ? 'ring-2 ring-sky-300 border-dashed border-sky-200 bg-sky-50/30 cursor-pointer' : (t.slot_remarks?.[slotIndex - 1] ? 'bg-emerald-50/20 border-dashed border-emerald-100' : 'bg-rose-50/20 border-dashed border-rose-100'))"
                        @click="handleSlotClick(gIndex, tIndex, slotIndex - 1)"
                      >
                        <template v-if="slotMember(t, slotIndex - 1)">
                          <div class="min-w-0">
                            <div class="flex items-center gap-2">
                              <div class="font-black text-sm truncate text-slate-800">{{ formatNameWithServerShort(slotMember(t, slotIndex - 1)) }}</div>
                              <span class="text-[10px] font-black px-2 py-0.5 rounded shrink-0 bg-slate-100 text-slate-600">
                                {{ slotMember(t, slotIndex - 1).className }}
                              </span>
                              <span class="text-[10px] font-medium shrink-0 text-slate-400">({{ slotMember(t, slotIndex - 1).raceName }})</span>
                            </div>
                            <div class="text-[9px] font-black flex items-center gap-2 mt-0.5 text-[#45a6d5]">
                              <span>战 {{ formatCombatPower(slotMember(t, slotIndex - 1).combatPower) }}</span>
                              <span class="w-1 h-1 rounded-full bg-slate-200"></span>
                              <span>评 {{ slotMember(t, slotIndex - 1).itemLevel || '-' }}</span>
                            </div>
                            <div class="mt-1" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
                              <input
                                v-model="slotMember(t, slotIndex - 1).remark"
                                type="text"
                                class="w-full px-2 py-1 rounded border outline-none font-bold text-[9px] transition-all bg-white/50 border-slate-100 focus:border-sky-300 text-slate-700 placeholder:text-slate-200"
                                placeholder="添加成员备注..."
                                @click.stop
                              />
                            </div>
                            <div class="text-[10px] font-bold mt-1 truncate text-slate-400">
                              {{ formatServerDisplay(slotMember(t, slotIndex - 1).serverId) }} · Lv.{{ slotMember(t, slotIndex - 1).characterLevel }}
                            </div>
                          </div>
                          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" :class="{ 'hidden': selectedSwap }">
                            <button
                              class="p-1 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                              @click.stop="copyText(formatNameWithServerShort(slotMember(t, slotIndex - 1)))"
                              title="复制角色名"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                            <button
                              class="p-1 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                              :class="{ 'animate-spin': refreshingSlots[`${gIndex}-${tIndex}-${slotIndex - 1}`] }"
                              @click.stop="refreshMember(gIndex, tIndex, slotIndex - 1)"
                              title="刷新角色信息"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                            </button>
                            <button
                              class="p-1 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                              :disabled="slotIndex - 1 === 0"
                              @click.stop="moveMember(gIndex, tIndex, slotIndex - 1, -1)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            </button>
                            <button
                              class="p-1 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                              :disabled="slotIndex - 1 === (t.members.length - 1)"
                              @click.stop="moveMember(gIndex, tIndex, slotIndex - 1, 1)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m18 9-6 6-6-6"/></svg>
                            </button>
                            <button
                              class="p-1 rounded-md bg-rose-50 text-rose-500 hover:bg-rose-100"
                              @click.stop="removeMember(gIndex, tIndex, slotIndex - 1)"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="flex-1" :class="{ 'opacity-20 pointer-events-none': selectedSwap }">
                            <input
                              v-model="t.slot_remarks[slotIndex - 1]"
                              type="text"
                              class="w-full px-2 py-1 rounded bg-transparent border-b border-slate-100 focus:border-sky-300 outline-none font-bold text-[10px] text-slate-400 placeholder:text-slate-200"
                              :placeholder="`空位 ${slotIndex} 备注...`"
                              @click.stop
                            />
                          </div>
                          <div class="text-[10px] font-black text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" :class="{ 'hidden': selectedSwap }">添加 +</div>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div v-if="g.teams.length === 0" class="lg:col-span-2 py-12 text-center text-slate-300 font-bold border-2 border-dashed border-slate-100 rounded-3xl bg-white/50">
                    暂无队伍，点击上方按钮添加
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="pickerOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
        <div class="relative z-10 w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div class="font-black text-slate-800 text-lg">选择队员</div>
            <button
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
              @click="pickerOpen = false"
            >
              关闭
            </button>
          </div>

          <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scroll">
            <div class="flex items-center gap-2 flex-wrap">
              <button
                @click="pickerTab = 'legion'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="pickerTab === 'legion' ? 'bg-[#45a6d5] text-white border-[#45a6d5]' : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'"
              >
                军团成员
              </button>
              <button
                @click="pickerTab = 'search'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="pickerTab === 'search' ? 'bg-[#45a6d5] text-white border-[#45a6d5]' : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'"
              >
                查询角色
              </button>
              <button
                @click="pickerTab = 'manual'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="pickerTab === 'manual' ? 'bg-[#45a6d5] text-white border-[#45a6d5]' : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'"
              >
                手动输入
              </button>
            </div>

            <div v-if="pickerTab === 'legion'" class="space-y-3">
              <div class="flex items-center gap-2">
                <input
                  v-model="legionKeyword"
                  class="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="搜索军团成员..."
                />
                <button
                  class="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  :disabled="legionLoading"
                  @click="fetchLegionMembers"
                >
                  {{ legionLoading ? '刷新中...' : '刷新' }}
                </button>
              </div>

              <div class="max-h-[45vh] overflow-y-auto custom-scroll space-y-2">
                <div
                  v-for="m in filteredLegionMembers"
                  :key="m.character_id"
                  class="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  @click="pickFromLegion(m)"
                >
                  <div class="min-w-0">
                    <div class="font-black text-slate-800 truncate">{{ m.name }}</div>
                    <div class="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{{ formatServerDisplay(m.server_id || 0) }}</span>
                      <span>{{ m.class_name }}</span>
                      <span>Lv.{{ m.level }}</span>
                    </div>
                  </div>
                  <div class="text-xs font-black text-sky-600 shrink-0">选择</div>
                </div>
                <div v-if="!legionLoading && filteredLegionMembers.length === 0" class="py-8 text-center text-slate-400 font-bold">
                  暂无结果
                </div>
              </div>
            </div>

            <div v-else-if="pickerTab === 'search'" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  v-model.number="searchRaceId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option :value="1">天族</option>
                  <option :value="2">魔族</option>
                </select>
                <select
                  v-model.number="searchServerId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option v-for="s in searchServerOptions" :key="s.serverId" :value="s.serverId">
                    {{ formatServerDisplay(s.serverId) }}
                  </option>
                </select>
                <input
                  v-model="searchKeyword"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="输入角色名关键词..."
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="searchQuick"
                  class="px-4 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all"
                  placeholder="快捷粘贴：角色名[区服简写]（例如 xxx[简卡]）"
                />
                <button
                  class="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  @click="applyQuickToSearchAndSearch"
                >
                  解析并查询
                </button>
              </div>
              <div class="flex items-center justify-end">
                <button
                  class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors disabled:opacity-50"
                  :disabled="searchLoading"
                  @click="searchCharacters"
                >
                  {{ searchLoading ? '查询中...' : '查询' }}
                </button>
              </div>

              <div v-if="searchLoading" class="py-10 text-center text-slate-400 font-bold">查询中...</div>
              <div v-else class="max-h-[45vh] overflow-y-auto custom-scroll space-y-2">
                <div
                  v-for="c in searchResults"
                  :key="c.characterId"
                  class="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  @click="pickFromSearch(c)"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="font-black text-slate-800 truncate" v-html="c.name"></div>
                      <div class="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{{ formatServerDisplay(c.serverId) }}</span>
                        <span>{{ c.race === 1 ? '天族' : '魔族' }}</span>
                        <span>Lv.{{ c.level }}</span>
                      </div>
                    </div>
                    <div class="text-xs font-black text-sky-600 shrink-0">选择</div>
                  </div>
                </div>
                <div v-if="searchedOnce && searchResults.length === 0" class="py-8 text-center text-slate-400 font-bold">暂无结果</div>
              </div>
            </div>

            <div v-else class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  v-model.number="manualRaceId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option :value="1">天族</option>
                  <option :value="2">魔族</option>
                </select>
                <select
                  v-model.number="manualServerId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option v-for="s in manualServerOptions" :key="s.serverId" :value="s.serverId">
                    {{ formatServerDisplay(s.serverId) }}
                  </option>
                </select>
                <input
                  v-model="manualName"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="输入完整角色名..."
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="manualQuick"
                  class="px-4 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all"
                  placeholder="快捷粘贴：角色名[区服简写]（例如 問號[奎靈]）"
                />
                <button
                  class="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  @click="applyQuickToManual"
                >
                  解析
                </button>
              </div>
              <div class="flex items-center justify-end">
                <button
                  class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors disabled:opacity-50"
                  :disabled="manualLoading"
                  @click="manualValidate"
                >
                  {{ manualLoading ? '验证中...' : '验证并添加' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { formatServerDisplay, getServerShortNameById, getServersByRace, parseNameWithServerShort } from '~/utils/aionServers'
import { formatCombatPower } from '~/utils/formatCombatPower'

definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const { $alert, $confirm, $loading } = useNuxtApp()

const loading = ref(false)
const saving = ref(false)
const plans = ref([])
const viewerId = ref(null)

const viewMode = ref('mine')
const searchText = ref('')

const editorOpen = ref(false)
const editingId = ref(null)
const form = ref({ title: '', start_at: '', notes: '', groups: [], is_public: false, tags: [] })
const tagInput = ref('')

const statusOpen = ref(false)
const statusSaving = ref(false)
const statusTarget = ref(null)

const formatNameWithServerShort = (m) => {
  const name = String(m?.characterName || '').trim()
  const sid = Number(m?.serverId)
  const short = String(m?.serverShortName || getServerShortNameById(sid) || '').trim()
  if (!name) return ''
  if (!short) return name
  return `${name}[${short}]`
}

const copyText = async (text) => {
  const v = String(text || '').trim()
  if (!v) return
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(v)
    } else {
      const el = document.createElement('textarea')
      el.value = v
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      el.style.top = '-9999px'
      document.body.appendChild(el)
      el.focus()
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    $alert('已复制', v)
  } catch (e) {
    $alert('复制失败', e?.message || String(e))
  }
}

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

const toLocalInput = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

const fromLocalInput = (v) => {
  if (!v) return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

const formatLocalInput = (d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

const roundUpMinutes = (d, step) => {
  const date = new Date(d)
  const ms = step * 60 * 1000
  return new Date(Math.ceil(date.getTime() / ms) * ms)
}

const setStartAtPreset = (type) => {
  const now = new Date()
  if (type === 'next') {
    form.value.start_at = formatLocalInput(roundUpMinutes(now, 60))
    return
  }

  const base = new Date(now)
  base.setSeconds(0, 0)
  if (type === 'today20') {
    base.setHours(20, 0, 0, 0)
    if (base.getTime() < now.getTime()) base.setDate(base.getDate() + 1)
    form.value.start_at = formatLocalInput(base)
    return
  }
  if (type === 'tomorrow20') {
    base.setDate(base.getDate() + 1)
    base.setHours(20, 0, 0, 0)
    form.value.start_at = formatLocalInput(base)
    return
  }
  if (type === 'sat20') {
    const day = base.getDay()
    const delta = (6 - day + 7) % 7
    base.setDate(base.getDate() + (delta === 0 ? 7 : delta))
    base.setHours(20, 0, 0, 0)
    form.value.start_at = formatLocalInput(base)
    return
  }
}

const startAtPreview = computed(() => {
  const iso = fromLocalInput(form.value.start_at)
  if (!iso) return '-'
  return formatDateTime(iso)
})

const normalizeTags = (raw) => {
  const list = String(raw || '')
    .split(/[,，\s]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
  return Array.from(new Set(list)).slice(0, 10)
}

watch(
  () => form.value.is_public,
  (v) => {
    if (!v) tagInput.value = ''
  },
)

const filteredPlans = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return plans.value
  return plans.value.filter((p) => {
    const title = String(p.title || '').toLowerCase()
    const notes = String(p.notes || '').toLowerCase()
    const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : ''
    return title.includes(q) || notes.includes(q) || tags.includes(q)
  })
})

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

const planCardClass = (p) => {
  if (p.status === 'completed') return 'border-emerald-200 bg-emerald-50/40 hover:shadow-md hover:border-emerald-300'
  if (p.status === 'overdue') return 'border-amber-200 bg-amber-50/40 hover:shadow-md hover:border-amber-300'
  if (p.status === 'canceled') return 'border-rose-200 bg-rose-50/30 opacity-80 hover:shadow-md hover:border-rose-300'
  return 'border-slate-100 hover:shadow-md hover:border-sky-200'
}

const canEdit = (p) => {
  if (!viewerId.value) return true
  return !p.created_by || p.created_by === viewerId.value
}

const setViewMode = (mode) => {
  if (viewMode.value === mode) return
  viewMode.value = mode
  fetchPlans()
}

const fetchPlans = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/dungeon-plans', { query: { limit: 50, view: viewMode.value } })
    plans.value = res?.success ? (res.data || []) : []
    viewerId.value = res?.viewer?.id || null
  } catch (e) {
    plans.value = []
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingId.value = null
  form.value = { title: '', start_at: formatLocalInput(roundUpMinutes(new Date(), 60)), notes: '', groups: [], is_public: false, tags: [] }
  tagInput.value = ''
  editorOpen.value = true
}

const openEdit = (p) => {
  editingId.value = p.id
  
  // 适配旧数据：如果只有 teams 没有 groups，则将 teams 包装到默认组中
  let groups = []
  if (Array.isArray(p.groups)) {
    groups = p.groups.map((g, idx) => ({
      id: g.id || `group_${idx}_${Date.now()}`,
      title: g.title || '',
      note: g.note || '',
      teams: Array.isArray(g.teams)
        ? g.teams.map((t, j) => {
            const members = [null, null, null, null]
            if (Array.isArray(t.members)) {
              t.members.forEach((m, k) => {
                if (k < 4) {
                  members[k] = {
                    ...m,
                    key: m.key || `m_${idx}_${j}_${k}_${Date.now()}`,
                    remark: m.remark || '',
                  }
                }
              })
            }
            return {
              id: t.id || `team_${idx}_${j}_${Date.now()}`,
              title: t.title || '',
              note: t.note || '',
              slot_remarks: Array.isArray(t.slot_remarks) ? t.slot_remarks : ['', '', '', ''],
              members,
            }
          })
        : [],
    }))
  } else if (Array.isArray(p.teams)) {
    groups = [
      {
        id: `group_migrated_${Date.now()}`,
        title: '默认组',
        note: '从旧版本迁移',
        teams: p.teams.map((t, idx) => {
          const members = [null, null, null, null]
          if (Array.isArray(t.members)) {
            t.members.forEach((m, j) => {
              if (j < 4) {
                members[j] = {
                  ...m,
                  key: m.key || `m_${idx}_${j}_${Date.now()}`,
                  remark: m.remark || '',
                }
              }
            })
          }
          return {
            id: t.id || `team_${idx}_${Date.now()}`,
            title: t.title || '',
            note: t.note || '',
            slot_remarks: Array.isArray(t.slot_remarks) ? t.slot_remarks : ['', '', '', ''],
            members,
          }
        }),
      },
    ]
  }

  form.value = {
    title: p.title || '',
    start_at: toLocalInput(p.start_at),
    notes: p.notes || '',
    is_public: !!p.is_public,
    tags: Array.isArray(p.tags) ? p.tags : [],
    groups,
  }
  tagInput.value = Array.isArray(p.tags) ? p.tags.join(',') : ''
  editorOpen.value = true
}

const savePlan = async () => {
  const title = String(form.value.title || '').trim()
  const startAt = fromLocalInput(form.value.start_at)
  if (!title) {
    $alert('提示', '请填写标题')
    return
  }
  if (!startAt) {
    $alert('提示', '请选择时间')
    return
  }

  saving.value = true
  $loading.show('正在保存...')
  try {
    const payload = {
      title,
      start_at: startAt,
      notes: form.value.notes || null,
      is_public: !!form.value.is_public,
      tags: form.value.is_public ? normalizeTags(tagInput.value) : [],
      groups: (form.value.groups || []).map((g, idx) => ({
        id: g.id || `group_${idx}_${Date.now()}`,
        title: g.title || '',
        note: g.note || '',
        teams: (g.teams || []).map((t, j) => ({
          id: t.id || `team_${idx}_${j}_${Date.now()}`,
          title: t.title || '',
          note: t.note || '',
          slot_remarks: Array.isArray(t.slot_remarks) ? t.slot_remarks : ['', '', '', ''],
          members: (t.members || []).slice(0, 4).map((m) => {
            if (!m) return null
            return {
              key: m.key,
              characterId: m.characterId,
              characterName: m.characterName,
              serverId: m.serverId,
              serverName: m.serverName,
              serverShortName: m.serverShortName || getServerShortNameById(m.serverId),
              raceId: m.raceId,
              raceName: m.raceName,
              className: m.className,
              characterLevel: m.characterLevel,
              combatPower: m.combatPower,
              itemLevel: m.itemLevel,
              remark: m.remark || null,
            }
          }),
        })),
      })),
    }

    if (editingId.value) {
      const res = await $fetch(`/api/dungeon-plans/${editingId.value}`, { method: 'PUT', body: payload })
      if (!res?.success) throw new Error(res?.error || '保存失败')
    } else {
      const res = await $fetch('/api/dungeon-plans', { method: 'POST', body: payload })
      if (!res?.success) throw new Error(res?.error || '保存失败')
    }

    editorOpen.value = false
    await fetchPlans()
    $alert('保存成功', '副本计划已更新')
  } catch (e) {
    $alert('保存失败', e?.message || String(e))
  } finally {
    $loading.hide()
    saving.value = false
  }
}

const removePlan = async (p) => {
  const ok = await $confirm('删除确认', `确定删除计划「${p.title}」吗？`)
  if (!ok) return
  $loading.show('正在删除...')
  try {
    const res = await $fetch(`/api/dungeon-plans/${p.id}`, { method: 'DELETE' })
    if (!res?.success) throw new Error(res?.error || '删除失败')
    await fetchPlans()
  } catch (e) {
    $alert('删除失败', e?.message || String(e))
  } finally {
    $loading.hide()
  }
}

const openStatus = (p) => {
  statusTarget.value = p
  statusOpen.value = true
}

const setStatus = async (status) => {
  if (!statusTarget.value?.id) return
  statusSaving.value = true
  $loading.show('正在更新状态...')
  try {
    const body = { status }
    if (status === 'completed') {
      body.completed_at = new Date().toISOString()
    } else if (status !== 'completed') {
      body.completed_at = null
    }

    const res = await $fetch(`/api/dungeon-plans/${statusTarget.value.id}`, { method: 'PUT', body })
    if (!res?.success) throw new Error(res?.error || '更新失败')

    statusOpen.value = false
    await fetchPlans()

    if (status === 'overdue') {
      const ok = await $confirm('逾期提示', '已标记为逾期，是否现在重新安排时间？')
      if (ok) {
        const updated = plans.value.find((x) => x.id === statusTarget.value.id)
        if (updated) openEdit(updated)
      }
    }
    if (status === 'canceled') {
      const ok = await $confirm('作废提示', '已作废，是否删除该编排？')
      if (ok) {
        await removePlan(statusTarget.value)
      }
    }
  } catch (e) {
    $alert('更新失败', e?.message || String(e))
  } finally {
    $loading.hide()
    statusSaving.value = false
  }
}

const addGroup = () => {
  form.value.groups.push({ id: `group_${Date.now()}`, title: '', note: '', teams: [] })
}

const removeGroup = (gIndex) => {
  form.value.groups.splice(gIndex, 1)
}

const moveGroup = (gIndex, delta) => {
  const next = gIndex + delta
  if (next < 0 || next >= form.value.groups.length) return
  const arr = form.value.groups
  const tmp = arr[gIndex]
  arr[gIndex] = arr[next]
  arr[next] = tmp
}

const addTeamToGroup = (gIndex) => {
  const group = form.value.groups[gIndex]
  if (!group) return
  if (group.teams.length >= 2) {
    $alert('提示', '每组最多只能有 2 个队伍')
    return
  }
  group.teams.push({ id: `team_${Date.now()}`, title: '', note: '', members: [null, null, null, null], slot_remarks: ['', '', '', ''] })
}

const removeTeamFromGroup = (gIndex, tIndex) => {
  const group = form.value.groups[gIndex]
  if (!group) return
  group.teams.splice(tIndex, 1)
}

const moveTeamInGroup = (gIndex, tIndex, delta) => {
  const group = form.value.groups[gIndex]
  if (!group) return
  const next = tIndex + delta
  if (next < 0 || next >= group.teams.length) return
  const arr = group.teams
  const tmp = arr[tIndex]
  arr[tIndex] = arr[next]
  arr[next] = tmp
}

const moveMember = (gIndex, tIndex, mIndex, delta) => {
  const team = form.value.groups[gIndex]?.teams[tIndex]
  const next = mIndex + delta
  if (!team || next < 0 || next >= 4) return
  const arr = team.members
  const tmp = arr[mIndex]
  arr[mIndex] = arr[next]
  arr[next] = tmp
}

const removeMember = (gIndex, tIndex, mIndex) => {
  const team = form.value.groups[gIndex]?.teams[tIndex]
  if (!team) return
  team.members[mIndex] = null
}

const selectedSwap = ref(null)
const refreshingSlots = ref({})

const slotMember = (team, index) => {
  return team?.members?.[index] || null
}

const isSelectedSwap = (gIndex, tIndex, mIndex) => {
  return !!selectedSwap.value && 
         selectedSwap.value.gIndex === gIndex && 
         selectedSwap.value.tIndex === tIndex && 
         selectedSwap.value.mIndex === mIndex
}

const handleSlotClick = (gIndex, tIndex, mIndex) => {
  if (selectedSwap.value || slotMember(form.value.groups[gIndex]?.teams[tIndex], mIndex)) {
    onSwapClick(gIndex, tIndex, mIndex)
  } else {
    openPicker(gIndex, tIndex, mIndex)
  }
}

const refreshMember = async (gIndex, tIndex, mIndex) => {
  const team = form.value.groups[gIndex]?.teams[tIndex]
  const member = team?.members?.[mIndex]
  if (!member) return

  const key = `${gIndex}-${tIndex}-${mIndex}`
  if (refreshingSlots.value[key]) return
  refreshingSlots.value[key] = true

  try {
    const updated = await fetchCharacterInfo(member.characterId, member.serverId)
    if (updated) {
      team.members[mIndex] = {
        ...team.members[mIndex],
        characterName: updated.characterName,
        className: updated.className,
        characterLevel: updated.characterLevel,
        combatPower: updated.combatPower,
        itemLevel: updated.itemLevel,
        raceId: updated.raceId,
        raceName: updated.raceName,
        serverId: updated.serverId,
        serverName: updated.serverName,
        serverShortName: getServerShortNameById(updated.serverId),
      }
    }
  } catch (e) {
    $alert('刷新失败', e?.message || String(e))
  } finally {
    delete refreshingSlots.value[key]
  }
}

const onSwapClick = (gIndex, tIndex, mIndex) => {
  const team = form.value.groups[gIndex]?.teams[tIndex]
  const member = team?.members?.[mIndex]

  if (!selectedSwap.value) {
    if (!member) return
    selectedSwap.value = { gIndex, tIndex, mIndex, name: member.characterName }
    return
  }

  if (selectedSwap.value.gIndex === gIndex && selectedSwap.value.tIndex === tIndex && selectedSwap.value.mIndex === mIndex) {
    selectedSwap.value = null
    return
  }

  const aTeam = form.value.groups[selectedSwap.value.gIndex]?.teams[selectedSwap.value.tIndex]
  const bTeam = form.value.groups[gIndex]?.teams[tIndex]
  
  if (!aTeam || !bTeam) {
    selectedSwap.value = null
    return
  }

  const tmp = aTeam.members[selectedSwap.value.mIndex]
  aTeam.members[selectedSwap.value.mIndex] = bTeam.members[mIndex]
  bTeam.members[mIndex] = tmp

  selectedSwap.value = null
}

const pickerOpen = ref(false)
const pickerGroupIndex = ref(-1)
const pickerTeamIndex = ref(-1)
const pickerMemberIndex = ref(-1)
const pickerTab = ref('legion')

const openPicker = async (gIndex, tIndex, mIndex = -1) => {
  pickerGroupIndex.value = gIndex
  pickerTeamIndex.value = tIndex
  pickerMemberIndex.value = mIndex
  pickerTab.value = 'legion'
  pickerOpen.value = true
  await fetchLegionMembers()
}

const legionLoading = ref(false)
const legionMembers = ref([])
const legionKeyword = ref('')

const fetchLegionMembers = async () => {
  legionLoading.value = true
  try {
    const { data } = await supabase
      .from('legion_members')
      .select('character_id,name,server_id,server_name,race_id,race_name,level,class_name')
      .order('updated_at', { ascending: false })
      .limit(200)
    legionMembers.value = data || []
  } finally {
    legionLoading.value = false
  }
}

const filteredLegionMembers = computed(() => {
  const kw = legionKeyword.value.trim().toLowerCase()
  if (!kw) return legionMembers.value
  return legionMembers.value.filter((m) => String(m.name || '').toLowerCase().includes(kw))
})

const searchRaceId = ref(2)
const searchServerId = ref(2015)
const searchServerOptions = computed(() => getServersByRace(searchRaceId.value))
watch(searchRaceId, () => {
  const list = searchServerOptions.value
  searchServerId.value = list[0]?.serverId || (searchRaceId.value === 1 ? 1001 : 2001)
})

const searchKeyword = ref('')
const searchQuick = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const searchedOnce = ref(false)

const applyQuickToSearch = () => {
  const parsed = parseNameWithServerShort(searchQuick.value)
  if (!parsed) {
    $alert('格式提示', '请输入例如：問號[奎靈]')
    return null
  }
  searchRaceId.value = parsed.raceId
  searchServerId.value = parsed.serverId
  searchKeyword.value = parsed.keyword
  searchQuick.value = ''
  return parsed
}

const applyQuickToSearchAndSearch = async () => {
  const parsed = applyQuickToSearch()
  if (!parsed) return
  await searchCharacters()
}

const searchCharacters = async () => {
  if (!searchKeyword.value.trim()) return
  searchLoading.value = true
  searchedOnce.value = true
  try {
    const embedded = parseNameWithServerShort(searchKeyword.value)
    if (embedded) {
      searchQuick.value = searchKeyword.value
      applyQuickToSearch()
    }
    const res = await $fetch('/api/aion/search', { query: { keyword: searchKeyword.value, race: searchRaceId.value, serverId: searchServerId.value, page: 1, size: 30 } })
    searchResults.value = res?.list || []
  } catch {
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const manualRaceId = ref(2)
const manualServerId = ref(2015)
const manualServerOptions = computed(() => getServersByRace(manualRaceId.value))
watch(manualRaceId, () => {
  const list = manualServerOptions.value
  manualServerId.value = list[0]?.serverId || (manualRaceId.value === 1 ? 1001 : 2001)
})
const manualName = ref('')
const manualQuick = ref('')
const manualLoading = ref(false)

const applyQuickToManual = () => {
  const parsed = parseNameWithServerShort(manualQuick.value)
  if (!parsed) {
    $alert('格式提示', '请输入例如：問號[奎靈]')
    return null
  }
  manualRaceId.value = parsed.raceId
  manualServerId.value = parsed.serverId
  manualName.value = parsed.keyword
  manualQuick.value = ''
  return parsed
}

const fetchCharacterInfo = async (characterId, serverId) => {
  const detail = await $fetch('/api/aion/info', { params: { characterId, serverId } })
  const profile = detail?.profile
  if (!profile) throw new Error('角色信息不存在')
  const itemLevel = detail?.stat?.statList?.find((x) => x?.type === 'ItemLevel')?.value
  return { ...profile, itemLevel }
}

const addMemberToTeam = (profile) => {
  const gIndex = pickerGroupIndex.value
  const tIndex = pickerTeamIndex.value
  const mIndex = pickerMemberIndex.value
  const team = form.value.groups[gIndex]?.teams[tIndex]
  if (!team) return

  const targetIndex = mIndex >= 0 ? mIndex : team.members.findIndex((m) => m === null)
  if (targetIndex === -1) {
    $alert('提示', '每队最多 4 人')
    return
  }

  const exists = form.value.groups.some((g) => (g.teams || []).some((t) => (t.members || []).some((m) => m && m.characterId === profile.characterId)))
  if (exists) {
    $alert('提示', '该角色已在计划中')
    return
  }

  team.members[targetIndex] = {
    key: `m_${Date.now()}`,
    characterId: profile.characterId,
    characterName: profile.characterName,
    serverId: profile.serverId,
    serverName: profile.serverName,
    serverShortName: getServerShortNameById(profile.serverId),
    raceId: profile.raceId,
    raceName: profile.raceName,
    className: profile.className,
    characterLevel: profile.characterLevel,
    combatPower: profile.combatPower,
    itemLevel: profile.itemLevel,
    remark: '',
  }

  pickerOpen.value = false
}

const pickFromLegion = async (m) => {
  $loading.show('正在获取角色信息...')
  try {
    const profile = await fetchCharacterInfo(m.character_id, m.server_id)
    addMemberToTeam(profile)
  } catch (e) {
    $alert('添加失败', e?.message || String(e))
  } finally {
    $loading.hide()
  }
}

const pickFromSearch = async (c) => {
  $loading.show('正在获取角色信息...')
  try {
    const profile = await fetchCharacterInfo(c.characterId, c.serverId)
    addMemberToTeam(profile)
  } catch (e) {
    $alert('添加失败', e?.message || String(e))
  } finally {
    $loading.hide()
  }
}

const manualValidate = async () => {
  const embedded = parseNameWithServerShort(manualName.value)
  if (embedded) {
    manualQuick.value = manualName.value
    applyQuickToManual()
  }
  const name = manualName.value.trim()
  if (!name) return
  manualLoading.value = true
  $loading.show('正在验证角色...')
  try {
    const res = await $fetch('/api/aion/search', { query: { keyword: name, race: manualRaceId.value, serverId: manualServerId.value, page: 1, size: 30 } })
    const list = res?.list || []
    const exact = list.find((x) => String(x.name || '').replace(/<[^>]+>/g, '') === name) || list[0]
    if (!exact) throw new Error('角色不存在')
    const profile = await fetchCharacterInfo(exact.characterId, exact.serverId)
    addMemberToTeam(profile)
    manualName.value = ''
  } catch (e) {
    $alert('验证失败', e?.message || String(e))
  } finally {
    $loading.hide()
    manualLoading.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

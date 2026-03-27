<template>
  <div class="h-full flex flex-col gap-6 overflow-y-auto custom-scroll pb-6">
    <!-- 上方：已保存列表 -->
    <div class="shrink-0" v-if="user || savedView === 'public'">
      <div
        class="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden"
      >
        <div
          class="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-4"
        >
          <div class="flex items-center gap-3">
            <h4 class="font-black text-slate-800 flex items-center gap-2">
              <span>📋</span> 已保存的计算
            </h4>
            <div class="flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-100" v-if="user">
              <button
                class="px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                :class="savedView === 'mine' ? 'bg-sky-500 text-white' : 'text-slate-500 hover:bg-slate-50'"
                @click="savedView = 'mine'"
              >
                我的
              </button>
              <button
                class="px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                :class="savedView === 'public' ? 'bg-sky-500 text-white' : 'text-slate-500 hover:bg-slate-50'"
                @click="savedView = 'public'"
              >
                公开
              </button>
            </div>
          </div>
          <span class="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-1 rounded-lg self-start sm:self-auto">
            {{ savedList.length }} 条
          </span>
        </div>

        <div class="p-4 overflow-x-auto custom-scroll">
          <div v-if="!user && savedView === 'mine'" class="text-center py-6">
            <div class="text-2xl mb-2 opacity-20">🔒</div>
            <p class="text-xs text-slate-400 font-bold">登录后可查看我的保存</p>
          </div>
          <div
            v-else-if="loadingSaved"
            class="flex flex-col items-center justify-center py-6 gap-3"
          >
            <div
              class="w-6 h-6 border-3 border-slate-100 border-t-sky-500 rounded-full animate-spin"
            ></div>
            <span class="text-[10px] font-black text-slate-400">加载中...</span>
          </div>
          <div v-else-if="savedList.length === 0" class="text-center py-6">
            <div class="text-2xl mb-2 opacity-20">📭</div>
            <p class="text-xs text-slate-400 font-bold">暂无保存记录</p>
          </div>
          <div v-else class="flex gap-4 pb-2">
            <div
              v-for="item in savedList"
              :key="item.id"
              class="shrink-0 w-64 group p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-sky-100 hover:bg-white transition-all relative flex flex-col"
            >
              <div class="flex justify-between items-start mb-2">
                <h5 class="font-black text-slate-800 text-sm truncate pr-6">
                  {{ item.equipment_name }}
                </h5>
                <div class="absolute top-4 right-4 flex items-center gap-2">
                  <span
                    class="text-[10px] font-black px-2 py-1 rounded-lg"
                    :class="item.is_public ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ item.is_public ? '公开' : '仅我' }}
                  </span>
                  <button
                    v-if="item.user_id && user?.id && item.user_id === user.id"
                    @click="deleteSaved(item.id)"
                    class="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div v-if="!user" class="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-400 rounded-xl font-black text-sm text-center flex items-center justify-center border-2 border-slate-200 mt-2">
                    登录后可记录历史
                  </div>
                </div>
              </div>
              <p
                class="text-xs text-slate-500 font-medium line-clamp-2 mb-3 bg-white/50 p-2 rounded-lg flex-1"
                v-if="item.remark"
              >
                {{ item.remark }}
              </p>
              <div class="flex items-center justify-between mt-auto pt-2">
                <span class="text-[10px] text-slate-400 font-bold">{{
                  formatDate(item.created_at)
                }}</span>
                <button
                  @click="loadSaved(item)"
                  class="text-[10px] font-black text-sky-500 hover:underline flex items-center gap-1"
                >
                  <div class="flex items-center gap-1">
                    <svg
                      t="1774493289480"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="26700"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M750.933333 1024H273.066667C122.197333 1024 0 901.802667 0 750.933333V273.066667C0 122.197333 122.197333 0 273.066667 0h477.866666c150.869333 0 273.066667 122.197333 273.066667 273.066667v477.866666c0 150.869333-122.197333 273.066667-273.066667 273.066667z"
                        fill="#E7E8FF"
                        p-id="26701"
                      ></path>
                      <path
                        d="M665.6 768H358.4c-56.490667 0-102.4-45.909333-102.4-102.4V358.4c0-56.490667 45.909333-102.4 102.4-102.4h307.2c56.490667 0 102.4 45.909333 102.4 102.4v307.2c0 56.490667-45.909333 102.4-102.4 102.4z"
                        fill="#8E9EFF"
                        p-id="26702"
                      ></path>
                      <path
                        d="M499.029333 354.645333h34.133334v238.933334h-34.133334z"
                        fill="#FFFFFF"
                        p-id="26703"
                      ></path>
                      <path
                        d="M588.168533 490.581333l24.132267 24.149334-96.546133 96.529066-24.132267-24.132266z"
                        fill="#FFFFFF"
                        p-id="26704"
                      ></path>
                      <path
                        d="M538.897067 587.195733l-24.132267 24.149334-96.546133-96.546134 24.132266-24.132266zM379.562667 653.312h273.066666v34.133333h-273.066666z"
                        fill="#FFFFFF"
                        p-id="26705"
                      ></path>
                    </svg>
                    <span> 点击加载</span>
                  </div>
                </button>
                  <div v-if="!user" class="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-400 rounded-xl font-black text-sm text-center flex items-center justify-center border-2 border-slate-200 mt-2">
                    登录后可记录历史
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>

    <!-- 下方：计算器主体 -->
    <div class="flex-1 flex flex-col gap-6 min-h-0">
      <!-- 装备选择区 -->
      <div class="space-y-4 shrink-0">
        <div
          class="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div class="relative flex-1">
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              >🔍</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索装备名称..."
              class="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
            />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-1 md:pb-0 items-center">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              class="px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2"
              :class="
                selectedCategory === cat
                  ? 'bg-[#45a6d5] text-white border-[#45a6d5]'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-[#E6F7FF]'
              "
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- 装备网格 -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"
            ></div>
            <span class="text-sky-800 font-black text-xs">加载中...</span>
          </div>
        </div>

        <div
          v-else-if="filteredEquipment.length === 0"
          class="flex flex-col items-center justify-center py-8 text-slate-400"
        >
          <span class="text-2xl mb-2">📦</span>
          <span class="font-bold text-sm">未找到相关装备</span>
        </div>

        <div v-else class="flex gap-4 overflow-x-auto custom-scroll pb-4 px-1">
          <div
            v-for="eq in filteredEquipment"
            :key="eq.id"
            @click="selectEquipment(eq)"
            class="shrink-0 w-48 group p-4 bg-white rounded-3xl border-2 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg"
            :class="
              selectedEq?.id === eq.id
                ? 'border-[#f9b11d] bg-white shadow-md'
                : 'border-slate-50 hover:border-sky-200'
            "
          >
            <div class="flex items-start justify-between mb-2">
              <div
                class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
              >
                {{
                  eq.category === "武器"
                    ? "⚔️"
                    : eq.category === "防具"
                      ? "🛡️"
                      : "💍"
                }}
              </div>
              <span
                class="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest"
              >
                {{ eq.category }}
              </span>
            </div>
            <h4 class="font-black text-slate-800 text-sm truncate mb-1">
              {{ eq.name }}
            </h4>
            <div class="text-[10px] font-bold text-slate-400">
              {{ eq.materials.length }} 种材料
            </div>
          </div>
        </div>
      </div>

      <!-- 详情 & 计算区 -->
      <div
        class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative shrink-0"
      >
        <!-- 面板头部与汇率 -->
        <div
          class="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0"
        >
          <div v-if="selectedEq" class="relative z-10">
            <div
              class="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-1"
            >
              Cost Analysis
            </div>
            <h3
              class="text-2xl md:text-3xl font-black text-slate-800 leading-tight"
            >
              {{ selectedEq.name }}
            </h3>
          </div>
          <div v-else class="relative z-10">
            <div
              class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1"
            >
              Select Item
            </div>
            <h3 class="text-xl font-black text-slate-300">
              请选择上方一件装备查看详情
            </h3>
          </div>

          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto z-10"
          >
            <div
              class="bg-white px-5 py-3 rounded-2xl border-2 flex flex-col gap-2 shadow-sm w-full md:w-auto"
              :class="isKinahRateValid ? 'border-slate-100' : 'border-rose-200 bg-rose-50/40'"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-slate-700 whitespace-nowrap"
                    >当前基纳汇率</span
                  >
                  <span class="text-[10px] font-black text-rose-500" v-if="!isKinahRateValid">必填</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-500">1 元 = </span>
                  <div class="relative">
                    <input
                      type="number"
                      v-model.number="kinahRate"
                      min="0"
                      step="0.0001"
                      inputmode="decimal"
                      placeholder="必填"
                      class="w-28 px-3 py-2 bg-white border-2 rounded-xl text-right font-mono text-base font-black focus:bg-white outline-none transition-all"
                      :class="isKinahRateValid ? 'border-sky-100 text-sky-700 focus:border-[#45a6d5]' : 'border-rose-300 text-rose-600 focus:border-rose-400'"
                    />
                    <span
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"
                      >万</span
                    >
                  </div>
                </div>
              </div>
              <div v-if="!isKinahRateValid" class="text-[10px] font-bold text-rose-600">
                请输入“1元等于多少万基纳”，否则无法保存或记录
              </div>
              <div
                v-if="bestCompareRate"
                class="text-[10px] font-bold text-slate-500 flex items-center justify-between gap-3"
              >
                <span class="truncate">
                  最划算：1元 = {{ bestCompareRate }}万（{{ bestComparePlatform }}）
                </span>
                <button
                  v-if="Number(bestCompareRate) > 0 && Number(kinahRate) !== Number(bestCompareRate)"
                  type="button"
                  class="shrink-0 text-[10px] font-black text-sky-600 hover:underline"
                  @click="applyBestCompareRate"
                >
                  使用
                </button>
              </div>
            </div>
            <button
              v-if="selectedEq"
              @click="clearCurrent(true)"
              class="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-rose-200 bg-white text-rose-600 font-black text-xs hover:bg-rose-50 transition-colors"
            >
              清空当前
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div v-if="selectedEq" class="flex flex-col">
          <div class="p-6 md:p-8">
            <div class="flex justify-between items-center px-2 mb-4">
              <span
                class="text-xs font-black text-slate-400 uppercase tracking-widest"
                >所需材料明细</span
              >
              <span class="text-[10px] font-bold text-sky-500"
                >手动输入持有量与单价</span
              >
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <div
                v-for="req in selectedEq.materials"
                :key="req.materialId"
                class="p-5 bg-white rounded-[2rem] border-2 border-slate-50 group hover:border-[#45a6d5]/40 hover:shadow-md transition-all duration-300"
                :class="{
                  'bg-emerald-50/20 border-emerald-100':
                    (userOwned[req.materialId] || 0) >= req.count,
                }"
              >
                <div class="flex justify-between items-start mb-4">
                  <div
                    class="font-black text-slate-800 text-lg leading-tight truncate pr-4 flex-1 flex items-center"
                    :title="getMaterial(req.materialId)?.name"
                  >
                    <span
                      v-if="(userOwned[req.materialId] || 0) >= req.count"
                      class="mr-1"
                    >
                      <svg
                        t="1774491515895"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="7316"
                        width="40"
                        height="40"
                      >
                        <path
                          d="M616 926.1H409c-171.5 0-310.4-139-310.4-310.4v-207c0-171.5 139-310.4 310.4-310.4h207c171.5 0 310.4 139 310.4 310.4v207c0 171.4-139 310.4-310.4 310.4z"
                          fill="#D8F6F0"
                          p-id="7317"
                        ></path>
                        <path
                          d="M364 655.8h-32.8c-21 0-37.9-17-37.9-37.9v-15.5c0-21 17-37.9 37.9-37.9H364c21 0 37.9 17 37.9 37.9v15.5c0 20.9-17 37.9-37.9 37.9zM364 509.2h-32.8c-21 0-37.9-17-37.9-37.9v-15.5c0-21 17-37.9 37.9-37.9H364c21 0 37.9 17 37.9 37.9v15.5c0 20.9-17 37.9-37.9 37.9z"
                          fill="#80F2B0"
                          p-id="7318"
                        ></path>
                        <path
                          d="M586.9 752.4h-119c-80 0-144.9-64.9-144.9-144.9V466.1c0-80 64.9-144.9 144.9-144.9h119c80 0 144.9 64.9 144.9 144.9v141.4c0 80-64.9 144.9-144.9 144.9z"
                          fill="#40E09C"
                          p-id="7319"
                        ></path>
                        <path
                          d="M497.7 571c-8.1 2.1-16.5 3.2-25.1 3.2-13.1 0-25.8-2.6-37.3-7.2-3.8-3.9-5.6-8.9-5.6-14 0-5.3 2-10.6 6.1-14.7 8.1-8.1 21.1-8.1 29.2 0l32.7 32.7z"
                          fill="#80F2B0"
                          p-id="7320"
                        ></path>
                        <path
                          d="M639.7 487.8L527 600.4l-14.6 14.7c-8.1 8.1-21.2 8.1-29.3 0l-14.6-14.7-32.8-32.8c-0.2-0.2-0.4-0.4-0.5-0.6 11.5 4.7 24.1 7.2 37.3 7.2 8.7 0 17.1-1.1 25.1-3.2l0.2 0.2 70.5-70.5 42.1-42.2c4-4 9.3-6.1 14.7-6.1 5.3 0 10.6 2.1 14.6 6.1 8.1 8.1 8.1 21.3 0 29.3z"
                          fill="#FFFFFF"
                          p-id="7321"
                        ></path>
                      </svg>
                    </span>
                    {{ getMaterial(req.materialId)?.name }}
                  </div>
                  <div class="flex flex-row items-end shrink-0">
                    <span
                      class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
                      >目标需求</span
                    >
                    <span
                      class="text-base font-mono font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-xl"
                    >
                      {{ req.count }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-1.5">
                    <label
                      class="block text-[10px] font-black text-emerald-500 uppercase tracking-wider ml-1"
                      >已持有数量</label
                    >
                    <div class="relative">
                      <input
                        type="number"
                        v-model.number="userOwned[req.materialId]"
                        min="0"
                        class="w-full bg-emerald-50/30 border-2 border-transparent rounded-2xl px-4 py-2.5 text-center font-mono text-base font-black text-emerald-600 focus:border-emerald-400 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center ml-1">
                      <label
                        class="block text-[10px] font-black text-sky-500 uppercase tracking-wider"
                        >单价(万基纳)</label
                      >
                    </div>
                    <div class="relative">
                      <input
                        type="number"
                        v-model.number="userPrices[req.materialId]"
                        min="0"
                        class="w-full bg-sky-50/30 border-2 border-transparent rounded-2xl px-4 py-2.5 text-right font-mono text-base font-black text-sky-600 focus:border-sky-400 focus:bg-white outline-none transition-all pr-8"
                        :placeholder="
                          recentPrices[req.materialId]?.price_w || '0'
                        "
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black text-sky-300 pointer-events-none"
                        >w</span
                      >
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between pt-4 border-t border-slate-50"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-0.5"
                      >尚需补足</span
                    >
                    <span class="text-lg font-mono font-black text-rose-500">
                      {{
                        Math.max(
                          0,
                          req.count - (userOwned[req.materialId] || 0),
                        )
                      }}
                    </span>
                  </div>
                  <div class="text-right">
                    <span
                      class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5"
                      >缺口预估 (基纳)</span
                    >
                    <div class="text-xl font-mono font-black text-slate-800">
                      {{
                        formatNumber(
                          Math.max(
                            0,
                            req.count - (userOwned[req.materialId] || 0),
                          ) *
                            (userPrices[req.materialId] || 0) *
                            10000,
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部汇总 -->
          <div
            class="p-6 md:p-8 bg-slate-900 rounded-b-[2.5rem] text-white shadow-lg relative overflow-hidden group shrink-0 mt-4"
          >
            <div
              class="relative z-10 flex flex-col md:flex-row justify-around items-center gap-6"
            >
              <div class="text-center md:text-left opacity-60">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >
                  装备全额价值
                </div>
                <div
                  class="flex items-end gap-2 justify-center md:justify-start"
                >
                  <span
                    class="text-xl md:text-2xl font-mono font-black text-slate-300"
                  >
                    ¥ {{ fullRmbValue }}
                  </span>
                </div>
                <div class="text-[9px] font-bold text-slate-500 mt-1">
                  {{ formatNumber(fullMarketValue) }} 基纳
                </div>
              </div>

              <div class="h-12 w-[1px] bg-slate-800 hidden md:block"></div>

              <div class="text-center md:text-left">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >
                  实际所需支出
                </div>
                <div
                  class="flex items-end gap-2 justify-center md:justify-start"
                >
                  <span
                    class="text-3xl md:text-5xl font-mono font-black text-[#f9b11d] truncate"
                  >
                    ¥ {{ totalRmbCost }}
                  </span>
                  <span class="text-sm font-bold text-slate-500 mb-2">元</span>
                </div>
                <div class="text-[10px] font-black text-emerald-400 mt-1">
                  {{ formatNumber(totalKinahCost) }} 基纳
                </div>
              </div>

              <div class="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <button
                  v-if="user"
                  @click="openSaveModal"
                  :disabled="saving || !selectedEq || !isKinahRateValid"
                  class="px-6 py-3 bg-[#45a6d5] hover:bg-sky-400 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_0_#0284c7] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>保存计算结果</span>
                </button>
                <button
                  v-if="user"
                  @click="recordCalculation"
                  :disabled="recording || !hasPricesEntered || !isKinahRateValid"
                  class="px-6 py-3 bg-[#f9b11d] hover:bg-[#fbc02d] text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_0_#d98a00] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="recording" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>记录本次计算 (纳入历史)</span>
                </button>
                <div v-if="!user" class="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-400 rounded-xl font-black text-sm text-center flex items-center justify-center border-2 border-slate-200">
                  登录后可保存或记录计算
                </div>
                <div class="text-[10px] font-bold text-slate-400 text-center md:text-left mt-1">
                  使用汇率：1元 = {{ kinahRateDisplay }}万（只读）
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center p-12 text-center"
        >
          <div
            class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-bounce"
          >
            <span class="text-4xl">
              <svg
                t="1774492214851"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="10167"
                width="100"
                height="100"
              >
                <path
                  d="M0 0h1024v1024H0V0z"
                  fill="#202425"
                  opacity=".01"
                  p-id="10168"
                ></path>
                <path
                  d="M136.533333 68.266667a68.266667 68.266667 0 0 0-68.266666 68.266666v428.305067a17.066667 17.066667 0 0 0 28.842666 12.356267l237.738667-226.440534a34.133333 34.133333 0 0 1 42.496-3.6864l268.288 178.858667a17.066667 17.066667 0 0 0 22.766933-3.447467L951.978667 171.4176A17.066667 17.066667 0 0 0 955.733333 160.699733V136.533333a68.266667 68.266667 0 0 0-68.266666-68.266666H136.533333z m819.2 255.3856a17.066667 17.066667 0 0 0-30.344533-10.717867l-221.866667 274.705067a17.066667 17.066667 0 0 0-3.7888 10.717866v340.309334a17.066667 17.066667 0 0 0 17.066667 17.066666h170.666667a68.266667 68.266667 0 0 0 68.266666-68.266666V323.652267zM614.4 955.733333a17.066667 17.066667 0 0 0 17.066667-17.066666v-330.990934a17.066667 17.066667 0 0 0-7.611734-14.199466l-204.8-136.533334a17.066667 17.066667 0 0 0-26.5216 14.199467V938.666667a17.066667 17.066667 0 0 0 17.066667 17.066666h204.8z m-307.2 0a17.066667 17.066667 0 0 0 17.066667-17.066666v-443.733334a17.066667 17.066667 0 0 0-28.842667-12.356266l-221.866667 211.285333a17.066667 17.066667 0 0 0-5.290666 12.3904V887.466667a68.266667 68.266667 0 0 0 68.266666 68.266666h170.666667z"
                  fill="#FFAA44"
                  p-id="10169"
                ></path>
                <path
                  d="M73.557333 693.8624a17.066667 17.066667 0 0 0-5.290666 12.3904V887.466667a68.266667 68.266667 0 0 0 68.266666 68.266666h170.666667a17.066667 17.066667 0 0 0 17.066667-17.066666v-443.733334a17.066667 17.066667 0 0 0-28.842667-12.356266l-221.866667 211.285333zM392.533333 938.666667a17.066667 17.066667 0 0 0 17.066667 17.066666h204.8a17.066667 17.066667 0 0 0 17.066667-17.066666v-330.990934a17.066667 17.066667 0 0 0-7.611734-14.199466l-204.8-136.533334a17.066667 17.066667 0 0 0-26.5216 14.199467V938.666667z m307.2 0a17.066667 17.066667 0 0 0 17.066667 17.066666h170.666667a68.266667 68.266667 0 0 0 68.266666-68.266666V323.6864a17.066667 17.066667 0 0 0-30.344533-10.752l-221.866667 274.705067a17.066667 17.066667 0 0 0-3.7888 10.717866v340.309334z"
                  fill="#11AA66"
                  p-id="10170"
                ></path>
              </svg>
            </span>
          </div>
          <p class="text-slate-400 font-black text-lg max-w-md">
            请选择上方装备开始计算。
          </p>
        </div>
      </div>
    </div>

    <!-- 保存备注弹窗 -->
    <Transition name="modal">
      <div
        v-if="showSaveModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          @click="showSaveModal = false"
        ></div>
        <div
          class="relative z-10 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div
            class="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between"
          >
            <h4 class="font-black text-slate-800 text-lg">保存本次计算</h4>
            <button
              @click="showSaveModal = false"
              class="text-slate-400 hover:text-slate-600"
            >
              <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2"
                >计算结果备注</label
              >
              <textarea
                v-model="saveRemark"
                rows="3"
                placeholder="例如：这是准备给小号做的装备，差奥德..."
                class="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 text-sm transition-all resize-none"
              ></textarea>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">基纳汇率（只读）</div>
              <div class="mt-1 text-sm font-mono font-black text-slate-700">
                1元 = {{ kinahRateDisplay }}万
              </div>
            </div>
            <div class="flex gap-3">
              <button
                @click="showSaveModal = false"
                class="flex-1 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                取消
              </button>
              <button
                @click="handleSave(false)"
                :disabled="saving"
                class="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span
                  v-if="saving"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span>保存到我的</span>
              </button>
              <button
                @click="handleSave(true)"
                :disabled="saving"
                class="flex-1 py-3 bg-[#45a6d5] text-white rounded-xl font-black shadow-lg hover:bg-[#3b95c0] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span
                  v-if="saving"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span>保存为公开</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { $alert, $loading } = useNuxtApp();

// 状态管理
const loading = ref(true);
const loadingSaved = ref(false);
const recording = ref(false);
const saving = ref(false);
const showSaveModal = ref(false);
const saveRemark = ref("");
const savedView = ref(user.value ? "mine" : "public");

watch(() => user.value, (newUser) => {
  if (!newUser && savedView.value === "mine") {
    savedView.value = "public";
  } else if (newUser && savedView.value === "public") {
    savedView.value = "mine";
  }
});

const config = ref({ materials: [], equipment: [] });
const recentPrices = ref({});
const searchQuery = ref("");
const selectedCategory = ref("全部");
const selectedEq = ref(null);

const kinahRate = ref(0);
const userPrices = ref({});
const userOwned = ref({});
const savedList = ref([]);
const bestCompareRate = ref(null);
const bestComparePlatform = ref("");

// 计算属性
const categories = computed(() => {
  const cats = new Set(config.value.equipment.map((e) => e.category));
  return ["全部", ...Array.from(cats).sort()];
});

const filteredEquipment = computed(() => {
  return config.value.equipment.filter((eq) => {
    const matchSearch = eq.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchCat =
      selectedCategory.value === "全部" ||
      eq.category === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const hasPricesEntered = computed(() => {
  return Object.values(userPrices.value).some((p) => p !== null && p > 0);
});

const totalKinahCost = computed(() => {
  if (!selectedEq.value) return 0;
  return selectedEq.value.materials.reduce((total, req) => {
    const owned = userOwned.value[req.materialId] || 0;
    const missingCount = Math.max(0, req.count - owned);
    return (
      total + missingCount * (userPrices.value[req.materialId] || 0) * 10000
    );
  }, 0);
});

const totalRmbCost = computed(() => {
  if (!kinahRate.value || kinahRate.value <= 0) return 0;
  return (totalKinahCost.value / (kinahRate.value * 10000)).toFixed(2);
});

const fullMarketValue = computed(() => {
  if (!selectedEq.value) return 0;
  return selectedEq.value.materials.reduce((total, req) => {
    return total + req.count * (userPrices.value[req.materialId] || 0) * 10000;
  }, 0);
});

const fullRmbValue = computed(() => {
  if (!kinahRate.value || kinahRate.value <= 0) return 0;
  return (fullMarketValue.value / (kinahRate.value * 10000)).toFixed(2);
});

const isKinahRateValid = computed(() => {
  const v = Number(kinahRate.value);
  return Number.isFinite(v) && v > 0;
});

const kinahRateDisplay = computed(() => {
  if (!isKinahRateValid.value) return "-";
  const v = Number(kinahRate.value);
  return v.toString();
});

// 数据加载
const fetchConfig = async () => {
  loading.value = true;
  const { data: configData } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "equipment_cost_config")
    .maybeSingle();
  if (configData?.value) config.value = configData.value;
  const { data: priceData } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "material_recent_prices")
    .maybeSingle();
  if (priceData?.value) recentPrices.value = priceData.value;
  loading.value = false;
};

const fetchSaved = async () => {
  loadingSaved.value = true;
  let q = supabase
    .from("saved_calculations")
    .select("*");

  if (savedView.value === "mine") {
    if (!user.value?.id) {
      savedList.value = [];
      loadingSaved.value = false;
      return;
    }
    q = q.eq("user_id", user.value.id);
  } else {
    q = q.eq("is_public", true);
  }

  q = q.order("created_at", { ascending: false }).limit(50);

  const { data, error } = await q;

  if (error) console.error("Fetch saved failed:", error);
  else savedList.value = data || [];
  loadingSaved.value = false;
};

// 核心功能
const clearCurrent = (withConfirm) => {
  if (!selectedEq.value) return;
  if (withConfirm) {
    const ok = confirm("清空当前计算将丢失已输入的单价/持有量，确定继续吗？");
    if (!ok) return;
  }
  selectedEq.value = null;
  userPrices.value = {};
  userOwned.value = {};
  showSaveModal.value = false;
  saveRemark.value = "";
};

const selectEquipment = (eq) => {
  if (selectedEq.value?.id === eq.id) return;

  if (selectedEq.value) {
    const ok = confirm("切换装备会清空当前已输入的单价/持有量，确定切换吗？");
    if (!ok) return;
    userPrices.value = {};
    userOwned.value = {};
  }

  selectedEq.value = eq;
  eq.materials.forEach((req) => {
    if (userPrices.value[req.materialId] === undefined)
      userPrices.value[req.materialId] = null;
    if (userOwned.value[req.materialId] === undefined)
      userOwned.value[req.materialId] = 0;
  });
};

const fetchBestCompareRate = async () => {
  try {
    const res = await $fetch("/api/kinah/compare", {
      query: { t: Date.now() },
    });
    const top = res?.combinedRanking?.[0];
    const v = Number(top?.coinOneMoney);
    if (Number.isFinite(v) && v > 0) {
      bestCompareRate.value = Number(v.toFixed(4)).toString();
      bestComparePlatform.value =
        top?.platform === "lulu233" ? "lulu233" : top?.platform === "dd373" ? "DD373" : "7881";
      if (!isKinahRateValid.value) {
        kinahRate.value = Number(bestCompareRate.value);
      }
    }
  } catch {}
};

const applyBestCompareRate = () => {
  if (!bestCompareRate.value) return;
  const v = Number(bestCompareRate.value);
  if (!Number.isFinite(v) || v <= 0) return;
  kinahRate.value = v;
};

const handleSave = async (isPublic) => {
  if (!selectedEq.value) return;
  if (!user.value?.id) {
    $alert("保存失败", "请先登录后再保存");
    return;
  }
  if (!isKinahRateValid.value) {
    $alert("提示", "请先填写当前基纳汇率");
    return;
  }
  saving.value = true;

  try {
    const { error } = await supabase.from("saved_calculations").insert({
      equipment_id: selectedEq.value.id,
      equipment_name: selectedEq.value.name,
      remark: saveRemark.value,
      kinah_rate: kinahRate.value,
      user_prices: userPrices.value,
      user_owned: userOwned.value,
      total_kinah: totalKinahCost.value,
      total_rmb: parseFloat(totalRmbCost.value),
      is_public: isPublic,
      user_id: user.value.id,
    });

    if (error) throw error;

    $alert("保存成功", isPublic ? "已保存为公开记录（所有用户可见）" : "已保存到我的记录（仅自己可见）");
    showSaveModal.value = false;
    saveRemark.value = "";
    fetchSaved();
  } catch (err) {
    $alert("保存失败", err.message);
  } finally {
    saving.value = false;
  }
};

const loadSaved = (item) => {
  const eq = config.value.equipment.find((e) => e.id === item.equipment_id);
  if (!eq) {
    $alert("加载失败", "原装备配置已不存在");
    return;
  }

  selectedEq.value = eq;
  kinahRate.value = item.kinah_rate;
  userPrices.value = { ...item.user_prices };
  userOwned.value = { ...item.user_owned };
  $alert("加载成功", `已恢复：${item.equipment_name}`);
};

const deleteSaved = async (id) => {
  if (!$alert("确定删除该保存记录吗？")) return;
  if (!user.value?.id) {
    $alert("删除失败", "请先登录后再删除");
    return;
  }

  const { error } = await supabase
    .from("saved_calculations")
    .delete()
    .eq("id", id);
  if (error) $alert("删除失败", error.message);
  else fetchSaved();
};

const recordCalculation = async () => {
  if (!selectedEq.value || !hasPricesEntered.value) {
    $alert("提示", "请输入价格后再记录");
    return;
  }
  if (!isKinahRateValid.value) {
    $alert("提示", "请先填写当前基纳汇率");
    return;
  }

  recording.value = true;
  $loading.show("正在保存计算历史...");

  try {
    const materialsData = selectedEq.value.materials.map((req) => {
      const material = getMaterial(req.materialId);
      const price_w = userPrices.value[req.materialId] || 0;
      const owned = userOwned.value[req.materialId] || 0;
      const missing = Math.max(0, req.count - owned);
      return {
        id: req.materialId,
        name: material.name,
        price_w: price_w,
        quantity: req.count,
        owned: owned,
        missing: missing,
        subtotal: missing * price_w * 10000,
      };
    });

    const { data: historyData, error: historyError } = await supabase
      .from("crafting_history")
      .insert({
        equipment_id: selectedEq.value.id,
        equipment_name: selectedEq.value.name,
        kinah_rate: kinahRate.value,
        total_kinah: totalKinahCost.value,
        total_rmb: parseFloat(totalRmbCost.value),
        materials_data: materialsData,
      })
      .select("id")
      .single();

    if (historyError) throw historyError;

    const priceHistoryData = materialsData
      .filter((m) => m.price_w > 0)
      .map((m) => ({
        material_id: m.id,
        material_name: m.name,
        price_w: m.price_w,
        calculation_id: historyData.id,
      }));

    if (priceHistoryData.length > 0) {
      await supabase.from("material_price_history").insert(priceHistoryData);
    }

    // 3. 更新“近期价格”缓存 (site_config)
    const { data: configData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "material_recent_prices")
      .maybeSingle();
    const currentRecentPrices = configData?.value || {};
    materialsData.forEach((m) => {
      if (m.price_w > 0) {
        currentRecentPrices[m.id] = {
          price_w: m.price_w,
          updated_at: new Date().toISOString(),
        };
      }
    });
    await supabase.from("site_config").upsert(
      {
        key: "material_recent_prices",
        value: currentRecentPrices,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    recentPrices.value = currentRecentPrices;

    $alert("记录成功", "计算历史已存入数据库，近期价格已更新");
  } catch (err) {
    $alert("记录失败", err.message);
  } finally {
    recording.value = false;
    $loading.hide();
  }
};

const openSaveModal = () => {
  if (!selectedEq.value) return;
  if (!isKinahRateValid.value) {
    $alert("提示", "请先填写当前基纳汇率");
    return;
  }
  showSaveModal.value = true;
};

// 辅助函数
const getMaterial = (id) =>
  config.value.materials.find((m) => m.id === id) || { name: "未知材料" };
const formatNumber = (num) => new Intl.NumberFormat().format(num);
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};

onMounted(() => {
  fetchConfig();
  fetchSaved();
  fetchBestCompareRate();
});

watch(savedView, () => {
  fetchSaved();
});

watch(
  user,
  () => {
    if (savedView.value === "mine") fetchSaved();
  },
  { immediate: true },
);
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

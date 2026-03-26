<template>
  <div class="h-full flex flex-col gap-6">
    <div
      class="bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-white shadow-md overflow-hidden"
    >
      <div
        class="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-br from-sky-50 to-white border-b border-slate-100"
      >
        <div>
          <div
            class="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-1"
          >
            Kinah Compare
          </div>
          <h3
            class="text-2xl md:text-3xl font-black text-slate-800 leading-tight"
          >
            基纳比价
          </h3>
          <div class="mt-2 text-xs text-slate-500 font-bold">
            <span v-if="data?.updated_at"
              >更新时间：{{ formatDateTime(data.updated_at) }}</span
            >
            <span v-else>更新时间：-</span>
          </div>
          <div
            class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-sky-100/70 text-sky-800 text-[11px] font-black"
          >
            <span class="text-sky-600">提示</span>
            <span class="text-sky-700/90">点击任意报价或「去购买」可跳转</span>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <button
            @click="refreshPrices"
            :disabled="pending"
            class="w-full md:w-auto justify-center px-5 py-2.5 rounded-2xl bg-[#45a6d5] text-white font-black shadow-md hover:bg-[#3b95c0] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span
              v-if="pending"
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></span>
            刷新价格
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="p-6 rounded-3xl border-2 border-slate-100 bg-gradient-to-r from-white to-sky-50"
        >
          <div
            class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div
                class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
              >
                结论
              </div>
              <div class="text-lg font-black text-slate-800">
                <span v-if="winnerKey">当前更划算：{{ winnerLabel }}</span>
                <span v-else>暂无可用报价</span>
              </div>
            </div>
            <div class="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-4 rounded-2xl bg-white border border-slate-100">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  差值
                </div>
                <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                  {{ deltaText }}
                </div>
                <div class="text-[10px] font-bold text-slate-400 mt-1">
                  以万基纳/元（越大越好）比较
                </div>
              </div>
              <a
                v-if="winnerBuyUrl"
                :href="winnerBuyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-4 rounded-2xl bg-[#45a6d5] text-white font-black shadow-md hover:bg-[#3b95c0] transition-all flex items-center justify-between gap-3"
              >
                <div class="min-w-0">
                  <div
                    class="text-[10px] font-black text-white/80 uppercase tracking-widest"
                  >
                    购买入口
                  </div>
                  <div class="mt-1 text-base font-black truncate">
                    点击购买当前更划算
                  </div>
                </div>
                <div class="shrink-0 text-white/90 text-lg">↗</div>
              </a>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-black text-slate-800">指标说明</h5>
          </div>
          <div class="text-sm text-slate-600 font-bold space-y-2">
            <div>1 元可得（万基纳/元）：数值越大越划算。</div>
            <div>1 万基纳（元/万）：数值越小越划算。</div>
          </div>
        </div>
      </div>
      <div class="p-6 md:p-8">
        <div
          v-if="error"
          class="p-5 rounded-2xl bg-rose-50 border-2 border-rose-100 text-rose-700 font-bold text-sm"
        >
          获取失败：{{ errorMessage }}
        </div>

        <div v-else class="space-y-6">
          <!-- 上方：全平台基纳比较排行 (独占一行) -->
          <div
            class="p-4 md:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col max-h-[60vh] md:max-h-[520px]"
          >
            <div class="flex items-center justify-between mb-4 shrink-0">
              <h5 class="font-black text-slate-800 flex items-center gap-2">
                <span>🏆</span> 全平台基纳排行
              </h5>
              <div class="flex items-center gap-3">
                <span v-if="winnerKey" class="text-xs font-bold text-slate-500">
                  当前更划算：<span class="text-emerald-600 font-black">{{
                    winnerLabel
                  }}</span>
                  <span
                    class="ml-2 px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500"
                    >差值 {{ deltaText }}</span
                  >
                </span>
                <span
                  class="text-[10px] font-black bg-sky-100 text-sky-700 px-2 py-1 rounded-lg"
                  >Top 20</span
                >
              </div>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto custom-scroll pr-2 space-y-2">
            <a
              v-for="(o, idx) in data?.combinedRanking || []"
              :key="idx"
              :href="
                o.detailUrl ||
                (o.platform === 'lulu233'
                  ? data?.lulu233?.url
                  : data?.dd373?.url)
              "
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 hover:border-sky-200 hover:bg-sky-50/30 transition-all group"
            >
              <div
                class="w-6 text-center font-black"
                :class="idx < 3 ? 'text-amber-500' : 'text-slate-300'"
              >
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-[10px] font-black px-1.5 py-0.5 rounded"
                    :class="{
                      'bg-emerald-100 text-emerald-700':
                        o.platform === 'lulu233',
                      'bg-blue-100 text-blue-700': o.platform === 'dd373',
                      'bg-orange-100 text-orange-700': o.platform === '7881',
                    }"
                  >
                    {{
                      o.platform === "lulu233"
                        ? "lulu233"
                        : o.platform === "dd373"
                          ? "DD373"
                          : "7881"
                    }}
                  </span>
                  <span class="text-sm font-black text-slate-800 truncate">{{
                    o.goodsName || (o.kinahW ? o.kinahW + "万基纳" : "基纳商品")
                  }}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-bold truncate">
                  {{ o.regionNames || `¥ ${formatMoney(o.rmb)}` }}
                </div>
              </div>
              <div class="text-right shrink-0 flex flex-col items-end gap-1">
                <div class="text-sm font-mono font-black text-emerald-600">
                  {{ formatRate(o.coinOneMoney) }}万/元
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-[10px] text-slate-400 font-bold">
                    ¥ {{ formatMoney(o.rmb) }}
                  </div>
                  <span
                    class="text-[10px] font-black px-2 py-1 rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition-all"
                    >去购买 ↗</span
                  >
                </div>
              </div>
            </a>
            <div
              v-if="!data?.combinedRanking?.length"
              class="text-center py-8 text-slate-400 font-bold text-sm"
            >
              暂无排行数据
            </div>
          </div>
        </div>

        <!-- 下方：三平台独立明细 (三列分布) -->
        <div :class="['grid grid-cols-1 gap-6', platformGridClass]">
          <div
            class="p-4 md:p-6 rounded-3xl border-2 bg-white shadow-sm transition-all"
            :class="
              winnerKey === 'lulu233'
                ? 'border-emerald-200 ring-2 ring-emerald-100'
                : 'border-slate-100'
            "
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xl">🦌</span>
                  <h4 class="text-lg font-black text-slate-800">lulu233</h4>
                  <span
                    v-if="winnerKey === 'lulu233'"
                    class="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg"
                    >更划算</span
                  >
                </div>
                <p class="text-xs text-slate-500 font-bold mt-1">
                  取最优报价（万基纳/元）
                </p>
              </div>
              <a
                v-if="data?.lulu233?.url"
                :href="data.lulu233.url"
                target="_blank"
                class="text-[10px] font-black text-sky-500 hover:underline"
                >打开平台 ↗</a
              >
            </div>

            <div class="mt-5 grid grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  1 元可得
                </div>
                <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                  {{ formatRate(luluBest)
                  }}<span class="text-sm font-black text-slate-400 ml-1"
                    >万</span
                  >
                </div>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  1 万基纳
                </div>
                <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                  {{ formatMoney(luluBestMoneyOneCoin)
                  }}<span class="text-sm font-black text-slate-400 ml-1"
                    >元</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <span
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Top 报价</span
                >
                <span class="text-[10px] font-black text-slate-500"
                  >{{ (data?.lulu233?.offers || []).length }} 条</span
                >
              </div>
              <div class="space-y-2">
                <a
                  v-for="o in (data?.lulu233?.offers || []).slice(0, 5)"
                  :key="o.id"
                  :href="o.detailUrl || data?.lulu233?.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block p-3 rounded-2xl bg-white border border-slate-100 hover:border-sky-100 hover:shadow-sm transition-all"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="text-sm font-black text-slate-800 truncate">
                        {{ o.goodsName }}
                      </div>
                      <div
                        class="text-[10px] text-slate-400 font-bold mt-0.5 truncate"
                      >
                        {{ o.regionNames }}
                      </div>
                    </div>
                    <div
                      class="text-right shrink-0 flex flex-col items-end gap-1"
                    >
                      <div
                        class="text-sm font-mono font-black text-emerald-600"
                      >
                        {{ formatRate(o.coinOneMoney) }}万/元
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="text-[10px] text-slate-400 font-bold">
                          ¥ {{ formatMoney(o.goodsPrice) }}
                        </div>
                        <span
                          class="hidden sm:inline text-[10px] font-black px-2 py-1 rounded-lg bg-sky-100 text-sky-700"
                          >去购买 ↗</span
                        >
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div
            class="p-4 md:p-6 rounded-3xl border-2 bg-white shadow-sm transition-all"
            :class="
              winnerKey === 'dd373'
                ? 'border-emerald-200 ring-2 ring-emerald-100'
                : 'border-slate-100'
            "
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xl">🐲</span>
                  <h4 class="text-lg font-black text-slate-800">DD373</h4>
                  <span
                    v-if="winnerKey === 'dd373'"
                    class="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg"
                    >更划算</span
                  >
                </div>
                <p class="text-xs text-slate-500 font-bold mt-1">
                  抓取页面 good-list-box 内比率文本
                </p>
              </div>
              <a
                v-if="data?.dd373?.url"
                :href="data.dd373.url"
                target="_blank"
                class="text-[10px] font-black text-sky-500 hover:underline"
                >打开平台 ↗</a
              >
            </div>

            <div class="mt-5 grid grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  1 元可得
                </div>
                <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                  {{ formatRate(ddBest)
                  }}<span class="text-sm font-black text-slate-400 ml-1"
                    >万</span
                  >
                </div>
              </div>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >
                  1 万基纳
                </div>
                <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                  {{ formatMoney(ddBestMoneyOneCoin)
                  }}<span class="text-sm font-black text-slate-400 ml-1"
                    >元</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <span
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >Top 报价</span
                >
                <span class="text-[10px] font-black text-slate-500"
                  >{{ (data?.dd373?.offers || []).length }} 条</span
                >
              </div>
              <div class="space-y-2">
                <a
                  v-for="(o, idx) in (data?.dd373?.offers || []).slice(0, 5)"
                  :key="idx"
                  :href="o.detailUrl || data?.dd373?.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block p-3 rounded-2xl bg-white border border-slate-100 hover:border-sky-100 hover:shadow-sm transition-all"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="text-sm font-black text-slate-800 truncate">
                        {{
                          o.goodsName ||
                          (o.kinahW === null ? "—" : o.kinahW + "万基纳")
                        }}
                      </div>
                      <div
                        class="text-[10px] text-slate-400 font-bold mt-0.5 truncate"
                      >
                        {{ o.regionNames || `¥ ${formatMoney(o.rmb)}` }}
                      </div>
                    </div>
                    <div
                      class="text-right shrink-0 flex flex-col items-end gap-1"
                    >
                      <div
                        class="text-sm font-mono font-black text-emerald-600"
                      >
                        {{ formatRate(o.coinOneMoney) }}万/元
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="text-[10px] text-slate-400 font-bold">
                          {{ formatMoney(o.moneyOneCoin) }}元/万
                        </div>
                        <span
                          class="hidden sm:inline text-[10px] font-black px-2 py-1 rounded-lg bg-sky-100 text-sky-700"
                          >去购买 ↗</span
                        >
                      </div>
                    </div>
                  </div>
                </a>
                <div
                  v-if="data?.dd373 && !data.dd373.ok"
                  class="text-xs text-rose-600 font-bold"
                >
                  DD373 获取失败：{{ data.dd373.error || "未知错误" }}
                </div>
              </div>
            </div>
          </div>

          <!-- 7881 卡片 -->
          <!-- <div class="p-6 rounded-3xl border-2 bg-white shadow-sm transition-all"
                 :class="winnerKey === '7881' ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-slate-100'">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🦊</span>
                    <h4 class="text-lg font-black text-slate-800">7881</h4>
                    <span v-if="winnerKey === '7881'" class="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">更划算</span>
                  </div>
                  <p class="text-xs text-slate-500 font-bold mt-1">取最优报价（万基纳/元）</p>
                </div>
                <a
                  v-if="data?.s7881?.url"
                  :href="data.s7881.url"
                  target="_blank"
                  class="text-[10px] font-black text-sky-500 hover:underline"
                >打开平台 ↗</a>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-4">
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">1 元可得</div>
                  <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                    {{ formatRate(s7881Best) }}<span class="text-sm font-black text-slate-400 ml-1">万</span>
                  </div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">1 万基纳</div>
                  <div class="mt-1 text-2xl font-mono font-black text-slate-800">
                    {{ formatMoney(s7881BestMoneyOneCoin) }}<span class="text-sm font-black text-slate-400 ml-1">元</span>
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top 报价</span>
                  <span class="text-[10px] font-black text-slate-500">{{ (data?.s7881?.offers || []).length }} 条</span>
                </div>
                <div class="space-y-2">
                  <a
                    v-for="o in (data?.s7881?.offers || []).slice(0, 5)"
                    :key="o.id"
                    :href="o.detailUrl || data?.s7881?.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block p-3 rounded-2xl bg-white border border-slate-100 hover:border-sky-100 hover:shadow-sm transition-all"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="min-w-0">
                        <div class="text-sm font-black text-slate-800 truncate">{{ o.goodsName }}</div>
                        <div class="text-[10px] text-slate-400 font-bold mt-0.5 truncate">{{ o.regionNames }}</div>
                      </div>
                      <div class="text-right shrink-0">
                        <div class="text-sm font-mono font-black text-emerald-600">{{ formatRate(o.coinOneMoney) }}万/元</div>
                        <div class="text-[10px] text-slate-400 font-bold">¥ {{ formatMoney(o.goodsPrice) }}</div>
                      </div>
                    </div>
                  </a>
                  <div v-if="data?.s7881 && !data.s7881.ok" class="text-xs text-rose-600 font-bold">
                    7881 获取失败：{{ data.s7881.error || '未知错误' }}
                  </div>
                </div>
              </div>
            </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const refreshNonce = ref(Date.now());
const forceRefresh = ref(false);

const { data, pending, error } = useFetch("/api/kinah/compare", {
  server: false,
  query: computed(() => ({
    force: forceRefresh.value ? "1" : undefined,
    t: String(refreshNonce.value),
  })),
  watch: [refreshNonce, forceRefresh],
});

const refreshPrices = () => {
  forceRefresh.value = true;
  refreshNonce.value = Date.now();
  setTimeout(() => {
    forceRefresh.value = false;
  }, 0);
};

const winnerKey = computed(() => data.value?.winner || null);
const winnerLabel = computed(() => {
  if (winnerKey.value === "lulu233") return "lulu233";
  if (winnerKey.value === "dd373") return "DD373";
  if (winnerKey.value === "7881") return "7881";
  return "";
});

const winnerBuyUrl = computed(() => {
  if (winnerKey.value === "lulu233") {
    const best = data.value?.lulu233?.best;
    if (best && typeof best === "object" && best.detailUrl)
      return best.detailUrl;
    const first = data.value?.lulu233?.offers?.[0];
    return first?.detailUrl || data.value?.lulu233?.url || null;
  }
  if (winnerKey.value === "dd373") {
    const first = data.value?.dd373?.offers?.[0];
    return first?.detailUrl || data.value?.dd373?.url || null;
  }
  return null;
});

const platformGridClass = computed(() => {
  const show7881 = false;
  return show7881 ? "lg:grid-cols-3" : "lg:grid-cols-2";
});

const luluBest = computed(() => {
  const best = data.value?.lulu233?.best;
  if (!best) return null;
  if (typeof best === "number") return best;
  if (typeof best === "object" && Number.isFinite(best.coinOneMoney))
    return Number(best.coinOneMoney);
  return null;
});

const luluBestMoneyOneCoin = computed(() => {
  const best = data.value?.lulu233?.best;
  if (!best) return null;
  if (typeof best === "object" && Number.isFinite(best.moneyOneCoin))
    return Number(best.moneyOneCoin);
  if (luluBest.value) return 1 / luluBest.value;
  return null;
});

const ddBest = computed(() => {
  const best = data.value?.dd373?.best;
  if (!best) return null;
  if (typeof best === "number") return best;
  if (typeof best === "object" && Number.isFinite(best.coinOneMoney))
    return Number(best.coinOneMoney);
  return null;
});

const ddBestMoneyOneCoin = computed(() => {
  const best = data.value?.dd373?.bestUnitPrice;
  if (best) return best;
  if (ddBest.value) return 1 / ddBest.value;
  return null;
});

const s7881Best = computed(() => {
  const best = data.value?.s7881?.best;
  if (!best) return null;
  if (typeof best === "number") return best;
  if (typeof best === "object" && Number.isFinite(best.coinOneMoney))
    return Number(best.coinOneMoney);
  return null;
});

const s7881BestMoneyOneCoin = computed(() => {
  const best = data.value?.s7881?.best;
  if (!best) return null;
  if (typeof best === "object" && Number.isFinite(best.moneyOneCoin))
    return Number(best.moneyOneCoin);
  if (s7881Best.value) return 1 / s7881Best.value;
  return null;
});

const deltaText = computed(() => {
  const vals = [luluBest.value, ddBest.value, s7881Best.value].filter(
    (v) => v !== null,
  );
  if (vals.length < 2) return "-";
  vals.sort((a, b) => b - a);
  const diff = vals[0] - vals[1];
  const pct = (diff / vals[1]) * 100;
  return `${diff.toFixed(3)}万/元 (${pct.toFixed(1)}%)`;
});

const errorMessage = computed(() => {
  const err = error.value;
  return (
    (err && (err.data?.message || err.message || String(err))) ||
    "unknown error"
  );
});

const formatRate = (v) => {
  if (!v || !Number.isFinite(v)) return "-";
  return Number(v)
    .toFixed(v >= 100 ? 2 : 4)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
};

const formatMoney = (v) => {
  if (v === null || v === undefined || !Number.isFinite(v)) return "-";
  return Number(v).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
};

const formatDateTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${mi}`;
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(174, 226, 249, 0.4);
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(69, 166, 213, 0.4);
}
</style>

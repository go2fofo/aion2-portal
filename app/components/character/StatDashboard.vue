<script setup>
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

// 注册 ECharts 组件
use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const props = defineProps({
  groupedStats: {
    type: Array,
    default: () => [],
  },
  loadingEquipment: {
    type: Boolean,
    default: false,
  },
});

// 生成雷达图配置的通用函数
const createRadarOption = (title, stats, color, areaColor) => {
  if (!stats || stats.length === 0) return null;

  // 过滤出有数值的属性
  const validStats = stats.filter(
    (s) => s.value !== undefined && s.value !== null,
  );
  if (validStats.length < 3) return null; // 雷达图至少需要3个点

  return {
    radar: {
      indicator: validStats.map((s) => ({
        name: s.name,
        max: Math.max(s.value * 1.5, 100),
      })),
      radius: "60%",
      center: ["50%", "50%"],
      axisName: {
        color: "#64748b",
        fontWeight: "bold",
        fontSize: 10,
        formatter: (name) => {
          const item = validStats.find((s) => s.name === name);
          return `${name}\n${item ? item.value : 0}`;
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.2)"],
        },
      },
      axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0.05)" } },
      splitLine: { lineStyle: { color: "rgba(0, 0, 0, 0.05)" } },
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: validStats.map((s) => s.value),
            name: title,
            areaStyle: { color: areaColor },
            lineStyle: { color: color, width: 2 },
            itemStyle: { color: color },
            symbol: "none",
          },
        ],
      },
    ],
  };
};

const baseStatRadarOption = computed(() => {
  const group = props.groupedStats.find((g) => g.name === "角色基础属性");
  return createRadarOption(
    "基础能力",
    group?.list,
    "#9333ea",
    "rgba(147, 51, 234, 0.2)",
  );
});

const lordStatRadarOption = computed(() => {
  const group = props.groupedStats.find((g) => g.name === "主神属性");
  return createRadarOption(
    "主神之力",
    group?.list,
    "#d97706",
    "rgba(217, 119, 6, 0.2)",
  );
});
</script>

<template>
  <div
    class="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-white relative overflow-hidden group/board"
  >
    <!-- 装饰背景 -->
    <div
      class="absolute -top-24 -right-24 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl transition-transform group-hover/board:scale-110 duration-1000"
    ></div>
    <div
      class="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-100/30 rounded-full blur-3xl transition-transform group-hover/board:scale-110 duration-1000"
    ></div>

    <div class="relative z-10">
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
      >
        <div>
          <h3
            class="font-black text-slate-800 text-3xl mb-2 flex items-center gap-3"
          >
            <span
              class="bg-gradient-to-br from-sky-400 to-blue-600 text-white p-3 rounded-[1.5rem] shadow-lg shadow-sky-200/50"
            >
              <svg
                t="1774492214851"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="10167"
                width="40"
                height="40"
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
            全维能力数据中心
          </h3>
          <p class="text-slate-400 font-bold text-sm ml-16 tracking-wide">
            FULL ATTRIBUTE DATA DASHBOARD
          </p>
        </div>
        <div
          class="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-2"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
            ></span>
          </span>
          <span
            class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
            >Live Data Synchronized</span
          >
        </div>
      </div>

      <div
        v-if="loadingEquipment"
        class="flex flex-col items-center justify-center py-24 gap-4"
      >
        <div class="relative w-16 h-16">
          <div
            class="absolute inset-0 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin"
          ></div>
          <div
            class="absolute inset-0 flex items-center justify-center text-2xl"
          >
            ⚡
          </div>
        </div>
        <span class="text-slate-400 font-black animate-pulse"
          >正在解析全量属性...</span
        >
      </div>

      <div
        v-else-if="groupedStats.length === 0"
        class="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100"
      >
        <div class="text-4xl mb-4">🏜️</div>
        <div class="text-slate-400 font-black italic">未检测到详细属性记录</div>
      </div>

      <div v-else class="space-y-12">
        <!-- 1. 顶部核心双属性布局 (角色基础 & 主神属性) -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <template
            v-for="group in groupedStats.filter((g) =>
              ['角色基础属性', '主神属性'].includes(g.name),
            )"
            :key="group.name"
          >
            <div
              class="flex flex-col gap-8 bg-slate-50/40 p-8 rounded-[3.5rem] border border-slate-100/50 shadow-inner relative overflow-hidden group/topcard"
            >
              <!-- 分组标题 -->
              <div class="flex items-center justify-between px-2 relative z-10">
                <div class="flex items-center gap-4">
                  <div
                    class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-4 border-white"
                    :class="group.bg"
                  >
                    <svg
                      class="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      v-html="group.iconSvg"
                      :class="group.color"
                    ></svg>
                  </div>
                  <div>
                    <h4
                      class="font-black text-slate-800 text-2xl tracking-tight uppercase"
                    >
                      {{ group.name }}
                    </h4>
                    <div class="flex items-center gap-2 mt-1">
                      <div
                        class="h-1.5 w-12 rounded-full"
                        :class="group.bg.replace('bg-', 'bg-').split(' ')[0]"
                      ></div>
                      <span
                        class="text-[10px] font-black text-slate-300 uppercase tracking-widest"
                        >Dimension Analysis</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-10 items-center relative z-10">
                <!-- 雷达图展示 (放在上方) -->
                <div
                  class="w-full md:w-2/3 h-[320px] relative bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
                >
                  <VChart
                    v-if="
                      group.name === '角色基础属性'
                        ? baseStatRadarOption
                        : lordStatRadarOption
                    "
                    class="w-full h-full"
                    :option="
                      group.name === '角色基础属性'
                        ? baseStatRadarOption
                        : lordStatRadarOption
                    "
                    autoresize
                  />
                  <div v-else class="text-slate-200 text-xs font-black">
                    数据不足以生成图表
                  </div>
                </div>

                <!-- 属性列表 (紧凑型，改为 3 列以适应上下布局) -->
                <div
                  class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  <div
                    v-for="stat in group.list"
                    :key="stat.type"
                    class="relative p-4 rounded-[2rem] bg-white border-2 border-slate-50 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="flex flex-col">
                          <span
                            class="text-[8px] font-black text-slate-300 uppercase leading-none mb-1"
                            >{{ stat.type }}</span
                          >
                          <span
                            class="text-xs font-black text-slate-600 truncate max-w-[80px]"
                            >{{ stat.name }}</span
                          >
                        </div>
                      </div>
                      <span
                        class="text-base font-black tracking-tighter tabular-nums"
                        :class="group.color"
                        >{{ stat.value }}</span
                      >
                    </div>
                    <!-- 二级加成摘要 -->
                    <div
                      v-if="stat.statSecondList?.length"
                      class="mt-2 pt-2 border-t border-slate-50 flex flex-wrap gap-1"
                    >
                      <span
                        v-for="(bonus, bIdx) in stat.statSecondList"
                        :key="bIdx"
                        class="text-[8px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md"
                      >
                        {{ bonus }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 2. 下方常规属性列表 (攻击、防御、生存) -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div
            v-for="group in groupedStats.filter(
              (g) => !['角色基础属性', '主神属性'].includes(g.name),
            )"
            :key="group.name"
            class="flex flex-col gap-6 bg-slate-50/30 p-8 rounded-[3rem] border border-slate-100/50"
          >
            <!-- 分组标题 -->
            <div class="flex items-center gap-4 px-2">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-4 border-white"
                :class="group.bg"
              >
                <svg
                  class="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  v-html="group.iconSvg"
                  :class="group.color"
                ></svg>
              </div>
              <div>
                <h4
                  class="font-black text-slate-800 text-xl tracking-tight uppercase"
                >
                  {{ group.name }}
                </h4>
                <div
                  class="h-1 w-12 rounded-full mt-1"
                  :class="group.bg.replace('bg-', 'bg-').split(' ')[0]"
                ></div>
              </div>
            </div>

            <!-- 属性列表 (垂直列表模式) -->
            <div class="space-y-3">
              <div
                v-for="stat in group.list"
                :key="stat.type"
                class="p-4 rounded-[2rem] bg-white border-2 border-slate-50 shadow-sm transition-all hover:shadow-md hover:border-sky-100"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                      <span
                        class="text-[8px] font-black text-slate-300 uppercase mb-0.5"
                        >{{ stat.type }}</span
                      >
                      <span class="text-sm font-black text-slate-600">{{
                        stat.name
                      }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <span
                      class="text-lg font-black tracking-tighter"
                      :class="group.color"
                      >{{ stat.value }}</span
                    >
                    <span
                      v-if="stat.extra"
                      class="text-[9px] font-black text-emerald-500"
                      >+{{ stat.extra }}</span
                    >
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

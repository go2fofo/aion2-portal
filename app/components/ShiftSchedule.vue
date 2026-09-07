<!--
 * @Author: fofo
 * @Date: 2026-09-07 09:29:25
 * @LastEditTime: 2026-09-07 09:41:03
 * @LastEditors: fofo
 * @Description: 永恒之塔2 实时排班表组件 (高对比度提示横幅、100%宽度自适应)
 * @FilePath: /aion2-portal/app/components/ShiftSchedule.vue
-->
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// 星期映射 (0: 周日, 1: 周一, ... 6: 周六)
const weekDays = [
  { key: 1, label: "周一" },
  { key: 2, label: "周二" },
  { key: 3, label: "周三" },
  { key: 4, label: "周四" },
  { key: 5, label: "周五" },
  { key: 6, label: "周六" },
  { key: 0, label: "周日" },
];

// 时间点数据源
const timeSlots = [
  { time: "01:00", schedule: { 1: "卡伊拉", 2: "卡伊拉", 3: "卡伊拉", 4: "卡伊拉", 5: "卡伊拉", 6: "卡伊拉", 0: "卡伊拉" } },
  { time: "02:00", schedule: { 1: "缝隙", 2: "缝隙", 3: "缝隙", 4: "缝隙", 5: "缝隙", 6: "缝隙", 0: "缝隙" } },
  { time: "05:00", schedule: { 1: "卡伊拉/缝隙", 2: "卡伊拉/缝隙", 3: "卡伊拉/缝隙", 4: "卡伊拉/缝隙", 5: "卡伊拉/缝隙", 6: "卡伊拉/缝隙", 0: "卡伊拉/缝隙" } },
  { time: "08:00", schedule: { 1: "缝隙", 2: "缝隙", 3: "缝隙", 4: "缝隙", 5: "缝隙", 6: "缝隙", 0: "缝隙" } },
  { time: "09:00", schedule: { 1: "卡伊拉", 2: "卡伊拉", 3: "卡伊拉", 4: "卡伊拉", 5: "卡伊拉", 6: "卡伊拉", 0: "卡伊拉" } },
  { time: "11:00", schedule: { 1: "缝隙", 2: "缝隙", 3: "缝隙", 4: "缝隙", 5: "缝隙", 6: "缝隙", 0: "缝隙" } },
  { time: "13:00", schedule: { 1: "卡伊拉", 2: "卡伊拉", 3: "卡伊拉", 4: "卡伊拉", 5: "卡伊拉", 6: "卡伊拉", 0: "卡伊拉" } },
  { time: "14:00", schedule: { 1: "缝隙", 2: "缝隙", 3: "缝隙", 4: "缝隙", 5: "缝隙", 6: "缝隙", 0: "缝隙" } },
  { time: "17:00", schedule: { 1: "卡伊拉/缝隙", 2: "卡伊拉/缝隙", 3: "卡伊拉/缝隙", 4: "卡伊拉/缝隙", 5: "卡伊拉/缝隙", 6: "卡伊拉/缝隙", 0: "卡伊拉/缝隙" } },
  { time: "20:00", schedule: { 1: "时空裂缝争夺战", 2: "缝隙", 3: "缝隙", 4: "时空裂缝争夺战", 5: "缝隙", 6: "时空裂缝争夺战", 0: "缝隙" } },
  { time: "21:00", schedule: { 1: "卡伊拉", 2: "卡伊拉", 3: "卡伊拉", 4: "卡伊拉", 5: "卡伊拉", 6: "卡伊拉", 0: "卡伊拉" } },
  { time: "22:00", schedule: { 1: "", 2: "300vs300", 3: "神器", 4: "300vs300", 5: "神将", 6: "神器", 0: "神将" } },
  { time: "22:30", schedule: { 1: "", 2: "", 3: "小神将", 4: "", 5: "", 6: "小神将", 0: "" } },
  { time: "23:00", schedule: { 1: "时空裂缝争夺战", 2: "缝隙", 3: "缝隙", 4: "时空裂缝争夺战", 5: "缝隙", 6: "时空裂缝争夺战", 0: "缝隙" } },
];

// 实时时间驱动
const now = ref(new Date());
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// 计算当前及下一个活动状态预处理
const currentActivityNotice = computed(() => {
  const currentDay = now.value.getDay();
  const currentHour = now.value.getHours();
  const currentMinute = now.value.getMinutes();
  const currentSecond = now.value.getSeconds();
  const currentTotalSec = currentHour * 3600 + currentMinute * 60 + currentSecond;

  const slotsWithSec = timeSlots.map((slot) => {
    const [h, m] = slot.time.split(":").map(Number);
    return {
      time: slot.time,
      totalSec: h * 3600 + m * 60,
      name: slot.schedule[currentDay] || ""
    };
  }).filter(s => s.name !== "");

  if (slotsWithSec.length === 0) return { type: 'none', text: '今日暂无排班活动' };

  // 1. 检查进行中状态 (开始后 10 分钟内)
  for (let i = 0; i < slotsWithSec.length; i++) {
    const slot = slotsWithSec[i];
    const durationSec = slot.time === "22:30" ? 1800 : 3600;
    
    if (currentTotalSec >= slot.totalSec && currentTotalSec < slot.totalSec + durationSec) {
      const elapsed = currentTotalSec - slot.totalSec;
      if (elapsed <= 600) {
        return {
          type: 'ongoing',
          text: `当前活动 【${slot.time} - ${slot.name}】 正在火热进行中！`
        };
      }
    }
  }

  // 2. 寻找下一个活动
  let nextSlot = slotsWithSec.find(s => s.totalSec > currentTotalSec);
  if (!nextSlot) {
    nextSlot = slotsWithSec[0];
  }

  let diffSec = nextSlot.totalSec - currentTotalSec;
  if (diffSec < 0) {
    diffSec += 24 * 3600;
  }

  const hours = Math.floor(diffSec / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  const secs = diffSec % 60;

  const timeStr = [
    hours > 0 ? `${hours}小时` : '',
    mins > 0 ? `${mins}分` : '',
    `${secs}秒`
  ].filter(Boolean).join('');

  // 临近 10 分钟内 (600秒)
  if (diffSec <= 600 && diffSec > 0) {
    return {
      type: 'upcoming',
      text: `即将开始：下一个活动 【${nextSlot.time}】 ${nextSlot.name} 将在 ${timeStr} 后准时启动！`
    };
  }

  return {
    type: 'waiting',
    text: `活动预告：下一场 【${nextSlot.time}】 ${nextSlot.name} 将在 ${timeStr} 后开始`
  };
});

// 计算格子具体状态
const getSlotStatus = (slotTime, dayKey) => {
  const currentDay = now.value.getDay();
  if (currentDay !== dayKey) return { type: 'normal' };

  const currentHour = now.value.getHours();
  const currentMinute = now.value.getMinutes();
  const currentSecond = now.value.getSeconds();
  const currentTotalSec = currentHour * 3600 + currentMinute * 60 + currentSecond;

  const [slotHour, slotMin] = slotTime.split(":").map(Number);
  const slotTotalSec = slotHour * 3600 + slotMin * 60;

  const diffSec = slotTotalSec - currentTotalSec;

  if (diffSec > 0 && diffSec <= 600) {
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return {
      type: 'upcoming',
      text: `即将开始 ${mins > 0 ? mins + '分' : ''}${secs}秒`
    };
  }

  const durationSec = slotTime === "22:30" ? 1800 : 3600;
  if (currentTotalSec >= slotTotalSec && currentTotalSec < slotTotalSec + durationSec) {
    const elapsedSec = currentTotalSec - slotTotalSec;
    if (elapsedSec <= 600) {
      return { type: 'ongoing', text: '进行中' };
    }
  }

  return { type: 'normal' };
};

// 样式渲染适配
const getEventBadgeStyle = (eventName, statusType) => {
  if (!eventName) return "bg-transparent text-transparent border-transparent";
  
  if (statusType === 'ongoing' || statusType === 'upcoming') {
    return "bg-amber-500 text-slate-950 dark:bg-amber-400 dark:text-slate-950 border-2 border-amber-600 font-black animate-pulse shadow-lg scale-105 z-10";
  }

  if (eventName.includes("争夺战")) {
    return "bg-amber-500/15 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-400/70 dark:border-amber-600/70 font-black";
  }
  if (eventName.includes("300vs300") || eventName.includes("神器") || eventName.includes("神将")) {
    return "bg-sky-500/15 dark:bg-sky-500/25 text-sky-800 dark:text-sky-300 border border-sky-400/70 dark:border-sky-600/70 font-black";
  }
  if (eventName.includes("/")) {
    return "bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-400/70 dark:border-emerald-600/70 font-bold";
  }
  if (eventName === "卡伊拉") {
    return "bg-teal-500/15 dark:bg-teal-500/25 text-teal-800 dark:text-teal-300 font-bold";
  }
  return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700";
};
</script>

<template>
  <div class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 space-y-3">
    <!-- 顶部高对比度动态活动预告与倒计时提示栏 -->
    <div 
      class="w-full px-4 py-3 rounded-2xl border text-xs font-black transition-all flex items-center justify-between shadow-sm"
      :class="{
        'bg-amber-500 text-slate-950 border-amber-600 shadow-amber-500/20 animate-pulse': currentActivityNotice.type === 'upcoming' || currentActivityNotice.type === 'ongoing',
        'bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:border-slate-600': currentActivityNotice.type === 'waiting'
      }"
    >
      <div class="flex items-center gap-2.5 truncate">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="currentActivityNotice.type === 'upcoming' || currentActivityNotice.type === 'ongoing' ? 'bg-slate-950 animate-ping' : 'bg-sky-400'"></span>
        <span class="truncate tracking-wide text-sm">{{ currentActivityNotice.text }}</span>
      </div>
    </div>

    <!-- 表格容器：宽度 100% 充满父组件 -->
    <div class="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
      <table class="w-full text-center border-collapse text-xs table-auto">
        <!-- 表头：星期 -->
        <thead>
          <tr class="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <th class="py-3 px-3 font-black tracking-wider border-r border-slate-200 dark:border-slate-800 w-24">时间</th>
            <th v-for="day in weekDays" :key="day.key" class="py-3 px-2 font-black tracking-wider border-r last:border-r-0 border-slate-200 dark:border-slate-800">
              {{ day.label }}
            </th>
          </tr>
        </thead>

        <!-- 表体：时间点与活动 -->
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
          <tr v-for="(row, index) in timeSlots" :key="index" class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
            <!-- 时间列 -->
            <td class="py-2.5 px-3 font-mono font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 whitespace-nowrap">
              {{ row.time }}
            </td>

            <!-- 星期循环列 -->
            <td v-for="day in weekDays" :key="day.key" class="p-2 border-r last:border-r-0 border-slate-200 dark:border-slate-800 relative">
              <div
                class="py-2 px-1.5 rounded-xl transition-all flex flex-col items-center justify-center min-h-[38px]"
                :class="getEventBadgeStyle(row.schedule[day.key], getSlotStatus(row.time, day.key).type)"
              >
                <span>{{ row.schedule[day.key] || '—' }}</span>
                <!-- 动态倒计时或进行中提示 -->
                <span 
                  v-if="getSlotStatus(row.time, day.key).type !== 'normal' && row.schedule[day.key]"
                  class="text-[9px] font-black tracking-tight mt-0.5 px-1.5 py-0.2 rounded bg-slate-950 text-amber-400 dark:bg-white dark:text-slate-950"
                >
                  {{ getSlotStatus(row.time, day.key).text }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
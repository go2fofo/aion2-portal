<!--
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-10-20 14:03:34
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/app.vue
-->
<template>
  <!-- 根节点或者通过 bodyAttrs 动态绑定 dark 类 -->
  <NuxtLayout>
    <NuxtPage />
    <GlobalFeedback />
  </NuxtLayout>
  <!-- 发现新版本提示 -->
  <Transition name="slide-up">
    <div
      v-if="updateAvailable"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-amber-500 text-white rounded-2xl shadow-xl border border-amber-400 text-xs font-bold"
    >
      <span>✨ 社区门户已更新至最新版本，请刷新以体验新功能</span>
      <button
        @click="location.reload()"
        class="px-3 py-1.5 bg-white text-amber-700 rounded-xl hover:bg-amber-50 active:scale-95 transition-all cursor-pointer shadow-xs"
      >
        立即刷新
      </button>
    </div>
  </Transition>
  <GlobalFeedbackUI />
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
const updateAvailable = useState("updateAvailable");
import { useGameStore } from "@/stores/useGameStore";
import GlobalFeedbackUI from "~/components/GlobalNotificationUI.vue";
import { calcPremiumRemainingDays } from "@/utils/index.ts";
const expiringGroups = ref([]);
const { $notify } = useNuxtApp();
const gameStore = useGameStore();
// const user = useSupabaseUser();

onMounted(async () => {
  let gameData = await gameStore.initGameData();
  console.log(
    `🔍 [app:42] %c app---onMounted---gameData: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData
  );

  // 获取剩余 3 天及以内（<= 3 且 >= 0）的会员分组账号
  expiringGroups.value =
    gameData?.groups?.reduce((pre, cur) => {
      let premiumRemainingMemberDay = cur?.premiumMember
        ? calcPremiumRemainingDays(cur?.premiumEndTime, cur?.premiumMemberDay)
        : 0;

      // ⭐ 修改条件：只要剩余天数在 1 到 3 天之间（或者你可以把 0 也包含进来做当天提醒）
      if (premiumRemainingMemberDay > 0 && premiumRemainingMemberDay <= 3) {
        return [...pre, { ...cur, remainingDays: premiumRemainingMemberDay }];
      }
      return pre;
    }, []) || [];

  if (expiringGroups.value.length > 0) {
    // 按照剩余天数分类，或者直接合并提示
    // 这里我们按“紧急程度”或“具体天数”分组展示，文案更精准：

    // 比如：筛选出还剩 1 天的、2 天的、3 天的
    const day3List = expiringGroups.value
      .filter((g) => g.remainingDays === 3)
      .map((g) => g.groupName || g.name);
    const day2List = expiringGroups.value
      .filter((g) => g.remainingDays === 2)
      .map((g) => g.groupName || g.name);
    const day1List = expiringGroups.value
      .filter((g) => g.remainingDays === 1)
      .map((g) => g.groupName || g.name);

    // 组装更智能、更清晰的提示消息
    let messages = [];
    if (day1List.length > 0) messages.push(`【仅剩 1 天】${day1List.join("、")}`);
    if (day2List.length > 0) messages.push(`【还剩 2 天】${day2List.join("、")}`);
    if (day3List.length > 0) messages.push(`【还剩 3 天】${day3List.join("、")}`);

    $notify({
      title: "⚠️ 会员即将到期提醒",
      message: `检测到以下账号分组即将到期，请及时续费：\n${messages.join("；")}`,
      type: "warning", // 警告样式
      duration: 0, // 长驻，直到手动关闭
    });
  }
});
// 主题状态：从 localStorage 读取，默认浅色
const isDark = ref(false);

// 切换主题方法（可以绑定到你的 UI 按钮上，或者导出去给其他组件用）
const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateThemeClass();
};

// 更新 DOM 的 dark 类
const updateThemeClass = () => {
  if (typeof window !== "undefined") {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }
};

// 初始化检查本地存储
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
  }
  updateThemeClass();
});

// 动态修改 body 背景色（适配黑夜与白天）
useHead({
  title: "AION2 宝宝巴士",
  meta: [{ name: "description", content: "AION2 宝宝巴士门户网站" }],
  link: [{ rel: "icon", type: "image/png", href: "/bbbswz.png" }],
  bodyAttrs: {
    // 白天是 sky-300，黑夜自动变成深灰色/Slate色（配合 tailwind 的 dark: 前缀）
    class:
      "bg-sky-300 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300",
  },
});

import { useGameRefresh } from "@/composables/useGameRefresh";
const {
  executeDataRefresh,
  initAutoRefreshTimer,
  stopAutoRefreshTimer,
} = useGameRefresh();

onMounted(async () => {
  await executeDataRefresh();
  initAutoRefreshTimer();
});

onUnmounted(() => {
  stopAutoRefreshTimer();
});

// 可选：将 toggleTheme 暴露给全局（如果其他地方的导航栏按钮要用）
provide("theme", { isDark, toggleTheme });
</script>
<style>
/* 自定义滚动条（兼容黑夜模式） */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #aee2f9 #e6f7ff;
}

/* 黑夜模式下的 Firefox 滚动条颜色 */
.dark .custom-scroll {
  scrollbar-color: #0369a1 #0f172a;
}

/* Webkit 核心浏览器（Chrome, Safari, Edge） */
:deep(.custom-scroll)::-webkit-scrollbar {
  width: 8px;
}

:deep(.custom-scroll)::-webkit-scrollbar-track {
  background: #e6f7ff;
  border-radius: 9999px;
}

:deep(.custom-scroll)::-webkit-scrollbar-thumb {
  background: #aee2f9;
  border-radius: 9999px;
  box-shadow: inset 0 0 0 2px #ffffff;
}

/* 黑夜模式下的 Webkit 滚动条样式 */
:deep(.dark .custom-scroll)::-webkit-scrollbar-track {
  background: #0f172a; /* 对应 slate-900 */
}

:deep(.dark .custom-scroll)::-webkit-scrollbar-thumb {
  background: #0284c7; /* 对应 sky-600 */
  box-shadow: inset 0 0 0 2px #0f172a; /* 边框阴影适配暗色背景 */
}
</style>

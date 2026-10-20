<!--
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-10-20 11:46:20
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
const expiringGroups = ref([]);
const { $notify } = useNuxtApp();
const gameStore = useGameStore();
// const user = useSupabaseUser();

/**
 * 根据会员结束时间（yyyy-MM-dd）动态计算精准剩余天数
 * @param {string} endTimeStr 会员结束时间字符串
 * @param {number} [fallbackDays] 如果没有结束时间或解析失败时的备用天数
 * @returns {number} 剩余天数（最小为 0）
 */
const calcPremiumRemainingDays = (endTimeStr, fallbackDays = 0) => {
  if (!endTimeStr) return Number(fallbackDays) || 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(endTimeStr);
  endDate.setHours(0, 0, 0, 0);

  // 如果日期格式非法，直接返回备用天数
  if (isNaN(endDate.getTime())) return Number(fallbackDays) || 0;

  // 结束时间减去当前时间，毫秒转换为天数
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

onMounted(async () => {
  let gameData = await gameStore.initGameData();
  console.log(
    `🔍 [app:42] %c app---onMounted---gameData: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData
  );

  // 获取剩余三天的会员分组账号
  expiringGroups.value =
    gameData?.groups?.reduce((pre, cur) => {
      let premiumRemainingMemberDay = cur?.premiumMember
        ? calcPremiumRemainingDays(cur?.premiumEndTime, cur?.premiumMemberDay)
        : 0;

      if (premiumRemainingMemberDay !== 0 && premiumRemainingMemberDay === 3) {
        return [...pre, { ...cur }];
      }
      return pre;
    }, []) || [];

  if (expiringGroups.value.length > 0) {
    // 提取出所有符合条件的分组名称（用逗号隔开）
    const groupNames = expiringGroups.value
      .map((g) => g.groupName || g.name || "未命名分组")
      .join("、");

    $notify({
      title: "⚠️ 会员到期提醒",
      message: `检测到以下分组的会员将在 3 天后到期 [${groupNames}]，请及时续费处理！`,
      type: "warning", // 警告样式，醒目提示
      duration: 0, // 设为 0，代表长驻直到用户手动点击右上角 × 关闭
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

<script setup>
import { computed } from "vue";
import { dungeonDecayRules } from "../config/userAdmin";

// 1. 定义 Props
const props = defineProps({
  // 完整数据
  gameData: {
    type: Object,
    default: () => {},
  },
  // 角色列表数据
  characters: {
    type: Array,
    default: () => [],
  },
  // 当前分组数据
  getGroup: {
    type: Function,
    default: () => {},
  },
  // 戦斗力格式化方法
  formatCombatPower: {
    type: Function,
    default: (val) => val || 0,
  },
  // ⚙️ 核心配置对象
  config: {
    type: Object,
    default: () => ({
      columns: 3, // 列数: 1, 2, 3, 4
      mode: "default", // 显示模式: "simple"(简单模式) | "default"(列表/标准模式) | "custom"(自定义模式)
      customFields: {
        // 自定义模式下控制显隐的开关
        showCombatPower: true, // 是否显示装等/战力
        showDungeons: true, // 是否显示副本进度 (远征/超越)
        showEnergy: true, // 是否显示奥德能量
        showTasks: true, // 是否显示任务状态按钮
        showNotes: true, // 是否显示备注框
      },
    }),
  },
});

// 定义 Emits（向父组件抛出所有交互事件）
const emit = defineEmits([
  "click-gameplay",
  "toggle-lock",
  "toggle-task",
  "text-change",
  "delete",
  "task-click",
]);

// 3. 动态计算网格列数样式 (Tailwind 适配)
const gridColsClass = computed(() => {
  const cols = props.config?.columns || 3;
  switch (cols) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 4:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    case 5:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
    case 3:
    default:
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }
});
// 整体调大尺寸后的挂签样式类
const gameplayBadgeClass = computed(() => {
  const cols = Number(props.config?.columns) || 3;

  if (cols <= 2) {
    // 2列及以下：特大号！大幅加宽、加高，极具视觉冲击力与分量感
    return "px-6 py-2.5 text-sm gap-2";
  } else if (cols === 3) {
    // 3列：标准适中偏大
    return "px-5 py-2 text-[13px] gap-1.5";
  } else if (cols === 4) {
    // 4列：适中偏紧凑
    return "px-4 py-1.5 text-[11px] gap-1.5";
  } else {
    // 5列及以上：紧凑微型
    return "px-3 py-1 text-[10px] gap-1";
  }
});

// 对应各列数的图标大小（完美匹配 2/3/4/5 列的四档划分）
const gameplayIconClass = computed(() => {
  const cols = Number(props.config?.columns) || 3;

  if (cols <= 2) {
    return "w-5 h-5"; // 2列及以下：大图标
  } else if (cols === 3) {
    return "w-4 h-4"; // 3列：适中偏大
  } else if (cols === 4) {
    return "w-3.5 h-3.5"; // 4列：紧凑适中
  } else {
    return "w-3 h-3"; // 5列及以上：微型图标
  }
});

//  当前模式判断辅助
const currentMode = computed(() => props.config?.mode || "default");
const fields = computed(() => props.config?.customFields || {});

//================ 远征副本剩余卡片 开始================
//计算指定组内的总通关次数
const getGroupTotalRuns = (groupId, charactersList, type) => {
  if (!charactersList) return 0;
  const groupChars = charactersList.filter((c) => c.group === groupId);
  return groupChars.reduce((sum, c) => {
    if (type === "expedition") return sum + (c.runs || 0);
    if (type === "surpass") return sum + (c.transcendRuns || 0);
    return sum;
  }, 0);
};

/**
 * 根据组ID和类型（远征/超越），直接从 groups 数据中获取当前组的总次数与收益率文案
 * @param {number} groupId 角色所属的分组ID (char.group)
 * @param {string} type 'expedition' (远征) 或 'surpass' (超越)
 */
const getGroupDecayInfo = (groupId, type) => {
  const groupsList = props.gameData?.groups;

  if (!groupsList || !Array.isArray(groupsList)) {
    return "已刷 0次，基纳获得量 100%";
  }

  const group = groupsList.find((g) => g.id === groupId);
  if (!group) {
    return "已刷 0次，基纳获得量 100%";
  }

  // 严格区分类型：远征取 group.runs，超越取 group.transcendRuns
  const totalRuns = type === "expedition" ? group.runs || 0 : group.transcendRuns || 0;

  const rules = dungeonDecayRules[type] || [];

  let rateLabel = "基纳获得量 20%";
  for (const rule of rules) {
    if (totalRuns <= rule.maxCount) {
      rateLabel = rule.label;
      break;
    }
  }

  return `已刷 ${totalRuns}次，${rateLabel}`;
};

/**
 * 获取角色今天某个类型的副本已刷次数（通过 runLogs 累加计算）
 * @param {Object} char 角色对象
 * @param {string} type 'expedition' 或 'surpass'
 */
const getTodayRunCount = (char, type) => {
  if (!char.runLogs || !Array.isArray(char.runLogs)) return 0;

  // 获取当前日期的标准字符串 (格式: YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  // 筛选出今天且类型匹配的日志，累加 count
  return char.runLogs
    .filter((log) => log.date === todayStr && log.type === type)
    .reduce((sum, log) => sum + (log.count || 0), 0);
};
//  计算当前角色奥德能刷多少次 (基于基础能量 + 存储能量)
const calcRunsByEnergy = (char, type) => {
  const totalEnergy = (char.energy || 0) + (char.storedEnergy || 0);
  const baseCost = 40; // 单次基准消耗
  return Math.floor(totalEnergy / baseCost);
};
/**
 * 获取圣域指定 Boss 的当前状态（已刷次数与上限）
 * @param {Object} char 角色对象
 * @param {string} bossKey 圣域 Boss 的 key (例如 's1', 's2', 's3')
 */
const getSanctuaryStatus = (char, bossKey) => {
  // 1. 获取最大上限（默认给 1）
  const maxLimit = char.sanctuary?.[bossKey] || 1;
  // 2. 获取已消耗次数（默认 0）
  const usedCount = char.sanctuaryRuns?.[bossKey] || 0;

  // 3. 计算剩余可刷次数（确保不小于 0）
  const remaining = Math.max(0, maxLimit - usedCount);

  return {
    maxLimit,
    usedCount,
    remaining,
  };
};
//================ 远征副本剩余卡片 结束 =====================');
//================ 周常/日常 开始================
/**
 * 获取当前角色所在组的共享玩法数据（因为同组共享、同加同减，只需获取组内任一角色的数据即可）
 * @param {number} groupId 角色所属的分组 ID
 * @param {string} metricKey 字段名 ('dailyRuns', 'minigameCount', 'dimensionalCount' 等)
 * @param {string} storedKey 存储字段名 ('storedDailyRuns', 'storedMinigameCount', 'storedDimensionalCount' 等)
 * @param {number} maxLimit 最大上限 (默认 14)
 */
const getGroupSharedTaskData = (groupId, metricKey, storedKey, maxLimit = 14) => {
  const defaultResult = { current: 0, stored: 0, max: maxLimit };
  // 获取当前组的所有角色
  const groupTarget = props?.gameData?.groups?.find((f) => f.id === groupId);

  if (!groupTarget) {
    return defaultResult;
  }

  return {
    current: Number(groupTarget[metricKey]) || 0,
    stored: Number(groupTarget[storedKey]) || 0,
    max: maxLimit,
    total: Number(groupTarget?.[metricKey] || 0) + Number(groupTarget?.[storedKey] || 0),
  };
};
/**
 * 获取当前角色的玩法数据（因为同组共享、同加同减，只需获取组内任一角色的数据即可）
 * @param {number} groupId 角色所属的分组 ID
 * @param {string} metricKey 字段名 ('dailyRuns', 'minigameCount', 'dimensionalCount' 等)
 * @param {string} storedKey 存储字段名 ('storedDailyRuns', 'storedMinigameCount', 'storedDimensionalCount' 等)
 * @param {number} maxLimit 最大上限 (默认 14)
 */
const getCharacterSharedTaskData = (char, metricKey, storedKey, maxLimit = 14) => {
  const defaultResult = { current: 0, stored: 0, max: maxLimit };
  // 获取当前角色
  const charTarget = props?.gameData?.characters?.find((f) => f.id === char.id);

  if (!charTarget) {
    return defaultResult;
  }

  return {
    current: Number(charTarget[metricKey]) || 0,
    stored: Number(charTarget[storedKey]) || 0,
    max: maxLimit,
    total: Number(charTarget?.[metricKey] || 0) + Number(charTarget?.[storedKey] || 0),
  };
};
//================ 周常/日常 结束 =====================


</script>

<template>
  <div v-if="characters.length > 0" class="grid gap-5" :class="gridColsClass">
    <div
      v-for="char in characters"
      :key="char.characterId || char.id"
      class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-2 rounded-3xl shadow-sm space-y-4 border-[#45a6d5] transition-all flex flex-col"
      :class="char.locked ? 'opacity-95 bg-slate-50 dark:bg-slate-800/50' : ''"
    >
      <!-- 右上角“游玩消耗”挂载式精致标签按钮（自适应列数大小） -->
      <button
        type="button"
        :class="[
          gameplayBadgeClass,
          'absolute -top-[1px] -right-[1px] bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white font-black rounded-bl-3xl rounded-tr-3xl shadow-[0_4px_16px_-4px_rgba(147,51,234,0.6)] hover:shadow-[0_6px_20px_-4px_rgba(147,51,234,0.8)] hover:scale-105 transition-all tracking-wider z-20 flex items-center active:scale-95',
        ]"
        @click="emit('click-gameplay', char)"
      >
        <!-- 小图标点缀 -->
        <svg
          :class="gameplayIconClass"
          class="text-purple-200 animate-pulse shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.42 15.17L17.25 21A2.5 2.5 0 0021 17.25l-5.83-5.83M15 5.5l3.5 3.5m-11.5 8.5l-4-4 8.5-8.5 4 4-8.5 8.5z"
          ></path>
        </svg>
        <span>游玩消耗/补充</span>
      </button>

      <!-- 顶部标题栏（所有模式均展示，完美兼容小卡片紧凑布局） -->
      <div
        class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-1 transition-colors"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <!-- 锁定/解锁按钮（纯 SVG 图标版，固定尺寸防挤压） -->
          <button
            type="button"
            class="w-8 h-8 rounded-xl flex items-center justify-center border text-xs font-bold transition-all shadow-xs shrink-0"
            :class="
              char.locked
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/80'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            "
            @click="emit('toggle-lock', char)"
            :title="
              char.locked
                ? '已锁定（点击解锁以允许删除）'
                : '未锁定（点击锁定以防止误删）'
            "
          >
            <!-- 已锁定：闭锁 SVG 图标 -->
            <svg
              v-if="char.locked"
              class="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            <!-- 未锁定：开锁 SVG 图标 -->
            <svg
              v-else
              class="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </button>

          <!-- 头像容器 -->
          <div
            class="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#45a6d5] dark:text-sky-400 font-black flex items-center justify-center border border-sky-100 dark:border-sky-900/60 shadow-xs overflow-hidden shrink-0"
          >
            <img
              v-if="char.profileImage"
              :src="char.profileImage"
              alt="avatar"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xs">{{
              char.characterName ? char.characterName.charAt(0) : "角"
            }}</span>
          </div>

          <!-- 角色基本信息（增加 min-w-0 与 truncate 防止挤压换行） -->
          <div
            class="min-w-0 flex-1 cursor-pointer select-none"
            @click="emit('task-click', char, '', 'globalModifyCharacter')"
          >
            <!-- 角色名称与职业标签 -->
            <div
              class="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5"
            >
              <span class="truncate max-w-[110px]">{{
                char.characterName || "未命名角色"
              }}</span>
              <span
                class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 shrink-0"
              >
                {{ char.className || "选择职业" }}
              </span>
            </div>

            <!-- 等级、种族、服务器（极简紧凑） -->
            <div
              class="text-[9px] font-bold text-slate-400 dark:text-slate-400 mt-0.5 flex items-center gap-1 truncate"
            >
              <span>Lv.{{ char.characterLevel || 1 }}</span>
              <span>·</span>
              <span class="truncate">{{ char.raceName || "未知种族" }}</span>
              <template v-if="char.serverName">
                <span>·</span>
                <span class="truncate">{{ char.serverName }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 模式一：基础数值指标（非 simple 模式或 custom 模式下显示） ================= -->
      <div
        v-if="
          currentMode !== 'simple' && (currentMode !== 'custom' || fields.showCombatPower)
        "
        class="grid grid-cols-2 gap-3"
        @click="emit('task-click', char, '', 'globalModifyCharacter')"
      >
        <div
          class="bg-white dark:bg-slate-900/80 p-3 rounded-2xl border-2 border-yellow-100 dark:border-yellow-900/40 shadow-sm flex flex-col justify-between space-y-1"
        >
          <div
            class="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase leading-none"
          >
            装等
          </div>
          <div class="text-yellow-600 dark:text-yellow-400 font-black text-xs">
            {{ char.itemLevel || char.equipmentScore || "N/A" }}
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900/80 p-3 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between space-y-1"
        >
          <div
            class="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase leading-none"
          >
            战斗力
          </div>
          <div class="text-emerald-700 dark:text-emerald-400 font-black text-xs">
            {{ formatCombatPower(char.combatPower) }}
          </div>
        </div>
      </div>

      <!-- ================= 模式二：副本及核心进度区 ================= -->
      <div
        v-if="
          currentMode !== 'simple' && (currentMode !== 'custom' || fields.showDungeons)
        "
        class="space-y-2 text-xs"
      >
        <!-- 1. 远征副本 -->
        <div
          class="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400"
          >
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#45a6d5]"></span> 远征副本
            </span>
            <span class="font-black text-[#45a6d5] dark:text-sky-400">
              今日已刷: {{ getTodayRunCount(char, "expedition") }} 次
            </span>
          </div>
          <div
            class="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium px-2"
          >
            <span
              >奥德可刷:
              <strong class="text-[#45a6d5] dark:text-sky-400 text-[11px]">{{
                calcRunsByEnergy(char, "expedition")
              }}</strong>
              次</span
            >
          </div>
          <!-- 组内收益（读取 groups） -->
          <div
            class="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-xl px-2 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between"
          >
            <span>组内收益:</span>
            <span class="truncate">{{
              getGroupDecayInfo(char.group, "expedition")
            }}</span>
          </div>
        </div>

        <!-- 2. 超越副本 -->
        <div
          class="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400"
          >
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 超越副本
            </span>
            <span class="font-black text-purple-600 dark:text-purple-400">
              今日已刷: {{ getTodayRunCount(char, "surpass") }} 次
            </span>
          </div>
          <div
            class="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium px-2"
          >
            <span
              >奥德可刷:
              <strong class="text-purple-500 dark:text-purple-400 text-[11px]">{{
                calcRunsByEnergy(char, "surpass")
              }}</strong>
              次</span
            >
          </div>
          <!-- 组内收益（读取 groups） -->
          <div
            class="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-xl px-2 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between"
          >
            <span>组内收益:</span>
            <span class="truncate">{{ getGroupDecayInfo(char.group, "surpass") }}</span>
          </div>
        </div>

        <!-- ================= 3. 圣域副本 (角色独立，每周三5点重置) ================= -->
        <div
          v-if="
            currentMode !== 'simple' && (currentMode !== 'custom' || fields.showSanctuary)
          "
          class="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
        >
          <div
            class="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400"
          >
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 圣域副本
            </span>
          </div>

          <!-- 遍历 sanctuary 中的所有 Boss 配置 -->
          <div class="grid grid-cols-3 gap-1.5 pt-1">
            <div
              v-for="(maxLimit, bossKey) in char.sanctuary || { s1: 1, s2: 1, s3: 1 }"
              :key="bossKey"
              class="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-xl px-2 py-1.5 flex flex-col items-center justify-center gap-0.5"
            >
              <span
                class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase"
                >{{ bossKey }}</span
              >
              <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                剩余次数:
                {{ char.sanctuary?.[bossKey] - (char.sanctuaryRuns?.[bossKey] || 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 模式三：奥德能量进度 ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showEnergy)"
        class="p-3.5 bg-gradient-to-br from-slate-50/90 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-2.5 shadow-sm transition-all hover:shadow dark:hover:border-slate-600"
        @click="emit('task-click', char, '', 'globalSimpleEnergy')"
      >
        <!-- 头部：标题与数值概览 -->
        <div class="flex items-center justify-between text-xs">
          <span
            class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
          >
            <span
              class="w-2 h-2 rounded-full bg-gradient-to-r from-[#45a6d5] to-amber-500 shadow-sm"
            ></span>
            奥德能量
          </span>
          <div class="flex items-center gap-1 text-xs font-black">
            <span
              class="text-[#45a6d5] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded-md border border-sky-100 dark:border-sky-900"
              title="基础奥德"
              >{{ char.energy || 0 }}</span
            >
            <span class="text-slate-300 dark:text-slate-600 font-normal">+</span>
            <span
              class="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900"
              title="存储奥德"
              >{{ char.storedEnergy || 0 }}</span
            >
            <span class="text-slate-400 dark:text-slate-500 font-medium ml-0.5"
              >/ {{ getGroup(char.group).premiumMember ? 840 : 560 }}</span
            >
          </div>
        </div>

        <!-- 组合进度条主体 -->
        <div
          class="w-full bg-slate-200/70 dark:bg-slate-700/80 h-2.5 rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-600 shadow-inner"
        >
          <!-- 基础奥德进度条 -->
          <div
            class="bg-gradient-to-r from-[#3998c7] to-[#45a6d5] dark:from-[#2e82ab] dark:to-[#3894c2] h-full rounded-l-full transition-all duration-500 relative"
            :style="{
              width: `${Math.min(
                100,
                Math.max(0, ((char.energy || 0) / (char.premiumMember ? 840 : 560)) * 100)
              )}%`,
            }"
            :title="`基础奥德: ${char.energy || 0}`"
          ></div>
          <!-- 存储奥德进度条 -->
          <div
            class="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 h-full rounded-r-full transition-all duration-500 relative opacity-95"
            :style="{
              width: `${Math.min(
                100 -
                  Math.min(
                    100,
                    ((char.energy || 0) / (char.premiumMember ? 840 : 560)) * 100
                  ),
                ((char.storedEnergy || 0) / (char.premiumMember ? 840 : 560)) * 100
              )}%`,
            }"
            :title="`存储奥德: ${char.storedEnergy || 0}`"
          ></div>
        </div>

        <!-- 底部：图例与总计 -->
        <div
          class="flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-0.5 px-0.5"
        >
          <div class="flex items-center gap-2.5">
            <span class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span class="w-1.5 h-1.5 rounded-full bg-[#45a6d5]"></span>
              基础
            </span>
            <span class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              存储
            </span>
          </div>
          <span class="text-slate-500 dark:text-slate-400">
            总计:
            <strong class="text-slate-700 dark:text-slate-200 font-bold">{{
              (char.energy || 0) + (char.storedEnergy || 0)
            }}</strong>
            点
          </span>
        </div>
      </div>
      <!-- ================= 共享玩法统一样式区（同一行：每日副本、古树庆典、次元袭击） ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showTasks)"
        class="grid grid-cols-3 gap-2 pt-1"
      >
        <!-- 1. 每日副本 (服务器共享，周三5点，固定14次+存储上限) -->
        <button
          type="button"
          class="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col items-start gap-1 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left shadow-sm group"
          @click="emit('task-click', char, 'dailyRuns', 'weeklydaily')"
        >
          <div class="w-full flex items-center justify-between">
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[10px] truncate"
              >每日副本</span
            >
            <span
              class="text-[8px] text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1 rounded border border-cyan-100 dark:border-cyan-900/80"
              >共享</span
            >
          </div>
          <div class="w-full flex items-center justify-between text-[11px] font-black">
            <span class="text-cyan-600 dark:text-cyan-400 tracking-tight">
              剩余{{
                getGroupSharedTaskData(char.group, "dailyRuns", "storedDailyRuns", 14)
                  .total
              }}次
            </span>
          </div>
        </button>

        <!-- 2. 古树庆典 (服务器共享，每天5点恢复2次，上限14) -->
        <button
          type="button"
          class="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col items-start gap-1 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left shadow-sm group"
          @click="emit('task-click', char, 'minigameCount', 'weeklydaily')"
        >
          <div class="w-full flex items-center justify-between">
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[10px] truncate"
              >古树庆典</span
            >
            <span
              class="text-[8px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1 rounded border border-amber-100 dark:border-amber-900/80"
              >共享</span
            >
          </div>
          <div class="w-full flex items-center justify-between text-[11px] font-black">
            <span class="text-amber-600 dark:text-amber-400 tracking-tight">
              剩余{{
                getGroupSharedTaskData(
                  char.group,
                  "minigameCount",
                  "storedMinigameCount",
                  14
                ).total
              }}次
            </span>
          </div>
        </button>

        <!-- 3. 次元袭击 (服务器共享，每天5点恢复2次，上限14) -->
        <button
          type="button"
          class="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col items-start gap-1 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left shadow-sm group"
          @click="emit('task-click', char, 'dimensionalCount', 'weeklydaily')"
        >
          <div class="w-full flex items-center justify-between">
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[10px] truncate"
              >次元袭击</span
            >
            <span
              class="text-[8px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1 rounded border border-rose-100 dark:border-rose-900/80"
              >共享</span
            >
          </div>
          <div class="w-full flex items-center justify-between text-[11px] font-black">
            <span class="text-rose-600 dark:text-rose-400 tracking-tight">
              剩余{{
                getGroupSharedTaskData(
                  char.group,
                  "dimensionalCount",
                  "storedDimensionalCount",
                  14
                ).total
              }}次
            </span>
          </div>
        </button>
      </div>

      <!-- ================= 角色/共享玩法统一样式区（同一行：噩梦副本、觉醒、战场） ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showTasks)"
        class="grid grid-cols-3 gap-2 pt-1"
      >
        <!-- 1. 噩梦副本 (角色独立，有存储次数) -->
        <button
          type="button"
          class="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col items-start gap-1 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left shadow-sm group"
          @click="emit('task-click', char, 'nightmareCount', 'weeklydaily')"
        >
          <div class="w-full flex items-center justify-between">
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[10px] truncate"
              >噩梦副本</span
            >
            <span
              class="text-[8px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1 rounded border border-purple-100 dark:border-purple-900/80"
              >角色</span
            >
          </div>
          <div class="w-full flex items-center justify-between text-[11px] font-black">
            <span class="text-purple-600 dark:text-purple-400 tracking-tight">
              剩余{{
                getCharacterSharedTaskData(
                  char,
                  "nightmareCount",
                  "storedNightmareCount",
                  14
                ).total
              }}次
            </span>
          </div>
        </button>

        <!-- 2. 觉醒 (角色独立，上限30次或3次，带存储) -->
        <button
          type="button"
          class="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col items-start gap-1 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left shadow-sm group"
          @click="emit('task-click', char, 'awakening', 'weeklydaily')"
        >
          <div class="w-full flex items-center justify-between">
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[10px] truncate"
              >觉醒</span
            >
            <span
              class="text-[8px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1 rounded border border-indigo-100 dark:border-indigo-900/80"
              >角色</span
            >
          </div>
          <div class="w-full flex items-center justify-between text-[11px] font-black">
            <span class="text-indigo-600 dark:text-indigo-400 tracking-tight">
              剩余{{
                getCharacterSharedTaskData(char, "awakening", "storedAwakening", 30)
                  .total
              }}次
            </span>
          </div>
        </button>

        <!-- 3. 战场 (角色独立，无存储字段) -->
        <button
          type="button"
          class="p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex flex-col items-start gap-1 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left shadow-sm group"
          @click="emit('task-click', char, 'battlefield', 'weeklydaily')"
        >
          <div class="w-full flex items-center justify-between">
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[10px] truncate"
              >战场</span
            >
            <span
              class="text-[8px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded border border-emerald-100 dark:border-emerald-900/80"
              >角色</span
            >
          </div>
          <div class="w-full flex items-center justify-between text-[11px] font-black">
            <span class="text-emerald-600 dark:text-emerald-400 tracking-tight">
              剩余{{ char.battlefield }}次
            </span>
          </div>
        </button>
      </div>
      <!-- ================= 首页精简版：角色奥德展示卡片 ================= -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <!-- 1. 微风商店 - 角色奥德 -->
        <div
          class="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between shadow-xs transition-all hover:border-[#45a6d5]/50 hover:bg-sky-50/30 dark:hover:bg-sky-950/30 cursor-pointer"
          @click="emit('task-click', char, 'breezeCharOd', 'exchangeCharOD')"
          v-if="getGroup(char.group).premiumMember"
        >
          <div class="flex items-center gap-1.5 min-w-0">
            <div class="w-1.5 h-1.5 rounded-full bg-[#45a6d5] shrink-0"></div>
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[11px] truncate"
              >商店奥德</span
            >
          </div>
          <div class="flex items-center gap-1 font-black text-[11px] shrink-0">
            <span
              :class="
                (char.breezeCharOd || 0) >= 4
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-[#45a6d5] dark:text-sky-400'
              "
            >
              {{ char.breezeCharOd || 0 }}
            </span>
            <span class="text-slate-300 dark:text-slate-600 font-normal">/ 4</span>
            <span
              class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]"
              :class="
                (char.breezeCharOd || 0) >= 4
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/80'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700'
              "
            >
              <template v-if="(char.breezeCharOd || 0) >= 4">✓</template>
              <template v-else>
                <svg
                  class="w-2 h-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                </svg>
              </template>
            </span>
          </div>
        </div>

        <!-- 2. 物质变换 - 角色奥德 -->
        <div
          class="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between shadow-xs transition-all hover:border-amber-400/50 hover:bg-amber-50/30 dark:hover:bg-amber-950/30 cursor-pointer"
          @click="emit('task-click', char, 'materialCharOd', 'exchangeCharOD')"
        >
          <div class="flex items-center gap-1.5 min-w-0">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></div>
            <span
              class="font-bold text-slate-700 dark:text-slate-200 text-[11px] truncate"
              >变换奥德</span
            >
          </div>
          <div class="flex items-center gap-1 font-black text-[11px] shrink-0">
            <span
              :class="
                (char.materialCharOd || 0) >= 4
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              "
            >
              {{ char.materialCharOd || 0 }}
            </span>
            <span class="text-slate-300 dark:text-slate-600 font-normal">/ 4</span>
            <span
              class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]"
              :class="
                (char.materialCharOd || 0) >= 4
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/80'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700'
              "
            >
              <template v-if="(char.materialCharOd || 0) >= 4">✓</template>
              <template v-else>
                <svg
                  class="w-2 h-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                </svg>
              </template>
            </span>
          </div>
        </div>
      </div>

      <!-- ================= 模式五：备注输入框 ================= -->
      <div
        v-if="currentMode !== 'simple' && (currentMode !== 'custom' || fields.showNotes)"
      >
        <textarea
          :value="char.note || ''"
          :disabled="char.locked"
          placeholder="点击添加备注信息..."
          rows="2"
          @change="(e) => emit('text-change', char, 'note', e.target.value)"
          class="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#45a6d5] resize-none disabled:bg-slate-100"
        ></textarea>
      </div>

      <!-- 底部操作与元信息标签（所有模式均展示） -->
      <!-- <div
        class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] font-bold text-slate-400"
      >
        <span>分组: {{ getGroupName(char.group) }}</span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1 rounded-xl transition-all font-black text-[10px]"
            :class="
              char.locked
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            "
            :disabled="char.locked"
            @click="emit('delete', char)"
            :title="char.locked ? '角色已锁定，无法删除（需先解锁）' : '删除角色'"
          >
            删除
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

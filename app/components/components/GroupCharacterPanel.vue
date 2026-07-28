<script setup>
import { computed, watch } from "vue";
import { formatCombatPower } from "~/utils/formatCombatPower";
//远征副本，超越副本，圣域副本获得吉纳数和消耗奥德能量
const KinahOdSate = {
  // 远征副本
  expedition: [
    {
      stars: 6,
      name: "堕落守护者之城",
      difficulties: [
        { mode: "困难", energy: 120, kina: 360, boundKina: 0, total: 360 },
        { mode: "普通", energy: 80, kina: 201, boundKina: 0, total: 201 },
      ],
    },
    {
      stars: 5,
      name: "青息之岛",
      difficulties: [
        { mode: "困难", energy: 80, kina: 201, boundKina: 0, total: 201 },
        { mode: "普通", energy: 80, kina: 162, boundKina: 0, total: 162 },
      ],
    },
    {
      stars: 5,
      name: "幻影回廊",
      difficulties: [
        { mode: "困难", energy: 80, kina: 201, boundKina: 0, total: 201 },
        { mode: "普通", energy: 80, kina: 162, boundKina: 0, total: 162 },
      ],
    },
    {
      stars: 4,
      name: "无之摇篮",
      difficulties: [
        { mode: "困难", energy: 80, kina: 162, boundKina: 0, total: 162 },
        { mode: "普通", energy: 80, kina: 60, boundKina: 60, total: 120 },
      ],
    },
    {
      stars: 4,
      name: "死亡德拉玛塔巢穴",
      difficulties: [
        { mode: "困难", energy: 80, kina: 162, boundKina: 0, total: 162 },
        { mode: "普通", energy: 80, kina: 60, boundKina: 60, total: 120 },
      ],
    },
    {
      stars: 3,
      name: "凶猛的角窟",
      difficulties: [
        { mode: "困难", energy: 80, kina: 51, boundKina: 51, total: 102 },
        { mode: "普通", energy: 80, kina: 0, boundKina: 102, total: 102 },
      ],
    },
    {
      stars: 3,
      name: "火之神殿",
      difficulties: [
        { mode: "困难", energy: 80, kina: 51, boundKina: 51, total: 102 },
        { mode: "普通", energy: 80, kina: 0, boundKina: 102, total: 102 },
      ],
    },
    {
      stars: 2,
      name: "巴克隆空中岛",
      difficulties: [
        { mode: "困难", energy: 80, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 80, kina: 0, boundKina: 81, total: 81 },
      ],
    },
    {
      stars: 2,
      name: "乌努库库峡谷",
      difficulties: [
        { mode: "困难", energy: 80, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 80, kina: 0, boundKina: 81, total: 81 },
      ],
    },
    {
      stars: 1,
      name: "德拉乌伯尼尔",
      difficulties: [
        { mode: "困难", energy: 80, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 80, kina: 0, boundKina: 60, total: 60 },
      ],
    },
    {
      stars: 1,
      name: "克洞穴",
      difficulties: [
        { mode: "困难", energy: 80, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 80, kina: 0, boundKina: 60, total: 60 },
      ],
    },
  ],

  // 超越副本
  surpass: [
    {
      stars: 4,
      name: "深渊角窟",
      difficulties: [
        { mode: "阶段4", energy: 120, kina: 420, boundKina: 0, total: 420 },
        { mode: "阶段3", energy: 80, kina: 240, boundKina: 0, total: 240 },
        { mode: "阶段2", energy: 80, kina: 201, boundKina: 0, total: 201 },
        { mode: "阶段1", energy: 80, kina: 171, boundKina: 0, total: 171 },
      ],
    },
    {
      stars: 3,
      name: "绯红羁绊之镜",
      difficulties: [
        { mode: "阶段4", energy: 80, kina: 240, boundKina: 0, total: 240 },
        { mode: "阶段3", energy: 80, kina: 201, boundKina: 0, total: 201 },
        { mode: "阶段2", energy: 80, kina: 171, boundKina: 0, total: 171 },
        { mode: "阶段1", energy: 80, kina: 150, boundKina: 0, total: 150 },
      ],
    },
    {
      stars: 2,
      name: "沉没的生命神殿",
      difficulties: [
        { mode: "阶段4", energy: 80, kina: 75, boundKina: 75, total: 150 },
        { mode: "阶段3", energy: 80, kina: 72, boundKina: 69, total: 141 },
        { mode: "阶段2", energy: 80, kina: 66, boundKina: 66, total: 132 },
        { mode: "阶段1", energy: 80, kina: 60, boundKina: 60, total: 120 },
      ],
    },
    {
      stars: 1,
      name: "破碎的雅尔卡尼斯",
      difficulties: [
        { mode: "阶段4", energy: 80, kina: 0, boundKina: 114, total: 114 },
        { mode: "阶段3", energy: 80, kina: 0, boundKina: 90, total: 90 },
        { mode: "阶段2", energy: 80, kina: 0, boundKina: 72, total: 72 },
        { mode: "阶段1", energy: 80, kina: 0, boundKina: 60, total: 60 },
      ],
    },
    {
      stars: 1,
      name: "德乌斯研究基地",
      difficulties: [
        { mode: "阶段4", energy: 80, kina: 0, boundKina: 114, total: 114 },
        { mode: "阶段3", energy: 80, kina: 0, boundKina: 90, total: 90 },
        { mode: "阶段2", energy: 80, kina: 0, boundKina: 72, total: 72 },
        { mode: "阶段1", energy: 80, kina: 0, boundKina: 60, total: 60 },
      ],
    },
  ],

  // 圣域
  sanctuary: [
    {
      stars: 5,
      name: "深渊重铸: 卢德菜",
      difficulties: [
        { mode: "默认", energy: 160, kina: 200, boundKina: 200, total: 400 },
      ],
    },
    {
      stars: 5,
      name: "侵蚀净化所",
      difficulties: [
        { mode: "默认", energy: 160, kina: 800, boundKina: 0, total: 800 },
      ],
    },
    {
      stars: 5,
      name: "穆斯费尔圣杯",
      difficulties: [
        { mode: "困难", energy: 160, kina: 1200, boundKina: 0, total: 1200 },
        { mode: "普通", energy: 160, kina: 1000, boundKina: 0, total: 1000 },
      ],
    },
  ],
};
const props = defineProps({
  activeTabGroup: {
    type: [String, Number],
    required: true,
  },
  gameData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update-character",
  "delete-character",
  "toggle-lock",
  "toggle-task",
  "play-consumption",
  "open-edit",
]);

const { $confirm, $alert } = useNuxtApp();

// 根据 activeTabGroup 过滤当前展示的角色列表
const filteredCharacters = computed(() => {
  const characters = props.gameData?.characters || [];
  const groups = props.gameData?.groups || [];
  const tab = props.activeTabGroup;

  if (tab === "all") {
    return characters;
  }
  if (tab === "default") {
    return characters.filter(
      (c) => !c.group || !groups.some((g) => g.id === c.group),
    );
  }
  return characters.filter((c) => Number(c.group) === Number(tab));
});

// 获取当前 Tab 的标题名称
const currentTabTitle = computed(() => {
  const tab = props.activeTabGroup;
  if (tab === "all") return "全部角色";
  if (tab === "default") return "默认分组";
  const found = props.gameData?.groups?.find(
    (g) => Number(g.id) === Number(tab),
  );
  return found ? found.name : "未知分组";
});

// 根据分组 ID 获取分组名称
const getGroupName = (groupId) => {
  if (!groupId) return "默认分组";
  const found = props.gameData?.groups?.find(
    (g) => Number(g.id) === Number(groupId),
  );
  return found ? found.name : "默认分组";
};

// 事件抛出与处理
const handleTextChange = (char, field, value) => {
  const updatedChar = { ...char, [field]: value };
  emit("update-character", updatedChar);
};
const handleDelete = async (char) => {
  if (char.locked) return;
  try {
    await $confirm?.("确定要删除该角色吗？删除后不可恢复", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    emit("delete-character", char);
  } catch {
    // 取消删除
  }
};

const handleToggleTask = (char, field) => {
  const updatedChar = { ...char, [field]: !char[field] };
  emit("update-character", updatedChar);
};

//========================游玩消耗/补充弹框开始========================
// 打开游玩消耗/补充，弹框
const openGameplay = ref(false);
const gameplayCharForm = ref(null); //当前点击游玩消耗/补充的角色
// 定义弹窗内部的 Tab 状态
// 'consume' -> 消耗奥德分组
// 'supplement' -> 补充内容分组
const activeTab = ref("consume");

const saving = ref(false);
// 关闭弹窗方法（如果你原有的是直接改 openGameplay = false 也可以用下面的方式绑定 emit）
const handleClose = () => {
  emit("update:openGameplay", false);
};

// 检查同组是否有角色已配置过挑战次数
const hasGroupDailyRuns = computed(() => {
  const currentGroup = props.gameplayCharForm?.group;
  const currentCharId = props.gameplayCharForm?.characterId;
  const characters = props.gameData?.characters || [];

  return characters.some((c) => {
    const cId = c.id ?? c.characterId;
    const isSameGroup =
      (!c.group && !currentGroup) || Number(c.group) === Number(currentGroup);
    return isSameGroup && cId !== currentCharId && (c.dailyRuns || 0) > 0;
  });
});

// 获取同组已配置的挑战次数数值
const getGroupDailyRunsValue = computed(() => {
  const currentGroup = props.gameplayCharForm?.group;
  const currentCharId = props.gameplayCharForm?.characterId;
  const characters = props.gameData?.characters || [];

  const found = characters.find((c) => {
    const cId = c.id ?? c.characterId;
    const isSameGroup =
      (!c.group && !currentGroup) || Number(c.group) === Number(currentGroup);
    return isSameGroup && cId !== currentCharId && (c.dailyRuns || 0) > 0;
  });
  return found ? found.dailyRuns : 0;
});

// 奥德能量上限计算（高级会员840，普通560）
const energyLimit = computed(() => {
  const isPremium =
    props.gameplayCharForm?.premiumMember ||
    (props.gameData?.characters || []).some(
      (c) =>
        Number(c.group) === Number(props.gameplayCharForm?.group) &&
        c.premiumMember,
    );
  return isPremium ? 840 : 560;
});

// 补充奥德能量上限计算（2000）
const storedEnergyLimit = computed(() => {
  return 2000;
});

// 存储补充的独立累加表单状态
const addODForm = ref({
  bigOdCount: 0,
  smallOdCount: 0,
});

// 计算大奥德提供的总点数 (每个40点)
const bigOdTotalPoints = computed(() => {
  return (addODForm.value.bigOdCount || 0) * 40;
});

// 计算小奥德提供的总点数 (每个10点)
const smallOdTotalPoints = computed(() => {
  return (addODForm.value.smallOdCount || 0) * 10;
});

// 计算本次总共补充的奥德能量之和
const totalSupplementPoints = computed(() => {
  return bigOdTotalPoints.value + smallOdTotalPoints.value;
});

// 计数器加减操作
const handleUpdateOdCount = (type, delta) => {
  if (type === "big") {
    addODForm.value.bigOdCount = Math.max(
      0,
      (addODForm.value.bigOdCount || 0) + delta,
    );
  } else if (type === "small") {
    addODForm.value.smallOdCount = Math.max(
      0,
      (addODForm.value.smallOdCount || 0) + delta,
    );
  }
};
// 执行存储奥德能量补充确认
const handleExecuteSupplement = async () => {
  // 把这里改成你实际绑定的表单变量名（例如 form、charForm 等）
  const currentStored = gameplayCharForm.value.storedEnergy || 0;
  const maxLimit = 2000;

  // 计算本次新增的总能量（大奥德每个40点，小奥德每个10点）
  const addedPoints =
    (addODForm.value.bigOdCount || 0) * 40 +
    (addODForm.value.smallOdCount || 0) * 10;

  if (addedPoints <= 0) {
    $alert("请先选择或输入要补充的大/小奥德数量！");
    return;
  }

  // 计算加和后的新能量（不能超过上限 2000）
  const newStoredEnergy = Math.min(maxLimit, currentStored + addedPoints);

  // 1. 组装更新后的完整角色对象
  const updatedCharacter = {
    ...gameplayCharForm.value,
    storedEnergy: newStoredEnergy,
  };

  // 2. 更新你当前的表单响应式数据
  gameplayCharForm.value = updatedCharacter;

  // 3. 直接调用更新/保存方法进行持久化
  emit("update-character", updatedCharacter);

  // 4. 补充成功后，清空本次的累加计数器，方便下次继续追加
  addODForm.value.bigOdCount = 0;
  addODForm.value.smallOdCount = 0;

  $alert(`成功补充 ${addedPoints} 点奥德能量并已保存！`);
};

//消耗奥德
// 1. 初始化消耗表单（优先读取 localStorage 记忆，如果没有则给默认值）
const consumeForm = ref({
  dungeonType: localStorage.getItem("aion2_last_dungeon_type") || "expedition",
  selectedDungeonIndex:
    Number(localStorage.getItem("aion2_last_dungeon_idx")) || 0,
  selectedDiffIndex: Number(localStorage.getItem("aion2_last_diff_idx")) || 0,
  multiplier: Number(localStorage.getItem("aion2_last_multiplier")) || 1,
});

// 2. 当前大类对应的副本列表
const currentDungeonList = computed(() => {
  return KinahOdSate[consumeForm.value.dungeonType] || [];
});

// 3. 当前具体副本对应的难度/阶段列表
const currentDifficultiesList = computed(() => {
  const list = currentDungeonList.value;
  const dungeon = list[consumeForm.value.selectedDungeonIndex];
  return dungeon ? dungeon.difficulties : [];
});

// 切换副本大类时，自动把索引重置为 0 防止数组越界
const handleSelectDungeonType = (type) => {
  consumeForm.value.dungeonType = type;
  consumeForm.value.selectedDungeonIndex = 0;
  consumeForm.value.selectedDiffIndex = 0;
};

// 监听具体副本切换，自动把难度索引重置为 0
watch(
  () => consumeForm.value.selectedDungeonIndex,
  () => {
    consumeForm.value.selectedDiffIndex = 0;
  },
);

// 4. 动态计算：最终奥德消耗
const calculatedEnergyCost = computed(() => {
  const diffs = currentDifficultiesList.value;
  const diff = diffs[consumeForm.value.selectedDiffIndex];
  const baseEnergy = diff ? diff.energy : 80;
  return baseEnergy * consumeForm.value.multiplier;
});

// 5. 动态计算：吉纳收益（基纳、绑基、合计，均乘以倍数）
const calculatedKinaGain = computed(() => {
  const diffs = currentDifficultiesList.value;
  const diff = diffs[consumeForm.value.selectedDiffIndex];
  return (diff ? diff.kina : 0) * consumeForm.value.multiplier;
});

const calculatedBoundKinaGain = computed(() => {
  const diffs = currentDifficultiesList.value;
  const diff = diffs[consumeForm.value.selectedDiffIndex];
  return (diff ? diff.boundKina : 0) * consumeForm.value.multiplier;
});

const calculatedTotalGain = computed(() => {
  const diffs = currentDifficultiesList.value;
  const diff = diffs[consumeForm.value.selectedDiffIndex];
  return (diff ? diff.total : 0) * consumeForm.value.multiplier;
});

// 6. 自动持久化记忆到 localStorage
watch(
  () => consumeForm.value.dungeonType,
  (val) => localStorage.setItem("aion2_last_dungeon_type", val),
);
watch(
  () => consumeForm.value.selectedDungeonIndex,
  (val) => localStorage.setItem("aion2_last_dungeon_idx", val),
);
watch(
  () => consumeForm.value.selectedDiffIndex,
  (val) => localStorage.setItem("aion2_last_diff_idx", val),
);
watch(
  () => consumeForm.value.multiplier,
  (val) => localStorage.setItem("aion2_last_multiplier", val),
);

// 7. 执行扣除奥德逻辑
// 7. 执行扣除奥德逻辑（优先扣基础奥德，不足部分扣存储奥德）
const handleExecuteConsume = async () => {
  const cost = calculatedEnergyCost.value;
  const currentEnergy = gameplayCharForm.value?.energy || 0;
  const currentStored = gameplayCharForm.value?.storedEnergy || 0;

  // 检查总奥德（基础 + 存储）是否足够支付本次消耗
  if (currentEnergy + currentStored < cost) {
    alert("当前角色的基础奥德与存储奥德总和不足，无法完成本次消耗！");
    return;
  }

  let newEnergy = currentEnergy;
  let newStored = currentStored;

  if (currentEnergy >= cost) {
    // 情况1：基础奥德足够直接全部从基础奥德扣
    newEnergy = currentEnergy - cost;
  } else {
    // 情况2：基础奥德不够，先把基础奥德扣光（剩0），剩下的差额从存储奥德中扣
    const remainingCost = cost - currentEnergy;
    newEnergy = 0;
    newStored = Math.max(0, currentStored - remainingCost);
  }

  // 组装更新后的角色表单对象
  const updatedCharacter = {
    ...gameplayCharForm.value,
    energy: newEnergy,
    storedEnergy: newStored,
  };

  // 1. 更新当前表单响应式数据
  gameplayCharForm.value = updatedCharacter;

  // 2. 触发父组件更新或直接调用你的持久化保存方法
  if (typeof groupCharacterPanelHandleUpdateCharacter === "function") {
    await groupCharacterPanelHandleUpdateCharacter(updatedCharacter);
  } else {
    emit("update:update-character", updatedCharacter);
  }

  $alert(
    `消耗成功！扣除基础奥德：${currentEnergy - newEnergy} 点，存储奥德：${currentStored - newStored} 点`,
  );
};

//========================游玩消耗/补充弹框结束========================

watch(
  () => gameplayCharForm.value,
  (val) => {
    if (val) {
      console.log(
        `🔍 [GroupCharacterPanel:530] %c gameplayCharForm当前角色数据: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        val,
      );
    }
  },
);
</script>

<template>
  <div class="space-y-6">
    <!-- 分组头部信息展示 -->
    <!-- <div
      class="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-[#45a6d5]"></div>
        <div>
          <h2 class="text-base font-black text-slate-800">
            {{ currentTabTitle }}
          </h2>
          <p class="text-xs font-bold text-slate-400">
            当前分组共有 {{ filteredCharacters.length }} 个角色
          </p>
        </div>
      </div>
    </div> -->

    <!-- 角色卡片列表网格 -->
    <div
      v-if="filteredCharacters.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <div
        v-for="char in filteredCharacters"
        :key="char.characterId || char.id"
        class="relative bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-4 border-[#45a6d5] transition-all flex flex-col overflow-hidden"
        :class="char.locked ? 'opacity-95 bg-slate-50/50' : ''"
      >
        <!-- 右上角“游玩消耗”精致角标按钮 -->
        <button
          type="button"
          class="absolute top-0 right-0 px-3.5 py-1.5 bg-gradient-to-l from-purple-500 to-indigo-500 text-white font-black text-[12px] rounded-bl-2xl shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-all tracking-wider z-10"
          @click="
            gameplayCharForm = char;
            openGameplay = true;
          "
        >
          点击进行游玩消耗/补充
        </button>

        <!-- 顶部标题栏 -->
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-3 pr-16"
        >
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="w-8 h-8 rounded-xl flex items-center justify-center border text-xs font-bold transition-all shadow-sm"
              :class="
                char.locked
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              "
              @click="emit('toggle-lock', char)"
              :title="
                char.locked
                  ? '已锁定（点击解锁以允许删除）'
                  : '未锁定（点击锁定以防止误删）'
              "
            >
              {{ char.locked ? "🔒" : "🔓" }}
            </button>
            <div
              class="w-10 h-10 rounded-2xl bg-sky-50 text-[#45a6d5] font-black flex items-center justify-center border border-sky-100 shadow-sm overflow-hidden"
            >
              <img
                v-if="char.profileImage"
                :src="char.profileImage"
                alt="avatar"
                class="w-full h-full object-cover"
              />
              <span v-else>{{
                char.characterName ? char.characterName.charAt(0) : "角"
              }}</span>
            </div>
            <div>
              <div
                class="text-sm font-black text-slate-800 flex items-center gap-2"
              >
                <span>{{ char.characterName || "未命名角色" }}</span>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                >
                  {{ char.className || "选择职业" }}
                </span>
              </div>
              <div
                class="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-2"
              >
                <span>等级: {{ char.characterLevel || 1 }}</span>
                <span>{{ char.raceName || "未知种族" }}</span>
                <span>{{ char.serverName || "未知服务器" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 基础数值指标卡片区（装等与战斗力） -->
        <div class="grid grid-cols-2 gap-3">
          <div
            class="bg-white/80 p-3 rounded-2xl border-2 border-yellow-100 shadow-sm flex flex-col justify-between space-y-1"
          >
            <div
              class="text-[10px] text-slate-400 font-black uppercase leading-none"
            >
              装等
            </div>
            <div class="text-yellow-600 font-black text-xs">
              {{ char.itemLevel || char.equipmentScore || "N/A" }}
            </div>
          </div>

          <div
            class="bg-white/80 p-3 rounded-2xl border-2 border-emerald-100 shadow-sm flex flex-col justify-between space-y-1"
          >
            <div
              class="text-[10px] text-slate-400 font-black uppercase leading-none"
            >
              战斗力
            </div>
            <div class="text-emerald-700 font-black text-xs">
              {{ formatCombatPower(char.combatPower) }}
            </div>
          </div>
        </div>

        <!-- 副本及核心进度区 -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div
            class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2 flex flex-col justify-between"
          >
            <div
              class="flex items-center justify-between text-[11px] font-bold text-slate-500"
            >
              <span>远征副本</span>
              <span class="font-black text-[#45a6d5]"
                >{{ char.dailyRuns || 0 }} / 14</span
              >
            </div>
            <div
              class="flex items-center justify-between text-[11px] font-bold text-slate-500"
            >
              <span>存储补充</span>
              <span class="font-black text-amber-600"
                >{{ char.storedDailyRuns || 0 }} / 30</span
              >
            </div>
          </div>

          <div
            class="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl space-y-2 flex flex-col justify-between"
          >
            <div
              class="flex items-center justify-between text-[11px] font-bold text-slate-500"
            >
              <span>超越副本</span>
              <span class="font-black text-purple-600"
                >{{ char.transcendRuns || 0 }} / 14</span
              >
            </div>
            <div
              class="flex items-center justify-between text-[11px] font-bold text-slate-500"
            >
              <span>存储补充</span>
              <span class="font-black text-amber-600">{{
                char.storedTranscendRuns || 0
              }}</span>
            </div>
          </div>
        </div>

        <!-- 奥德能量进度（基础 + 存储复合展示） -->
        <div
          class="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3 shadow-sm"
        >
          <!-- 头部文本与数值 -->
          <div class="flex items-center justify-between text-xs">
            <span class="font-black text-slate-700 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
              奥德能量
            </span>
            <div class="flex items-center gap-1.5 font-black text-xs">
              <span class="text-[#45a6d5]" title="基础奥德">{{
                char.energy || 0
              }}</span>
              （
              <span class="text-slate-300">+</span>
              <span class="text-amber-600" title="存储奥德">{{
                char.storedEnergy || 0
              }}</span>
              ）
              <span class="text-slate-400 font-medium"
                >/ {{ char.premiumMember ? 840 : 560 }}</span
              >
            </div>
          </div>

          <!-- 双色复合进度条 -->
          <div
            class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex p-0.5 bg-slate-100 border border-slate-200/60"
          >
            <!-- 基础奥德进度段 -->
            <div
              class="bg-[#45a6d5] h-full rounded-l-full transition-all duration-500 relative"
              :style="{
                width: `${Math.min(100, Math.max(0, ((char.energy || 0) / (char.premiumMember ? 840 : 560)) * 100))}%`,
              }"
              title="基础奥德"
            ></div>
            <!-- 存储奥德叠加段 -->
            <div
              class="bg-amber-500 h-full rounded-r-full transition-all duration-500 relative opacity-90"
              :style="{
                width: `${Math.min(100 - Math.min(100, ((char.energy || 0) / (char.premiumMember ? 840 : 560)) * 100), ((char.storedEnergy || 0) / (char.premiumMember ? 840 : 560)) * 100)}%`,
              }"
              title="存储奥德"
            ></div>
          </div>

          <!-- 底部小标签提示 -->
          <div
            class="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-0.5"
          >
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#45a6d5]"></span> 基础
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1"></span>
              存储
            </span>
            <span
              >总计:
              <strong class="text-slate-700">{{
                (char.energy || 0) + (char.storedEnergy || 0)
              }}</strong>
              点</span
            >
          </div>
        </div>

        <!-- 任务状态按钮组 -->
        <div class="grid grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="
              char.dailyMission
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            "
            @click="handleToggleTask(char, 'dailyMission')"
          >
            日常任务
          </button>
          <button
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="
              char.dailySignIn
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            "
            @click="handleToggleTask(char, 'dailySignIn')"
          >
            每日签到
          </button>
          <button
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="
              char.awakening
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            "
            @click="handleToggleTask(char, 'awakening')"
          >
            觉醒之战
          </button>
          <button
            type="button"
            class="px-2 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm"
            :class="
              char.weeklyEnergyPurchased
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            "
            @click="handleToggleTask(char, 'weeklyEnergyPurchased')"
          >
            能量兑换
          </button>
        </div>

        <!-- 备注输入框 -->
        <div>
          <textarea
            :value="char.note || ''"
            :disabled="char.locked"
            placeholder="点击添加备注信息..."
            rows="2"
            @change="(e) => handleTextChange(char, 'note', e.target.value)"
            class="w-full bg-slate-50/70 border border-slate-200/60 p-2.5 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-[#45a6d5] resize-none disabled:bg-slate-100"
          ></textarea>
        </div>

        <!-- 底部操作与元信息标签 -->
        <div
          class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-400"
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
              @click="handleDelete(char)"
              :title="
                char.locked ? '角色已锁定，无法删除（需先解锁）' : '删除角色'
              "
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态展示 -->
    <div
      v-else
      class="bg-white border border-slate-200/80 p-12 rounded-3xl text-center space-y-3 shadow-sm"
    >
      <div
        class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center font-black"
      >
        空
      </div>
      <div class="text-sm font-black text-slate-700">当前分组下暂无角色</div>
      <p class="text-xs font-bold text-slate-400">
        请切换其他分组或新增角色来查看详细面板~
      </p>
    </div>
  </div>

  <!-- 游玩消耗/补充弹框 -->
  <Transition name="GAMEEPLAY">
    <div
      v-if="openGameplay"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm"
    >
      <div
        class="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-800 flex flex-col h-[90vh]"
      >
        <!-- 弹窗头部 -->
        <div
          class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10"
        >
          <div class="flex items-center gap-6">
            <div class="text-xl font-black tracking-wide text-slate-900">
              游玩消耗/补充
            </div>
            <!-- Tab 切换按钮组 -->
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                class="px-4 py-1.5 rounded-xl text-xs font-black transition-all"
                :class="
                  activeTab === 'consume'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                "
                @click="activeTab = 'consume'"
              >
                消耗奥德
              </button>
              <button
                type="button"
                class="px-4 py-1.5 rounded-xl text-xs font-black transition-all"
                :class="
                  activeTab === 'supplement'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                "
                @click="activeTab = 'supplement'"
              >
                补充内容
              </button>
            </div>
          </div>
          <button
            @click="openGameplay = false"
            class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
          >
            关闭
          </button>
        </div>
        <!-- 卡片一：基础身份信息 -->
        <div
          class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
              <div
                class="text-sm font-black uppercase tracking-wider text-slate-700"
              >
                基础身份信息
              </div>
            </div>
          </div>
          <div
            v-if="gameplayCharForm.characterId"
            class="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl flex items-center gap-4 transition-all"
          >
            <img
              v-if="gameplayCharForm.profileImage"
              :src="gameplayCharForm.profileImage"
              alt="头像"
              class="w-14 h-14 rounded-xl object-cover border border-sky-200 shadow-sm"
            />
            <div class="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div class="text-[10px] font-bold text-slate-400">
                  昵称 / 职业
                </div>
                <div class="text-sm font-black text-slate-800 truncate">
                  {{ gameplayCharForm.characterName || gameplayCharForm.name }}
                  <span class="text-xs font-bold text-[#45a6d5]"
                    >({{
                      gameplayCharForm.className || gameplayCharForm.class
                    }})</span
                  >
                </div>
              </div>
              <div>
                <div class="text-[10px] font-bold text-slate-400">
                  等级 / 装等
                </div>
                <div class="text-sm font-black text-slate-800">
                  Lv.{{ gameplayCharForm.characterLevel || 1 }}
                  <span class="text-xs font-bold text-amber-600"
                    >(
                    {{ formatCombatPower(gameplayCharForm.combatPower || 0) }}
                    )</span
                  >
                </div>
              </div>
              <div>
                <div class="text-[10px] font-bold text-slate-400">
                  服务器 / 种族
                </div>
                <div class="text-sm font-black text-slate-800 truncate">
                  {{ gameplayCharForm.serverName || "未知" }} ·
                  <span class="text-xs font-bold text-purple-600">{{
                    gameplayCharForm.raceName || "未知"
                  }}</span>
                </div>
              </div>
              <div>
                <div class="text-[10px] font-bold text-slate-400">称号</div>
                <div class="text-sm font-black text-slate-800 truncate">
                  {{ gameplayCharForm.titleName || "无" }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 弹窗表单主体 (卡片式布局) -->
        <div
          class="p-8 space-y-6 overflow-y-auto custom-scroll flex-1 bg-slate-50/50"
        >
          <!-- 第一个分组：消耗奥德分组内容 -->
          <div v-if="activeTab === 'consume'" class="space-y-6">
            <template
              v-if="
                gameplayCharForm?.energy > 0 ||
                gameplayCharForm?.storedEnergy > 0
              "
            >
              <!-- 副本类型与吉纳收益联动配置卡片 -->
              <div
                class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-5 shadow-sm"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div
                      class="text-sm font-black uppercase tracking-wider text-slate-700"
                    >
                      副本消耗与吉纳收益计算
                    </div>
                  </div>
                  <!-- 当前奥德状态提示 -->
                  <span class="text-xs font-bold text-slate-500">
                    当前角色奥德:
                    <strong class="text-[#45a6d5]">{{
                      gameplayCharForm?.energy || 0
                    }}</strong>
                    / {{ energyLimit }}
                  </span>
                  <span class="text-xs font-bold text-slate-500">
                    当前角色补充奥德:
                    <strong class="text-[#45a6d5]">{{
                      gameplayCharForm?.storedEnergy || 0
                    }}</strong>
                    / {{ storedEnergyLimit }}
                  </span>
                </div>

                <!-- 1. 选择副本大类 -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500"
                    >选择副本类型</label
                  >
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      class="py-2.5 px-3 rounded-2xl font-black text-xs transition-all border shadow-sm"
                      :class="
                        consumeForm.dungeonType === 'expedition'
                          ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-sky-500/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      "
                      @click="handleSelectDungeonType('expedition')"
                    >
                      远征副本
                    </button>
                    <button
                      type="button"
                      class="py-2.5 px-3 rounded-2xl font-black text-xs transition-all border shadow-sm"
                      :class="
                        consumeForm.dungeonType === 'surpass'
                          ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-sky-500/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      "
                      @click="handleSelectDungeonType('surpass')"
                    >
                      超越副本
                    </button>
                    <button
                      type="button"
                      class="py-2.5 px-3 rounded-2xl font-black text-xs transition-all border shadow-sm"
                      :class="
                        consumeForm.dungeonType === 'sanctuary'
                          ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-sky-500/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      "
                      @click="handleSelectDungeonType('sanctuary')"
                    >
                      圣域
                    </button>
                  </div>
                </div>

                <!-- 2. 选择具体副本 -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500"
                    >选择具体副本</label
                  >
                  <select
                    v-model="consumeForm.selectedDungeonIndex"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#45a6d5] outline-none font-bold text-xs text-slate-800 transition-all"
                  >
                    <option
                      v-for="(item, idx) in currentDungeonList"
                      :key="idx"
                      :value="idx"
                    >
                      {{ "⭐".repeat(item.stars) }} - {{ item.name }}
                    </option>
                  </select>
                </div>

                <!-- 3. 选择难度 / 阶段 -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500"
                    >选择难度 / 阶段</label
                  >
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="(diff, idx) in currentDifficultiesList"
                      :key="idx"
                      type="button"
                      class="py-2 px-3 rounded-xl font-black text-xs transition-all border text-center"
                      :class="
                        consumeForm.selectedDiffIndex === idx
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      "
                      @click="consumeForm.selectedDiffIndex = idx"
                    >
                      {{ diff.mode }} (耗能: {{ diff.energy }})
                    </button>
                  </div>
                </div>

                <!-- 4. 消耗倍数选择 (1倍=标准, 2倍=2倍消耗与收益, 3倍=3倍消耗与收益) -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-bold text-slate-500"
                      >消耗倍数</label
                    >
                    <span class="text-xs font-black text-amber-600">
                      最终消耗奥德: {{ calculatedEnergyCost }} 点
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="m in [1, 2, 3]"
                      :key="m"
                      type="button"
                      class="py-2 px-3 rounded-xl font-black text-xs transition-all border"
                      :class="
                        consumeForm.multiplier === m
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      "
                      @click="consumeForm.multiplier = m"
                    >
                      {{ m }} 倍
                    </button>
                  </div>
                </div>

                <!-- 5. 收益面板展示 -->
                <div
                  class="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-2"
                >
                  <div
                    class="text-xs font-black text-amber-800 flex items-center justify-between"
                  >
                    <span>预计吉纳总收益:</span>
                    <span class="text-sm font-black text-amber-700"
                      >{{ calculatedTotalGain }} 万</span
                    >
                  </div>
                  <div
                    class="grid grid-cols-2 gap-2 text-[11px] font-bold text-amber-900/70"
                  >
                    <div>
                      基纳:
                      <span class="font-black text-amber-900"
                        >{{ calculatedKinaGain }} 万</span
                      >
                    </div>
                    <div>
                      绑定基纳:
                      <span class="font-black text-amber-900"
                        >{{ calculatedBoundKinaGain }} 万</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="p-8 bg-slate-50/70 border border-slate-200/80 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-inner"
              >
                <!-- 图标外发光圆圈 -->
                <div
                  class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-sm flex items-center justify-center text-amber-500"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    ></path>
                  </svg>
                </div>

                <!-- 提示文案 -->
                <div class="space-y-1">
                  <div class="text-sm font-black text-slate-700">
                    当前角色奥德能量不足
                  </div>
                  <div class="text-xs font-bold text-slate-400">
                    请先前往“奥德存储补充”配置能量后，再进行副本消耗计算
                  </div>
                </div>

                <!-- 快捷跳转/切换到补充 Tab 的按钮（如果有的话） -->
                <button
                  type="button"
                  class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  @click="activeTab = 'supplement'"
                >
                  <span>⚡ 立即去补充奥德</span>
                </button>
              </div>
            </template>
          </div>

          <!-- 第二个分组：补充内容 -->
          <template
            v-if="activeTab === 'supplement' && gameplayCharForm.characterId"
          >
            <!-- 奥德存储补充配置卡片 -->
            <div
              class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <div
                    class="text-sm font-black uppercase tracking-wider text-slate-700"
                  >
                    奥德存储补充
                  </div>
                </div>
                <!-- 实时展示：当前存储 + 本次计算后总和 / 目标2000 -->
                <span class="text-[10px] font-black text-amber-600">
                  当前: {{ gameplayCharForm.storedEnergy || 0 }} ＋ 本次补充:
                  {{ totalSupplementPoints }} ＝ 总计:
                  {{
                    (gameplayCharForm.storedEnergy || 0) + totalSupplementPoints
                  }}
                  / 2000
                </span>
              </div>

              <div
                class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
              >
                <!-- 拆分：大奥德与小奥德的独立累加计数 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- 大奥德计数器 -->
                  <div
                    class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                  >
                    <div
                      class="flex items-center justify-between text-xs font-bold text-slate-600"
                    >
                      <span>大奥德 (每个 +40 点)</span>
                      <span class="text-amber-600 font-black"
                        >+{{ bigOdTotalPoints }}点</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all"
                        @click="handleUpdateOdCount('big', -1)"
                      >
                        -
                      </button>
                      <input
                        v-model.number="addODForm.bigOdCount"
                        type="number"
                        min="0"
                        class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                      />
                      <button
                        type="button"
                        class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black flex items-center justify-center transition-all"
                        @click="handleUpdateOdCount('big', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- 小奥德计数器 -->
                  <div
                    class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                  >
                    <div
                      class="flex items-center justify-between text-xs font-bold text-slate-600"
                    >
                      <span>小奥德 (每个 +10 点)</span>
                      <span class="text-sky-600 font-black"
                        >+{{ smallOdTotalPoints }}点</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all"
                        @click="handleUpdateOdCount('small', -1)"
                      >
                        -
                      </button>
                      <input
                        v-model.number="addODForm.smallOdCount"
                        type="number"
                        min="0"
                        class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                      />
                      <button
                        type="button"
                        class="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-black flex items-center justify-center transition-all"
                        @click="handleUpdateOdCount('small', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 汇总提示与直接输入基础存储 -->
                <div
                  class="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs"
                >
                  <span class="font-bold text-slate-500"
                    >已选奥德总数之和：<strong class="text-slate-800"
                      >{{
                        (addODForm.bigOdCount || 0) +
                        (addODForm.smallOdCount || 0)
                      }}
                      个</strong
                    ></span
                  >
                  <span class="font-bold text-slate-500"
                    >提供总能量：<strong class="text-amber-600"
                      >{{ totalSupplementPoints }} 点</strong
                    ></span
                  >
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- 弹窗底部操作按钮 -->
        <div
          class="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-4 z-10"
        >
          <button
            type="button"
            @click="showAddCharModal = false"
            class="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-all"
          >
            取消
          </button>

          <!-- 确认消耗快捷按钮 (仅在 consume 标签页且满足条件时显示) -->
          <button
            type="button"
            v-if="
              gameplayCharForm.characterId &&
              (gameplayCharForm.energy > 0 ||
                gameplayCharForm.storedEnergy > 0) &&
              calculatedEnergyCost > 0 &&
              activeTab === 'consume'
            "
            class="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            @click="handleExecuteConsume"
          >
            <span>确认消耗 {{ calculatedEnergyCost }} 点奥德并完成记录</span>
          </button>

          <!-- 确认补充按钮 (仅在 supplement 标签页且已选角色时显示) -->
          <button
            type="button"
            v-if="gameplayCharForm.characterId && activeTab === 'supplement'"
            @click="handleExecuteSupplement"
            :disabled="saving"
            class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50"
          >
            {{ saving ? "补充中..." : "确认补充" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

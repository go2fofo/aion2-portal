<script setup>
import { ref, computed, onMounted } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";
import {
  getLocalGameData,
  saveLocalGameData,
  clearLocalGameData,
} from "~/utils/indexedDb";
import {
  formatServerDisplay,
  getServerById,
  getServerShortNameById,
  getServersByRace,
  parseNameWithServerShort,
  hasValidBrackets,
} from "~/utils/aionServers";
import { formatCombatPower } from "~/utils/formatCombatPower";
import GroupCharacterPanel from "./components/GroupCharacterPanel.vue";
const client = useSupabaseClient();
const user = useSupabaseUser();

// 游戏数据结构
const gameData = ref({
  characters: [],
  accounts: [],
  groups: [
    { id: 1, name: "分组1", sort: 1 },
    { id: 2, name: "分组2", sort: 2 },
    { id: 3, name: "分组3", sort: 3 },
    { id: 4, name: "分组4", sort: 4 },
    { id: 5, name: "分组5", sort: 5 },
  ],
  groupCount: 5,
  autoRefreshEnabled: true,
  teams: [],
  accountSharedData: {},
  version: "1.0.0",
  dataType: "complete",
});
const groupOpen = ref(false);
const pickerOpen = ref(false);
const pickerOpenOther = ref({
  type: "",
});
const pickerTab = ref("search");
const { $alert, $confirm, $loading } = useNuxtApp();
// 控制新增角色弹窗状态
const showAddCharModal = ref(false);
const saving = ref(false);

// 新增角色的表单数据
const newCharForm = ref({
  sanctuary: {
    s1: 1,
    s2: 1,
    s3: 1,
  },
});

// 可选职业列表
const classOptions = [
  "魔道星",
  "治愈星",
  "护法星",
  "守护星",
  "杀星",
  "弓星",
  "剑星",
  "拳星",
];

// 计算基纳收益比例
const calculateKinaEarned = (runs, type) => {
  let rate = 1.0;
  if (type === "runs") {
    if (runs > 147) rate = 0.2;
    else if (runs > 126) rate = 0.4;
    else if (runs > 105) rate = 0.6;
    else if (runs > 84) rate = 0.8;
  } else if (type === "transcend") {
    if (runs > 98) rate = 0.2;
    else if (runs > 84) rate = 0.4;
    else if (runs > 70) rate = 0.6;
    else if (runs > 56) rate = 0.8;
  }
  return rate;
};

// 统计面板计算属性
const totalCharacters = computed(() => gameData.value.characters?.length || 0);

const totalEnergy = computed(() => {
  if (!gameData.value?.characters) return 0;
  return gameData.value?.characters?.reduce((acc, char) => {
    return acc + (char.energy || 0) + (char.storedEnergy || 0);
  }, 0);
});

const totalKinaStats = computed(() => {
  let possible = 0;
  let earned = 0;

  if (!gameData.value.characters) return { possible: 0, earned: 0 };

  gameData.value?.characters?.forEach((char) => {
    const r = char.runs || 0;
    const tr = char.transcendRuns || 0;
    possible += (r + tr) * 100;
    earned +=
      (r * calculateKinaEarned(r, "runs") +
        tr * calculateKinaEarned(tr, "transcend") * 1.5) *
      100;
  });

  return {
    possible: (possible / 10000).toFixed(2),
    earned: (earned / 10000).toFixed(2),
  };
});

// 打开新增角色弹窗
const openAddCharModal = () => {
  // const defaultAccount = gameData.value.accounts?.[0]?.id || "";
  newCharForm.value = {
    locked: true,
    sanctuary: {
      s1: 1,
      s2: 1,
      s3: 1,
    },
  };
  showAddCharModal.value = true;
};

// 数据持久化
const saveData = async () => {
  console.log(
    `🔍 [UsersAdmin:144] %c 最终保存的gameData: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData.value,
  );

  if (typeof saving !== "undefined") saving.value = true;
  if (gameData.value) {
    gameData.value.exportDate = new Date().toLocaleString();
  }

  try {
    if (
      typeof user !== "undefined" &&
      user.value &&
      typeof client !== "undefined"
    ) {
      await client.from("user_game_data").upsert(
        {
          user_id: user.value.id,
          data: gameData.value,
          updated_at: new Date(),
        },
        { onConflict: "user_id" },
      );
      $alert("数据已成功保存！");
    } else if (typeof saveLocalGameData === "function") {
      await saveLocalGameData(gameData.value);
      $alert("数据已成功保存！");
    } else {
      localStorage.setItem(
        "aion2_portal_game_data",
        JSON.stringify(gameData.value),
      );
      $alert("数据已成功保存！");
    }
  } catch (error) {
    console.error("保存数据失败:", error);
  } finally {
    if (typeof saving !== "undefined") saving.value = false;
  }
};

// 加载数据
const loadData = async () => {
  if (user.value) {
    const { data } = await client
      .from("user_game_data")
      .select("data")
      .eq("user_id", user.value.id)
      .single();

    if (data && data.data) {
      gameData.value = data.data;
    } else {
      const localData = await getLocalGameData();
      if (localData) {
        gameData.value = localData;
        await saveData();
        await clearLocalGameData();
      }
    }
  } else {
    const localData = await getLocalGameData();
    if (localData) {
      gameData.value = localData;
    }
  }
};

//==========================================添加成员开始=========================================
const searchRaceId = ref(2);
const searchServerId = ref(2018);
const searchServerOptions = computed(() =>
  getServersByRace(searchRaceId.value),
);
const filteredLegionMembers = computed(() => {
  const kw = legionKeyword.value.trim().toLowerCase();
  if (!kw) return legionMembers.value;
  return legionMembers.value.filter((m) =>
    String(m.name || "")
      .toLowerCase()
      .includes(kw),
  );
});
const legionLoading = ref(false);
const legionMembers = ref([]);
const legionKeyword = ref("");

const fetchLegionMembers = async () => {
  legionLoading.value = true;
  try {
    const { data } = await supabase
      .from("legion_members")
      .select(
        "character_id,name,server_id,server_name,race_id,race_name,level,class_name",
      )
      .order("updated_at", { ascending: false })
      .limit(200);
    legionMembers.value = data || [];
  } finally {
    legionLoading.value = false;
  }
};
const myKeyword = ref("");
const mySaving = ref({});
// 我的角色
const filteredMyMembers = computed(() => {
  const kw = myKeyword.value.trim().toLowerCase();
  if (!kw) return gameData.value?.characters || [];
  return gameData.value?.characters?.filter((m) => {
    const n = String(m.character_name || "").toLowerCase();
    const r = String(m.remark || "").toLowerCase();
    const s = String(m.server_short_name || "").toLowerCase();
    return n.includes(kw) || r.includes(kw) || s.includes(kw);
  });
});
const formatNameWithServerShort = (m) => {
  const name = String(m?.characterName || "").trim();
  const sid = Number(m?.serverId);
  const short = String(
    m?.serverShortName || getServerShortNameById(sid) || "",
  ).trim();
  if (!name) return "";
  if (!short) return name;
  return `${name}[${short}]`;
};
watch(searchRaceId, () => {
  const list = searchServerOptions.value;
  searchServerId.value =
    list[0]?.serverId || (searchRaceId.value === 1 ? 1001 : 2001);
});

const manualRaceId = ref(2);
const manualServerId = ref(2015);
const manualServerOptions = computed(() =>
  getServersByRace(manualRaceId.value),
);
watch(manualRaceId, () => {
  const list = manualServerOptions.value;
  manualServerId.value =
    list[0]?.serverId || (manualRaceId.value === 1 ? 1001 : 2001);
});
const stripHtml = (v) => String(v || "").replace(/<[^>]+>/g, "");
const fetchCharacterInfo = async (characterId, serverId) => {
  const detail = await $fetch("/api/aion/info", {
    params: { characterId, serverId },
  });
  const profile = detail?.profile;
  if (!profile) throw new Error("角色信息不存在");
  const itemLevel = detail?.stat?.statList?.find(
    (x) => x?.type === "ItemLevel",
  )?.value;
  return { ...profile, itemLevel };
};

const buildFallbackProfile = ({
  characterId,
  characterName,
  serverId,
  raceId,
  level,
  className,
}) => {
  const sid = Number(serverId);
  const s = getServerById(sid);
  const rid = Number(raceId);
  return {
    characterId: String(characterId),
    characterName: String(characterName),
    serverId: sid,
    serverName: s?.serverName || String(serverId),
    raceId: rid,
    raceName: rid === 1 ? "天族" : "魔族",
    className: className ? String(className) : "未知",
    characterLevel: level ? Number(level) : null,
    combatPower: null,
    itemLevel: null,
    needsRefresh: true,
  };
};
//新增的数据
const addMemberToTeam = (profile) => {
  console.log(
    `🔍 [UsersAdmin:346] %c profile: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    profile,
  );

  const exists = gameData.value?.characters?.find(
    (x) => x.characterId === profile.characterId,
  );
  if (exists) {
    $alert("提示", "该角色已存在");
    return;
  }
  newCharForm.value = {
    ...newCharForm.value,
    ...profile,
  };

  pickerOpen.value = false;
  pickerOpenOther.value = {
    type: "",
  };
};
const searchQuick = ref("");
const searchResults = ref([]);
const searchLoading = ref(false);
const searchedOnce = ref(false);
const applyQuickToSearch = () => {
  const parsed = parseNameWithServerShort(searchQuick.value);
  if (!parsed) {
    $alert("格式提示", "请正确输入简写！");
    return null;
  }
  searchRaceId.value = parsed.raceId;
  searchServerId.value = parsed.serverId;
  searchQuick.value = parsed.keyword;
  return parsed;
};

const applyQuickToSearchAndSearch = async () => {
  if (hasValidBrackets(searchQuick.value)) {
    const parsed = applyQuickToSearch();
    if (!parsed) return;
  }
  await searchCharacters();
};

const searchCharacters = async () => {
  if (!searchQuick.value.trim()) return;
  searchLoading.value = true;
  searchedOnce.value = true;
  try {
    const embedded = parseNameWithServerShort(searchQuick.value);
    if (embedded) {
      applyQuickToSearch();
    }
    const res = await $fetch("/api/aion/search", {
      query: {
        keyword: searchQuick.value,
        race: searchRaceId.value,
        serverId: searchServerId.value,
        page: 1,
        size: 30,
      },
    });
    if (res?.list?.length == 1) {
      pickFromSearch(res?.list[0]);
      return;
    }
    searchResults.value = res?.list || [];
  } catch {
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
};
const pickFromSearch = async (c) => {
  $loading.show("正在获取角色信息...");
  try {
    let profile;
    try {
      profile = await fetchCharacterInfo(c.characterId, c.serverId);
      profile.needsRefresh = false;
    } catch {
      profile = buildFallbackProfile({
        characterId: c.characterId,
        characterName: stripHtml(c.name),
        serverId: c.serverId,
        raceId: c.race,
        level: c.level,
        className: null,
      });
      $alert(
        "已添加",
        "角色详情接口暂时不可用，已先添加占位信息，可稍后点刷新补全",
      );
    }
    addMemberToTeam(profile);
  } catch (e) {
    $alert("添加失败", e?.message || String(e));
  } finally {
    $loading.hide();
  }
};
// 1. 检查同组（排除当前正在编辑的角色自己）是否已经有其他角色配置过每日副本挑战次数
const hasGroupDailyRuns = computed(() => {
  const characters = gameData.value?.characters || [];
  return characters.some(
    (c) =>
      c.group === newCharForm.value.group &&
      c.characterId !== newCharForm.value.characterId &&
      (c.dailyRuns ?? 0) > 0,
  );
});

// 2. 获取当前分组共享的挑战次数值（并自动把值同步给当前表单，方便提交）
const getGroupDailyRunsValue = computed(() => {
  const characters = gameData.value?.characters || [];
  const existingChar = characters.find(
    (c) =>
      c.group === newCharForm.value.group &&
      c.characterId !== newCharForm.value.characterId &&
      (c.dailyRuns ?? 0) > 0,
  );
  if (existingChar) {
    newCharForm.value.dailyRuns = existingChar.dailyRuns;
    return existingChar.dailyRuns;
  }
  return newCharForm.value.dailyRuns || 0;
});

// 判断同组中（排除当前正在编辑的角色）是否已经有其他角色开启了特级会员
const isGroupHasOtherPremium = computed(() => {
  const characters = gameData.value?.characters || [];
  return characters.some(
    (c) =>
      Number(c.group) === Number(newCharForm.value.group) &&
      c.characterId !== newCharForm.value.characterId &&
      c.premiumMember === true,
  );
});
// 获取同组其他角色共享的会员剩余天数（并顺便自动同步给当前表单）
const groupSharedPremiumDays = computed(() => {
  const characters = gameData.value?.characters || [];
  const sharedChar = characters.find(
    (c) =>
      Number(c.group) === Number(newCharForm.value.group) &&
      c.characterId !== newCharForm.value.characterId &&
      c.premiumMember === true,
  );
  if (sharedChar) {
    // 自动同步天数，保证同一组天数完全一样
    newCharForm.value.premiumMemberDay = sharedChar.premiumMemberDay;
    return sharedChar.premiumMemberDay;
  }
  return newCharForm.value.premiumMemberDay || 0;
});
//=========================================添加成员结束=========================================

// 监听分组切换，实时检测该分组下是否已有主账号或特级会员
const handleGroupChange = () => {
  const selectedGroup = newCharForm.value.group;

  // 找出当前分组下已存在的其他角色
  const groupChars = gameData.value?.characters?.filter(
    (c) =>
      c.group === selectedGroup &&
      c.characterId !== newCharForm.value.characterId,
  );

  const hasPrimaryInGroup = groupChars.some((c) => c.primaryAccount);
  const hasPremiumInGroup = groupChars.some((c) => c.premiumMember);

  // 1. 如果该分组已有主账号，给出提示
  if (hasPrimaryInGroup && newCharForm.value.primaryAccount) {
    // 假设你有全局提示方法 $alert 或使用 alert
    if (typeof $alert === "function") {
      $alert("提示", "当前分组下已经存在主账号，建议取消或更换分组。");
    } else {
      alert("当前分组下已经存在主账号！");
    }
  }

  // 2. 如果该分组已有特级会员，自动同步并提示
  if (hasPremiumInGroup) {
    newCharForm.value.premiumMember = true;
    // 可以把该分组现有会员的剩余天数同步过来，或者提示已共享
  }
};

// 提交保存前的校验逻辑
const handleSaveCharacter = async () => {
  // characterId: c.characterId,
  //     characterName: stripHtml(c.name),

  if (!newCharForm.value.characterId) {
    $alert("提示", "请选择角色！");
    return;
  }

  const selectedGroup = newCharForm.value.group;

  // 校验重复：检查当前分组或全局是否已存在相同名称/ID的角色
  const isDuplicate = gameData.value?.characters?.some(
    (c) => c.characterId && c.characterId === newCharForm.value.characterId,
  );

  if (isDuplicate) {
    if (typeof $alert === "function") {
      $alert("提示", "该角色已存在，请勿重复添加！");
    } else {
      $alert("该角色已存在，请勿重复添加！");
    }
    return;
  }

  // 校验分组内主账号唯一性
  if (newCharForm.value.primaryAccount) {
    const existingPrimary = gameData.value?.characters?.find(
      (c) => c.group === selectedGroup && c.primaryAccount,
    );
    if (existingPrimary) {
      if (typeof $alert === "function") {
        $alert(
          "提示",
          `当前选择的 "${gameData.value.groups[selectedGroup].name}" 分组下已经拥有主账号 (${existingPrimary.characterName})！`,
        );
      } else {
        alert(
          `当前选择的 "${gameData.value.groups[selectedGroup].name}" 分组下已经拥有主账号 (${existingPrimary.characterName})！`,
        );
      }
      return;
    }
  }
  const nowIso = new Date().toISOString();
  const newChar = {
    id: Date.now(),

    // 能量与资源
    energy: Number(newCharForm.value.energy),
    storedEnergy: Number(newCharForm.value.storedEnergy),
    kina: Number(newCharForm.value.kina),
    weeklyEnergyPurchased: false,
    weeklyEnergyPurchasedDate: nowIso,
    breezeEnergyPurchased: false,
    breezeEnergyPurchasedDate: nowIso,

    // 副本与次数进度
    runs: Number(newCharForm.value.runs),
    lastRunsUpdate: nowIso,
    transcendRuns: Number(newCharForm.value.transcendRuns),
    lastTranscendRunsUpdate: nowIso,
    nightmareCount: Number(newCharForm.value.nightmareCount),
    storedNightmareCount: Number(newCharForm.value.storedNightmareCount),
    lastNightmareUpdate: nowIso,
    dailyRuns: Number(newCharForm.value.dailyRuns),
    storedDailyRuns: Number(newCharForm.value.storedDailyRuns),
    lastDailyRunsUpdate: nowIso,

    // 最终Boss削弱进度
    finalBossReductionRuns: 0,
    finalBossReductionRunsDate: nowIso,
    finalBossReductionRunsTranscend: 0,
    finalBossReductionRunsTranscendDate: nowIso,

    // 圣域、小游戏及日常状态
    sanctuary: { s1: 1, s2: 1, s3: 1 },
    minigameCount: 0,
    storedMinigameCount: 0,
    lastMinigameUpdate: nowIso,
    awakening: false,
    awakeningDate: nowIso,
    dailyMission: false,
    dailyMissionDate: nowIso,
    dailySignIn: false,
    dailySignInDate: nowIso,

    // 战斗属性
    equipmentScore: Number(newCharForm.value.equipmentScore),
    combatPower: Number(newCharForm.value.combatPower),
    transcendNote: newCharForm.value.transcendNote,
    teamId: null,
    lastEnergyUpdate: nowIso,
    abyssOrderCompleted: false,
    abyssOrderDate: nowIso,
    localOrderCompleted: false,
    localOrderDate: nowIso,
    ...newCharForm.value,
  };

  if (!gameData.value.characters) {
    gameData.value.characters = [];
  }
  gameData.value?.characters?.unshift(newChar);
  gameData.value.characterCount = gameData.value?.characters?.length || 0;

  showAddCharModal.value = false;
  await saveData();
};

//============================分组管理开始============================

const groupEditingId = ref(null); // null 代表当前是新增状态，有值代表正在编辑该 ID 的分组
const groupInputName = ref(""); // 输入框绑定的分组名称

// 打开分组管理弹窗
const openGroupModal = () => {
  groupOpen.value = true;
  cancelGroupEdit(); // 每次打开时重置表单状态
};

// 点击“编辑”按钮：加载当前选中分组的数据到输入框
const startEditGroup = (group) => {
  groupEditingId.value = group.id;
  groupInputName.value = group.name;
};

// 点击“取消”：重置编辑状态与输入框
const cancelGroupEdit = () => {
  groupEditingId.value = null;
  groupInputName.value = "";
};

// 保存分组（兼顾新增与修改）
const saveGroup = async () => {
  const name = groupInputName.value.trim();
  if (!name) {
    alert("分组名称不能为空！");
    return;
  }

  if (groupEditingId.value !== null) {
    // 1. 修改现有分组
    const target = gameData.value.groups.find(
      (g) => g.id === groupEditingId.value,
    );
    if (target) {
      target.name = name;
    }
  } else {
    // 2. 新增分组（自动计算自增 ID，避免重复）
    const ids = gameData.value.groups.map((g) => g.id);
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    gameData.value.groups.push({
      id: nextId,
      name: name,
    });
  }
  await saveData();
  // 保存后重置输入状态
  cancelGroupEdit();
};

// 删除分组
const deleteGroup = async (id) => {
  // 安全校验：检查该分组下是否仍有角色绑定，若有则阻止删除
  const hasCharsInGroup = gameData.value?.characters?.some(
    (c) => c.group === id,
  );
  if (hasCharsInGroup) {
    $alert("该分组下仍有绑定的角色，无法直接删除！请先迁移或删除对应角色。");
    return;
  }

  const target = gameData.value?.groups?.find((g) => g.id === id);
  const confirmed = await $confirm(
    "删除确认",
    `确定要删除分组 "${target?.name || id}" 吗？`,
  );
  if (!confirmed) return;

  const index = gameData.value?.groups?.findIndex((g) => g.id === id);
  if (index !== -1) {
    gameData.value?.groups?.splice(index, 1);
    await saveData();
  }
  // 如果当前正在编辑刚好被删除的那项，则顺便重置编辑状态
  if (groupEditingId.value === id) {
    cancelGroupEdit();
  }
};

const activeTabGroup = ref("all"); // 'all' 代表全选，或者存放具体的分组 id
//============================分组管理结束============================

//============================组角色卡片列表事件处理/开始============================
// 分组角色卡片列表删除角色事件处理
const groupCharacterPanelHandleDelete = async (char) => {
  const targetId = char.id ?? char.characterId;
  gameData.value.characters = gameData.value.characters.filter((c) => {
    const cId = c.id ?? c.characterId;
    return cId !== targetId;
  });
  await saveData();
};
// 分组角色卡片列表切换锁定事件处理
const groupCharacterPanelHandleToggleLock = async (char) => {
  // 默认不锁定，取反切换
  char.locked = !char.locked;
  await groupCharacterPanelHandleUpdateCharacter(char);
};

// 分组角色卡片列表更新角色事件处理
const groupCharacterPanelHandleUpdateCharacter = async (char) => {
  const targetId = char.id ?? char.characterId;
  gameData.value.characters = gameData.value.characters.map((c) => {
    const cId = c.id ?? c.characterId;
    if (cId === targetId) {
      return { ...c, ...char };
    }
    return c;
  });
  console.log(`🔍 [UsersAdmin:734] %c gameData保存签前groupCharacterPanelHandleUpdateCharacter: `,'font-size:14px; background:#26A08F; color:#fff;font-weight: bold;', gameData.value);
  await saveData();
};

// 分组角色卡片列表切换任务事件处理
const groupCharacterPanelHandleToggleTask = async (char, field) => {
  const updatedChar = { ...char, [field]: !char[field] };
  await groupCharacterPanelHandleUpdateCharacter(updatedChar);
};

// 分组角色卡片列表底层保存处理
const updateCharacter = async (char) => {
  await saveData();
};

// 分组角色卡片列表消耗能量事件处理
const groupCharacterPanelHandleConsumeEnergy = async (char) => {
  char.energy = 0;
  await groupCharacterPanelHandleUpdateCharacter(char);
};

//============================组角色卡片列表事件处理/开结束============================

onMounted(async () => {
  await loadData();
});
watch(gameData, (newVal) => {
  if (newVal) {
    console.log(
      `🔍 [UsersAdmin:450] %c 数据gameData: `,
      "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
      gameData.value,
    );
  }
});
</script>

<template>
  <div
    class="p-8 bg-slate-50 text-slate-800 rounded-3xl shadow-sm space-y-8 max-w-7xl mx-auto border border-slate-100 min-h-[90vh]"
  >
    <!-- 顶部数据面板 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-slate-400 text-xs font-bold tracking-wider uppercase">
          总角色数
        </div>
        <div class="text-3xl font-black mt-2 tracking-tight text-slate-900">
          {{ totalCharacters }}
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-slate-400 text-xs font-bold tracking-wider uppercase">
          可收益基纳数 (万)
        </div>
        <div class="text-3xl font-black mt-2 text-emerald-600 tracking-tight">
          {{ totalKinaStats.possible }}
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-slate-400 text-xs font-bold tracking-wider uppercase">
          已收益基纳数 (万)
        </div>
        <div class="text-3xl font-black mt-2 text-[#45a6d5] tracking-tight">
          {{ totalKinaStats.earned }}
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="text-slate-400 text-xs font-bold tracking-wider uppercase">
          总奥德能量 (点)
        </div>
        <div class="text-3xl font-black mt-2 text-amber-600 tracking-tight">
          {{ totalEnergy }}
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div
      class="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <button
          @click="openAddCharModal"
          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#45a6d5] to-[#3b95c0] text-white font-black text-sm hover:opacity-95 transition-all shadow-md shadow-sky-500/20 active:scale-95 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          新增角色
        </button>
        <button
          @click="openGroupModal"
          class="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-black text-sm transition-all active:scale-95 flex items-center gap-2 border border-slate-200/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          分组管理
        </button>
      </div>

      <div
        class="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
      >
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span>{{ user ? "已同步到云端数据库" : "当前为本地存储模式" }}</span>
      </div>
    </div>
    <!-- Tab 切换栏 -->
    <div
      class="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto custom-scroll select-none"
    >
      <!-- 全部角色 Tab -->
      <button
        @click="activeTabGroup = 'all'"
        class="px-5 py-2.5 rounded-2xl font-black text-xs transition-colors duration-150 whitespace-nowrap flex items-center gap-2 border"
        :class="
          activeTabGroup === 'all'
            ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-sm shadow-sky-500/20'
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/60'
        "
      >
        <span>全部角色</span>
        <span
          class="min-w-[18px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none"
          :class="
            activeTabGroup === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-slate-200/70 text-slate-600'
          "
        >
          {{ gameData.characters.length }}
        </span>
      </button>

      <!-- 默认分组 Tab -->
      <button
        @click="activeTabGroup = 'default'"
        class="px-5 py-2.5 rounded-2xl font-black text-xs transition-colors duration-150 whitespace-nowrap flex items-center gap-2 border"
        :class="
          activeTabGroup === 'default'
            ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-sm shadow-sky-500/20'
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/60'
        "
      >
        <span>默认分组</span>
        <span
          class="min-w-[18px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none"
          :class="
            activeTabGroup === 'default'
              ? 'bg-white/20 text-white'
              : 'bg-slate-200/70 text-slate-600'
          "
        >
          {{
            gameData.characters.filter(
              (c) => !c.group || !gameData.groups.some((g) => g.id === c.group),
            ).length
          }}
        </span>
      </button>

      <!-- 自定义分组 Tab -->
      <button
        v-for="group in gameData.groups"
        :key="group.id"
        @click="activeTabGroup = group.id"
        class="px-5 py-2.5 rounded-2xl font-black text-xs transition-colors duration-150 whitespace-nowrap flex items-center gap-2 border"
        :class="
          activeTabGroup === group.id
            ? 'bg-[#45a6d5] text-white border-[#45a6d5] shadow-sm shadow-sky-500/20'
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/60'
        "
      >
        <span>{{ group.name }}</span>
        <span
          class="min-w-[18px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none"
          :class="
            activeTabGroup === group.id
              ? 'bg-white/20 text-white'
              : 'bg-slate-200/70 text-slate-600'
          "
        >
          {{ gameData.characters.filter((c) => c.group === group.id).length }}
        </span>
      </button>
    </div>

    <!-- 分组角色卡片列表 -->
    <GroupCharacterPanel
      :activeTabGroup="activeTabGroup"
      :gameData="gameData"
      @character-delete="groupCharacterPanelHandleDelete"
      @toggle-lock="groupCharacterPanelHandleToggleLock"
      @update-character="groupCharacterPanelHandleUpdateCharacter"
      @toggle-task="groupCharacterPanelHandleToggleTask"
      @consume-energy="groupCharacterPanelHandleConsumeEnergy"
    />
    <!-- 极宽卡片式新增角色弹窗 (蓝白色调) -->
    <Transition name="modal">
      <div
        v-if="showAddCharModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm"
      >
        <div
          class="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-800 flex flex-col h-[90vh]"
        >
          <!-- 弹窗头部 -->
          <div
            class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10"
          >
            <div>
              <div class="text-xl font-black tracking-wide text-slate-900">
                新增角色
              </div>
            </div>
            <button
              @click="showAddCharModal = false"
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
            >
              关闭
            </button>
          </div>

          <!-- 弹窗表单主体 (卡片式布局) -->
          <div
            class="p-8 space-y-6 overflow-y-auto custom-scroll flex-1 bg-slate-50/50"
          >
            <template v-if="newCharForm.characterId">
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
                  <button
                    type="button"
                    @click="
                      ((pickerOpen = true), (pickerOpenOther.type = 'add'))
                    "
                    class="px-4 py-2 rounded-xl bg-[#45a6d5] text-white font-bold text-xs hover:bg-[#3b95c0] transition-all shadow-sm shadow-sky-500/20 flex items-center gap-1.5 active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    重新添加选择角色
                  </button>
                </div>

                <!-- 选择完成后的角色基本信息预览展示卡片 -->
                <div
                  v-if="newCharForm.characterId"
                  class="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl flex items-center gap-4 transition-all"
                >
                  <img
                    v-if="newCharForm.profileImage"
                    :src="newCharForm.profileImage"
                    alt="头像"
                    class="w-14 h-14 rounded-xl object-cover border border-sky-200 shadow-sm"
                  />
                  <div
                    class="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    <div>
                      <div class="text-[10px] font-bold text-slate-400">
                        昵称 / 职业
                      </div>
                      <div class="text-sm font-black text-slate-800 truncate">
                        {{ newCharForm.characterName || newCharForm.name }}
                        <span class="text-xs font-bold text-[#45a6d5]"
                          >({{
                            newCharForm.className || newCharForm.class
                          }})</span
                        >
                      </div>
                    </div>
                    <div>
                      <div class="text-[10px] font-bold text-slate-400">
                        等级 / 装等
                      </div>
                      <div class="text-sm font-black text-slate-800">
                        Lv.{{ newCharForm.value?.characterLevel || 1 }}
                        <span class="text-xs font-bold text-amber-600"
                          >({{ newCharForm.value?.itemLevel || 0 }})</span
                        >
                      </div>
                    </div>
                    <div>
                      <div class="text-[10px] font-bold text-slate-400">
                        服务器 / 种族
                      </div>
                      <div class="text-sm font-black text-slate-800 truncate">
                        {{ newCharForm.value?.serverName || "未知" }} ·
                        <span class="text-xs font-bold text-purple-600">{{
                          newCharForm.value?.raceName || "未知"
                        }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="text-[10px] font-bold text-slate-400">
                        称号
                      </div>
                      <div class="text-sm font-black text-slate-800 truncate">
                        {{ newCharForm.value?.titleName || "无" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 卡片二：所属分组与账号属性配置 (独立卡片) -->
              <div
                class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-5 shadow-sm"
              >
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                  <div
                    class="text-sm font-black uppercase tracking-wider text-slate-700"
                  >
                    所属分组与账号属性配置
                  </div>
                </div>
                <p class="text-xs font-bold text-slate-400">
                  添加分组后会视为同一账号，共享部分资源
                </p>

                <div
                  class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1 items-stretch"
                >
                  <!-- 分组选择 -->
                  <div class="flex flex-col">
                    <label class="text-xs font-bold text-slate-500 block mb-2"
                      >所属分组</label
                    >
                    <div class="flex-1 flex items-center">
                      <select
                        v-model.number="newCharForm.group"
                        @change="handleGroupChange"
                        class="w-full h-[50px] px-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all cursor-pointer box-border"
                      >
                        <option
                          v-for="(group, key) in gameData.groups"
                          :key="key"
                          :value="group.id"
                        >
                          {{ group.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- 是否为主账号 (带同组排他提示) -->
                  <div class="flex flex-col">
                    <label class="text-xs font-bold text-slate-500 block mb-2"
                      >主账号状态</label
                    >
                    <div class="flex-1 flex items-center">
                      <div
                        class="w-full h-[50px] flex items-center justify-between px-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 cursor-pointer select-none transition-all hover:border-[#45a6d5] box-border"
                        @click="
                          () => {
                            const groupChars =
                              gameData.value?.characters?.filter(
                                (c) => c.group === newCharForm.group,
                              );
                            const hasPrimary = groupChars?.some(
                              (c) => c.primaryAccount,
                            );
                            if (!newCharForm?.primaryAccount && hasPrimary) {
                              alert('该分组下已经存在主账号，无法重复设置！');
                              return;
                            }
                            newCharForm.primaryAccount =
                              !newCharForm.primaryAccount;
                          }
                        "
                      >
                        <span class="text-sm font-bold text-slate-700"
                          >设为主账号</span
                        >
                        <div
                          class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300"
                          :class="
                            newCharForm.primaryAccount
                              ? 'bg-[#45a6d5]'
                              : 'bg-slate-300'
                          "
                        >
                          <div
                            class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
                            :class="
                              newCharForm.primaryAccount
                                ? 'translate-x-4'
                                : 'translate-x-0'
                            "
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 特级会员选择：高度与输入框/开关严格对齐 -->
                  <div class="flex flex-col">
                    <label class="text-xs font-bold text-slate-500 block mb-2"
                      >特级会员状态</label
                    >
                    <div class="flex-1 flex items-center">
                      <!-- 如果同组有其他角色开启了会员，则直接展示共享状态并隐藏开关 -->
                      <div
                        v-if="isGroupHasOtherPremium"
                        class="w-full h-[50px] px-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-between box-border"
                      >
                        <span>同组已共享特级会员</span>
                        <span
                          class="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full"
                          >无需重复开启</span
                        >
                      </div>

                      <!-- 否则正常显示开通开关 -->
                      <div
                        v-else
                        class="w-full h-[50px] flex items-center justify-between px-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 cursor-pointer select-none transition-all hover:border-[#45a6d5] box-border"
                        @click="
                          newCharForm.premiumMember = !newCharForm.premiumMember
                        "
                      >
                        <span class="text-sm font-bold text-slate-700"
                          >开通特级会员</span
                        >
                        <div
                          class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300"
                          :class="
                            newCharForm.premiumMember
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          "
                        >
                          <div
                            class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
                            :class="
                              newCharForm.premiumMember
                                ? 'translate-x-4'
                                : 'translate-x-0'
                            "
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 如果开启了特级会员，动态展开剩余天数输入或展示共享天数 -->
                <Transition name="fade">
                  <div
                    v-if="newCharForm.premiumMember || isGroupHasOtherPremium"
                    class="pt-2"
                  >
                    <div
                      class="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-2"
                    >
                      <label class="text-xs font-bold text-amber-700 block"
                        >特级会员剩余天数</label
                      >

                      <!-- 情况 A：同组已有其他角色开启了会员（只展示共享天数，自动同步） -->
                      <div
                        v-if="isGroupHasOtherPremium"
                        class="flex items-center justify-between py-1"
                      >
                        <span class="text-sm font-black text-amber-900">
                          同组共享天数：<span
                            class="text-base text-amber-600"
                            >{{ groupSharedPremiumDays }}</span
                          >
                          天（已自动同步）
                        </span>
                        <span
                          class="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold"
                          >组内一致</span
                        >
                      </div>

                      <!-- 情况 B：当前角色自己是组内第一个开启会员的（允许输入天数） -->
                      <input
                        v-else
                        v-model.number="newCharForm.premiumMemberDay"
                        type="number"
                        placeholder="请输入剩余天数..."
                        class="w-full md:w-1/3 px-4 py-2.5 rounded-xl bg-white border-2 border-amber-200 focus:border-amber-500 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- 卡片三：能量与资源 (合并优化版) -->
              <!-- 奥德能量组合卡片 (当前 + 存储补充) -->
              <div
                class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
              >
                <div
                  class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                >
                  <!-- 在大标题后面实时显示：当前能量 / 上限 -->
                  <div class="flex items-center gap-2">
                    <span>奥德能量</span>
                    <span class="text-xs font-black text-[#45a6d5]">
                      {{ newCharForm?.energy || 0 }} （+{{
                        newCharForm?.storedEnergy || 0
                      }}） /
                      {{
                        newCharForm?.premiumMember ||
                        gameData?.characters?.some(
                          (c) =>
                            c.group === newCharForm.group && c.premiumMember,
                        )
                          ? 840
                          : 560
                      }}
                    </span>
                  </div>

                  <!-- 右侧动态计算并显示上限提示 -->
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="
                      newCharForm?.premiumMember ||
                      gameData?.characters?.some(
                        (c) => c.group === newCharForm.group && c.premiumMember,
                      )
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-600'
                    "
                  >
                    上限:
                    {{
                      newCharForm?.premiumMember ||
                      gameData?.characters?.some(
                        (c) => c.group === newCharForm.group && c.premiumMember,
                      )
                        ? 840
                        : 560
                    }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="text-xs font-bold text-slate-500"
                        >当前能量</label
                      >
                      <!-- 实时计算并展示“当前值 (还需补充值) / 上限” -->
                      <span class="text-[10px] font-black text-[#45a6d5]">
                        {{ newCharForm?.energy || 0 }} ({{
                          Math.max(
                            0,
                            (newCharForm?.premiumMember ||
                            gameData?.characters?.some(
                              (c) =>
                                c.group === newCharForm.group &&
                                c.premiumMember,
                            )
                              ? 840
                              : 560) - (newCharForm?.energy || 0),
                          )
                        }}) /
                        {{
                          newCharForm?.premiumMember ||
                          gameData?.characters?.some(
                            (c) =>
                              c.group === newCharForm.group && c.premiumMember,
                          )
                            ? 840
                            : 560
                        }}
                      </span>
                    </div>
                    <input
                      v-model.number="newCharForm.energy"
                      type="number"
                      class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="text-xs font-bold text-slate-500"
                        >存储补充能量</label
                      >
                      <!-- 实时计算并展示存储补充能量的格式：“当前存储 (还需补充至2000) / 2000” -->
                      <span class="text-[10px] font-black text-amber-600">
                        {{ newCharForm.storedEnergy || 0 }} ({{
                          Math.max(0, 2000 - (newCharForm.storedEnergy || 0))
                        }}) / 2000
                      </span>
                    </div>
                    <input
                      v-model.number="newCharForm.storedEnergy"
                      type="number"
                      class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
              <!-- 卡片三：次数进度配置 -->
              <div
                class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-6 shadow-sm"
              >
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div
                    class="text-sm font-black uppercase tracking-wider text-slate-700"
                  >
                    次数进度配置
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- 噩梦副本卡片 (挑战 + 存储) -->
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                  >
                    <div
                      class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                    >
                      噩梦副本
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          class="text-xs font-bold text-slate-500 block mb-1.5"
                          >挑战次数</label
                        >
                        <input
                          v-model.number="newCharForm.nightmareCount"
                          type="number"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label
                          class="text-xs font-bold text-slate-500 block mb-1.5"
                          >存储次数</label
                        >
                        <input
                          v-model.number="newCharForm.storedNightmareCount"
                          type="number"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 每日副本卡片 (挑战共享 + 存储独立) -->
                <div
                  class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                      <div
                        class="text-sm font-black uppercase tracking-wider text-slate-700"
                      >
                        每日副本 (组内共享挑战 / 独立存储)
                      </div>
                    </div>
                    <!-- 组内状态提示 -->
                    <span
                      class="text-[10px] font-bold px-3 py-1 rounded-full"
                      :class="
                        hasGroupDailyRuns
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-50 text-[#45a6d5]'
                      "
                    >
                      {{
                        hasGroupDailyRuns
                          ? "同组已有角色配置过挑战次数 (当前角色已隐藏)"
                          : "当前分组首次配置挑战次数"
                      }}
                    </span>
                  </div>

                  <p class="text-xs font-bold text-slate-400">
                    同一分组账号下挑战次数视为组内共用（上限14）；每个角色可独立维护自己的存储补充次数（上限30）。
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <!-- 挑战次数卡片 (如果同组已配置过，则直接隐藏该卡片) -->
                    <div
                      v-if="!hasGroupDailyRuns"
                      class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                    >
                      <div
                        class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                      >
                        <span>挑战次数 (组内共用 / 上限14)</span>
                        <span class="text-xs font-black text-[#45a6d5]">
                          {{ newCharForm.dailyRuns || 0 }} / 14
                        </span>
                      </div>
                      <div class="grid grid-cols-1 gap-4">
                        <div>
                          <div class="flex items-center justify-between mb-1.5">
                            <label class="text-xs font-bold text-slate-500"
                              >当前次数</label
                            >
                          </div>
                          <input
                            v-model.number="newCharForm.dailyRuns"
                            type="number"
                            max="14"
                            min="0"
                            class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- 如果同组已配置过，给个友好的提示卡片占位（或让存储卡片自适应宽度） -->
                    <div
                      v-else
                      class="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex flex-col justify-center space-y-2"
                    >
                      <div class="text-xs font-bold text-amber-800">
                        挑战次数已由同组角色共享设定
                      </div>
                      <div class="text-xs font-medium text-amber-600">
                        当前分组共享挑战次数为：<span
                          class="font-black text-amber-700"
                          >{{ getGroupDailyRunsValue }} / 14</span
                        >。当前角色无需重复配置。
                      </div>
                    </div>

                    <!-- 存储补充次数卡片 (角色独立) -->
                    <div
                      class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                    >
                      <div
                        class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                      >
                        <span>存储补充次数 (角色独立 / 上限30)</span>
                        <span class="text-xs font-black text-amber-600">
                          {{ newCharForm.storedDailyRuns || 0 }} / 30
                        </span>
                      </div>
                      <div class="grid grid-cols-1 gap-4">
                        <div>
                          <div class="flex items-center justify-between mb-1.5">
                            <label class="text-xs font-bold text-slate-500"
                              >存储次数</label
                            >
                            <span class="text-[10px] font-black text-amber-600">
                              剩余可补充:
                              {{
                                Math.max(
                                  0,
                                  30 - (newCharForm.storedDailyRuns || 0),
                                )
                              }}
                            </span>
                          </div>
                          <input
                            v-model.number="newCharForm.storedDailyRuns"
                            type="number"
                            max="30"
                            min="0"
                            class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 圣域系列次数分组 -->
                <div
                  class="p-5 bg-emerald-50/40 border border-emerald-100/80 rounded-2xl space-y-3"
                >
                  <div
                    class="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider"
                  >
                    圣域副本次数
                  </div>
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label
                        class="text-xs font-bold text-slate-600 block mb-1.5"
                        >S1 次数</label
                      >
                      <input
                        v-model.number="newCharForm.sanctuary.s1"
                        type="number"
                        class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-emerald-500 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label
                        class="text-xs font-bold text-slate-600 block mb-1.5"
                        >S2 次数</label
                      >
                      <input
                        v-model.number="newCharForm.sanctuary.s2"
                        type="number"
                        class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-emerald-500 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label
                        class="text-xs font-bold text-slate-600 block mb-1.5"
                        >S3 次数</label
                      >
                      <input
                        v-model.number="newCharForm.sanctuary.s3"
                        type="number"
                        class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200/80 focus:border-emerald-500 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="p-8 bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 transition-all hover:border-[#45a6d5]/50 hover:bg-sky-50/30 group cursor-pointer"
                @click="((pickerOpen = true), (pickerOpenOther.type = 'add'))"
              >
                <!-- 图标外发光圆圈 -->
                <div
                  class="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-[#45a6d5] group-hover:scale-110 group-hover:border-sky-200 group-hover:shadow-md transition-all duration-300"
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    ></path>
                  </svg>
                </div>

                <!-- 提示文案 -->
                <div class="space-y-1">
                  <div
                    class="text-sm font-black text-slate-700 group-hover:text-[#45a6d5] transition-colors"
                  >
                    点击添加/选择角色
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
              @click="showAddCharModal = false"
              class="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-all"
            >
              取消
            </button>
            <button
              v-if="newCharForm.characterId"
              @click="handleSaveCharacter"
              :disabled="saving"
              class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25"
            >
              {{ saving ? "保存中..." : "确认添加角色" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <!-- 选择角色/选择其他角色 -->
    <Transition name="modal2">
      <div
        v-if="pickerOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div
          class="relative z-10 w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh"
        >
          <div
            class="p-6 border-b border-slate-100 flex items-center justify-between gap-4"
          >
            <div class="font-black text-slate-800 text-lg">
              {{ pickerOpenOther.type === "add" ? "添加角色" : "选择其他角色" }}
            </div>
            <button
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
              @click="pickerOpen = false"
            >
              关闭
            </button>
          </div>

          <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scroll">
            <!-- 我的角色 -->
            <div v-if="pickerOpenOther.type == 'myroles'" class="space-y-3">
              <div class="flex items-center gap-2">
                <input
                  v-model="myKeyword"
                  class="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="搜索我的角色..."
                />
                <button
                  class="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  :disabled="myLoading"
                  @click="fetchMyMembers"
                >
                  {{ myLoading ? "刷新中..." : "刷新" }}
                </button>
              </div>

              <div
                v-if="myLoading"
                class="py-10 text-center text-slate-400 font-bold"
              >
                加载中...
              </div>
              <div
                v-else
                class="max-h-[55vh] overflow-y-auto custom-scroll space-y-2"
              >
                <div
                  v-for="m in filteredMyMembers"
                  :key="m.id"
                  class="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div class="min-w-0">
                    <div class="font-black text-slate-800 truncate">
                      {{
                        formatNameWithServerShort({
                          characterName: m.character_name,
                          serverId: m.server_id,
                          serverShortName: m.server_short_name,
                        })
                      }}
                    </div>
                    <div
                      class="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2 flex-wrap"
                    >
                      <span>{{ formatServerDisplay(m.server_id) }}</span>
                      <span>{{ m.class_name || "—" }}</span>
                      <span v-if="m.character_level"
                        >Lv.{{ m.character_level }}</span
                      >
                      <span>战 {{ formatCombatPower(m.combat_power) }}</span>
                      <span>评 {{ m.item_level || "-" }}</span>
                    </div>
                    <div class="mt-2">
                      <input
                        v-model="m.remark"
                        type="text"
                        class="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#45a6d5] outline-none font-bold text-xs text-slate-700 transition-all"
                        placeholder="备注（可选）"
                      />
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      class="px-3 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-xs hover:bg-[#3b95c0] transition-colors"
                      @click="pickFromMyMember(m)"
                    >
                      选择
                    </button>
                    <!-- <button
                      class="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-black text-xs hover:bg-slate-200 transition-colors disabled:opacity-50"
                      :disabled="mySaving[m.id]"
                      @click="updateMyMember(m)"
                    >
                      {{ mySaving[m.id] ? "保存中..." : "保存备注" }}
                    </button>
                    <button
                      class="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 font-black text-xs hover:bg-rose-100 transition-colors disabled:opacity-50"
                      :disabled="mySaving[m.id]"
                      @click="deleteMyMember(m)"
                    >
                      删除
                    </button> -->
                  </div>
                </div>
                <div
                  v-if="filteredMyMembers.length === 0"
                  class="py-10 text-center text-slate-400 font-bold"
                >
                  暂无队员
                </div>
              </div>
            </div>
            <div v-else-if="pickerOpenOther.type === 'add'" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  v-model.number="searchRaceId"
                  class="px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option :value="1">天族</option>
                  <option :value="2">魔族</option>
                </select>
                <select
                  v-model.number="searchServerId"
                  class="px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option
                    v-for="s in searchServerOptions"
                    :key="s.serverId"
                    :value="s.serverId"
                  >
                    {{ formatServerDisplay(s.serverId) }}
                  </option>
                </select>
                <!-- <input
                  v-model="searchKeyword"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="输入角色名关键词..."
                /> -->
              </div>
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="searchQuick"
                  class="px-4 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all"
                  placeholder="输入角色名关键字或者快捷粘贴：角色名[区服简写]（例如 xxx[xxx]）"
                  @keyup.enter="applyQuickToSearchAndSearch"
                />
              </div>
              <div class="flex items-center justify-end">
                <button
                  class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors disabled:opacity-50"
                  :disabled="searchLoading"
                  @click="applyQuickToSearchAndSearch"
                >
                  {{ searchLoading ? "查询中..." : "查询" }}
                </button>
              </div>

              <div
                v-if="searchLoading"
                class="py-10 text-center text-slate-400 font-bold"
              >
                查询中...
              </div>
              <div
                v-else
                class="max-h-[45vh] overflow-y-auto custom-scroll space-y-2"
              >
                <div
                  v-for="c in searchResults"
                  :key="c.characterId"
                  class="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div
                        class="font-black text-slate-800 truncate"
                        v-html="c.name"
                      ></div>
                      <div
                        class="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2 flex-wrap"
                      >
                        <span>{{ formatServerDisplay(c.serverId) }}</span>
                        <span>{{ c.race === 1 ? "天族" : "魔族" }}</span>
                        <span>Lv.{{ c.level }}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <!-- <button
                        class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-black text-xs hover:bg-slate-200 transition-colors"
                        @click.stop="saveMyMemberFromSearch(c)"
                      >
                        存为我的
                      </button> -->
                      <button
                        class="px-3 py-1.5 rounded-xl bg-[#45a6d5] text-white font-black text-xs hover:bg-[#3b95c0] transition-colors"
                        @click.stop="pickFromSearch(c)"
                      >
                        选择
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-if="searchedOnce && searchResults.length === 0"
                  class="py-8 text-center text-slate-400 font-bold"
                >
                  暂无结果
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- 分组管理 -->
    <Transition name="modal3">
      <div
        v-if="groupOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          @click="groupOpen = false"
        ></div>
        <div
          class="relative z-10 w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div
            class="p-6 border-b border-slate-100 flex items-center justify-between gap-4"
          >
            <div
              class="font-black text-slate-800 text-lg flex items-center gap-2"
            >
              <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
              分组管理
            </div>
            <button
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
              @click="groupOpen = false"
            >
              关闭
            </button>
          </div>

          <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scroll">
            <!-- 增/改 输入面板 -->
            <div
              class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3"
            >
              <div
                class="text-xs font-extrabold text-slate-500 uppercase tracking-wider"
              >
                {{
                  groupEditingId !== null
                    ? `正在修改分组 [ID: ${groupEditingId}]`
                    : "添加新分组"
                }}
              </div>
              <div class="flex items-center gap-3">
                <input
                  v-model="groupInputName"
                  type="text"
                  placeholder="请输入分组名称（如：主力账号组）..."
                  class="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-slate-200/80 focus:border-[#45a6d5] outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                  @keyup.enter="saveGroup"
                />
                <button
                  @click="saveGroup"
                  class="px-6 py-3 rounded-xl bg-[#45a6d5] hover:bg-[#3b95c0] text-white font-black text-sm transition-all shadow-md shadow-sky-500/20 active:scale-95 whitespace-nowrap"
                >
                  {{ groupEditingId !== null ? "保存修改" : "确认添加" }}
                </button>
                <button
                  v-if="groupEditingId !== null"
                  @click="cancelGroupEdit"
                  class="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm transition-all whitespace-nowrap"
                >
                  取消
                </button>
              </div>
            </div>

            <!-- 现有分组列表 -->
            <div class="space-y-3">
              <div
                class="text-xs font-extrabold text-slate-400 uppercase tracking-wider"
              >
                现有分组列表 ({{ gameData.groups.length }})
              </div>

              <div
                v-for="group in gameData.groups"
                :key="group.id"
                class="flex items-center justify-between p-4 bg-white border-2 border-slate-200/80 rounded-2xl hover:border-slate-300 transition-all shadow-sm"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="w-7 h-7 rounded-xl bg-sky-50 text-[#45a6d5] text-xs font-black flex items-center justify-center border border-sky-100 shadow-sm"
                  >
                    {{ group.id }}
                  </span>
                  <span class="text-sm font-black text-slate-800">{{
                    group.name
                  }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="startEditGroup(group)"
                    class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteGroup(group.id)"
                    class="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

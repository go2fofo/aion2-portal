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
import cloneDeep from "lodash/cloneDeep";
const client = useSupabaseClient();
const user = useSupabaseUser();

// 游戏数据结构 参考 docs/多角色管理模块相关.md
const gameData = ref({
  characters: [],
  accounts: [],
  groups: [
    {
      id: 1,
      name: "分组1",
      sort: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      transcendRuns: 0,
      runLogs: [],
    },
    {
      id: 2,
      name: "分组2",
      sort: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      transcendRuns: 0,
      runLogs: [],
    },
    {
      id: 3,
      name: "分组3",
      sort: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      transcendRuns: 0,
      runLogs: [],
    },
    {
      id: 4,
      name: "分组4",
      sort: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      transcendRuns: 0,
      runLogs: [],
    },
    {
      id: 5,
      name: "分组5",
      sort: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      transcendRuns: 0,
      runLogs: [],
    },
  ],
  groupCount: 5,
  autoRefreshEnabled: true,
  teams: [],
  accountSharedData: {},
  version: "1.0.0",
  dataType: "complete",
});

const groupOpen = ref(false);
const settingsOpen = ref(false);
const pickerOpen = ref(false);
const pickerOpenOther = ref({
  type: "",
});
const pickerTab = ref("search");
const { $alert, $confirm, $loading } = useNuxtApp();
// 控制新增角色弹窗状态
const showAddCharModal = ref(false);
const saving = ref(false);

//y验证规则放回返
const validationResult = ref({
  isValid: true,
  invalidFields: [],
  errors: {},
});
// 验证规则配置数组
const characterValidationRules = [
  // 1. 基础奥德能量 (energy)
  {
    field: "energy",
    label: "基础奥德能量",
    validate: (form) => {
      const val = Number(form.energy) || 0;
      const maxLimit = form.premiumMember ? 840 : 560;
      return val <= maxLimit;
    },
    message: () => "特级会员状态下能量上限为840，未开通上限为560，当前值超出限制",
  },
  // 2. 存储奥德能量 (storedEnergy)
  {
    field: "storedEnergy",
    label: "存储奥德能量",
    validate: (form) => (Number(form.storedEnergy) || 0) <= 2000,
    message: () => "存储/积压奥德能量不能超过2000",
  },
  //  噩梦次数 (nightmareCount)
  {
    field: "nightmareCount",
    label: "噩梦次数",
    validate: (form) => (Number(form.nightmareCount) || 0) <= 14,
    message: () => "噩梦次数不能超过14次",
  },
  //  存储噩梦次数 (storedNightmareCount)
  {
    field: "storedNightmareCount",
    label: "存储噩梦次数",
    validate: (form) => (Number(form.storedNightmareCount) || 0) <= 30,
    message: () => "存储噩梦次数不能超过30次",
  },
  //  觉醒战次数 (awakening)
  {
    field: "awakening",
    label: "觉醒战次数",
    validate: (form) => (Number(form.awakening) || 0) <= 3,
    message: () => "次数不能超过3次",
  },
  //  存储觉醒战次数 (storedAwakening)
  {
    field: "storedAwakening",
    label: "存储觉醒战次数",
    validate: (form) => (Number(form.storedAwakening) || 0) <= 30,
    message: () => "存储觉醒战次数不能超过30次",
  },

  // 7. 圣域副本 s1
  {
    field: "sanctuary.s1", // 对应表单中的嵌套路径
    label: "圣域副本 s1",
    validate: (form) => {
      const s1 = form.sanctuary?.s1 ?? 0;
      return Number(s1) <= 10;
    },
    message: () => "圣域 s1 次数不能超过10次",
  },
  // 8. 圣域副本 s2
  {
    field: "sanctuary.s2",
    label: "圣域副本 s2",
    validate: (form) => {
      const s2 = form.sanctuary?.s2 ?? 0;
      return Number(s2) <= 10;
    },
    message: () => "圣域 s2 次数不能超过10次",
  },
  // 9. 圣域副本 s3
  {
    field: "sanctuary.s3",
    label: "圣域副本 s3",
    validate: (form) => {
      const s3 = form.sanctuary?.s3 ?? 0;
      return Number(s3) <= 10;
    },
    message: () => "圣域 s3 次数不能超过10次",
  },
  // 10. 特级会员剩余天数（前置条件：开启了特级会员 且 非同组共享）
  {
    field: "premiumMemberDay",
    label: "特级会员剩余天数",
    validate: (form) => {
      // 前置条件：必须开启了特级会员，且不是同组共享状态
      const isSelfMember = form.premiumMember && !getCharGroup.value?.premiumMember;
      if (!isSelfMember) return true; // 未开启或共享状态无需校验此项

      const days = Number(form.premiumMemberDay) || 0;
      // 必须大于0且不能超过28天
      return days > 0 && days <= 28;
    },
    message: (form) => {
      const days = Number(form.premiumMemberDay) || 0;
      if (days <= 0) return "请输入有效的特级会员剩余天数";
      return "特级会员剩余天数不能超过 28 天";
    },
  },
  //  group 的完美校验规则
  {
    field: "group",
    label: "所属分组",
    validate: (form) => {
      // 只要 group 有值（不是 null、undefined、空字符串），就判定通过！
      const val = form?.group;
      return val !== null && val !== undefined && val !== "";
    },
    message: () => "请选择所属分组",
  },

  //  战场 (battlefield)
  {
    field: "battlefield",
    label: "战场次数",
    validate: (form) => (Number(form.battlefield) || 0) <= 3,
    message: () => "战场次数不能超过3次",
  },
];

//分组验证规则配置数据
const groupValidationRules = [
  {
    field: "premiumMemberDay",
    label: "特级会员剩余天数",
    validate: (form) => {
      // 前置条件：必须开启了特级会员，且不是同组共享状态
      const isSelfMember = form.premiumMember && !getCharGroup.value?.premiumMember;
      if (!isSelfMember) return true; // 未开启或共享状态无需校验此项

      const days = Number(form.premiumMemberDay) || 0;
      // 必须大于0且不能超过28天
      return days > 0 && days <= 28;
    },
    message: (form) => {
      const days = Number(form.premiumMemberDay) || 0;
      if (days <= 0) return "请输入有效的特级会员剩余天数";
      return "特级会员剩余天数不能超过 28 天";
    },
  },
  //  每日副本次数 (dailyRuns)
  {
    field: "dailyRuns",
    label: "每日副本次数",
    validate: (form) => (Number(form.dailyRuns) || 0) <= 14,
    message: () => "每日副本次数不能超过14次",
  },
  //  存储每日副本次数 (storedDailyRuns) - 组内共享校验
  {
    field: "storedDailyRuns",
    label: "存储每日副本次数",
    validate: (form, context = {}) => {
      const total = totalGroupStoredDailyRuns.value;
      return total <= 30;
    },
    message: () => "同组账号下存储每日副本次数总和不能超过30次",
  },
  // 古树庆典小游戏挑战次数校验（组内共用）

  {
    field: "minigameCount",
    label: "古树庆典小游戏挑战次数",
    validate: (form) => (Number(form.minigameCount) || 0) <= 14,
    message: () => "古树庆典小游戏挑战次数不能超过14次",
  },

  // 古树庆典小游戏存储补充次数校验（组内共享上限 30）
  {
    field: "storedMinigameCount",
    label: "古树庆典小游戏存储补充次数",
    validate: (form, context = {}) => {
      const total = totalGroupStoredMinigameCount.value;
      return total <= 30;
    },
    message: () => "同组账号下古树庆典小游戏存储补充次数总和不能超过30次",
  },
  // 次元袭击挑战次数校验（组内共用）
  {
    field: "dimensionalCount",
    label: "次元袭击挑战次数",
    validate: (form) => (Number(form.dimensionalCount) || 0) <= 14,
    message: () => "次元袭击挑战次数不能超过14次",
  },
  // 次元袭击存储补充次数校验（组内共享上限 30）
  {
    field: "storedDimensionalCount",
    label: "次元袭击存储补充次数",
    validate: (form, context = {}) => {
      const total = totalGroupStoredDimensionalCount.value;
      return total <= 30;
    },
    message: () => "同组账号下次元袭击存储补充次数总和不能超过30次",
  },
];

// 新增角色的表单数据一角色的默认数据
const newCharForm = ref({
  nightmareCount: 14, //噩梦次数
  dailyRuns: 14, //每日副本次数
  //圣域
  sanctuary: {
    s1: 1,
    s2: 1,
    s3: 1,
  },
});
// 新增角色的表单数据组默认数据
let defGroup = {
  //每日副本刷新规则：服务器共享（既同一组内共享），每周三5点更新，固定14次

  //输入框占位
  dailyRunsInput: 0,
  storedDailyRunsInput: 0,
  /** 每日副本挑战次数 */
  dailyRuns: 0,
  /** 每日副本补充挑战次数 服务器共享（既同一组内共享），30次上限*/
  storedDailyRuns: 0,
  /** 每日副本次数最后更新时间 */
  lastDailyRunsUpdate: "",

  minigameCountInput: 0,
  storedMinigameCountInput: 0,
  //古树庆典小游戏刷新规则：服务器共享（既同一组内共享），于每天5点恢复2次 minigameCount ，上限恢复上限14次
  /** 古树庆典小游戏的次数 */
  minigameCount: 0,
  /** 补充古树庆典小游戏副本次数 */
  storedMinigameCount: 0,
  /** 补充古树庆典小游戏副本次数最后更新时间 */
  lastMinigameUpdate: "",

  dimensionalCountInput: 0,
  storedDimensionalCountInput: 0,
  //次元袭击刷新规则：服务器共享（既同一组内共享），于每天5点恢复2次 dimensionalCount ，上限恢复上限14次
  /** 次元袭击的次数 */
  dimensionalCount: 0,
  /** 补充次元袭击次数 */
  storedDimensionalCount: 0,
  /** 次元袭击次数最后更新时间 */
  lastDimensionalUpdate: "",
};
const newCharGroupForm = ref(cloneDeep(defGroup));
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
    nightmareCount: 14, //噩梦次数
    awakening: 3, //觉醒战
    nightmareCount: 14, //噩梦

    battlefield: 3, //战场

    locked: true,
    sanctuary: {
      s1: 1,
      s2: 1,
      s3: 1,
    },
  };
  newCharGroupForm.value = cloneDeep(defGroup);
  showAddCharModal.value = true;
};

// 数据持久化
const saveData = async () => {
  console.log(
    `🔍 [UsersAdmin:144] %c 最终保存的gameData: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData.value
  );

  if (typeof saving !== "undefined") saving.value = true;
  if (gameData.value) {
    gameData.value.exportDate = new Date().toLocaleString();
  }

  try {
    if (typeof user !== "undefined" && user.value && typeof client !== "undefined") {
      await client.from("user_game_data").upsert(
        {
          user_id: user.value.id,
          data: gameData.value,
          updated_at: new Date(),
        },
        { onConflict: "user_id" }
      );
    } else if (typeof saveLocalGameData === "function") {
      // const cleanData = JSON.parse(JSON.stringify(gameData.value));
      const cleanData = cloneDeep(gameData.value);
      await saveLocalGameData(cleanData);
    } else {
      localStorage.setItem("aion2_portal_game_data", JSON.stringify(gameData.value));
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
const searchServerOptions = computed(() => getServersByRace(searchRaceId.value));
const filteredLegionMembers = computed(() => {
  const kw = legionKeyword.value.trim().toLowerCase();
  if (!kw) return legionMembers.value;
  return legionMembers.value.filter((m) =>
    String(m.name || "")
      .toLowerCase()
      .includes(kw)
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
        "character_id,name,server_id,server_name,race_id,race_name,level,class_name"
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
  const short = String(m?.serverShortName || getServerShortNameById(sid) || "").trim();
  if (!name) return "";
  if (!short) return name;
  return `${name}[${short}]`;
};
watch(searchRaceId, () => {
  const list = searchServerOptions.value;
  searchServerId.value = list[0]?.serverId || (searchRaceId.value === 1 ? 1001 : 2001);
});

const manualRaceId = ref(2);
const manualServerId = ref(2015);
const manualServerOptions = computed(() => getServersByRace(manualRaceId.value));
watch(manualRaceId, () => {
  const list = manualServerOptions.value;
  manualServerId.value = list[0]?.serverId || (manualRaceId.value === 1 ? 1001 : 2001);
});
const stripHtml = (v) => String(v || "").replace(/<[^>]+>/g, "");
const fetchCharacterInfo = async (characterId, serverId) => {
  const detail = await $fetch("/api/aion/info", {
    params: { characterId, serverId },
  });
  const profile = detail?.profile;
  if (!profile) throw new Error("角色信息不存在");
  const itemLevel = detail?.stat?.statList?.find((x) => x?.type === "ItemLevel")?.value;
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
    profile
  );

  const exists = gameData.value?.characters?.find(
    (x) => x.characterId === profile.characterId
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
      $alert("已添加", "角色详情接口暂时不可用，已先添加占位信息，可稍后点刷新补全");
    }
    addMemberToTeam(profile);
  } catch (e) {
    $alert("添加失败", e?.message || String(e));
  } finally {
    $loading.hide();
  }
};

// 获取当前角色对应的已经的保存分组数据
const getCharGroup = computed(() => {
  let groupItem = gameData.value?.groups?.find((f) => f.id == newCharForm.value?.group);
  return groupItem;
});

// 获取同组其他角色共享的会员剩余天数（并顺便自动同步给当前表单）
const groupSharedPremiumDays = computed(() => {
  return newCharGroupForm.value?.premiumMemberDay || 0;
});
//=========================================添加成员结束=========================================

// 监听分组切换，实时检测该分组下是否已有主账号或特级会员
const handleGroupChange = (e) => {
  const selectedGroupId = Number(e.target.value);

  newCharGroupForm.value = {
    ...cloneDeep(getCharGroup.value),
    dailyRuns: getCharGroup.value?.dailyRuns || 14, //每日副本次数
    minigameCount: getCharGroup.value?.minigameCount || 14, //古树庆典小游戏次数
    dimensionalCount: getCharGroup.value?.dimensionalCount || 14, //次元袭击次数
  };
};

/**
 * 校验表单数据
 * @param {Object} formData 验证的数据对象
 * @param {String} type 验证的类型 character角色，group 分组
 * @returns {Object} { isValid: boolean, invalidFields: string[], errors: Object }
 */
const validateForm = (formData, context = {}, type = "character") => {
  const invalidFields = [];
  const errors = {};

  let validateFormRules = [];

  if (type == "character") {
    validateFormRules = characterValidationRules;
  }
  if (type == "group") {
    validateFormRules = groupValidationRules;
  }

  validateFormRules.forEach((rule) => {
    try {
      const passes = rule.validate(formData, context);

      // 加上这行日志，看看究竟哪一条规则没通过
      if (!passes) {
        console.warn(`❌ 校验未通过的字段: [${rule.field}]`, formData);
        invalidFields.push(rule.field);
        errors[rule.field] =
          typeof rule.message === "function" ? rule.message(formData) : rule.message;
      }
    } catch (e) {
      console.error(`验证规则执行出错 [${rule.field}]:`, e);
    }
  });

  return {
    isValid: invalidFields.length === 0,
    invalidFields,
    errors,
  };
};

// 提交保存前的校验逻辑 确认添加角色保存触发 新增角色 新建角色
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
    (c) => c.characterId && c.characterId === newCharForm.value.characterId
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
      (c) => c.group === selectedGroup && c.primaryAccount
    );
    if (existingPrimary) {
      if (typeof $alert === "function") {
        $alert(
          "提示",
          `当前选择的 "${gameData.value.groups[selectedGroup].name}" 分组下已经拥有主账号 (${existingPrimary.characterName})！`
        );
      } else {
        alert(
          `当前选择的 "${gameData.value.groups[selectedGroup].name}" 分组下已经拥有主账号 (${existingPrimary.characterName})！`
        );
      }
      return;
    }
  }

  const nowIso = new Date().toISOString();
  const newChar = {
    id: Date.now(),

    // 能量与资源
    energy: 0,
    storedEnergy: 0,
    kina: 0,
    weeklyEnergyPurchased: false,
    weeklyEnergyPurchasedDate: nowIso,
    breezeEnergyPurchased: false,
    breezeEnergyPurchasedDate: nowIso,

    // 次数进度
    /** 每周远征副本通关次数 */
    runs: 0,
    /** 每周超越副本通关次数 */
    transcendRuns: 0,

    nightmareCount: 0,
    storedNightmareCount: 0,
    lastNightmareUpdate: nowIso,
    /** 角色觉醒战次数，当前角色每周三5点更新，固定3次，上限30*/
    awakening: 0,
    /** 觉醒战补充次数 角色独立，30次上限*/
    storedAwakening: 0,
    /** 觉醒战最后更新时间 */
    lastAwakeningUpdate: nowIso,

    /** 战场玩法的次数 */
    battlefield: 0,

    // 圣域、小游戏及日常状态
    sanctuary: { s1: 1, s2: 1, s3: 1 },

    dailySignIn: false,
    dailySignInDate: nowIso, //每日签到状态及时间

    dailyMission: false,
    dailyMissionDate: nowIso, //每日任务完成状态

    createDate: nowIso,

    ...newCharForm.value,
  };

  if (!gameData.value.characters) {
    gameData.value.characters = [];
  }

  console.log(
    `🔍 [UsersAdmin:623] %c newCharForm提交: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    newCharForm.value
  );
  console.log(
    `🔍 [UsersAdmin:624] %c newChar提交: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    newChar
  );
  console.log(
    `🔍 [UsersAdmin:624] %c calculatedStartTime提交: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    calculatedStartTime.value
  );

  gameData.value?.characters?.unshift(newChar);
  gameData.value.characterCount = gameData.value?.characters?.length || 0;

  showAddCharModal.value = false;

  // 查找对应索引
  if (newCharGroupForm.value?.id) {
    const targetId = newCharGroupForm.value.id;
    const index = gameData.value.groups.findIndex((g) => g.id === targetId);

    if (gameData.value?.groups && index !== -1) {
      const originalGroup = gameData.value.groups[index];
      const form = newCharGroupForm.value || {};

      // 批量解构出所有带有 Input 后缀的临时输入字段，剩下的干净表单数据存入 restForm
      const {
        storedDailyRunsInput,
        storedMinigameCountInput,
        storedDimensionalCountInput,
        primaryAccountID,
        ...formWithoutInput
      } = form;

      //  依次计算各自的最新存储次数（原有次数 + 本次输入增量）
      const newStoredDailyRuns =
        (Number(originalGroup.storedDailyRuns) || 0) +
        (Number(storedDailyRunsInput) || 0);
      const newStoredMinigameCount =
        (Number(originalGroup.storedMinigameCount) || 0) +
        (Number(storedMinigameCountInput) || 0);
      const newStoredDimensional =
        (Number(originalGroup.storedDimensionalCount) || 0) +
        (Number(storedDimensionalCountInput) || 0);

      gameData.value.groups[index] = {
        ...originalGroup,
        ...formWithoutInput,

        /** 每日副本次数最后更新时间 */
        lastDailyRunsUpdate: nowIso,
        /** 补充古树庆典小游戏副本次数最后更新时间 */
        lastMinigameUpdate: nowIso,
        /** 次元袭击次数最后更新时间 */
        lastDimensionalUpdate: nowIso,

        storedDailyRuns: newStoredDailyRuns,
        storedMinigameCount: newStoredMinigameCount,
        storedDimensionalCount: newStoredDimensional,
        primaryAccountID:
          !originalGroup?.primaryAccountID && primaryAccountID
            ? newChar?.characterId
            : originalGroup?.primaryAccountID,
      };
    }
  }

  console.log(
    `🔍 [UsersAdmin:624] %c gameData 提交: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData.value
  );
  debugger;
  await saveData();
};

//============================角色管理开始============================

//会员相关处理
// 辅助函数：格式化日期为 YYYY-MM-DD HH:mm 或 YYYY-MM-DD
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 1. 当前角色自主输入剩余天数时，动态计算开通日期
const calculatedStartTime = computed(() => {
  const remainingDays = Number(newCharForm.value.premiumMemberDay) || 0;
  if (remainingDays < 0 || remainingDays > 28) return "剩余天数应在 0~28 之间";

  const totalDays = 28;
  const passedDays = totalDays - remainingDays; // 已经过去的天数

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - passedDays);
  return formatDate(startDate);
});

// 2. 当前角色自主输入剩余天数时，动态计算结束（到期）日期
const calculatedEndTime = computed(() => {
  const remainingDays = Number(newCharForm.value.premiumMemberDay) || 0;
  if (remainingDays < 0 || remainingDays > 28) return "无效范围";

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + remainingDays);
  return formatDate(endDate);
});

// 3. 如果是同组共享模式，推导共享角色的开通与结束时间（假设共享数据里存的是对应的剩余天数）
const groupSharedStartTime = computed(() => {
  const remainingDays = Number(groupSharedPremiumDays.value) || 0;
  const passedDays = 28 - remainingDays;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - passedDays);
  return formatDate(startDate);
});

const groupSharedEndTime = computed(() => {
  const remainingDays = Number(groupSharedPremiumDays.value) || 0;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + remainingDays);
  return formatDate(endDate);
});

//============================角色管理结束============================

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
    const target = gameData.value.groups.find((g) => g.id === groupEditingId.value);
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
      createdAt: new Date(),
      updatedAt: new Date(),
      runs: 0,
      transcendRuns: 0,
      runLogs: [],
    });
  }
  await saveData();
  // 保存后重置输入状态
  cancelGroupEdit();
};

// 删除分组
const deleteGroup = async (id) => {
  // 安全校验：检查该分组下是否仍有角色绑定，若有则阻止删除
  const hasCharsInGroup = gameData.value?.characters?.some((c) => c.group === id);
  if (hasCharsInGroup) {
    $alert("该分组下仍有绑定的角色，无法直接删除！请先迁移或删除对应角色。");
    return;
  }

  const target = gameData.value?.groups?.find((g) => g.id === id);
  const confirmed = await $confirm(
    "删除确认",
    `确定要删除分组 "${target?.name || id}" 吗？`
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

console.log("================ 设置按钮 开始================");

// 打开分组管理弹窗
const openSettingsModal = () => {
  settingsOpen.value = true;
};

console.log("%c 设置按钮", "color: #28a745; font-weight: bold;");
console.log("================ 设置按钮 结束 =====================");

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
  console.log(
    `🔍 [UsersAdmin:734] %c gameData保存签前groupCharacterPanelHandleUpdateCharacter: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData.value
  );
  await saveData();
};
// 分组角色卡片列表更新分组事件处理（兼容传入单个分组或整个分组数组）
const groupCharacterPanelHandleUpdateGroup = async (updatedGroupsOrSingleGroup) => {
  if (Array.isArray(updatedGroupsOrSingleGroup)) {
    // 如果子组件传过来的是一整个 groups 数组，直接整体替换
    gameData.value.groups = updatedGroupsOrSingleGroup;
  } else if (updatedGroupsOrSingleGroup && updatedGroupsOrSingleGroup.id) {
    // 兼容老代码：如果传过来的是单个分组对象
    gameData.value.groups = gameData.value.groups.map((g) => {
      if (g.id === updatedGroupsOrSingleGroup.id) {
        return { ...g, ...updatedGroupsOrSingleGroup };
      }
      return g;
    });
  }

  console.log(
    `🔍 [UsersAdmin] %c gameData保存前 groupCharacterPanelHandleUpdateGroup: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    gameData.value.groups
  );

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

//================ 每日副本 开始================
// 1. 检查同组（排除当前正在编辑的角色自己）是否已经有其他角色配置过每日副本挑战次数
const hasGroupDailyRuns = computed(() => {
  return (getCharGroup.value?.dailyRuns ?? 0) > 0;
});

//  每日副本补充次数：组内全员共享统计
const totalGroupStoredDailyRuns = computed(() => {
  // 加上当前表单里输入的数值
  let total =
    (Number(getCharGroup.value?.storedDailyRuns) || 0) +
    (Number(newCharGroupForm.value?.storedDailyRunsInput) || 0);
  return total;
});
//================ 每日副本 结束 =====================

// ==================== 古树庆典小游戏（组内共享配置与统计） ====================

// 判断当前分组内是否已经有其他角色配置过“小游戏挑战次数”
const hasGroupMinigameCount = computed(() => {
  return (getCharGroup.value?.minigameCount ?? 0) > 0;
});
// 计算“古树庆典存储补充次数”的组内共享总和（包含当前表单实时输入的数值）
const totalGroupStoredMinigameCount = computed(() => {
  let total =
    (Number(getCharGroup.value?.storedMinigameCount) || 0) +
    (Number(newCharGroupForm.value?.storedMinigameCountInput) || 0);

  return total;
});

// ==================== 次元袭击 组内共享配置与统计） ====================

// 判断当前分组内是否已经有其他角色配置过“次元袭击挑战次数”
const hasGroupDimensionalCount = computed(() => {
  return (getCharGroup.value?.dimensionalCount ?? 0) > 0;
});

// 计算“次元袭击存储补充次数”的组内共享总和（包含当前表单实时输入的数值）
const totalGroupStoredDimensionalCount = computed(() => {
  let total =
    (Number(getCharGroup.value?.storedDimensionalCount) || 0) +
    (Number(newCharGroupForm.value?.storedDimensionalCountInput) || 0);

  return total;
});

//============================组角色卡片列表事件处理/开结束============================

onMounted(async () => {
  await loadData();
});
watch(
  () => gameData,
  (newVal) => {
    if (newVal) {
      console.log(
        `🔍 [UsersAdmin:450] %c 数据gameData: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        gameData.value
      );
    }
  }
);

// 辅助函数：统一执行校验并合并到全局 validationResult
const updateValidation = (form, context, type) => {
  const result = validateForm(form, context, type);

  // 核心：基于当前的 validationResult 进行合并，而不是直接整体覆盖
  const currentErrors = validationResult.value.errors || {};
  const currentInvalidFields = validationResult.value.invalidFields || [];

  // 获取当前 type 对应的规则里包含的所有字段（用于精准清理该类型旧的错误）
  const rules = type === "character" ? characterValidationRules : groupValidationRules;
  const currentTypeFields = rules.map((r) => r.field);

  // 1. 先清除属于当前 type 的旧错误
  const newErrors = { ...currentErrors };
  currentTypeFields.forEach((field) => {
    delete newErrors[field];
  });

  // 2. 注入当前最新的错误
  Object.assign(newErrors, result.errors);

  // 3. 处理 invalidFields（保留非当前 type 的错误字段，拼上当前最新的错误字段）
  const filteredFields = currentInvalidFields.filter(
    (f) => !currentTypeFields.includes(f)
  );
  const newInvalidFields = [...new Set([...filteredFields, ...result.invalidFields])];

  // 4. 更新合并后的结果
  validationResult.value = {
    isValid: newInvalidFields.length === 0,
    errors: newErrors,
    invalidFields: newInvalidFields,
  };
};

// 1. 监听角色表单
watch(
  () => newCharForm.value,
  (newVal) => {
    if (newVal) {
      const overrideForm = { ...newVal };
      updateValidation(
        overrideForm,
        {
          allCharacters: gameData?.characters || [],
          groups: gameData?.groups || [],
        },
        "character"
      );
    }
  },
  { deep: true, immediate: true }
);

// 2. 监听分组表单
watch(
  () => newCharGroupForm.value,
  (newVal) => {
    if (newVal) {
      console.log(
        `🔍 [UsersAdmin:1309] %c 监听分组表单newCharGroupForm: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        newCharGroupForm
      );
      const overrideForm = { ...newVal };

      if (totalGroupStoredDailyRuns.value > 30) {
        overrideForm.storedDailyRuns = totalGroupStoredDailyRuns.value;
      }
      if (totalGroupStoredMinigameCount.value > 30) {
        overrideForm.storedMinigameCount = totalGroupStoredMinigameCount.value;
      }
      if (totalGroupStoredDimensionalCount.value > 30) {
        overrideForm.storedDimensionalCount = totalGroupStoredDimensionalCount.value;
      }

      updateValidation(overrideForm, {}, "group");
    }
  },
  { deep: true }
);

watch(
  () => validationResult.value,
  (newVal) => {
    console.log(
      `🔍 [UsersAdmin:1298] %c validationResulty验证: `,
      "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
      newVal
    );
  },
  { deep: true, immediate: true }
);
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
        <!-- 设置按钮 -->
        <button
          @click="openSettingsModal"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          设置
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
      <!-- <button
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
      </button> -->

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
      :key="activeTabGroup"
      v-if="activeTabGroup"
      :activeTabGroup="activeTabGroup"
      :gameData="gameData"
      @character-delete="groupCharacterPanelHandleDelete"
      @toggle-lock="groupCharacterPanelHandleToggleLock"
      @update-character="groupCharacterPanelHandleUpdateCharacter"
      @update-groups="groupCharacterPanelHandleUpdateGroup"
      @toggle-task="groupCharacterPanelHandleToggleTask"
      @consume-energy="groupCharacterPanelHandleConsumeEnergy"
    />
    <!-- 极宽卡片式新增角色弹窗 (蓝白色调) -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddCharModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
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
                      @click="(pickerOpen = true), (pickerOpenOther.type = 'add')"
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
                    <div class="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <div class="text-[10px] font-bold text-slate-400">
                          昵称 / 职业
                        </div>
                        <div class="text-sm font-black text-slate-800 truncate">
                          {{ newCharForm.characterName || newCharForm.name }}
                          <span class="text-xs font-bold text-[#45a6d5]"
                            >({{ newCharForm.className || newCharForm.class }})</span
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
                          {{ newCharForm.value?.serverName || "未知" }}
                          ·
                          <span class="text-xs font-bold text-purple-600">{{
                            newCharForm.value?.raceName || "未知"
                          }}</span>
                        </div>
                      </div>
                      <div>
                        <div class="text-[10px] font-bold text-slate-400">称号</div>
                        <div class="text-sm font-black text-slate-800 truncate">
                          {{ newCharForm.value?.titleName || "无" }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 卡片二：所属分组配置 (独立卡片) -->
                <div
                  class="bg-white border p-6 rounded-3xl space-y-5 shadow-sm transition-all"
                  :class="
                    validationResult.errors.group
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                    <div
                      class="text-sm font-black uppercase tracking-wider text-slate-700"
                    >
                      所属分组配置
                    </div>
                  </div>
                  <p class="text-xs font-bold text-slate-400">
                    选择角色所属的分组，同组账号将共享远征/超越挑战次数等资源
                  </p>
                  <div class="grid grid-cols-1 gap-5 pt-1">
                    <!-- 分组选择 -->
                    <div class="flex flex-col">
                      <div class="flex items-center justify-between mb-2">
                        <!-- 标题 -->
                        <label class="text-xs font-bold text-slate-500 block"
                          >所属分组</label
                        >

                        <!-- 错误提示（右侧对齐） -->
                        <span
                          v-if="validationResult.errors.group"
                          class="text-[10px] text-red-500 font-bold"
                        >
                          {{ validationResult.errors.group }}
                        </span>
                      </div>

                      <div class="flex-1 flex items-center gap-2">
                        <select
                          v-model.number="newCharForm.group"
                          @change="
                            (e) => {
                              // 执行你原有的分组切换回调（如果有的话）
                              if (typeof handleGroupChange === 'function') {
                                handleGroupChange(e);
                              }
                            }
                          "
                          class="w-full h-[50px] px-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all cursor-pointer box-border"
                        >
                          <option :value="null" disabled hidden>请选择所属分组...</option>
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
                  </div>
                </div>

                <!-- 卡片三：账号属性配置 (独立卡片：主账号与特级会员) -->
                <div
                  class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-5 shadow-sm"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div
                      class="text-sm font-black uppercase tracking-wider text-slate-700"
                    >
                      账号属性配置
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 items-stretch">
                    <!-- 是否为主账号 (带同组排他提示) -->
                    <div class="flex flex-col">
                      <label class="text-xs font-bold text-slate-500 block mb-2"
                        >主账号状态</label
                      >

                      <div class="flex-1 flex items-center">
                        <div
                          class="w-full h-[50px] flex items-center justify-between px-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 select-none box-border transition-all"
                          :class="[
                            getCharGroup?.primaryAccountID
                              ? 'opacity-60 cursor-not-allowed bg-slate-100/60 border-slate-200'
                              : 'cursor-pointer hover:border-[#45a6d5]',
                          ]"
                          @click="
                            () => {
                              // 如果组内已经有主账号了，直接拦截点击，不让修改
                              if (getCharGroup?.primaryAccountID) return;
                              newCharGroupForm.primaryAccountID = !Boolean(
                                newCharGroupForm.primaryAccountID
                              );
                            }
                          "
                        >
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-slate-700"
                              >设为主账号</span
                            >
                            <!-- 提示文案：告知用户为什么被锁定 -->
                            <span
                              v-if="getCharGroup?.primaryAccountID"
                              class="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                            >
                              该组已有主账号
                            </span>
                          </div>

                          <!-- 开关外观 -->
                          <div
                            class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300"
                            :class="[
                              getCharGroup?.primaryAccountID
                                ? 'bg-slate-300 cursor-not-allowed'
                                : newCharGroupForm.primaryAccountID
                                ? 'bg-[#45a6d5]'
                                : 'bg-slate-300',
                            ]"
                          >
                            <div
                              class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
                              :class="
                                newCharGroupForm?.primaryAccountID
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
                          v-if="getCharGroup?.premiumMember"
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
                            newCharGroupForm.premiumMember = !newCharGroupForm.premiumMember
                          "
                        >
                          <span class="text-sm font-bold text-slate-700"
                            >开通特级会员</span
                          >
                          <div
                            class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300"
                            :class="
                              newCharGroupForm.premiumMember
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            "
                          >
                            <div
                              class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
                              :class="
                                newCharGroupForm.premiumMember
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
                      v-if="newCharGroupForm.premiumMember || getCharGroup?.premiumMember"
                      class="pt-2"
                    >
                      <div
                        class="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-3"
                      >
                        <label class="text-xs font-bold text-amber-700 block"
                          >特级会员剩余天数</label
                        >

                        <!-- 情况 A：同组已有其他角色开启了会员（只展示共享天数，自动同步） -->
                        <div v-if="getCharGroup?.premiumMember" class="space-y-1 py-1">
                          <div class="flex items-center justify-between">
                            <span class="text-sm font-black text-amber-900">
                              同组共享天数：<span class="text-base text-amber-600">{{
                                groupSharedPremiumDays
                              }}</span>
                              天（已自动同步）
                            </span>
                            <span
                              class="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold"
                              >组内一致</span
                            >
                          </div>
                          <!-- 同组共享时的起止时间展示 -->
                          <div
                            class="text-[11px] font-bold text-amber-700/80 flex items-center gap-3 pt-1"
                          >
                            <span>开通时间: {{ groupSharedStartTime || "未知" }}</span>
                            <span>|</span>
                            <span>到期时间: {{ groupSharedEndTime || "未知" }}</span>
                          </div>
                        </div>

                        <!-- 情况 B：当前角色自己是组内第一个开启会员的（允许输入天数） -->
                        <div v-else class="space-y-2">
                          <input
                            v-model.number="newCharGroupForm.premiumMemberDay"
                            min="1"
                            max="28"
                            placeholder="请输入剩余天数（最多28天）..."
                            class="w-full md:w-1/3 px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                            :class="
                              validationResult.invalidFields.includes('premiumMemberDay')
                                ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                : 'border-amber-200 focus:border-amber-500'
                            "
                          />
                          <!-- 错误提示小字 -->
                          <span
                            v-if="validationResult.errors.premiumMemberDay"
                            class="text-[10px] text-red-500 font-bold block"
                          >
                            {{ validationResult.errors.premiumMemberDay }}
                          </span>

                          <!-- 实时计算并展示：开通时间 与 结束时间（基于总时长28天倒推与顺延） -->
                          <div
                            v-if="
                              newCharGroupForm.premiumMemberDay &&
                              !validationResult.errors.premiumMemberDay
                            "
                            class="text-xs font-bold text-amber-800 bg-amber-100/60 px-3 py-2 rounded-xl flex flex-wrap items-center gap-x-4 gap-y-1"
                          >
                            <span
                              >预计开通时间：<strong class="text-amber-900">{{
                                calculatedStartTime
                              }}</strong></span
                            >
                            <span
                              >预计到期时间：<strong class="text-amber-900">{{
                                calculatedEndTime
                              }}</strong></span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
                <!-- 奥德能量组合卡片 (当前 + 存储补充) -->
                <div
                  class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-6 shadow-sm"
                >
                  <div
                    class="flex items-center justify-between pb-2 border-b border-slate-100"
                  >
                    <!-- 左侧：图标、名称与核心数值 -->
                    <div class="flex items-center gap-2.5">
                      <div
                        class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"
                      ></div>
                      <div class="flex items-center gap-2">
                        <span
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                          >奥德能量</span
                        >
                        <span
                          class="text-xs font-black text-[#45a6d5] bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100"
                        >
                          {{ newCharForm?.energy || 0 }}
                          <span class="text-amber-600 font-bold"
                            >（+{{ newCharForm?.storedEnergy || 0 }}）</span
                          >
                          <span class="text-slate-400 font-bold">/ </span>
                          <span class="text-slate-700">{{
                            newCharGroupForm?.premiumMember || getCharGroup?.premiumMember
                              ? 840
                              : 560
                          }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                  >
                    <div
                      class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                    ></div>

                    <div class="grid grid-cols-2 gap-4">
                      <!-- 基础奥德能量 -->
                      <div>
                        <div class="flex items-center justify-between mb-1.5">
                          <label class="text-xs font-bold text-slate-500">当前能量</label>
                          <span class="text-[10px] font-black text-[#45a6d5]">
                            {{ newCharForm?.energy || 0 }}
                            ({{
                              Math.max(
                                0,
                                (newCharGroupForm?.premiumMember ||
                                getCharGroup?.premiumMember
                                  ? 840
                                  : 560) - (newCharForm?.energy || 0)
                              )
                            }}) /
                            {{
                              newCharGroupForm?.premiumMember ||
                              getCharGroup?.premiumMember
                                ? 840
                                : 560
                            }}
                          </span>
                        </div>
                        <input
                          v-model.number="newCharForm.energy"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('energy')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-[#45a6d5]'
                          "
                        />
                        <span
                          v-if="validationResult.errors.energy"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors.energy }}
                        </span>
                      </div>

                      <!-- 存储补充能量 -->
                      <div>
                        <div class="flex items-center justify-between mb-1.5">
                          <label class="text-xs font-bold text-slate-500"
                            >存储补充能量</label
                          >
                          <span class="text-[10px] font-black text-amber-600">
                            {{ newCharForm.storedEnergy || 0 }}
                            ({{ Math.max(0, 2000 - (newCharForm.storedEnergy || 0)) }}) /
                            2000
                          </span>
                        </div>
                        <input
                          v-model.number="newCharForm.storedEnergy"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('storedEnergy')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-[#45a6d5]'
                          "
                        />
                        <span
                          v-if="validationResult.errors.storedEnergy"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors.storedEnergy }}
                        </span>
                      </div>
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
                  <!-- 战场卡片 -->
                  <div
                    class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          战场 (角色独立配置)
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <!-- 挑战次数卡片 -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>挑战次数 (角色独立 / 上限3)</span>
                          <span class="text-xs font-black text-[#45a6d5]">
                            {{ newCharForm.battlefield || 0 }}
                            / 3
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
                              v-model.number="newCharForm.battlefield"
                              max="14"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('battlefield')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.battlefield"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.battlefield }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 噩梦副本卡片 -->
                  <div
                    class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          噩梦副本 (角色独立配置)
                        </div>
                      </div>
                      <span
                        class="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-50 text-[#45a6d5]"
                      >
                        当前角色独立维护
                      </span>
                    </div>

                    <p class="text-xs font-bold text-slate-400">
                      噩梦副本挑战次数（上限14）与存储补充次数（上限30）均为当前角色独立所有，不与其他组内角色共享。
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <!-- 挑战次数卡片 -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>挑战次数 (角色独立 / 上限14)</span>
                          <span class="text-xs font-black text-[#45a6d5]">
                            {{ newCharForm.nightmareCount || 0 }}
                            / 14
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
                              v-model.number="newCharForm.nightmareCount"
                              max="14"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('nightmareCount')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.nightmareCount"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.nightmareCount }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- 存储补充次数卡片 -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>存储补充次数 (角色独立 / 上限30)</span>
                          <span class="text-xs font-black text-amber-600">
                            {{ newCharForm.storedNightmareCount || 0 }}
                            / 30
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
                                    30 - (newCharForm.storedNightmareCount || 0)
                                  )
                                }}
                              </span>
                            </div>
                            <input
                              v-model.number="newCharForm.storedNightmareCount"
                              max="30"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes(
                                  'storedNightmareCount'
                                )
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.storedNightmareCount"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.storedNightmareCount }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 觉醒战卡片 -->
                  <div
                    class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          觉醒战 (角色独立配置)
                        </div>
                      </div>
                      <span
                        class="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-50 text-[#45a6d5]"
                      >
                        当前角色独立维护
                      </span>
                    </div>

                    <p class="text-xs font-bold text-slate-400">
                      觉醒战挑战次数（上限3）与存储补充次数（上限30）均为当前角色独立所有，不与其他组内角色共享。
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <!-- 挑战次数卡片 -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>挑战次数 (角色独立 / 上限3)</span>
                          <span class="text-xs font-black text-[#45a6d5]">
                            {{ newCharForm.awakening || 0 }}
                            / 3
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
                              v-model.number="newCharForm.awakening"
                              max="3"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('awakening')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.awakening"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.awakening }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- 存储补充次数卡片 -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>存储补充次数 (角色独立 / 上限30)</span>
                          <span class="text-xs font-black text-amber-600">
                            {{ newCharForm.storedAwakening || 0 }}
                            / 30
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
                                {{ Math.max(0, 30 - (newCharForm.storedAwakening || 0)) }}
                              </span>
                            </div>
                            <input
                              v-model.number="newCharForm.storedAwakening"
                              max="30"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('storedAwakening')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.storedAwakening"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.storedAwakening }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 每日副本卡片 -->
                  <div
                    class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                    v-if="newCharGroupForm?.id"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          每日副本 (组内共享挑战与补充)
                        </div>
                      </div>
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
                      同一分组账号下挑战次数与存储补充次数均视为组内共用（挑战上限14，存储补充上限30）。
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <!-- 挑战次数卡片 -->
                      <div
                        v-if="!hasGroupDailyRuns"
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>挑战次数 (组内共用 / 上限14)</span>
                          <span class="text-xs font-black text-[#45a6d5]">
                            {{ newCharGroupForm.dailyRuns || 0 }}
                            / 14
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
                              v-model.number="newCharGroupForm.dailyRuns"
                              max="14"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('dailyRuns')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.dailyRuns"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.dailyRuns }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- 同组已配置占位 -->
                      <div
                        v-else
                        class="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex flex-col justify-center space-y-2"
                      >
                        <div class="text-xs font-bold text-amber-800">
                          挑战次数已由同组角色共享设定
                        </div>
                        <div class="text-xs font-medium text-amber-600">
                          当前分组共享挑战次数为：<span class="font-black text-amber-700"
                            >{{ getCharGroup?.dailyRuns || 0 }} / 14</span
                          >。当前角色无需重复配置。
                        </div>
                      </div>

                      <!-- 存储补充次数卡片 (组内共享计算) -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>存储补充次数 (组内共用 / 上限30)</span>
                          <span class="text-xs font-black text-amber-600">
                            {{ totalGroupStoredDailyRuns }}
                            / 30
                          </span>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                          <div>
                            <div class="flex items-center justify-between mb-1.5">
                              <label class="text-xs font-bold text-slate-500"
                                >存储次数</label
                              >
                              <span class="text-[10px] font-black text-amber-600">
                                组内剩余可补充:
                                {{ Math.max(0, 30 - totalGroupStoredDailyRuns) }}
                              </span>
                            </div>
                            <input
                              v-model.number="newCharGroupForm.storedDailyRunsInput"
                              max="30"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('storedDailyRuns')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.storedDailyRuns"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.storedDailyRuns }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 古树庆典小游戏卡片 -->
                  <div
                    class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          古树庆典小游戏 (组内共享挑战与补充)
                        </div>
                      </div>
                      <span
                        class="text-[10px] font-bold px-3 py-1 rounded-full"
                        :class="
                          hasGroupMinigameCount
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-50 text-[#45a6d5]'
                        "
                      >
                        {{
                          hasGroupMinigameCount
                            ? "同组已有角色配置过挑战次数 (当前角色已隐藏)"
                            : "当前分组首次配置挑战次数"
                        }}
                      </span>
                    </div>

                    <p class="text-xs font-bold text-slate-400">
                      同一分组账号下小游戏挑战次数与存储补充次数均视为组内共用（挑战上限14，存储补充上限30）。
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <!-- 挑战次数卡片 -->
                      <div
                        v-if="!hasGroupMinigameCount"
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>挑战次数 (组内共用 / 上限14)</span>
                          <span class="text-xs font-black text-[#45a6d5]">
                            {{ newCharGroupForm.minigameCount || 0 }}
                            / 14
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
                              v-model.number="newCharGroupForm.minigameCount"
                              max="14"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes('minigameCount')
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.minigameCount"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.minigameCount }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- 同组已配置占位 -->
                      <div
                        v-else
                        class="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex flex-col justify-center space-y-2"
                      >
                        <div class="text-xs font-bold text-amber-800">
                          挑战次数已由同组角色共享设定
                        </div>
                        <div class="text-xs font-medium text-amber-600">
                          当前分组共享挑战次数为：<span class="font-black text-amber-700"
                            >{{ getCharGroup?.minigameCount || 0 }} / 14</span
                          >。当前角色无需重复配置。
                        </div>
                      </div>

                      <!-- 存储补充次数卡片 (组内共享计算) -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>存储补充次数 (组内共用 / 上限30)</span>
                          <span class="text-xs font-black text-amber-600">
                            {{ totalGroupStoredMinigameCount }}
                            / 30
                          </span>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                          <div>
                            <div class="flex items-center justify-between mb-1.5">
                              <label class="text-xs font-bold text-slate-500"
                                >存储次数</label
                              >
                              <span class="text-[10px] font-black text-amber-600">
                                组内剩余可补充:
                                {{ Math.max(0, 30 - totalGroupStoredMinigameCount) }}
                              </span>
                            </div>
                            <input
                              v-model.number="newCharGroupForm.storedMinigameCountInput"
                              max="30"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes(
                                  'storedMinigameCount'
                                )
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.storedMinigameCount"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.storedMinigameCount }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 次元袭击卡片 -->
                  <div
                    class="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          次元袭击 (组内共享挑战与补充)
                        </div>
                      </div>
                      <span
                        class="text-[10px] font-bold px-3 py-1 rounded-full"
                        :class="
                          hasGroupDimensionalCount
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-50 text-[#45a6d5]'
                        "
                      >
                        {{
                          hasGroupDimensionalCount
                            ? "同组已有角色配置过挑战次数 (当前角色已隐藏)"
                            : "当前分组首次配置挑战次数"
                        }}
                      </span>
                    </div>

                    <p class="text-xs font-bold text-slate-400">
                      同一分组账号下次元袭击挑战次数与存储补充次数均视为组内共用（挑战上限14，存储补充上限30）。
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <!-- 挑战次数卡片 -->
                      <div
                        v-if="!hasGroupDimensionalCount"
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>挑战次数 (组内共用 / 上限14)</span>
                          <span class="text-xs font-black text-[#45a6d5]">
                            {{ newCharGroupForm.dimensionalCount || 0 }}
                            / 14
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
                              v-model.number="newCharGroupForm.dimensionalCount"
                              max="14"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes(
                                  'dimensionalCount'
                                )
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.dimensionalCount"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.dimensionalCount }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- 同组已配置占位 -->
                      <div
                        v-else
                        class="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl flex flex-col justify-center space-y-2"
                      >
                        <div class="text-xs font-bold text-amber-800">
                          挑战次数已由同组角色共享设定
                        </div>
                        <div class="text-xs font-medium text-amber-600">
                          当前分组共享挑战次数为：<span class="font-black text-amber-700"
                            >{{ getCharGroup?.dimensionalCount || 0 }} / 14</span
                          >。当前角色无需重复配置。
                        </div>
                      </div>

                      <!-- 存储补充次数卡片 (组内共享计算) -->
                      <div
                        class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-3"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider"
                        >
                          <span>存储补充次数 (组内共用 / 上限30)</span>
                          <span class="text-xs font-black text-amber-600">
                            {{ totalGroupStoredDimensionalCount }}
                            / 30
                          </span>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                          <div>
                            <div class="flex items-center justify-between mb-1.5">
                              <label class="text-xs font-bold text-slate-500"
                                >存储次数</label
                              >
                              <span class="text-[10px] font-black text-amber-600">
                                组内剩余可补充:
                                {{ Math.max(0, 30 - totalGroupStoredDimensionalCount) }}
                              </span>
                            </div>
                            <input
                              v-model.number="
                                newCharGroupForm.storedDimensionalCountInput
                              "
                              max="30"
                              min="0"
                              class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                              :class="
                                validationResult.invalidFields.includes(
                                  'storedDimensionalCount'
                                )
                                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                                  : 'border-slate-200/80 focus:border-[#45a6d5]'
                              "
                            />
                            <span
                              v-if="validationResult.errors.storedDimensionalCount"
                              class="text-[10px] text-red-500 font-bold mt-1 block"
                            >
                              {{ validationResult.errors.storedDimensionalCount }}
                            </span>
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
                      圣域副本次数 (每项上限10次)
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                      <!-- S1 -->
                      <div>
                        <label class="text-xs font-bold text-slate-600 block mb-1.5"
                          >深渊重铸：卢德莱-S1 次数</label
                        >
                        <input
                          v-model.number="newCharForm.sanctuary.s1"
                          max="1"
                          min="0"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('sanctuary.s1')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-emerald-500'
                          "
                        />
                        <span
                          v-if="validationResult.errors['sanctuary.s1']"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors["sanctuary.s1"] }}
                        </span>
                      </div>
                      <!-- S2 -->
                      <div>
                        <label class="text-xs font-bold text-slate-600 block mb-1.5"
                          >侵蚀净化所-S2 次数</label
                        >
                        <input
                          v-model.number="newCharForm.sanctuary.s2"
                          max="1"
                          min="0"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('sanctuary.s2')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-emerald-500'
                          "
                        />
                        <span
                          v-if="validationResult.errors['sanctuary.s2']"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors["sanctuary.s2"] }}
                        </span>
                      </div>
                      <!-- S3 -->
                      <div>
                        <label class="text-xs font-bold text-slate-600 block mb-1.5"
                          >穆斯费尔尔圣杯-S3 次数</label
                        >
                        <input
                          v-model.number="newCharForm.sanctuary.s3"
                          max="1"
                          min="0"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('sanctuary.s3')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-emerald-500'
                          "
                        />
                        <span
                          v-if="validationResult.errors['sanctuary.s3']"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors["sanctuary.s3"] }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="p-8 bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 transition-all hover:border-[#45a6d5]/50 hover:bg-sky-50/30 group cursor-pointer"
                  @click="(pickerOpen = true), (pickerOpenOther.type = 'add')"
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
                :disabled="saving || !validationResult.isValid"
                class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50"
              >
                {{ saving ? "保存中..." : "确认添加角色" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- 选择角色/选择其他角色 -->
    <Teleport to="body">
      <Transition name="modal2">
        <div
          v-if="pickerOpen"
          class="fixed inset-0 z-[60] flex items-center justify-center"
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

                <div v-if="myLoading" class="py-10 text-center text-slate-400 font-bold">
                  加载中...
                </div>
                <div v-else class="max-h-[55vh] overflow-y-auto custom-scroll space-y-2">
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
                        <span v-if="m.character_level">Lv.{{ m.character_level }}</span>
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
                <div v-else class="max-h-[45vh] overflow-y-auto custom-scroll space-y-2">
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
    </Teleport>
    <!-- 分组管理 -->
    <Teleport to="body">
      <Transition name="modal3">
        <div
          v-if="groupOpen"
          class="fixed inset-0 z-[60] flex items-center justify-center"
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
              <div class="font-black text-slate-800 text-lg flex items-center gap-2">
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
    </Teleport>
    <!-- 设置管理 -->
    <Teleport to="body">
      <Transition name="modal3">
        <div
          v-if="settingsOpen"
          class="fixed inset-0 z-[60] flex items-center justify-center"
        >
          <div
            class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            @click="settingsOpen = false"
          ></div>
          <div
            class="relative z-10 w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div
              class="p-6 border-b border-slate-100 flex items-center justify-between gap-4"
            >
              <div class="font-black text-slate-800 text-lg flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                显示设置
              </div>
              <button
                class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
                @click="settingsOpen = false"
              >
                关闭
              </button>
            </div>

            <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scroll"></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

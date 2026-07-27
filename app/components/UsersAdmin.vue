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
} from "~/utils/aionServers";
const client = useSupabaseClient();
const user = useSupabaseUser();

// 游戏数据结构
const gameData = ref({
  characters: [],
  accounts: [],
  groupNames: {
    1: "分组1",
    2: "分组2",
    3: "分组3",
    4: "分组4",
    5: "分组5",
  },
  groupCount: 5,
  autoRefreshEnabled: true,
  teams: [],
  accountSharedData: {},
  version: "1.0.0",
  dataType: "complete",
});
const pickerOpen = ref(false);
const pickerTab = ref("legion");
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
  if (!gameData.value.characters) return 0;
  return gameData.value.characters.reduce((acc, char) => {
    return acc + (char.energy || 0) + (char.storedEnergy || 0);
  }, 0);
});

const totalKinaStats = computed(() => {
  let possible = 0;
  let earned = 0;

  if (!gameData.value.characters) return { possible: 0, earned: 0 };

  gameData.value.characters.forEach((char) => {
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
  const defaultAccount = gameData.value.accounts?.[0]?.id || "";
  newCharForm.value = {
    sanctuary: {
      s1: 1,
      s2: 1,
      s3: 1,
    },
  };
  showAddCharModal.value = true;
};

// 提交保存新角色
const handleSaveCharacter = async () => {
  if (!newCharForm.value.name.trim()) return;

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
  gameData.value.characters.unshift(newChar);
  gameData.value.characterCount = gameData.value.characters.length;

  showAddCharModal.value = false;
  await saveData();
};

// 数据持久化
const saveData = async () => {
  saving.value = true;
  gameData.value.exportDate = new Date().toLocaleString();

  if (user.value) {
    await client.from("user_game_data").upsert(
      {
        user_id: user.value.id,
        data: gameData.value,
        updated_at: new Date(),
      },
      { onConflict: "user_id" },
    );
  } else {
    await saveLocalGameData(gameData.value);
  }
  saving.value = false;
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
const searchServerId = ref(2015);
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
const manualName = ref("");
const manualQuick = ref("");
const manualLoading = ref(false);

const applyQuickToManual = () => {
  const parsed = parseNameWithServerShort(manualQuick.value);
  if (!parsed) {
    $alert("格式提示", "请输入例如：問號[奎靈]");
    return null;
  }
  manualRaceId.value = parsed.raceId;
  manualServerId.value = parsed.serverId;
  manualName.value = parsed.keyword;
  manualQuick.value = "";
  return parsed;
};
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

  const exists = gameData.value.characters.find(
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
};

const manualValidate = async () => {
  const embedded = parseNameWithServerShort(manualName.value);
  if (embedded) {
    manualQuick.value = manualName.value;
    applyQuickToManual();
  }
  const name = manualName.value.trim();
  if (!name) return;
  manualLoading.value = true;
  $loading.show("正在验证角色...");
  try {
    const res = await $fetch("/api/aion/search", {
      query: {
        keyword: name,
        race: manualRaceId.value,
        serverId: manualServerId.value,
        page: 1,
        size: 30,
      },
    });
    const list = res?.list || [];
    const exact =
      list.find((x) => String(x.name || "").replace(/<[^>]+>/g, "") === name) ||
      list[0];
    if (!exact) throw new Error("角色不存在");
    let profile;
    try {
      profile = await fetchCharacterInfo(exact.characterId, exact.serverId);
      profile.needsRefresh = false;
    } catch {
      profile = buildFallbackProfile({
        characterId: exact.characterId,
        characterName: stripHtml(exact.name),
        serverId: exact.serverId,
        raceId: exact.race,
        level: exact.level,
        className: null,
      });
      $alert(
        "已添加",
        "角色详情接口暂时不可用，已先添加占位信息，可稍后点刷新补全",
      );
    }
    addMemberToTeam(profile);
    manualName.value = "";
  } catch (e) {
    $alert("验证失败", e?.message || String(e));
  } finally {
    $loading.hide();
    manualLoading.value = false;
  }
};
//=========================================添加成员结束=========================================

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
      class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm"
    >
      <button
        @click="openAddCharModal"
        class="px-6 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/20 active:scale-95"
      >
        新增角色
      </button>
      <span class="text-xs font-bold text-slate-400">
        当前存储:
        {{ user ? "已同步到 Supabase 数据库" : "本地 IndexedDB 存储" }}
      </span>
    </div>

    <!-- 极宽卡片式新增角色弹窗 (蓝白色调) -->
    <Transition name="modal">
      <div
        v-if="showAddCharModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm"
      >
        <div
          class="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]"
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
                  @click="pickerOpen = true"
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
                  选择角色
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
                      Lv.{{ newCharForm.characterLevel || 1 }}
                      <span class="text-xs font-bold text-amber-600"
                        >({{ newCharForm.itemLevel || 0 }})</span
                      >
                    </div>
                  </div>
                  <div>
                    <div class="text-[10px] font-bold text-slate-400">
                      服务器 / 种族
                    </div>
                    <div class="text-sm font-black text-slate-800 truncate">
                      {{ newCharForm.serverName || "未知" }} ·
                      <span class="text-xs font-bold text-purple-600">{{
                        newCharForm.raceName || "未知"
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="text-[10px] font-bold text-slate-400">称号</div>
                    <div class="text-sm font-black text-slate-800 truncate">
                      {{ newCharForm.titleName || "无" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 卡片二：能量与资源 -->
            <div
              class="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div
                  class="text-sm font-black uppercase tracking-wider text-slate-700"
                >
                  奥德能量
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label class="text-xs font-bold text-slate-500 block mb-2"
                    >当前奥德能量</label
                  >
                  <input
                    v-model.number="newCharForm.energy"
                    type="number"
                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-500 block mb-2"
                    >存储奥德能量</label
                  >
                  <input
                    v-model.number="newCharForm.storedEnergy"
                    type="number"
                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all"
                  />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-500 block mb-2"
                    >初始基纳金币</label
                  >
                  <input
                    v-model.number="newCharForm.kina"
                    type="number"
                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- 卡片三：次数进度 -->
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

              <div class="space-y-5">
                <!-- 常规副本次数分组 -->
                <div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <label class="text-xs font-bold text-slate-500 block mb-2"
                        >噩梦副本挑战</label
                      >
                      <input
                        v-model.number="newCharForm.nightmareCount"
                        type="number"
                        class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all"
                      />
                    </div>
                    <div>
                      <label class="text-xs font-bold text-slate-500 block mb-2"
                        >每日副本次数</label
                      >
                      <input
                        v-model.number="newCharForm.dailyRuns"
                        type="number"
                        class="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200/80 focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <!-- 圣域系列次数分组 (带区块包围设计，已修正绑定属性 s1/s2/s3) -->
                <div
                  class="p-5 bg-emerald-50/40 border border-emerald-100/80 rounded-2xl space-y-3"
                >
                  <div
                    class="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider"
                  >
                    圣域副本次数
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label class="text-xs font-bold text-slate-600 block mb-2"
                        >圣域 S1 次数</label
                      >
                      <input
                        v-model.number="newCharForm.sanctuary.s1"
                        type="number"
                        class="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200/80 focus:border-emerald-500 focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label class="text-xs font-bold text-slate-600 block mb-2"
                        >圣域 S2 次数</label
                      >
                      <input
                        v-model.number="newCharForm.sanctuary.s2"
                        type="number"
                        class="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200/80 focus:border-emerald-500 focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label class="text-xs font-bold text-slate-600 block mb-2"
                        >圣域 S3 次数</label
                      >
                      <input
                        v-model.number="newCharForm.sanctuary.s3"
                        type="number"
                        class="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200/80 focus:border-emerald-500 focus:bg-white outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    <!-- 选择角色 -->
    <Transition name="modal">
      <div
        v-if="pickerOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
        <div
          class="relative z-10 w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div
            class="p-6 border-b border-slate-100 flex items-center justify-between gap-4"
          >
            <div class="font-black text-slate-800 text-lg">选择队员</div>
            <button
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-colors"
              @click="pickerOpen = false"
            >
              关闭
            </button>
          </div>

          <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scroll">
            <div class="flex items-center gap-2 flex-wrap">
              <button
                @click="pickerTab = 'mine'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="
                  pickerTab === 'mine'
                    ? 'bg-[#45a6d5] text-white border-[#45a6d5]'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'
                "
              >
                我的队员
              </button>
              <!-- <button
                @click="pickerTab = 'legion'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="
                  pickerTab === 'legion'
                    ? 'bg-[#45a6d5] text-white border-[#45a6d5]'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'
                "
              >
                军团成员
              </button> -->
              <button
                @click="pickerTab = 'search'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="
                  pickerTab === 'search'
                    ? 'bg-[#45a6d5] text-white border-[#45a6d5]'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'
                "
              >
                查询角色
              </button>
              <button
                @click="pickerTab = 'manual'"
                class="px-4 py-2 rounded-xl font-black text-sm border-2 transition-all"
                :class="
                  pickerTab === 'manual'
                    ? 'bg-[#45a6d5] text-white border-[#45a6d5]'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200'
                "
              >
                手动输入
              </button>
            </div>

            <div v-if="pickerTab === 'mine'" class="space-y-3">
              <div class="flex items-center gap-2">
                <input
                  v-model="myKeyword"
                  class="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="搜索我的队员..."
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
                    <button
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
                    </button>
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

            <div v-else-if="pickerTab === 'legion'" class="space-y-3">
              <div class="flex items-center gap-2">
                <input
                  v-model="legionKeyword"
                  class="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="搜索军团成员..."
                />
                <button
                  class="px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  :disabled="legionLoading"
                  @click="fetchLegionMembers"
                >
                  {{ legionLoading ? "刷新中..." : "刷新" }}
                </button>
              </div>

              <div class="max-h-[45vh] overflow-y-auto custom-scroll space-y-2">
                <div
                  v-for="m in filteredLegionMembers"
                  :key="m.character_id"
                  class="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div class="min-w-0">
                    <div class="font-black text-slate-800 truncate">
                      {{ m.name }}
                    </div>
                    <div
                      class="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2 flex-wrap"
                    >
                      <span>{{ formatServerDisplay(m.server_id || 0) }}</span>
                      <span>{{ m.class_name }}</span>
                      <span>Lv.{{ m.level }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-black text-xs hover:bg-slate-200 transition-colors"
                      @click.stop="saveMyMemberFromLegion(m)"
                    >
                      存为我的
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-xl bg-[#45a6d5] text-white font-black text-xs hover:bg-[#3b95c0] transition-colors"
                      @click.stop="pickFromLegion(m)"
                    >
                      选择
                    </button>
                  </div>
                </div>
                <div
                  v-if="!legionLoading && filteredLegionMembers.length === 0"
                  class="py-8 text-center text-slate-400 font-bold"
                >
                  暂无结果
                </div>
              </div>
            </div>

            <div v-else-if="pickerTab === 'search'" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  v-model.number="searchRaceId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option :value="1">天族</option>
                  <option :value="2">魔族</option>
                </select>
                <select
                  v-model.number="searchServerId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option
                    v-for="s in searchServerOptions"
                    :key="s.serverId"
                    :value="s.serverId"
                  >
                    {{ formatServerDisplay(s.serverId) }}
                  </option>
                </select>
                <input
                  v-model="searchKeyword"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="输入角色名关键词..."
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="searchQuick"
                  class="px-4 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all"
                  placeholder="快捷粘贴：角色名[区服简写]（例如 xxx[简卡]）"
                />
                <button
                  class="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  @click="applyQuickToSearchAndSearch"
                >
                  解析并查询
                </button>
              </div>
              <div class="flex items-center justify-end">
                <button
                  class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors disabled:opacity-50"
                  :disabled="searchLoading"
                  @click="searchCharacters"
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
                      <button
                        class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-black text-xs hover:bg-slate-200 transition-colors"
                        @click.stop="saveMyMemberFromSearch(c)"
                      >
                        存为我的
                      </button>
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

            <div v-else class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  v-model.number="manualRaceId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option :value="1">天族</option>
                  <option :value="2">魔族</option>
                </select>
                <select
                  v-model.number="manualServerId"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-black text-slate-700"
                >
                  <option
                    v-for="s in manualServerOptions"
                    :key="s.serverId"
                    :value="s.serverId"
                  >
                    {{ formatServerDisplay(s.serverId) }}
                  </option>
                </select>
                <input
                  v-model="manualName"
                  class="px-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#45a6d5] focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  placeholder="输入完整角色名..."
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <input
                  v-model="manualQuick"
                  class="px-4 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-[#45a6d5] outline-none font-bold text-slate-700 transition-all"
                  placeholder="快捷粘贴：角色名[区服简写]（例如 問號[奎靈]）"
                />
                <button
                  class="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 transition-colors"
                  @click="applyQuickToManual"
                >
                  解析
                </button>
              </div>
              <div class="flex items-center justify-end">
                <button
                  class="px-5 py-2 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-colors disabled:opacity-50"
                  :disabled="manualLoading"
                  @click="manualValidate"
                >
                  {{ manualLoading ? "验证中..." : "验证并添加" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

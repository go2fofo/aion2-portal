<script setup>
import { computed, watch,defineExpose } from "vue";
import { formatCombatPower } from "~/utils/formatCombatPower";
import CharacterCard from "./CharacterCard.vue";
import cloneDeep from "lodash/cloneDeep";
// 远征副本，超越副本，圣域副本获得吉纳数和消耗奥德能量（基础单倍版）
const KinahOdSate = {
  // 远征副本
  expedition: [
    {
      stars: 6,
      name: "堕落守护者之城",
      difficulties: [
        {
          mode: "困难",
          energy: 60,
          kina: 360,
          boundKina: 0,
          total: 360,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 201,
          boundKina: 0,
          total: 201,
        },
      ],
    },
    {
      stars: 5,
      name: "青息之岛",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 201,
          boundKina: 0,
          total: 201,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 162,
          boundKina: 0,
          total: 162,
        },
      ],
    },
    {
      stars: 5,
      name: "幻影回廊",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 201,
          boundKina: 0,
          total: 201,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 162,
          boundKina: 0,
          total: 162,
        },
      ],
    },
    {
      stars: 4,
      name: "无之摇篮",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 162,
          boundKina: 0,
          total: 162,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 60,
          boundKina: 60,
          total: 120,
        },
      ],
    },
    {
      stars: 4,
      name: "死亡德拉玛塔巢穴",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 162,
          boundKina: 0,
          total: 162,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 60,
          boundKina: 60,
          total: 120,
        },
      ],
    },
    {
      stars: 3,
      name: "凶猛的角窟",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 51,
          boundKina: 51,
          total: 102,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 0,
          boundKina: 102,
          total: 102,
        },
      ],
    },
    {
      stars: 3,
      name: "火之神殿",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 51,
          boundKina: 51,
          total: 102,
        },
        {
          mode: "普通",
          energy: 40,
          kina: 0,
          boundKina: 102,
          total: 102,
        },
      ],
    },
    {
      stars: 2,
      name: "巴克隆空中岛",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 0,
          boundKina: 102,
          total: 102,
        },
        { mode: "普通", energy: 40, kina: 0, boundKina: 81, total: 81 },
      ],
    },
    {
      stars: 2,
      name: "乌努库库峡谷",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 0,
          boundKina: 102,
          total: 102,
        },
        { mode: "普通", energy: 40, kina: 0, boundKina: 81, total: 81 },
      ],
    },
    {
      stars: 1,
      name: "德拉乌伯尼尔",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 0,
          boundKina: 102,
          total: 102,
        },
        { mode: "普通", energy: 40, kina: 0, boundKina: 60, total: 60 },
      ],
    },
    {
      stars: 1,
      name: "克洞穴",
      difficulties: [
        {
          mode: "困难",
          energy: 40,
          kina: 0,
          boundKina: 102,
          total: 102,
        },
        { mode: "普通", energy: 40, kina: 0, boundKina: 60, total: 60 },
      ],
    },
  ],

  // 超越副本
  surpass: [
    {
      stars: 4,
      name: "深渊角窟",
      difficulties: [
        {
          mode: "阶段4",
          energy: 60,
          kina: 420,
          boundKina: 0,
          total: 420,
        },
        {
          mode: "阶段3",
          energy: 40,
          kina: 240,
          boundKina: 0,
          total: 240,
        },
        {
          mode: "阶段2",
          energy: 40,
          kina: 201,
          boundKina: 0,
          total: 201,
        },
        {
          mode: "阶段1",
          energy: 40,
          kina: 171,
          boundKina: 0,
          total: 171,
        },
      ],
    },
    {
      stars: 3,
      name: "绯红羁绊之镜",
      difficulties: [
        {
          mode: "阶段4",
          energy: 40,
          kina: 240,
          boundKina: 0,
          total: 240,
        },
        {
          mode: "阶段3",
          energy: 40,
          kina: 201,
          boundKina: 0,
          total: 201,
        },
        {
          mode: "阶段2",
          energy: 40,
          kina: 171,
          boundKina: 0,
          total: 171,
        },
        {
          mode: "阶段1",
          energy: 40,
          kina: 150,
          boundKina: 0,
          total: 150,
        },
      ],
    },
    {
      stars: 2,
      name: "沉没的生命神殿",
      difficulties: [
        {
          mode: "阶段4",
          energy: 40,
          kina: 75,
          boundKina: 75,
          total: 150,
        },
        {
          mode: "阶段3",
          energy: 40,
          kina: 72,
          boundKina: 69,
          total: 141,
        },
        {
          mode: "阶段2",
          energy: 40,
          kina: 66,
          boundKina: 66,
          total: 132,
        },
        {
          mode: "阶段1",
          energy: 40,
          kina: 60,
          boundKina: 60,
          total: 120,
        },
      ],
    },
    {
      stars: 1,
      name: "破碎的雅尔卡尼斯",
      difficulties: [
        {
          mode: "阶段4",
          energy: 40,
          kina: 0,
          boundKina: 114,
          total: 114,
        },
        {
          mode: "阶段3",
          energy: 40,
          kina: 0,
          boundKina: 90,
          total: 90,
        },
        {
          mode: "阶段2",
          energy: 40,
          kina: 0,
          boundKina: 72,
          total: 72,
        },
        {
          mode: "阶段1",
          energy: 40,
          kina: 0,
          boundKina: 60,
          total: 60,
        },
      ],
    },
    {
      stars: 1,
      name: "德乌斯研究基地",
      difficulties: [
        {
          mode: "阶段4",
          energy: 40,
          kina: 0,
          boundKina: 114,
          total: 114,
        },
        {
          mode: "阶段3",
          energy: 40,
          kina: 0,
          boundKina: 90,
          total: 90,
        },
        {
          mode: "阶段2",
          energy: 40,
          kina: 0,
          boundKina: 72,
          total: 72,
        },
        {
          mode: "阶段1",
          energy: 40,
          kina: 0,
          boundKina: 60,
          total: 60,
        },
      ],
    },
  ],

  // 圣域
  sanctuary: [
    {
      stars: 5,
      name: "深渊重铸: 卢德菜",
      key: "s1",
      difficulties: [
        {
          mode: "默认",
          energy: 80,
          kina: 200,
          boundKina: 200,
          total: 400,
        },
      ],
    },
    {
      stars: 5,
      name: "侵蚀净化所",
      key: "s2",
      difficulties: [
        {
          mode: "默认",
          energy: 80,
          kina: 800,
          boundKina: 0,
          total: 800,
        },
      ],
    },
    {
      stars: 5,
      name: "穆斯费尔圣杯",
      key: "s3",
      difficulties: [
        {
          mode: "困难",
          energy: 80,
          kina: 1200,
          boundKina: 0,
          total: 1200,
        },
        {
          mode: "普通",
          energy: 80,
          kina: 1000,
          boundKina: 0,
          total: 1000,
        },
      ],
    },
  ],
};
// 副本挑战次数与吉纳获取衰减规则
const dungeonDecayRules = {
  // 征服/远征副本衰减阶梯
  expedition: [
    { maxCount: 84, rate: 1.0, label: "0-84次 (基纳获得量 100%)" },
    { maxCount: 105, rate: 0.8, label: "85-105次 (基纳获得量 80%)" },
    { maxCount: 126, rate: 0.6, label: "106-126次 (基纳获得量 60%)" },
    { maxCount: 147, rate: 0.4, label: "127-147次 (基纳获得量 40%)" },
    { maxCount: Infinity, rate: 0.2, label: "148次以上 (基纳获得量 20%)" },
  ],
  // 超越副本衰减阶梯
  surpass: [
    { maxCount: 56, rate: 1.0, label: "0-56次 (基纳获得量 100%)" },
    { maxCount: 70, rate: 0.8, label: "57-70次 (基纳获得量 80%)" },
    { maxCount: 84, rate: 0.6, label: "71-84次 (基纳获得量 60%)" },
    { maxCount: 98, rate: 0.4, label: "85-98次 (基纳获得量 40%)" },
    { maxCount: Infinity, rate: 0.2, label: "99次以上 (基纳获得量 20%)" },
  ],
  // 圣域默认不衰减 (100%)
  sanctuary: [{ maxCount: Infinity, rate: 1.0, label: "无衰减 (基纳获得量 100%)" }],
};
// 游玩补充验证规则配置数组
const supplementValidationRules = [
  //  存储奥德能量 (storedEnergy)
  {
    field: "storedEnergy",
    label: "补充奥德能量",
    validate: (form) => {
      return (form?.storedEnergy || 0) <= 2000;
    },
    message: () => "补充奥德能量不能超过2000",
  },
  //  存储每日副本次数 (storedDailyRuns) - 组内共享校验
  {
    field: "storedDailyRuns",
    label: "存储每日副本次数",
    validate: (form, context = {}) => {
      const currentGroupId = form?.group;
      const allCharacters = context.allCharacters || [];
      const currentFormId = form?.id;

      // 计算同组其他角色的总和
      const otherGroupSum = allCharacters
        .filter((char) => char.group === currentGroupId && char.id !== currentFormId)
        .reduce((sum, char) => sum + (Number(char?.storedDailyRuns) || 0), 0);

      // 同组总和 + 当前表单填写的值
      const total = otherGroupSum + (Number(form?.storedDailyRuns) || 0);

      return total <= 30;
    },
    message: () => "同组账号下存储每日副本次数总和不能超过30次",
  },
  // 古树庆典小游戏存储补充次数校验（组内共享上限 30）
  {
    field: "storedMinigameCount",
    label: "古树庆典存储补充次数",
    validate: (form, context = {}) => {
      const currentGroupId = form?.group;
      const allCharacters = context.allCharacters || [];
      const currentFormId = form?.characterId || form?.id;

      // 计算同组其他角色的存储补充次数总和
      const otherGroupSum = allCharacters
        .filter(
          (char) =>
            char.group === currentGroupId &&
            (char.characterId || char.id) !== currentFormId
        )
        .reduce((sum, char) => sum + (Number(char?.storedMinigameCount) || 0), 0);

      // 同组总和 + 当前表单填写的值
      const total = otherGroupSum + (Number(form?.storedMinigameCount) || 0);

      return total <= 30;
    },
    message: () => "同组账号下古树庆典存储补充次数总和不能超过30次",
  },
  // 次元袭击存储补充次数校验（组内共享上限 30）
  {
    field: "storedDimensionalCount",
    label: "次元袭击存储补充次数",
    validate: (form, context = {}) => {
      const currentGroupId = form?.group;
      const allCharacters = context.allCharacters || [];
      const currentFormId = form?.characterId || form?.id;

      // 计算同组其他角色的存储补充次数总和
      const otherGroupSum = allCharacters
        .filter(
          (char) =>
            char.group === currentGroupId &&
            (char.characterId || char.id) !== currentFormId
        )
        .reduce((sum, char) => sum + (Number(char?.storedDimensionalCount) || 0), 0);

      // 同组总和 + 当前表单填写的值
      const total = otherGroupSum + (Number(form?.storedDimensionalCount) || 0);

      return total <= 30;
    },
    message: () => "同组账号下次元袭击存储补充次数总和不能超过30次",
  },
  // 存储噩梦次数 (storedNightmareCount)
  {
    field: "storedNightmareCount",
    label: "存储噩梦次数",
    validate: (form) => (Number(form.storedNightmareCount) || 0) <= 30,
    message: () => "存储噩梦次数不能超过30次",
  },
  {
    field: "storedAwakening",
    label: "存储觉醒战次数",
    validate: (form) => (Number(form.storedAwakening) || 0) <= 30,
    message: () => "存储噩梦次数不能超过30次",
  },
  // // 6. 存储每日副本次数 (storedDailyRuns)
  // {
  //   field: "storedDailyRuns",
  //   label: "存储每日副本次数",
  //   validate: (form) => (Number(form.storedDailyRuns) || 0) <= 30,
  //   message: () => "存储每日副本次数不能超过30次",
  // },
  // // 7. 圣域副本 s1
  // {
  //   field: "sanctuary.s1", // 对应表单中的嵌套路径
  //   label: "圣域副本 s1",
  //   validate: (form) => {
  //     const s1 = form.sanctuary?.s1 ?? 0;
  //     return Number(s1) <= 1;
  //   },
  //   message: () => "圣域 s1 次数不能超过1次",
  // },
  // // 8. 圣域副本 s2
  // {
  //   field: "sanctuary.s2",
  //   label: "圣域副本 s2",
  //   validate: (form) => {
  //     const s2 = form.sanctuary?.s2 ?? 0;
  //     return Number(s2) <= 1;
  //   },
  //   message: () => "圣域 s2 次数不能超过1次",
  // },
  // // 9. 圣域副本 s3
  // {
  //   field: "sanctuary.s3",
  //   label: "圣域副本 s3",
  //   validate: (form) => {
  //     const s3 = form.sanctuary?.s3 ?? 0;
  //     return Number(s3) <= 1;
  //   },
  //   message: () => "圣域 s3 次数不能超过1次",
  // },
];
// 日周消耗验证规则配置数组
const weeklyDailyValidationRules = [
  // //  存储奥德能量 (storedEnergy)
  // {
  //   field: "storedEnergy",
  //   label: "补充奥德能量",
  //   validate: (form) => (Number(form?.storedEnergy) || 0) <= 2000,
  //   message: () => "补充奥德能量不能超过2000",
  // },
  // //  存储每日副本次数 (storedDailyRuns) - 组内共享校验
  // {
  //   field: "storedDailyRuns",
  //   label: "存储每日副本次数",
  //   validate: (form, context = {}) => {
  //     const currentGroupId = form?.group;
  //     const allCharacters = context.allCharacters || [];
  //     const currentFormId = form?.id;

  //     // 计算同组其他角色的总和
  //     const otherGroupSum = allCharacters
  //       .filter((char) => char.group === currentGroupId && char.id !== currentFormId)
  //       .reduce((sum, char) => sum + (Number(char?.storedDailyRuns) || 0), 0);

  //     // 同组总和 + 当前表单填写的值
  //     const total = otherGroupSum + (Number(form?.storedDailyRuns) || 0);

  //     return total <= 30;
  //   },
  //   message: () => "同组账号下存储每日副本次数总和不能超过30次",
  // },
  // // 古树庆典小游戏存储补充次数校验（组内共享上限 30）
  // {
  //   field: "storedMinigameCount",
  //   label: "古树庆典存储补充次数",
  //   validate: (form, context = {}) => {
  //     const currentGroupId = form?.group;
  //     const allCharacters = context.allCharacters || [];
  //     const currentFormId = form?.characterId || form?.id;

  //     // 计算同组其他角色的存储补充次数总和
  //     const otherGroupSum = allCharacters
  //       .filter(
  //         (char) =>
  //           char.group === currentGroupId &&
  //           (char.characterId || char.id) !== currentFormId
  //       )
  //       .reduce((sum, char) => sum + (Number(char?.storedMinigameCount) || 0), 0);

  //     // 同组总和 + 当前表单填写的值
  //     const total = otherGroupSum + (Number(form?.storedMinigameCount) || 0);

  //     return total <= 30;
  //   },
  //   message: () => "同组账号下古树庆典存储补充次数总和不能超过30次",
  // },
  // // 次元袭击存储补充次数校验（组内共享上限 30）
  // {
  //   field: "storedDimensionalCount",
  //   label: "次元袭击存储补充次数",
  //   validate: (form, context = {}) => {
  //     const currentGroupId = form?.group;
  //     const allCharacters = context.allCharacters || [];
  //     const currentFormId = form?.characterId || form?.id;

  //     // 计算同组其他角色的存储补充次数总和
  //     const otherGroupSum = allCharacters
  //       .filter(
  //         (char) =>
  //           char.group === currentGroupId &&
  //           (char.characterId || char.id) !== currentFormId
  //       )
  //       .reduce((sum, char) => sum + (Number(char?.storedDimensionalCount) || 0), 0);

  //     // 同组总和 + 当前表单填写的值
  //     const total = otherGroupSum + (Number(form?.storedDimensionalCount) || 0);

  //     return total <= 30;
  //   },
  //   message: () => "同组账号下次元袭击存储补充次数总和不能超过30次",
  // },
  // 噩梦消耗次数 (nightmareCount)
  {
    field: "nightmareCount",
    label: "噩梦消耗次数",
    validate: (form) => {
      return (form?.nightmareCount || 0) < nightmareCountSum.value;
    },
    message: (form) => {
      return `噩梦消耗次数不能超过${nightmareCountSum.value}次`;
    },
  },
  {
    field: "awakening",
    label: "觉醒战消耗次数",
    validate: (form) => {
      return (form?.awakening || 0) < awakeningCountSum.value;
    },
    message: (form) => {
      return `觉醒战消耗次数不能超过${awakeningCountSum.value}次`;
    },
  },
  {
    field: "battlefield",
    label: "战场消耗次数",
    validate: (form) => {
      return (form?.battlefield || 0) < 3;
    },
    message: (form) => {
      return `战场消耗次数不能超过3次`;
    },
  },
  // 每日副本消耗次数 (dailyRuns)
  {
    field: "dailyRuns",
    label: "每日副本消耗次数",
    validate: (form) => {
      return (form?.dailyRuns || 0) < totalGroupStoredDailyRuns.value;
    },
    message: (form) => {
      return `每日副本消耗次数不能超过${
        getCharGroup.value?.storedDailyRuns + getCharGroup.value?.dailyRuns
      }次`;
    },
  },
  // 古树庆典小游戏消耗次数 (minigameCount)
  {
    field: "minigameCount",
    label: "古树庆典小游戏消耗次数",
    validate: (form) => {
      return (form?.minigameCount || 0) < totalGroupStoredMinigameCount.value;
    },
    message: (form) => {
      return `古树庆典小游戏消耗次数不能超过${
        getCharGroup.value?.storedMinigameCount + getCharGroup.value?.minigameCount
      }次`;
    },
  },
  // 次元袭击消耗次数 (dimensionalCount)
  {
    field: "dimensionalCount",
    label: "次元袭击消耗次数",
    validate: (form) => {
      return (form?.dimensionalCount || 0) < totalGroupStoredDimensionalCount.value;
    },
    message: (form) => {
      return `次元袭击消耗次数不能超过${
        getCharGroup.value?.storedDimensionalCount + getCharGroup.value?.dimensionalCount
      }次`;
    },
  },
  // {
  //   field: "storedAwakening",
  //   label: "存储觉醒战次数",
  //   validate: (form) => (Number(form.storedAwakening) || 0) <= 30,
  //   message: () => "存储噩梦次数不能超过30次",
  // },
];
// 游玩补充 表单内的控制 默认值
const defaultSupplementFormValues = {
  bigOdCount: 0, //大奥德数量
  smallOdCount: 0, //小奥德数量
  // 每日副本补充
  storedDailyRuns: 0,
  //噩梦补充
  storedNightmareCount: 0,
  //觉醒战补充
  storedAwakening: 0,
  // 古树庆典小游戏补充次数
  storedMinigameCount: 0,
  //次元袭击补充次数
  storedDimensionalCount: 0,
};
//赋值周兑换
const limitRules = [
  // 账号与微风商店兑换项
  { valueKey: "breezeAccountOd", flagKey: "isBreezeAccountOd", max: 16 },
  { valueKey: "materialAccountOd", flagKey: "isMaterialAccountOd", max: 16 },
  { valueKey: "breezeReviveStone", flagKey: "isBreezeReviveStone", max: 7 },
  { valueKey: "breezeRiftTicket", flagKey: "isBreezeRiftTicket", max: 21 },
  { valueKey: "breezeDailyTicket", flagKey: "isBreezeDailyTicket", max: 21 },
  {
    valueKey: "breezeNightmareTicket",
    flagKey: "isBreezeNightmareTicket",
    max: 14,
  },

  // 下层深渊指令书（上限各 5）
  { valueKey: "lowerAbyssNormal", flagKey: "isLowerAbyss", max: 5 },
  { valueKey: "lowerAbyssSkilled", flagKey: "isLowerAbyss", max: 5 },
  { valueKey: "lowerAbyssElite", flagKey: "isLowerAbyss", max: 5 },
  { valueKey: "lowerAbyssSpecial", flagKey: "isLowerAbyss", max: 5 },

  // 中层深渊指令书（上限各 5）
  { valueKey: "midAbyssSkilled", flagKey: "isMidAbyss", max: 5 },
  { valueKey: "midAbyssSpecial", flagKey: "isMidAbyss", max: 5 },

  // 地区指令书（上限各 12）
  { valueKey: "regionACount", flagKey: "isRegionACount", max: 12 },
  { valueKey: "regionBCount", flagKey: "isRegionBCount", max: 12 },
];
const validationRules = computed(() => {
  if (activeTab.value == "supplement") {
    return supplementValidationRules;
  }
  if (activeTab.value == "weeklydaily") {
    return weeklyDailyValidationRules;
  }

  return [];
});
// 日周任务 表单内的控制 默认值
const defaultWeeklydailyFormValues = {
  /** 每日任务完成状态及时间 */
  dailyMission: false,
  /** 每日任务完成次数 */
  dailyTaskCount: 0,
  dailyMissionDate: "",
  // 每日副本消耗
  dailyRuns: 0,
  //噩梦消耗
  nightmareCount: 0,
  //觉醒战消耗
  awakening: 0,
  // 古树庆典小游戏消耗次数
  minigameCount: 0,
  //次元袭击消耗次数
  dimensionalCount: 0,
  //战场消耗次数
  battlefield: 0,
};
// 周兑换 表单内的控制 默认值
const defaultExchangeFormValues = {
  // 角色
  /** 本周是否已购买商店周奥德能量（布尔值） */
  isBreezeCharOd: false,
  breezeCharOd: 0,
  breezeCharOdDate: "",

  /** 是否已购买物质变换角色奥德能量 */
  isMaterialCharOd: false,
  materialCharOd: 0,
  materialCharOdDate: "",

  // 物质变换账号奥德能量
  isBreezeAccountOd: false, // 是否已购买物质变换账号奥德能量（布尔值）
  breezeAccountOd: 0, // 物质变换账号奥德能量当前数量
  breezeAccountOdDate: "", // 物质变换账号奥德能量购买/重置日期

  //微风商店上限兑换管理
  isMaterialAccountOd: false, // 本周是否已购买商店周奥德能量（布尔值）
  materialAccountOd: 0, // 商店周奥德能量当前数量
  materialAccountOdDate: "", // 商店周奥德能量购买/重置日期

  isBreezeReviveStone: false, // 本周是否已购买商店周复活石（布尔值）
  breezeReviveStone: 0, // 商店周复活石当前数量
  breezeReviveStoneDate: "", // 商店周复活石购买/重置日期

  isBreezeRiftTicket: false, // 本周是否已购买商店周未知缝隙卷（布尔值）
  breezeRiftTicket: 0, // 商店周未知缝隙卷当前数量
  breezeRiftTicketDate: "", // 商店周未知缝隙卷购买/重置日期

  isBreezeDailyTicket: false, // 本周是否已购买商店周完成卷(每日)（布尔值）
  breezeDailyTicket: 0, // 商店周完成卷(每日)当前数量
  breezeDailyTicketDate: "", // 商店周完成卷(每日)购买/重置日期

  isBreezeNightmareTicket: false, // 本周是否已购买商店周完成卷(噩梦)（布尔值）
  breezeNightmareTicket: 0, // 商店周完成卷(噩梦)当前数量
  breezeNightmareTicketDate: "", // 商店周完成卷(噩梦)购买/重置日期

  // 深渊指令书管理（下层 & 中层，上限各 5）
  lowerAbyssNormal: 0, // 下层深渊指令书 - 普通数量
  lowerAbyssSkilled: 0, // 下层深渊指令书 - 熟练数量
  lowerAbyssElite: 0, // 下层深渊指令书 - 精锐数量
  lowerAbyssSpecial: 0, // 下层深渊指令书 - 特命数量

  midAbyssSkilled: 0, // 中层深渊指令书 - 熟练数量
  midAbyssSpecial: 0, // 中层深渊指令书 - 特命数量

  // 地区指令书管理（上限各 12）
  regionACount: 0, // 地区A指令书当前数量
  regionBCount: 0, // 地区B指令书当前数量
};

//默认验证规则放回返
const defaultValidationResult = {
  isValid: true, //是否符合要求
  invalidFields: [], //不符合要求的字段名集合（如 'energy', 'sanctuary.s1'）
  errors: {}, //具体的错误信息键值对
};

//验证规则放回返
const validationResult = ref(cloneDeep(defaultValidationResult));

const props = defineProps({
  activeTabGroup: {
    type: [String, Number],
    required: true,
  },
  gameData: {
    type: Object,
    required: true,
  },
  cardConfig: {
    type: Object,
    required: true,
  },

});

const emit = defineEmits([
  "update-character",
  "delete-character",
  "toggle-lock",
  "sign-in-click",
  "toggle-task",
  "play-consumption",
  "open-edit",
  "update-groups",
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
    return characters.filter((c) => !c.group || !groups.some((g) => g.id === c.group));
  }
  return characters.filter((c) => Number(c.group) === Number(tab));
});

// 获取当前 Tab 的标题名称
const currentTabTitle = computed(() => {
  const tab = props.activeTabGroup;
  if (tab === "all") return "全部角色";
  if (tab === "default") return "默认分组";
  const found = props.gameData?.groups?.find((g) => Number(g.id) === Number(tab));
  return found ? found.name : "未知分组";
});

// 根据分组 ID 获取分组名称
const getGroupName = (groupId) => {
  if (!groupId) return "默认分组";
  const found = props.gameData?.groups?.find((g) => Number(g.id) === Number(groupId));
  return found ? found.name : "默认分组";
};
/**
 * 校验角色表单数据
 * @param {Object} formData 当前表单对象 (如 newCharForm)
 * @returns {Object} { isValid: boolean, invalidFields: string[], errors: Object }
 */
const validateCharacterForm = (formData, context = {}, doc = "") => {
  console.log(
    `🔍 [GroupCharacterPanel:874] %c 验证validateCharacterForm触发来源doc: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    doc
  );

  const invalidFields = []; // 不符合要求的字段名集合
  const errors = {}; // 具体的错误信息键值对

  validationRules?.value?.forEach((rule) => {
    try {
      // 💡 关键修改：把 context（包含 allCharacters 等数据）传给 rule.validate
      const passes = rule.validate(formData, context);
      if (!passes) {
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
// 事件抛出与处理
const handleTextChange = (char, field, value) => {
  const updatedChar = { ...char, [field]: value };
  emit("update-character", updatedChar);
};
const handleDelete = async (char) => {
  if (char.locked) return;
  try {
    const confirmed = await $confirm?.("确定要删除该角色吗？删除后不可恢复", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    if (!confirmed) return;

    emit("delete-character", char);
  } catch {
    // 取消删除
  }
};

const handleToggleTask = (char, field) => {
  const updatedChar = { ...char, [field]: !char[field] };
  emit("update-character", updatedChar);
};
const handleTaskClick = (char, field, tab) => {
  console.log(
    `🔍 [GroupCharacterPanel:713] %c handleTaskClickk--char: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    char
  );
  console.log(
    `🔍 [GroupCharacterPanel:713] %c handleTaskClickk--field: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    field
  );
  console.log(
    `🔍 [GroupCharacterPanel:713] %c handleTaskClickk--tab: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    tab
  );
  // 今入日周tab
  handleClickGameplay(char, tab);
  nextTick(() => {
    scrollToSection(field);
  });

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

// 点击游玩消耗触发
const handleClickGameplay = (char, tab) => {
  if(tab){
    activeTab.value = tab;
  }
  console.log(
    `🔍 [GroupCharacterPanel:724] %c 点击游玩消耗触发 char: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    char
  );
  console.log(
    `🔍 [GroupCharacterPanel:1012] %c activeTab: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    activeTab.value
  );
  console.log(
    `🔍 [GroupCharacterPanel:724] %c 点击游玩消耗触发 gameData: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    props.gameData
  );
  console.log(
    `🔍 [GroupCharacterPanel:724] %c 点击游玩消耗触发 getCharGroup11111: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    getCharGroup.value
  );

  gameplayCharForm.value = char;
  openGameplay.value = true;
  //清空重置默认字段
  //补充奥德
  supplementFormValues.value = cloneDeep(defaultSupplementFormValues);

  if (
    !gameplayCharForm.value?.dailyMission &&
    (gameplayCharForm.value?.dailyTaskCount || 0) < 5
  ) {
    // 未完成且次数小于5：同步当前的次数
    weeklydailyFormValues.value = {
      ...cloneDeep(defaultWeeklydailyFormValues),
      dailyTaskCount: gameplayCharForm.value?.dailyTaskCount || 0,
      dailyMission: false,
    };
  } else {
    // 已完成或次数已满：清空或归零该项的表单值
    weeklydailyFormValues.value = {
      ...cloneDeep(defaultWeeklydailyFormValues),
      dailyTaskCount: 5,
      dailyMission: true,
    };
  }
  validationResult.value = cloneDeep(defaultValidationResult);

  nextTick(() => {
    if (activeTab.value === "exchange") {
      console.log(
        `🔍 [GroupCharacterPanel:724] %c 点击游玩消耗触发 getCharGroup22222: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        getCharGroup.value
      );
      exchangeFormValues.value = cloneDeep(defaultExchangeFormValues);
      if (
        gameplayCharForm.value?.breezeCharOd &&
        gameplayCharForm.value?.breezeCharOd > 0
      ) {
        exchangeFormValues.value.breezeCharOd = gameplayCharForm.value?.breezeCharOd;
        if (exchangeFormValues.value.breezeCharOd >= 4) {
          exchangeFormValues.value.breezeCharOd = 4;
          exchangeFormValues.value.isBreezeCharOd = true;
        }
      }
      if (
        gameplayCharForm.value?.materialCharOd &&
        gameplayCharForm.value?.materialCharOd > 0
      ) {
        exchangeFormValues.value.materialCharOd = gameplayCharForm.value?.materialCharOd;
        if (exchangeFormValues.value.materialCharOd >= 4) {
          exchangeFormValues.value.materialCharOd = 4;
          exchangeFormValues.value.isMaterialCharOd = true;
        }
      }
      limitRules.forEach((rule) => {
        const incomingVal = getCharGroup.value?.[rule.valueKey];

        if (incomingVal && incomingVal > 0) {
          // 累加当前值
          exchangeFormValues.value[rule.valueKey] =
            (exchangeFormValues.value[rule.valueKey] || 0) + incomingVal;

          // 触顶校验与状态联动
          if (exchangeFormValues.value[rule.valueKey] >= rule.max) {
            exchangeFormValues.value[rule.valueKey] = rule.max;
            exchangeFormValues.value[rule.flagKey] = true;
          }
        }
      });
    } else {
      exchangeFormValues.value = cloneDeep(defaultExchangeFormValues);
    }

    console.log(
      `🔍 [GroupCharacterPanel:1110] %c exchangeFormValues: `,
      "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
      exchangeFormValues.value
    );
  });
};
// 关闭游玩消耗/补充弹框
const handleCloseGameplay = () => {
  openGameplay.value = false;
};
// 奥德能量上限计算（高级会员840，普通560）
const energyLimit = computed(() => {
  const isPremium =
    props.getCharGroup?.premiumMember ||
    (props.gameData?.characters || []).some(
      (c) => Number(c.group) === Number(props.gameplayCharForm?.group) && c.premiumMember
    );
  return isPremium ? 840 : 560;
});

// 获取当前角色对应的已经的保存分组数据
const getCharGroup = computed(() => {
  let groupItem = props.gameData?.groups?.find(
    (f) => f.id == gameplayCharForm.value?.group
  );
  return groupItem;
});

// 游玩补充 表单内的控制

const supplementFormValues = ref(cloneDeep(defaultSupplementFormValues));
// 游玩补充概览卡片配置数据

const summaryItems = computed(() => {
  let suner = [];

  if (activeTab.value === "supplement") {
    suner = [
      {
        key: "nightmareCount",
        label: "噩梦",
        getValue: (form) => form?.nightmareCount || 0,
        getStoredValue: () => totalsToredNightmareCountRuns.value || 0,
        colorClass: "text-purple-600",
      },
      {
        key: "awakening",
        label: "觉醒战",
        getValue: (form) => form?.awakening || 0,
        getStoredValue: () => totalStoredAwakeningRuns.value || 0,
        colorClass: "text-emerald-600",
      },
      {
        key: "energy",
        label: "奥德能量",
        getValue: (form) => form?.energy || 0,
        getStoredValue: () => gameplayCharForm.value?.storedEnergy || 0,
        colorClass: "text-amber-600",
        limit: energyLimit.value, // 如果 energyLimit 是响应式变量
      },
      {
        key: "dailyRuns",
        label: "每日副本",
        getValue: (form, group) => group?.dailyRuns || 0,
        getStoredValue: () => totalGroupStoredDailyRuns.value || 0,
        colorClass: "text-purple-600",
      },

      {
        key: "minigameCount",
        label: "古树庆典小游戏",
        getValue: (form, group) => group?.minigameCount || 0,
        getStoredValue: () => totalGroupStoredMinigameCount.value || 0,
        colorClass: "text-amber-600",
      },
      {
        key: "dimensionalCount",
        label: "次元袭击",
        getValue: (form, group) => group?.dimensionalCount || 0,
        getStoredValue: () => totalGroupStoredDimensionalCount.value || 0,
        colorClass: "text-sky-600",
      },
    ];
  }

  return suner;
});

// 计算大奥德提供的总点数 (每个40点)
const bigOdTotalPoints = computed(() => {
  return (supplementFormValues.value.bigOdCount || 0) * 40;
});

// 计算小奥德提供的总点数 (每个10点)
const smallOdTotalPoints = computed(() => {
  return (supplementFormValues.value.smallOdCount || 0) * 10;
});

// 计算本次总共补充的奥德能量之和
const totalSupplementPoints = computed(() => {
  let total = bigOdTotalPoints.value + smallOdTotalPoints.value;
  return total;
});
//计算补充奥德和已存奥德之和
const totalsStoredEnergyCount = computed(() => {
  let total = (gameplayCharForm.value?.storedEnergy || 0) + totalSupplementPoints.value;

  return total;
});
//  每日副本补充次数：组内全员共享统计
const totalGroupStoredDailyRuns = computed(() => {
  // 加上当前表单里输入的数值
  let total =
    (Number(getCharGroup.value?.storedDailyRuns) || 0) +
    (Number(supplementFormValues.value?.storedDailyRuns) || 0);
  return total;
});

// 古树庆典小游戏补充次数：组内全员共享统计
const totalGroupStoredMinigameCount = computed(() => {
  let total =
    (Number(getCharGroup.value?.storedMinigameCount) || 0) +
    (Number(supplementFormValues.value?.storedMinigameCount) || 0);
  return total;
});
// 次元袭击补充次数：组内全员共享统计
const totalGroupStoredDimensionalCount = computed(() => {
  let total =
    (Number(getCharGroup.value?.storedDimensionalCount) || 0) +
    (Number(supplementFormValues.value?.storedDimensionalCount) || 0);
  return total;
});

// 噩梦补充次数：角色统计
const totalsToredNightmareCountRuns = computed(() => {
  const otherSum = gameplayCharForm.value?.storedNightmareCount;
  // 加上当前表单里输入的数值
  let totalsToredNightmareCountNum =
    otherSum + (Number(supplementFormValues.value?.storedNightmareCount) || 0);

  return totalsToredNightmareCountNum;
});

// 觉醒战补充次数：角色统计
const totalStoredAwakeningRuns = computed(() => {
  const otherSum = gameplayCharForm.value?.storedAwakening || 0;
  // 加上当前表单里输入的数值
  let totalstoredAwakeningCountNum =
    otherSum + (Number(supplementFormValues.value?.storedAwakening || 0) || 0);

  return totalstoredAwakeningCountNum;
});

// 计数器加减操作
const handleUpdateOdCount = (type, delta) => {
  if (type === "big") {
    supplementFormValues.value.bigOdCount = Math.max(
      0,
      (supplementFormValues.value.bigOdCount || 0) + delta
    );
  } else if (type === "small") {
    supplementFormValues.value.smallOdCount = Math.max(
      0,
      (supplementFormValues.value.smallOdCount || 0) + delta
    );
  }
};
// 执行游玩补充确认（支持奥德、每日副本、古树庆典/次元袭击等多种类型的统一扩展）
const handleExecuteSupplement = async () => {
  const currentTarget = gameplayCharForm.value;
  if (!currentTarget) return;

  let { isValid } = validateCharacterForm(
    currentTarget,
    {},
    "执行游玩补充确认--handleExecuteSupplement"
  );
  if (!isValid) return;

  // 先解构出需要用到的字段，避免反复写 supplementFormValues.value
  const {
    bigOdCount,
    smallOdCount,
    storedNightmareCount,
    storedDailyRuns,
    storedMinigameCount,
    storedAwakening,
    storedDimensionalCount,
  } = supplementFormValues.value || {};

  // 组装更新后的完整角色对象
  const updatedCharacter = {
    ...cloneDeep(currentTarget),
    // 奥德能量：只要有大/小 Od 补充，就更新为计算后的总能量（角色）
    ...(bigOdCount || smallOdCount
      ? { storedEnergy: totalsStoredEnergyCount.value }
      : {}),

    // 噩梦补充（角色）
    ...(storedNightmareCount
      ? { storedNightmareCount: totalsToredNightmareCountRuns.value }
      : {}),

    //觉醒战补充（角色）
    ...(storedAwakening ? { storedAwakening: totalStoredAwakeningRuns.value } : {}),
  };

  const groupId = getCharGroup.value?.id;
  const newGroups = props.gameData?.groups?.map((g) => {
    if (g.id === groupId) {
      return {
        ...g,
        // 每日副本补充（账号共享）
        ...(storedDailyRuns ? { storedDailyRuns: totalGroupStoredDailyRuns.value } : {}),

        // 古树庆典小游戏补充，（账号共享）
        ...(storedMinigameCount
          ? { storedMinigameCount: totalGroupStoredMinigameCount.value }
          : {}),
        // 次元袭击补充，（账号共享）
        ...(storedDimensionalCount
          ? { storedDimensionalCount: totalGroupStoredDimensionalCount.value }
          : {}),
      };
    }
    return g;
  });

  //  更新本地响应式数据
  gameplayCharForm.value = updatedCharacter;

  console.log(
    `🔍 [GroupCharacterPanel:928] %c updatedCharacter 角色补充保存: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    updatedCharacter
  );

  console.log(
    `🔍 [GroupCharacterPanel:928] %c newGroups 分组补充保存: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    newGroups
  );

  debugger;
  // 6. 触发持久化保存事件
  emit("update-character", updatedCharacter);
  emit("update-groups", newGroups);
  //清空
  supplementFormValues.value = cloneDeep(defaultSupplementFormValues);
  $alert(`成功完成补充`);
};

// ========================================副本消耗与吉纳收益计算开始========================================

// 消耗表单与挑战次数状态
const consumeForm = ref({
  dungeonType: localStorage.getItem("aion2_last_dungeon_type") || "expedition",
  selectedDungeonIndex: Number(localStorage.getItem("aion2_last_dungeon_idx")) || 0,
  selectedDiffIndex: Number(localStorage.getItem("aion2_last_diff_idx")) || 0,
  multiplier: Number(localStorage.getItem("aion2_last_multiplier")) || 1,
});
// 动态绑定当前角色所属分组的远征或超越通关次数
const currentActiveRuns = computed({
  get() {
    const groupId = gameplayCharForm.value?.group;
    const groups = props.gameData?.groups || [];

    // 如果没有绑定分组，直接返回 0
    if (groupId === null) return 0;

    const currentGroup = groups.find((g) => g.id === groupId);

    if (consumeForm.value.dungeonType === "expedition") {
      return currentGroup?.runs ?? gameplayCharForm.value?.runs ?? 0;
    } else if (consumeForm.value.dungeonType === "surpass") {
      return currentGroup?.transcendRuns ?? gameplayCharForm.value?.transcendRuns ?? 0;
    }
    return 0;
  },
  set(val) {
    const groupId = gameplayCharForm.value?.group;
    const groups = props.gameData?.groups || [];

    if (groupId === null) return;

    // 生成更新后的 groups 数组
    const newGroups = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          runs: consumeForm.value.dungeonType === "expedition" ? val : g.runs,
          transcendRuns:
            consumeForm.value.dungeonType === "surpass" ? val : g.transcendRuns,
          updatedAt: new Date().toLocaleString(),
        };
      }
      return g;
    });

    // 触发父组件的 update-groups 事件
    emit("update-groups", newGroups);
  },
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
  }
);
// 当前选中的难度对象
const currentSelectedDiff = computed(() => {
  if (!currentDifficultiesList.value) return null;
  return (
    currentDifficultiesList.value[consumeForm.value.selectedDiffIndex] ||
    currentDifficultiesList.value[0]
  );
});

// 根据当前类型和挑战次数获取对应衰减阶梯
const currentDecayRule = computed(() => {
  const rules =
    dungeonDecayRules[consumeForm.value.dungeonType] || dungeonDecayRules.expedition;
  const count = currentActiveRuns.value;
  for (const rule of rules) {
    if (count <= rule.maxCount) {
      return rule;
    }
  }
  return rules[rules.length - 1];
});
// 计算最终消耗奥德
const calculatedEnergyCost = computed(() => {
  if (!currentSelectedDiff.value) return 0;
  const base = currentSelectedDiff.value.energy || 0;
  return isEffectiveDoubleEnergy.value ? base * 2 : base;
});
const currentDecayRate = computed(() => currentDecayRule.value.rate);
const currentDecayRuleLabel = computed(() => currentDecayRule.value.label);
// 收益倍率
const getRewardMultiplier = computed(() => {
  return isEffectiveDoubleEnergy.value ? 1 : 0.5;
});
// 计算基纳增益
const calculatedKinaGain = computed(() => {
  if (!currentSelectedDiff.value) return 0;
  const base = currentSelectedDiff.value.kina || 0;
  return Number((base * getRewardMultiplier.value * currentDecayRate.value).toFixed(2));
});
// 计算绑定基纳增益
const calculatedBoundKinaGain = computed(() => {
  if (!currentSelectedDiff.value) return 0;
  const base = currentSelectedDiff.value.boundKina || 0;
  return Number((base * getRewardMultiplier.value * currentDecayRate.value).toFixed(2));
});

// 计算吉纳总收益
const calculatedTotalGain = computed(() => {
  return Number((calculatedKinaGain.value + calculatedBoundKinaGain.value).toFixed(2));
});
// 智能判断当前是否应该按双倍消耗计算
const isEffectiveDoubleEnergy = computed(() => {
  // 如果不是会员，绝对不允许双倍，强制为单倍
  if (!getCharGroup.value?.premiumMember) return false;
  // 如果是会员，则看用户的选择（默认情况下未定义或为 true 时即为双倍）
  return consumeForm.value.useDoubleEnergy !== false;
});
// 监听会员状态变化，动态校正消耗模式
watch(
  () => getCharGroup.value?.premiumMember,
  (isPremium) => {
    if (isPremium) {
      // 切换到会员身份时，默认勾选双倍消耗
      consumeForm.value.useDoubleEnergy = true;
    } else {
      // 切换到非会员身份时，强制切回单倍基础消耗
      consumeForm.value.useDoubleEnergy = false;
    }
  },
  { immediate: true } // 初始化时立即执行一次
);
// 6. 自动持久化记忆到 localStorage
watch(
  () => consumeForm.value.dungeonType,
  (val) => localStorage.setItem("aion2_last_dungeon_type", val)
);
watch(
  () => consumeForm.value.selectedDungeonIndex,
  (val) => localStorage.setItem("aion2_last_dungeon_idx", val)
);
watch(
  () => consumeForm.value.selectedDiffIndex,
  (val) => localStorage.setItem("aion2_last_diff_idx", val)
);
watch(
  () => consumeForm.value.multiplier,
  (val) => localStorage.setItem("aion2_last_multiplier", val)
);

// 7. 执行扣除奥德逻辑（全面支持 远征、超越、圣域 的衰减阶梯与每日收益流水记录）
const handleExecuteConsume = async () => {
  const cost = calculatedEnergyCost.value;
  const currentEnergy = gameplayCharForm.value?.energy || 0;
  const currentStored = gameplayCharForm.value?.storedEnergy || 0;

  // 1. 检查总奥德是否足够
  if (currentEnergy + currentStored < cost) {
    $alert("当前角色的基础奥德与存储奥德总和不足，无法完成本次消耗！");
    return;
  }

  let newEnergy = currentEnergy;
  let newStored = currentStored;

  if (currentEnergy >= cost) {
    newEnergy = currentEnergy - cost;
  } else {
    const remainingCost = cost - currentEnergy;
    newEnergy = 0;
    newStored = Math.max(0, currentStored - remainingCost);
  }

  // 2. 基础参数准备
  const addRunsCount = 1;
  const dungeonType = consumeForm.value.dungeonType; // 'expedition' | 'surpass' | 'sanctuary'
  const currentDateStr = new Date().toISOString().split("T")[0];
  const nowStr = new Date().toLocaleString();
  // ==================== B. 处理分组数据更新（远征与超越共享次数和日志） ====================
  const groupId = gameplayCharForm.value?.group;
  const groups = props.gameData?.groups || [];

  const newGroups = groups.map((g) => {
    if (g.id === groupId) {
      let updatedRuns = g.runs || 0;
      let updatedTranscendRuns = g.transcendRuns || 0;

      if (dungeonType === "expedition") {
        updatedRuns += addRunsCount;
      } else if (dungeonType === "surpass") {
        updatedTranscendRuns += addRunsCount;
      }

      // 分组的每日日志流水 (runLogs)
      let groupLogs = Array.isArray(g.runLogs) ? [...g.runLogs] : [];
      const existingLogIndex = groupLogs.findIndex(
        (log) => log.date === currentDateStr && log.type === dungeonType
      );

      if (existingLogIndex !== -1) {
        groupLogs[existingLogIndex] = {
          ...groupLogs[existingLogIndex],
          count: groupLogs[existingLogIndex].count + addRunsCount,
          kinaGain: Number(
            (groupLogs[existingLogIndex].kinaGain + calculatedKinaGain.value).toFixed(2)
          ),
          boundKinaGain: Number(
            (
              groupLogs[existingLogIndex].boundKinaGain + calculatedBoundKinaGain.value
            ).toFixed(2)
          ),
          updatedAt: nowStr,
        };
      } else {
        groupLogs.push({
          date: currentDateStr,
          type: dungeonType,
          count: addRunsCount,
          kinaGain: calculatedKinaGain.value,
          boundKinaGain: calculatedBoundKinaGain.value,
          createdAt: nowStr,
          updatedAt: nowStr,
        });
      }

      return {
        ...g,
        runs: updatedRuns,
        transcendRuns: updatedTranscendRuns,
        runLogs: groupLogs,
        updatedAt: nowStr,
      };
    }
    return g;
  });

  // ==================== C. 处理单角色数据更新（总次数、圣域及角色日志） ====================
  let updatedTotalRuns = gameplayCharForm.value?.totalRuns || 0;
  let updatedTotalTranscendRuns = gameplayCharForm.value?.totalTranscendRuns || 0;

  if (dungeonType === "expedition") {
    updatedTotalRuns += addRunsCount;
  } else if (dungeonType === "surpass") {
    updatedTotalTranscendRuns += addRunsCount;
  }

  // 圣域副本次数独立记录在角色上
  let updatedSanctuaryRuns = {
    ...(gameplayCharForm.value?.sanctuaryRuns || {}),
  };
  let updatedLastSanctuaryRunsUpdate =
    gameplayCharForm.value?.lastSanctuaryRunsUpdate || "";

  if (dungeonType === "sanctuary") {
    const selectedDungeon =
      currentDungeonList.value[consumeForm.value.selectedDungeonIndex];
    if (selectedDungeon && selectedDungeon.key) {
      const dungeonKey = selectedDungeon.key;
      const currentCount = updatedSanctuaryRuns[dungeonKey] || 0;
      updatedSanctuaryRuns[dungeonKey] = currentCount + addRunsCount;
      updatedLastSanctuaryRunsUpdate = nowStr;
    }
  }

  // 单角色的每日日志流水 (runLogs)
  let charLogs = Array.isArray(gameplayCharForm.value?.runLogs)
    ? [...gameplayCharForm.value.runLogs]
    : [];
  const charExistingLogIndex = charLogs.findIndex(
    (log) => log.date === currentDateStr && log.type === dungeonType
  );

  if (charExistingLogIndex !== -1) {
    charLogs[charExistingLogIndex] = {
      ...charLogs[charExistingLogIndex],
      count: charLogs[charExistingLogIndex].count + addRunsCount,
      kinaGain: Number(
        (charLogs[charExistingLogIndex].kinaGain + calculatedKinaGain.value).toFixed(2)
      ),
      boundKinaGain: Number(
        (
          charLogs[charExistingLogIndex].boundKinaGain + calculatedBoundKinaGain.value
        ).toFixed(2)
      ),
      updatedAt: nowStr,
    };
  } else {
    charLogs.push({
      date: currentDateStr,
      type: dungeonType,
      count: addRunsCount,
      kinaGain: calculatedKinaGain.value,
      boundKinaGain: calculatedBoundKinaGain.value,
      createdAt: nowStr,
      updatedAt: nowStr,
    });
  }

  // 组装更新后的完整角色对象
  const updatedCharacter = {
    ...gameplayCharForm.value,
    energy: newEnergy,
    storedEnergy: newStored,
    totalRuns: updatedTotalRuns,
    totalTranscendRuns: updatedTotalTranscendRuns,
    sanctuaryRuns: updatedSanctuaryRuns,
    lastSanctuaryRunsUpdate: updatedLastSanctuaryRunsUpdate,
    runLogs: charLogs,
  };

  const confirmed = await $confirm?.(
    `确定要消耗${calculatedEnergyCost?.value || 0}点奥德吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  );
  console.log(
    `🔍 [GroupCharacterPanel:1340] %c 消耗---confirmed: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    confirmed
  );
  if (!confirmed) return;
  // 更新本地表单状态
  gameplayCharForm.value = updatedCharacter;

  console.log(
    `🔍 [GroupCharacterPanel] %c 消耗奥德与各副本类型收益计算更新: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    {
      updatedCharacter,
      newGroups,
    }
  );

  // 触发父组件更新事件
  emit("update-character", updatedCharacter);
  emit("update-groups", newGroups);
};
// 过滤后的具体副本列表（若圣域对应的 s1/s2/s3 次数用尽则自动隐藏该项）
const filteredDungeonList = computed(() => {
  const list = currentDungeonList.value || [];
  const newList = list.map((item) => {
    let maxLimit = 1; // 默认圣域每周通关上限为 1 次
    let consumed = 0; // 已消耗/已通关次数

    if (consumeForm.value.dungeonType === "sanctuary" && item.key) {
      // 1. 圣域的总上限通常是固定值（例如每周限通关 1 次），如果 item 里配了就取 item.maxLimit，没有就默认为 1
      maxLimit = item.maxLimit ?? 1;

      // 2. 获取该项已经通关的次数 (sanctuaryRuns)
      const sanctuaryRunsMap = gameplayCharForm.value?.sanctuaryRuns || {};
      consumed = Number(sanctuaryRunsMap[item.key]) || 0;
    } else {
      // 非圣域走你原本的逻辑
      maxLimit = item.maxLimit ?? 1;
    }

    // 剩余可用次数 = 总上限 - 已通关次数
    const remaining = Math.max(0, maxLimit - consumed);
    const isFinished = remaining <= 0; // 如果剩余 <= 0，代表本周打完了

    return {
      ...item,
      currentRuns: consumed,
      maxLimit,
      isFinished,
    };
  });
  console.log(
    `🔍 [GroupCharacterPanel:674] %c newList: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    newList
  );
  console.log(
    `🔍 [GroupCharacterPanel:674] %c list: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    list
  );

  return newList;
});

// 监听副本大类切换，安全重置默认索引
watch(
  () => consumeForm.value.dungeonType,
  () => {
    consumeForm.value.selectedDungeonIndex =
      filteredDungeonList.value.length > 0 ? 0 : null;
    consumeForm.value.selectedDiffIndex = 0;
  }
);

// 监听 filteredDungeonList 变化，如果当前选中的副本已经打完了，自动帮用户切换到第一个没打完的副本
watch(
  filteredDungeonList,
  (newList) => {
    if (consumeForm.value.dungeonType === "sanctuary") {
      const currentSelected = newList[consumeForm.value.selectedDungeonIndex];
      // 如果当前选中的项不存在或者已经打完了，就自动寻找第一个没打完的
      if (!currentSelected || currentSelected.isFinished) {
        const firstUnfinishedIndex = newList.findIndex((item) => !item.isFinished);
        if (firstUnfinishedIndex !== -1) {
          consumeForm.value.selectedDungeonIndex = firstUnfinishedIndex;
        }
      }
    }
  },
  { immediate: true, deep: true }
);

const dailyRunsSection = ref(null);
const energySection = ref(null);
const minigameSection = ref(null);
const dimensionalSection = ref(null);
const awakeningSection = ref(null);
const nightmareSection = ref(null);
const battlefieldSection = ref(null);

// 点击跳转定位方法
const scrollToSection = (key) => {

  console.log(`🔍 [GroupCharacterPanel:1829] %c scrollToSection--key: ${key}`,'font-size:14px; background:#26A08F; color:#fff;font-weight: bold;',key);
  let targetElement = null;

  // 根据点击的 key 映射到对应的 DOM 元素
  switch (key) {
    case "dailyRunsCount":
    case "dailyRuns":
      targetElement = dailyRunsSection.value;
      break;
    case "energy":
      targetElement = energySection.value;
      break;
    case "minigame":
    case "minigameCount":
      targetElement = minigameSection.value;
      break;
    case "dimensionalCount":
      targetElement = dimensionalSection.value;
      break;
    case "awakening":
      targetElement = awakeningSection.value;
      break;
    case "battlefield":
      targetElement = battlefieldSection.value;
      break;
    case "nightmareCount":
      targetElement = nightmareSection.value;
      break;
  }

  console.log(`🔍 [GroupCharacterPanel:1855] %c 当前targetElement: `,'font-size:14px; background:#26A08F; color:#fff;font-weight: bold;', targetElement);
  if (targetElement) {
    // 平滑滚动到目标位置，并让其在视口中居中或靠上
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center", // 垂直居中展示
    });

    targetElement.classList.add(
      "ring-2",
      "ring-[#45a6d5]",
      "transition-all",
      "duration-500"
    );
    setTimeout(() => {
      targetElement.classList.remove("ring-2", "ring-[#45a6d5]");
    }, 1500);
  }
};

//========================游玩消耗/补充弹框结束========================
//================ 日周任务 开始 weeklydaily================
// 日周任务 表单内的控制
const weeklydailyFormValues = ref(cloneDeep(defaultWeeklydailyFormValues));
// 噩梦剩余次数：角色统计
const totalsRemainingNightmareCountRuns = computed(() => {
  const storedNightmareCount = gameplayCharForm.value?.storedNightmareCount;
  const nightmareCount = gameplayCharForm.value?.nightmareCount;
  // 当前表单里输入的数值
  const currentNightmareCount = weeklydailyFormValues.value.nightmareCount;

  let total = storedNightmareCount + nightmareCount - currentNightmareCount;

  return total;
});
// 觉醒战剩余次数：角色统计
const totalsRemainingAwakeningCountRuns = computed(() => {
  const storedAwakeningCount = gameplayCharForm.value?.storedAwakening;
  const awakeningCount = gameplayCharForm.value?.awakening;
  // 当前表单里输入的数值
  const currentAwakeningCount = weeklydailyFormValues.value.awakening;

  let total = storedAwakeningCount + awakeningCount - currentAwakeningCount;

  return total;
});
// 每日副本剩余次数：角色统计
const totalsRemainingDailyRunsCountRuns = computed(() => {
  const storedDailyCount = Number(getCharGroup.value?.storedDailyRuns);
  const dailyRuns = Number(getCharGroup.value?.dailyRuns);

  // 当前表单里输入的数值
  const currentDailyRunsCount = weeklydailyFormValues.value.dailyRuns;

  let total = storedDailyCount + dailyRuns - currentDailyRunsCount;

  return total;
});
// 古树庆典小游戏剩余次数：角色统计
const totalsRemainingMinigameCountRuns = computed(() => {
  const storedMinigameCount = Number(getCharGroup.value?.storedMinigameCount);
  const minigameCount = Number(getCharGroup.value?.minigameCount);

  // 当前表单里输入的数值
  const currentMinigameCount = weeklydailyFormValues.value.minigameCount;

  let total = storedMinigameCount + minigameCount - currentMinigameCount;

  return total;
});

//次元袭击剩余次数：角色统计
const totalsRemainingDimensionalCountRuns = computed(() => {
  const storedDimensionalCount = Number(getCharGroup.value?.storedDimensionalCount);
  const dimensionalCount = Number(getCharGroup.value?.dimensionalCount);

  // 当前表单里输入的数值
  const currentDimensionalCount = weeklydailyFormValues.value.dimensionalCount;

  let total = storedDimensionalCount + dimensionalCount - currentDimensionalCount;

  return total;
});

const hasWeeklyDailyValues = computed(() => {
  return (
    weeklydailyFormValues.value.dailyTaskCount > 0 ||
    weeklydailyFormValues.value.dimensionalCount > 0 ||
    weeklydailyFormValues.value.minigameCount > 0 ||
    weeklydailyFormValues.value.awakening > 0 ||
    weeklydailyFormValues.value.nightmareCount > 0 ||
    weeklydailyFormValues.value.dailyRuns > 0
  );
});

//日/周常任务 确认完成
const handleExecuteWeeklyDaily = () => {
  console.log(
    `🔍 [GroupCharacterPanel:1560] %c 点击handleExecuteWeeklyDaily: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;"
  );
  if (!hasWeeklyDailyValues.value) {
    return;
  }

  const {
    nightmareCount,
    dailyRuns,
    minigameCount,
    awakening,
    dimensionalCount,
    battlefield,
    dailyTaskCount,
  } = weeklydailyFormValues.value || {};
  const currentTarget = gameplayCharForm.value;
  // 组装更新后的完整角色对象
  const updatedCharacter = {
    ...cloneDeep(currentTarget),
  };
  // 噩梦消耗，先消耗基础的（updatedCharacter.nightmareCount），然后在消耗存储的（storedNightmareCount）
  // 噩梦消耗处理逻辑
  if (nightmareCount && nightmareCount > 0) {
    // 1. 先计算基础消耗中还能扣多少
    const currentBase = updatedCharacter.nightmareCount || 0;

    if (currentBase >= nightmareCount) {
      // 基础数量完全足够，直接在基础中扣除
      updatedCharacter.nightmareCount -= nightmareCount;
    } else {
      // 基础数量不够，先全部扣完（归零）
      const remainder = nightmareCount - currentBase;
      updatedCharacter.nightmareCount = 0;

      // 2. 剩余的量去扣减存储的 (storedNightmareCount)
      updatedCharacter.storedNightmareCount = Math.max(
        0,
        (updatedCharacter.storedNightmareCount || 0) - remainder
      );
    }
  }
  //觉醒战消耗计算，先消耗基础的（updatedCharacter.awakening），然后在消耗存储的（storedAwakening）
  if (awakening && awakening > 0) {
    // 1. 先计算基础消耗中还能扣多少
    const currentBase = updatedCharacter.awakening || 0;

    if (currentBase >= awakening) {
      // 基础数量完全足够，直接在基础中扣除
      updatedCharacter.awakening -= awakening;
    } else {
      // 基础数量不够，先全部扣完（归零）
      const remainder = awakening - currentBase;
      updatedCharacter.awakening = 0;

      // 2. 剩余的量去扣减存储的 (storedAwakening)
      updatedCharacter.storedAwakening = Math.max(
        0,
        (updatedCharacter.storedAwakening || 0) - remainder
      );
    }
  }
  //战场没有存储只有基础
  if (battlefield && battlefield > 0) {
    updatedCharacter.battlefield -= battlefield;
  }
  //每日任务是否完成.如果完成了五次就说明每日任务已经完成了
  // 每日任务次数累加与状态联动
  if (dailyTaskCount && dailyTaskCount > 0) {
    // 累加次数
    updatedCharacter.dailyTaskCount =
      (updatedCharacter?.dailyTaskCount || 0) + dailyTaskCount;
    updatedCharacter.dailyMission = false;
    // 如果达到或超过 5 次，则判定每日使命已完成，并将上限锁定在 5
    if (updatedCharacter.dailyTaskCount >= 5) {
      updatedCharacter.dailyTaskCount = 5;
      updatedCharacter.dailyMission = true;
    }
  }

  const groupId = getCharGroup.value?.id;
  const newGroups = props.gameData?.groups?.map((g) => {
    if (g.id === groupId) {
      let newGroup = {
        ...g,
      };
      // 每日副本消耗 先消耗基础在消耗存储
      if (dailyRuns && dailyRuns > 0) {
        // 1. 先计算基础消耗中还能扣多少
        const currentBase = newGroup.dailyRuns || 0;

        if (currentBase >= dailyRuns) {
          // 基础数量完全足够，直接在基础中扣除
          newGroup.dailyRuns -= dailyRuns;
        } else {
          // 基础数量不够，先全部扣完（归零）
          const remainder = dailyRuns - currentBase;
          newGroup.dailyRuns = 0;

          // 2. 剩余的量去扣减存储的 (storedDailyRuns)
          newGroup.storedDailyRuns = Math.max(
            0,
            (newGroup.storedDailyRuns || 0) - remainder
          );
        }
      }

      // 古树庆典小游戏消耗，先消耗基础的（newGroup.minigameCount），然后在消耗存储的（storedMinigameCount）
      if (minigameCount && minigameCount > 0) {
        // 1. 先计算基础消耗中还能扣多少
        const currentBase = newGroup.minigameCount || 0;

        if (currentBase >= minigameCount) {
          // 基础数量完全足够，直接在基础中扣除
          newGroup.minigameCount -= minigameCount;
        } else {
          // 基础数量不够，先全部扣完（归零）
          const remainder = minigameCount - currentBase;
          newGroup.minigameCount = 0;

          // 2. 剩余的量去扣减存储的 (storedMinigameCount)
          newGroup.storedMinigameCount = Math.max(
            0,
            (newGroup.storedMinigameCount || 0) - remainder
          );
        }
      }
      // 次元袭击消耗，先消耗基础的（newGroup.dimensionalCount），然后在消耗存储的（storedDimensionalCount）
      if (dimensionalCount && dimensionalCount > 0) {
        // 1. 先计算基础消耗中还能扣多少
        const currentBase = newGroup.dimensionalCount || 0;

        if (currentBase >= dimensionalCount) {
          // 基础数量完全足够，直接在基础中扣除
          newGroup.dimensionalCount -= dimensionalCount;
        } else {
          // 基础数量不够，先全部扣完（归零）
          const remainder = dimensionalCount - currentBase;
          newGroup.dimensionalCount = 0;

          // 2. 剩余的量去扣减存储的 (storedDimensionalCount)
          newGroup.storedDimensionalCount = Math.max(
            0,
            (newGroup.storedDimensionalCount || 0) - remainder
          );
        }
      }

      return newGroup;
    }
    return g;
  });

  //  更新本地响应式数据
  gameplayCharForm.value = cloneDeep(updatedCharacter);
  console.log(
    `🔍 [GroupCharacterPanel:928] %c updatedCharacter 角色消耗保存: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    updatedCharacter
  );
  console.log(
    `🔍 [GroupCharacterPanel:928] %c newGroups 分组消耗保存: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    newGroups
  );
  debugger;

  weeklydailyFormValues.value = {
    ...weeklydailyFormValues.value,
    dailyTaskCount: gameplayCharForm.value?.dailyTaskCount || 0,
    dailyMission: false,
  };

  // 触发父组件更新事件
  emit("update-character", updatedCharacter);
  emit("update-groups", newGroups);
  $alert(`成功完成消耗`);
};

//================ 日周任务 结束 =====================

//================ 周兑换 开始================

const exchangeFormValues = ref(cloneDeep(defaultExchangeFormValues));
const defaultExchangeFormValuesAll = {
  // 角色
  /** 本周是否已购买商店周奥德能量（布尔值） */
  isBreezeCharOd: true,
  breezeCharOd: 4,

  /** 是否已购买物质变换角色奥德能量 */
  isMaterialCharOd: true,
  materialCharOd: 4,

  //共享
  // 物质变换账号奥德能量
  isBreezeAccountOd: true, // 是否已购买物质变换账号奥德能量（布尔值）
  breezeAccountOd: 16, // 物质变换账号奥德能量当前数量

  //微风商店上限兑换管理
  isMaterialAccountOd: true, // 本周是否已购买商店周奥德能量（布尔值）
  materialAccountOd: 16, // 商店周奥德能量当前数量

  isBreezeReviveStone: true, // 本周是否已购买商店周复活石（布尔值）
  breezeReviveStone: 7, // 商店周复活石当前数量

  isBreezeRiftTicket: true, // 本周是否已购买商店周未知缝隙卷（布尔值）
  breezeRiftTicket: 21, // 商店周未知缝隙卷当前数量

  isBreezeDailyTicket: true, // 本周是否已购买商店周完成卷(每日)（布尔值）
  breezeDailyTicket: 21, // 商店周完成卷(每日)当前数量

  isBreezeNightmareTicket: true, // 本周是否已购买商店周完成卷(噩梦)（布尔值）
  breezeNightmareTicket: 14, // 商店周完成卷(噩梦)当前数量

  // 深渊指令书管理（下层 & 中层，上限各 5）
  lowerAbyssNormal: 5, // 下层深渊指令书 - 普通数量
  lowerAbyssSkilled: 5, // 下层深渊指令书 - 熟练数量
  lowerAbyssElite: 5, // 下层深渊指令书 - 精锐数量
  lowerAbyssSpecial: 5, // 下层深渊指令书 - 特命数量
  isLowerAbyss: true, // 是否已购买下层深渊指令书（布尔值）

  midAbyssSkilled: 5, // 中层深渊指令书 - 熟练数量
  midAbyssSpecial: 5, // 中层深渊指令书 - 特命数量
  isMidAbyss: true, // 是否已购买中层深渊指令书（布尔值）

  // 地区指令书管理（上限各 12）
  regionACount: 12, // 地区A指令书当前数量
  isRegionACount: true, // 是否已购买地区A指令书（布尔值）
  regionBCount: 12, // 地区B指令书当前数量
  isRegionBCount: true, // 是否已购买地区B指令书（布尔值）
};
const hasExchangeValues = computed(() => {
  return (
    exchangeFormValues.value.breezeCharOd > 0 ||
    exchangeFormValues.value.materialCharOd > 0 ||
    exchangeFormValues.value.breezeAccountOd > 0 ||
    exchangeFormValues.value.materialAccountOd > 0 ||
    exchangeFormValues.value.breezeReviveStone > 0 ||
    exchangeFormValues.value.breezeRiftTicket > 0 ||
    exchangeFormValues.value.breezeDailyTicket > 0 ||
    exchangeFormValues.value.breezeNightmareTicket > 0 ||
    exchangeFormValues.value.lowerAbyssNormal > 0 ||
    exchangeFormValues.value.lowerAbyssSkilled > 0 ||
    exchangeFormValues.value.lowerAbyssElite > 0 ||
    exchangeFormValues.value.lowerAbyssSpecial > 0 ||
    exchangeFormValues.value.midAbyssSkilled > 0 ||
    exchangeFormValues.value.midAbyssSpecial > 0 ||
    exchangeFormValues.value.regionACount > 0 ||
    exchangeFormValues.value.regionBCount > 0
  );
});
//一键全领兑换任务
const handleExecuteExchangeAll = () => {
  // 定义所有项及其最大上限的对照规则
  const maxLimits = {
    breezeCharOd: 4,
    materialCharOd: 4,

    breezeAccountOd: 16,
    materialAccountOd: 16,
    breezeReviveStone: 7,
    breezeRiftTicket: 21,
    breezeDailyTicket: 21,
    breezeNightmareTicket: 14,
    lowerAbyssNormal: 5,
    lowerAbyssSkilled: 5,
    lowerAbyssElite: 5,
    lowerAbyssSpecial: 5,
    midAbyssSkilled: 5,
    midAbyssSpecial: 5,
    regionACount: 12,
    regionBCount: 12,
  };

  

  Object.keys(maxLimits).forEach((key) => {
    const max = maxLimits[key];
    const currentVal = exchangeFormValues.value[key] || 0;

    // 如果没达到上限，则执行一键拉满
    if (currentVal < max) {
      exchangeFormValues.value[key] = max;
    }
  });

  exchangeFormValues.value.isBreezeCharOd = true;
  exchangeFormValues.value.isMaterialCharOd = true;
  exchangeFormValues.value.isBreezeAccountOd = true;
  exchangeFormValues.value.isMaterialAccountOd = true;
  exchangeFormValues.value.isBreezeReviveStone = true;
  exchangeFormValues.value.isBreezeRiftTicket = true;
  exchangeFormValues.value.isBreezeDailyTicket = true;
  exchangeFormValues.value.isBreezeNightmareTicket = true;
  exchangeFormValues.value.isLowerAbyss = true;
  exchangeFormValues.value.isMidAbyss = true;
  exchangeFormValues.value.isRegionACount = true;
  exchangeFormValues.value.isRegionBCount = true;
};

const handleExecuteExchange = () => {
  if (!hasExchangeValues.value) {
    $alert(`请正确填写兑换任务`);
    return;
  }
  console.log(
    `🔍 [GroupCharacterPanel:2112] %c exchangeFormValues: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    exchangeFormValues.value
  );
  const { breezeCharOd, materialCharOd } = exchangeFormValues.value || {};
  const currentTarget = gameplayCharForm.value;
  // 组装更新后的完整角色对象
  const updatedCharacter = {
    ...cloneDeep(currentTarget),
  };
  const nowStr = new Date().toLocaleString();
  // 赋值角色od：商店周奥德能量（上限 5）
  if (breezeCharOd && breezeCharOd > 0) {
    updatedCharacter.breezeCharOd = (updatedCharacter.breezeCharOd || 0) + breezeCharOd;
    updatedCharacter.breezeCharOdDate = nowStr;

    if (updatedCharacter.breezeCharOd >= 4) {
      updatedCharacter.breezeCharOd = 4;
      updatedCharacter.isBreezeCharOd = true;
    }
  }

  // 物质变换角色奥德能量（上限 5，兼容可能没有的情况）
  if (materialCharOd && materialCharOd > 0) {
    updatedCharacter.materialCharOd =
      (updatedCharacter.materialCharOd || 0) + materialCharOd;
    updatedCharacter.materialCharOdDate = nowStr;

    if (updatedCharacter.materialCharOd >= 4) {
      updatedCharacter.materialCharOd = 4;
      updatedCharacter.isMaterialCharOd = true;
    }
  }

  //共享组赋值
  const groupId = getCharGroup.value?.id;
  const newGroups = props.gameData?.groups?.map((g) => {
    if (g.id === groupId) {
      let newGroup = {
        ...g,
      };

      limitRules.forEach((rule) => {
        const incomingVal = exchangeFormValues.value?.[rule.valueKey];

        if (incomingVal && incomingVal > 0) {
          // 累加当前值
          newGroup[rule.valueKey] = (newGroup[rule.valueKey] || 0) + incomingVal;

          // 触顶校验与状态联动
          if (newGroup[rule.valueKey] >= rule.max) {
            newGroup[rule.valueKey] = rule.max;
            newGroup[rule.flagKey] = true;
          }
        }
      });

      return newGroup;
    }
    return g;
  });

  //  更新本地响应式数据
  gameplayCharForm.value = cloneDeep(updatedCharacter);
  // exchangeFormValues.value = cloneDeep(defaultExchangeFormValues);
  console.log(
    `🔍 [GroupCharacterPanel:928] %c handleExecuteExchange 周兑换保存: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    updatedCharacter
  );
  console.log(
    `🔍 [GroupCharacterPanel:928] %c newGroups 周兑换保存: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    newGroups
  );
  debugger;
  emit("update-character", updatedCharacter);
  emit("update-groups", newGroups);
  $alert(`成功完成周兑换`);
};

//================ 周兑换 结束 =====================

// 1. 定义一个通用的字段校验监听工厂函数
const watchFieldLimit = (sourceGetter, fieldName, extraCondition) => {
  watch(sourceGetter, (val) => {
    // if (val > maxLimit && extraCondition()) {
    if (extraCondition(val)) {
      const currentResult = validateCharacterForm(
        {
          [fieldName]: val,
        },
        {},
        "通用--watchFieldLimit触发"
      );
      validationResult.value = {
        ...validationResult.value,
        isValid: currentResult.isValid && validationResult.value.isValid,
        errors: {
          ...validationResult.value.errors,
          ...currentResult.errors,
        },
        invalidFields: Array.from(
          new Set([...validationResult.value.invalidFields, fieldName])
        ),
      };
    } else {
      // 移除当前字段的错误，保留其他字段
      const newErrors = { ...validationResult.value.errors };
      delete newErrors[fieldName];

      const newInvalidFields = validationResult.value.invalidFields.filter(
        (field) => field !== fieldName
      );

      validationResult.value = {
        ...validationResult.value,
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors,
        invalidFields: newInvalidFields,
      };
    }
  });
};

const tabClick = (tab) => {
  activeTab.value = tab;
  switch (tab) {
    case "consume": //消耗奥德
      break;
    case "supplement": //游玩补充
      break;
    case "weeklydaily": //日/周常任务
      if (
        !gameplayCharForm.value?.dailyMission &&
        (gameplayCharForm.value?.dailyTaskCount || 0) < 5
      ) {
        // 未完成且次数小于5：同步当前的次数
        weeklydailyFormValues.value = {
          ...weeklydailyFormValues.value,
          dailyTaskCount: gameplayCharForm.value?.dailyTaskCount || 0,
          dailyMission: false,
        };
      } else {
        // 已完成或次数已满：清空或归零该项的表单值
        weeklydailyFormValues.value = {
          ...weeklydailyFormValues.value,
          dailyTaskCount: 5,
          dailyMission: true,
        };
      }
      break;
    case "exchange": //周兑换
      exchangeFormValues.value = cloneDeep(defaultExchangeFormValues);

      if (
        gameplayCharForm.value?.breezeCharOd &&
        gameplayCharForm.value?.breezeCharOd > 0
      ) {
        exchangeFormValues.value.breezeCharOd = gameplayCharForm.value?.breezeCharOd;
        if (exchangeFormValues.value.breezeCharOd >= 4) {
          exchangeFormValues.value.breezeCharOd = 4;
          exchangeFormValues.value.isBreezeCharOd = true;
        }
      }
      if (
        gameplayCharForm.value?.materialCharOd &&
        gameplayCharForm.value?.materialCharOd > 0
      ) {
        exchangeFormValues.value.materialCharOd = gameplayCharForm.value?.materialCharOd;
        if (exchangeFormValues.value.materialCharOd >= 4) {
          exchangeFormValues.value.materialCharOd = 4;
          exchangeFormValues.value.isMaterialCharOd = true;
        }
      }
      limitRules.forEach((rule) => {
        const incomingVal = getCharGroup.value?.[rule.valueKey];

        if (incomingVal && incomingVal > 0) {
          // 累加当前值
          exchangeFormValues.value[rule.valueKey] =
            (exchangeFormValues.value[rule.valueKey] || 0) + incomingVal;

          // 触顶校验与状态联动
          if (exchangeFormValues.value[rule.valueKey] >= rule.max) {
            exchangeFormValues.value[rule.valueKey] = rule.max;
            exchangeFormValues.value[rule.flagKey] = true;
          }
        }
      });
      break;
  }
};

// ==================== 2. 表单整体变动的实时校验 ====================
watch(
  () => gameplayCharForm.value,
  (newVal) => {
    console.log(
      `🔍 [UsersAdmin:1250] %c 监听gameplayCharForm--校验触发: `,
      "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
      newVal
    );

    if (newVal && Object.keys(newVal).length > 0) {
      const overrideForm = { ...newVal };

      switch (activeTab.value) {
        case "supplement": //游玩补充
          if (totalGroupStoredMinigameCount.value > 30) {
            overrideForm.storedMinigameCount = totalGroupStoredMinigameCount.value;
          }

          validationResult.value = validateCharacterForm(
            overrideForm,
            {
              allCharacters: props.gameData?.characters || [],
              groups: props.gameData?.groups || [],
            },
            "gameplayCharForm.value监听触发"
          );

          break;
        case "weeklydaily": //日/周常任务
          break;
        default:
          break;
      }
    } else {
      validationResult.value = cloneDeep(defaultValidationResult);
    }
  },
  { deep: true, immediate: true }
);
// 判断是否全部任务都已做完的计算属性
const isAllExchangesCompleted = computed(() => {
  const limitsGroup = [
    { key: "breezeAccountOd", max: 16 },
    { key: "materialAccountOd", max: 16 },
    { key: "breezeReviveStone", max: 7 },
    { key: "breezeRiftTicket", max: 21 },
    { key: "breezeDailyTicket", max: 21 },
    { key: "breezeNightmareTicket", max: 14 },
    { key: "lowerAbyssNormal", max: 5 },
    { key: "lowerAbyssSkilled", max: 5 },
    { key: "lowerAbyssElite", max: 5 },
    { key: "lowerAbyssSpecial", max: 5 },
    { key: "midAbyssSkilled", max: 5 },
    { key: "midAbyssSpecial", max: 5 },
    { key: "regionACount", max: 12 },
    { key: "regionBCount", max: 12 },
  ];
  let limitsCharacter = [
    { key: "breezeCharOd", max: 4 },
    { key: "materialCharOd", max: 4 },
  ];
  // 只要有一个没达到上限，就返回 false；全部达到或超过上限才返回 true
  let isAllExchangesCompleted =
    limitsGroup.every((item) => {
      const val = getCharGroup.value?.[item.key] || 0;
      return val >= item.max;
    }) &&
    limitsCharacter.every((item) => {
      const val = gameplayCharForm.value?.[item.key] || 0;
      return val >= item.max;
    });
    console.log(`🔍 [GroupCharacterPanel:2512] %c isAllExchangesCompleted: `,'font-size:14px; background:#26A08F; color:#fff;font-weight: bold;', isAllExchangesCompleted);
  return isAllExchangesCompleted;
});
// ==================== 3. 独立字段的实时校验（一句话复用） ====================
// 判断补充表单内是否有任意一个值大于 0
const hasSupplementValues = computed(() => {
  return Object.values(supplementFormValues.value).some((val) => Number(val) > 0);
});
// 补充验证
// 奥德补充校验 (> 2000)
watchFieldLimit(
  () => totalsStoredEnergyCount.value,
  "storedEnergy",
  (val) => {
    return val > 2000;
  }
);

// 每日副本校验 (> 30 且 补充值 > 0)
watchFieldLimit(
  () => totalGroupStoredDailyRuns.value,
  "storedDailyRuns",
  (val) => {
    return val > 30 && supplementFormValues.value.storedDailyRuns > 0;
  }
);

// 古树庆典小游戏校验 (> 30 且 补充值 > 0)
watchFieldLimit(
  () => totalGroupStoredMinigameCount.value,
  "storedMinigameCount",
  (val) => {
    return val > 30 && supplementFormValues.value.storedMinigameCount > 0;
  }
);
// 次元袭击校验 (> 30 且 补充值 > 0)
watchFieldLimit(
  () => totalGroupStoredDimensionalCount.value,
  "storedDimensionalCount",
  (val) => {
    return val > 30 && supplementFormValues.value.storedDimensionalCount > 0;
  }
);

// 噩梦校验 (> 30 且 补充值 > 0)
watchFieldLimit(
  () => totalsToredNightmareCountRuns.value,
  "storedNightmareCount",
  (val) => {
    return val > 30 && supplementFormValues.value.storedNightmareCount > 0;
  }
);
// 觉醒战校验 (> 30 且 补充值 > 0)
watchFieldLimit(
  () => totalStoredAwakeningRuns.value,
  "storedAwakening",
  (val) => {
    return val > 30 && supplementFormValues.value.storedAwakening > 0;
  }
);

//日周消耗验证
// 噩梦消耗

const nightmareCountSum = computed(() => {
  return (
    (gameplayCharForm.value?.storedNightmareCount || 0) +
    (gameplayCharForm.value?.nightmareCount || 0)
  );
});

watchFieldLimit(
  () => weeklydailyFormValues.value?.nightmareCount,
  "nightmareCount",
  (val) => {
    return val > nightmareCountSum.value;
  }
);
// 觉醒战消耗

const awakeningCountSum = computed(() => {
  return (
    (gameplayCharForm.value?.storedAwakening || 0) +
    (gameplayCharForm.value?.awakening || 0)
  );
});

watchFieldLimit(
  () => weeklydailyFormValues.value?.awakening,
  "awakening",
  (val) => {
    return val > awakeningCountSum.value;
  }
);
// 战场消耗

watchFieldLimit(
  () => weeklydailyFormValues.value?.battlefield,
  "battlefield",
  (val) => {
    return val > (gameplayCharForm.value?.battlefield || 0);
  }
);

//每日副本消耗
watchFieldLimit(
  () => weeklydailyFormValues.value?.dailyRuns,
  "dailyRuns",
  (val) => {
    let total =
      (getCharGroup.value?.storedDailyRuns || 0) + (getCharGroup.value?.dailyRuns || 0);
    return total > 0 && val > total;
  }
);
// 古树庆典小游戏消耗
watchFieldLimit(
  () => weeklydailyFormValues.value?.minigameCount,
  "minigameCount",
  (val) => {
    let total =
      (getCharGroup.value?.storedMinigameCount || 0) +
      (getCharGroup.value?.minigameCount || 0);

    return total > 0 && val > total;
  }
);
// 次元袭击消耗
watchFieldLimit(
  () => weeklydailyFormValues.value?.dimensionalCount,
  "dimensionalCount",
  (val) => {
    let total =
      (getCharGroup.value?.storedDimensionalCount || 0) +
      (getCharGroup.value?.dimensionalCount || 0);
    return total > 0 && val > total;
  }
);

watch(
  () => gameplayCharForm.value,
  (val) => {
    if (val) {
      console.log(
        `🔍 [GroupCharacterPanel:530] %c gameplayCharForm当前角色数据: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        val
      );
    }
  }
);
watch(
  () => validationResult.value,
  (val) => {
    if (val) {
      console.log(
        `🔍 [GroupCharacterPanel:530] %c validationResult校验: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        val
      );
    }
  }
);
watch(
  () => activeTab.value,
  (val) => {
    if (val) {
      console.log(
        `🔍 [GroupCharacterPanel:530] %c activeTab tab监听变化: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        val
      );
    }
  }
);
defineExpose({
  handleTaskClick,
});
</script>

<template>
  <div class="space-y-2 mt-1">
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

    <CharacterCard
      v-if="filteredCharacters.length > 0"
      :characters="filteredCharacters"
      :config="props.cardConfig"
      :get-group-name="getGroupName"
      :format-combat-power="formatCombatPower"
      @click-gameplay="handleClickGameplay"
      @toggle-lock="(char) => emit('toggle-lock', char)"
      @toggle-task="handleToggleTask"
      @task-click="handleTaskClick"
      @text-change="handleTextChange"
      @delete="handleDelete"
      :groups="props.gameData.group"
      :gameData="props.gameData"
    />

    <!-- 空状态展示 -->
    <div
      v-else
      class="bg-white border border-slate-200/80 p-12 rounded-3xl text-center space-y-3 shadow-sm h-[500px]"
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
  <Teleport to="body">
    <Transition name="GAMEEPLAY">
      <div
        v-if="openGameplay"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm"
      >
        <div
          class="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-800 flex flex-col h-[90vh]"
        >
          <!-- 弹窗头部 -->
          <div
            class="px-8 py-2 border-b border-slate-100 flex items-center justify-between bg-white z-10"
          >
            <div class="flex items-center gap-6">
              <!-- Tab 切换按钮组 -->
              <div
                class="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-200"
              >
                <button
                  type="button"
                  class="flex-1 px-2 py-2 rounded-xl text-xs font-black transition-all shadow-2xs whitespace-nowrap"
                  :class="
                    activeTab === 'consume'
                      ? 'bg-[#45a6d5] text-white shadow-md shadow-[#45a6d5]/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  "
                  @click="tabClick('consume')"
                >
                  消耗奥德
                </button>
                <button
                  type="button"
                  class="flex-1 px-2 py-2 rounded-xl text-xs font-black transition-all shadow-2xs whitespace-nowrap"
                  :class="
                    activeTab === 'supplement'
                      ? 'bg-[#45a6d5] text-white shadow-md shadow-[#45a6d5]/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  "
                  @click="tabClick('supplement')"
                >
                  游玩补充
                </button>
                <button
                  type="button"
                  class="flex-1 px-2 py-2 rounded-xl text-xs font-black transition-all shadow-2xs whitespace-nowrap"
                  :class="
                    activeTab === 'weeklydaily'
                      ? 'bg-[#45a6d5] text-white shadow-md shadow-[#45a6d5]/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  "
                  @click="tabClick('weeklydaily')"
                >
                  日/周常任务
                </button>
                <button
                  type="button"
                  class="flex-1 px-2 py-2 rounded-xl text-xs font-black transition-all shadow-2xs whitespace-nowrap"
                  :class="
                    activeTab === 'exchange'
                      ? 'bg-[#45a6d5] text-white shadow-md shadow-[#45a6d5]/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  "
                  @click="tabClick('exchange')"
                >
                  周兑换
                </button>
              </div>
            </div>
            <button
              @click="handleCloseGameplay"
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
            >
              关闭
            </button>
          </div>
          <!-- 卡片：consume 消耗奥德-->
          <div
            v-if="gameplayCharForm?.characterId && activeTab == 'consume'"
            class="bg-gradient-to-r from-sky-50 via-white to-sky-50/60 border border-sky-200/80 px-4 py-3 flex items-center justify-between flex-wrap gap-4 shadow-2xs"
          >
            <!-- 左侧：角色基础身份（小号紧凑显示，不抢戏） -->
            <div class="flex items-center flex-wrap gap-2 text-xs">
              <span class="font-black text-slate-800 text-sm">
                {{ gameplayCharForm?.characterName || gameplayCharForm?.name }}
              </span>
              <span
                class="px-1.5 py-0.5 rounded bg-[#45a6d5]/10 text-[#45a6d5] font-bold text-[10px]"
              >
                {{ gameplayCharForm?.className || gameplayCharForm?.class || "未知" }}
              </span>
              <span class="text-slate-300">|</span>
              <span class="text-slate-500 font-bold"
                >Lv.{{ gameplayCharForm?.characterLevel || 1 }}</span
              >
              <span class="text-slate-300">|</span>
              <span class="text-slate-500 font-medium truncate max-w-[100px]">{{
                gameplayCharForm.serverName || "未知"
              }}</span>

              <!-- 特级会员极简标 -->
              <span
                v-if="getCharGroup?.premiumMember"
                class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded"
              >
                已开通特级会员
              </span>
              <span v-else class="text-[10px] font-bold px-1.5 py-0.5 rounded">
                未开通特级会员
              </span>
            </div>

            <!-- 右侧：奥德状态 -->
            <div
              class="flex items-center gap-3 bg-white border border-sky-200/80 px-3.5 py-1.5 rounded-xl shadow-2xs"
            >
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-[#45a6d5] animate-pulse"></div>
                <span class="text-[11px] font-black text-slate-400">奥德</span>
              </div>

              <div class="flex items-center gap-3 text-xs">
                <!-- 奥德 -->
                <div class="flex items-baseline gap-0.5">
                  <strong class="text-sm font-black text-[#45a6d5]">{{
                    gameplayCharForm?.energy || 0
                  }}</strong>
                  （
                  <strong class="text-sm font-black text-amber-600"
                    >+{{ gameplayCharForm?.storedEnergy || 0 }}</strong
                  >）
                  <span class="ext-sm font-black">/ {{ energyLimit }}</span>
                </div>

                <div class="h-3 w-px bg-slate-200"></div>
              </div>
            </div>
          </div>
          <!-- 卡片：supplement 游玩补充--->
          <div
            v-if="gameplayCharForm?.characterId && activeTab === 'supplement'"
            class="bg-gradient-to-r from-sky-50 via-white to-sky-50/60 border border-sky-200/80 px-4 py-3.5 shadow-2xs space-y-3 rounded-2xl"
          >
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div
                v-for="item in summaryItems"
                :key="item.key"
                @click="scrollToSection && scrollToSection(item.key)"
                class="flex flex-col bg-white border border-sky-100/80 p-2.5 rounded-xl shadow-2xs transition-all hover:border-sky-400 hover:shadow-sm cursor-pointer select-none group"
              >
                <!-- 标题 -->
                <span
                  class="text-[10px] font-bold text-slate-400 mb-1 group-hover:text-[#45a6d5] transition-colors"
                >
                  {{ item.label }}
                </span>

                <!-- 数值区 -->
                <div class="flex items-baseline gap-1 text-xs">
                  <!-- 基础值 -->
                  <span class="font-black text-slate-800">
                    {{
                      item.getValue ? item.getValue(gameplayCharForm, getCharGroup) : 0
                    }}
                  </span>

                  <!-- 补充值（仅在有值或大于0时展示，或者安全输出） -->
                  <span :class="['font-black', item.colorClass || 'text-amber-600']">
                    +{{
                      item.getStoredValue
                        ? item.getStoredValue(gameplayCharForm, getCharGroup)
                        : 0
                    }}
                  </span>

                  <!-- 额度上限（如果有） -->
                  <span v-if="item.limit" class="text-[10px] text-slate-400 font-medium">
                    /{{
                      typeof item.limit === "function"
                        ? item.limit(gameplayCharForm, getCharGroup)
                        : item.limit
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 卡片：weeklydaily 周常/日常任务--->
          <template v-if="gameplayCharForm?.characterId && activeTab === 'weeklydaily'">
            <div
              class="mt-3 bg-white border border-slate-200/80 px-4 py-3 shadow-2xs rounded-2xl flex items-center justify-between gap-4 overflow-x-auto text-xs whitespace-nowrap scrollbar-none"
            >
              <!-- 左侧极简标题 -->
              <div
                class="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-100"
              >
                <div class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                <span class="font-black text-slate-700 uppercase tracking-wider"
                  >今日消耗纵览</span
                >
              </div>

              <!-- 右侧精致微型卡片流 -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- 每日使命 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <span class="text-slate-400 font-medium">使命</span>
                  <span class="font-black text-slate-700">
                    {{
                      weeklydailyFormValues.dailyMission
                        ? "已完成"
                        : `${weeklydailyFormValues?.dailyTaskCount || 0}次`
                    }}
                  </span>
                </div>

                <!-- 噩梦 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 border rounded-xl transition-all"
                  :class="
                    validationResult.invalidFields.includes('nightmareCount')
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  "
                >
                  <span class="text-slate-400 font-medium">噩梦</span>
                  <span class="font-black"
                    >-{{ weeklydailyFormValues.nightmareCount || 0 }}</span
                  >
                </div>

                <!-- 觉醒战 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 border rounded-xl transition-all"
                  :class="
                    validationResult.invalidFields.includes('awakening')
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  "
                >
                  <span class="text-slate-400 font-medium">觉醒</span>
                  <span class="font-black"
                    >-{{ weeklydailyFormValues.awakening || 0 }}</span
                  >
                </div>

                <!-- 战场 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 border rounded-xl transition-all"
                  :class="
                    validationResult.invalidFields.includes('battlefield')
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  "
                >
                  <span class="text-slate-400 font-medium">战场</span>
                  <span class="font-black"
                    >-{{ weeklydailyFormValues.battlefield || 0 }}</span
                  >
                </div>

                <!-- 每日副本 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 border rounded-xl transition-all"
                  :class="
                    validationResult.invalidFields.includes('dailyRuns')
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  "
                >
                  <span class="text-slate-400 font-medium">副本</span>
                  <span class="font-black"
                    >-{{ weeklydailyFormValues.dailyRuns || 0 }}</span
                  >
                </div>

                <!-- 古树小游戏 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 border rounded-xl transition-all"
                  :class="
                    validationResult.invalidFields.includes('minigameCount')
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  "
                >
                  <span class="text-slate-400 font-medium">小游戏</span>
                  <span class="font-black"
                    >-{{ weeklydailyFormValues.minigameCount || 0 }}</span
                  >
                </div>

                <!-- 次元袭击 -->
                <div
                  class="flex items-center gap-1.5 px-2.5 py-1 border rounded-xl transition-all"
                  :class="
                    validationResult.invalidFields.includes('dimensionalCount')
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-100 text-slate-700'
                  "
                >
                  <span class="text-slate-400 font-medium">次元</span>
                  <span class="font-black"
                    >-{{ weeklydailyFormValues.dimensionalCount || 0 }}</span
                  >
                </div>
              </div>
            </div>
          </template>

          <!-- 弹窗表单主体 -->
          <div class="p-3 space-y-6 overflow-y-auto custom-scroll flex-1 bg-slate-50/50">
            <!-- 第一个分组：消耗奥德分组内容 -->
            <div v-if="activeTab === 'consume'" class="space-y-6">
              <template
                v-if="gameplayCharForm?.energy > 0 || gameplayCharForm?.storedEnergy > 0"
              >
                <!-- 副本类型与吉纳收益联动配置卡片 -->
                <div
                  class="bg-white border border-slate-200/80 p-3 rounded-3xl space-y-5 shadow-sm"
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
                    <!-- <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-slate-500">
                      基础:
                      <strong class="text-[#45a6d5]">{{
                        gameplayCharForm?.energy || 0
                      }}</strong>
                      / {{ energyLimit }}
                    </span>
                    <span class="text-xs font-bold text-slate-500">
                      存储:
                      <strong class="text-amber-600">{{
                        gameplayCharForm?.storedEnergy || 0
                      }}</strong>
                    </span>
                  </div> -->
                  </div>

                  <!-- 1. 选择副本大类 -->
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500">选择副本类型</label>
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
                  <template
                    v-if="
                      !(
                        consumeForm.dungeonType === 'sanctuary' &&
                        filteredDungeonList[consumeForm.selectedDungeonIndex]?.isFinished
                      )
                    "
                  >
                    <!-- 2. 账号分组共享挑战次数与衰减提示联动 -->
                    <div
                      v-if="consumeForm.dungeonType !== 'sanctuary'"
                      class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2"
                    >
                      <div class="flex items-center justify-between">
                        <label
                          class="text-xs font-black text-slate-700 flex items-center gap-2"
                        >
                          <span>
                            {{
                              consumeForm.dungeonType === "expedition"
                                ? "远征副本"
                                : "超越副本"
                            }}
                            分组共享本周已挑战次数
                          </span>
                          <span class="text-[10px] font-bold text-slate-400"
                            >（同组账号共享）</span
                          >
                        </label>
                        <span
                          class="text-[10px] font-black px-2.5 py-0.5 rounded-full"
                          :class="
                            currentDecayRate < 1
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          "
                        >
                          当前收益率:
                          {{ currentDecayRate * 100 }}%
                        </span>
                      </div>

                      <div class="flex items-center justify-between pt-1">
                        <div class="text-xs font-bold text-slate-600">
                          该组账号下累计通关:
                          <strong class="text-sm font-black text-[#45a6d5]">{{
                            currentActiveRuns
                          }}</strong>
                          次
                        </div>
                        <div class="text-[11px] font-bold text-slate-500">
                          当前衰减阶梯:
                          <span class="text-amber-600 font-black">{{
                            currentDecayRuleLabel
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 3. 选择具体副本 -->
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500">选择具体副本</label>
                      <select
                        v-model="consumeForm.selectedDungeonIndex"
                        class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#45a6d5] outline-none font-bold text-xs text-slate-800 transition-all"
                      >
                        <option
                          v-if="filteredDungeonList.length === 0"
                          :value="null"
                          disabled
                        >
                          暂无可选副本
                        </option>

                        <option
                          v-for="(item, index) in filteredDungeonList"
                          :key="item.key || index"
                          :value="index"
                          :disabled="item.isFinished"
                        >
                          {{ "⭐".repeat(item.stars) }}
                          - {{ item.name }}
                          {{
                            consumeForm.value?.dungeonType === "sanctuary"
                              ? `(已消耗: ${item.currentRuns}/${item.maxLimit})${
                                  item.isFinished ? " 【已打完】" : ""
                                }`
                              : ""
                          }}
                        </option>
                      </select>
                    </div>
                    <!-- 4. 选择难度 / 阶段 -->
                    <div
                      class="space-y-3"
                      v-if="
                        !(
                          consumeForm.dungeonType === 'sanctuary' &&
                          filteredDungeonList[consumeForm.selectedDungeonIndex]
                            ?.isFinished
                        )
                      "
                    >
                      <label class="text-xs font-bold text-slate-500"
                        >选择难度 / 阶段</label
                      >

                      <div class="grid grid-cols-2 gap-2">
                        <button
                          v-for="(diff, idx) in currentDifficultiesList"
                          :key="idx"
                          type="button"
                          class="py-2.5 px-3 rounded-xl font-black text-xs transition-all border text-center flex flex-col items-center justify-center gap-0.5"
                          :class="
                            consumeForm.selectedDiffIndex === idx
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          "
                          @click="consumeForm.selectedDiffIndex = idx"
                        >
                          <span>{{ diff.mode }}</span>
                          <span class="text-[10px] opacity-80">
                            (基础耗能:
                            {{ diff.energy }})
                          </span>
                        </button>
                      </div>
                    </div>

                    <!-- 5. 消耗模式 / 档位选择（非会员锁定单倍，会员可在“单倍/双倍”中切换选择） -->
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-500"
                          >消耗与奖励档位</span
                        >
                        <span class="text-xs font-black text-amber-600">
                          最终消耗奥德:
                          {{ calculatedEnergyCost }}
                          点
                        </span>
                      </div>

                      <!-- 档位选择按钮组 -->
                      <div class="grid grid-cols-2 gap-2">
                        <!-- 档位 1：标准单倍（非会员固定选这个，会员也可以主动选它来省奥德） -->
                        <button
                          type="button"
                          class="py-2.5 px-3 rounded-xl font-bold text-xs transition-all border text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                          :class="
                            consumeForm.useDoubleEnergy === false
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          "
                          @click="consumeForm.useDoubleEnergy = false"
                        >
                          <span>标准单倍消耗</span>
                          <span class="text-[10px] opacity-80">
                            耗能
                            {{ currentSelectedDiff?.energy || 0 }}
                          </span>
                        </button>

                        <!-- 档位 2：会员双倍（仅会员可选，非会员置灰加锁提示） -->
                        <button
                          type="button"
                          :disabled="!getCharGroup?.premiumMember"
                          class="py-2.5 px-3 rounded-xl font-bold text-xs transition-all border text-center flex flex-col items-center justify-center gap-0.5"
                          :class="[
                            !getCharGroup?.premiumMember
                              ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : consumeForm.useDoubleEnergy !== false
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm cursor-pointer'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer',
                          ]"
                          @click="
                            getCharGroup?.premiumMember &&
                              (consumeForm.useDoubleEnergy = true)
                          "
                        >
                          <span>
                            双倍消耗
                            <span
                              v-if="!getCharGroup?.premiumMember"
                              class="text-[9px] font-normal opacity-75"
                              >(需会员)</span
                            >
                          </span>
                          <span class="text-[10px] opacity-80">
                            耗能
                            {{ (currentSelectedDiff?.energy || 0) * 2 }}
                          </span>
                        </button>
                      </div>
                    </div>

                    <!-- 6. 收益面板展示（受挑战次数衰减影响，且单倍基础消耗对应减半收益） -->
                    <div
                      class="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-2"
                    >
                      <div
                        class="text-xs font-black text-amber-800 flex items-center justify-between"
                      >
                        <span>
                          预计吉纳总收益 (已乘衰减
                          {{ currentDecayRate * 100 }}%):
                        </span>
                        <span class="text-sm font-black text-amber-700">
                          {{ calculatedTotalGain }} 万
                        </span>
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
                  </template>
                </div>
              </template>
              <template v-else>
                <!-- 能量不足占位符 -->
                <div
                  class="p-8 bg-slate-50/70 border border-slate-200/80 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-inner"
                >
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
                  <div class="space-y-1">
                    <div class="text-sm font-black text-slate-700">
                      当前角色奥德能量不足
                    </div>
                    <div class="text-xs font-bold text-slate-400">
                      请先前往“奥德存储补充”配置能量后，再进行副本消耗计算
                    </div>
                  </div>
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
            <template v-if="activeTab === 'supplement' && gameplayCharForm?.characterId">
              <!-- 奥德存储补充配置卡片 -->
              <div
                class="p-3 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all"
                ref="energySection"
                :class="
                  validationResult.invalidFields.includes('storedEnergy')
                    ? 'border-red-500 bg-red-50/20'
                    : 'border-slate-200/80'
                "
              >
                <!-- 顶栏标题 -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <div
                      class="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"
                    >
                      奥德存储补充
                      <span
                        class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
                        :class="{
                          'bg-[#45a6d5]/10 text-[#45a6d5]':
                            2000 - totalsStoredEnergyCount > 200,
                          'bg-amber-500/10 text-amber-600':
                            2000 - totalsStoredEnergyCount <= 200 &&
                            2000 - totalsStoredEnergyCount > 0,
                          'bg-rose-500/10 text-rose-600 animate-pulse':
                            2000 - totalsStoredEnergyCount <= 0,
                        }"
                      >
                        {{
                          2000 - totalsStoredEnergyCount > 0
                            ? `可补充 ${2000 - totalsStoredEnergyCount} 点`
                            : "已经满了不可补充"
                        }}
                      </span>
                    </div>

                    <span
                      v-if="validationResult.invalidFields.includes('storedEnergy')"
                      class="text-[10px] text-red-500 font-bold"
                    >
                      {{ validationResult.errors.storedEnergy }}
                    </span>
                  </div>
                  <!-- 存储上限提示 -->
                  <span class="text-[10px] font-bold text-slate-400">
                    存储上限: 2000 点
                  </span>
                </div>

                <!-- 🌟 核心凸显区：当前基础奥德 & 当前已补充存储奥德 -->
                <div
                  class="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/70 rounded-2xl"
                >
                  <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-slate-400">当前基础奥德</span>
                    <span class="text-lg font-black text-slate-800 mt-0.5">
                      {{ gameplayCharForm.energy || 0 }}
                      <span class="text-xs font-bold text-slate-400">点</span>
                    </span>
                  </div>
                  <div class="flex flex-col border-l border-slate-200/80 pl-3">
                    <span class="text-[10px] font-bold text-slate-400"
                      >当前已补充奥德</span
                    >
                    <span class="text-lg font-black text-indigo-600 mt-0.5">
                      {{ gameplayCharForm.storedEnergy || 0 }}
                      <span class="text-xs font-bold text-indigo-400">点</span>
                    </span>
                  </div>
                </div>
        <div class="grid grid-cols-2 gap-4">
                      <!-- 基础奥德能量 -->
                      <div>
                        <div class="flex items-center justify-between mb-1.5">
                          <label class="text-xs font-bold text-slate-500">当前能量</label>
                          <span class="text-[10px] font-black text-[#45a6d5]">
                            {{ gameplayCharForm?.energy || 0 }}
                            <!-- ({{
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
                            }} -->
                          </span>
                        </div>
                        <input
                          v-model.number="gameplayCharForm.energy"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('energy')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-[#45a6d5]'
                          "
                        />
                        <!-- <span
                          v-if="validationResult.errors.energy"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors.energy }}
                        </span> -->
                      </div>

                      <!-- 存储补充能量 -->
                      <div>
                        <div class="flex items-center justify-between mb-1.5">
                          <label class="text-xs font-bold text-slate-500"
                            >存储补充能量</label
                          >
                          <span class="text-[10px] font-black text-amber-600">
                            {{ gameplayCharForm.storedEnergy || 0 }}
                            ({{ Math.max(0, 2000 - (gameplayCharForm.storedEnergy || 0)) }}) /
                            2000
                          </span>
                        </div>
                        <input
                          v-model.number="gameplayCharForm.storedEnergy"
                          class="w-full px-4 py-2.5 rounded-xl bg-white border-2 outline-none font-bold text-sm text-slate-800 transition-all shadow-sm"
                          :class="
                            validationResult.invalidFields.includes('storedEnergy')
                              ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                              : 'border-slate-200/80 focus:border-[#45a6d5]'
                          "
                        />
                        <!-- <span
                          v-if="validationResult.errors.storedEnergy"
                          class="text-[10px] text-red-500 font-bold mt-1 block"
                        >
                          {{ validationResult.errors.storedEnergy }}
                        </span> -->
                      </div>
                    </div>
                <!-- 计数器操作区域 -->
                <div
                  class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
                >
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
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="handleUpdateOdCount('big', -1)"
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.bigOdCount"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="handleUpdateOdCount('big', 1)"
                          :disabled="totalsStoredEnergyCount > 2000"
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
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="handleUpdateOdCount('small', -1)"
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.smallOdCount"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="handleUpdateOdCount('small', 1)"
                          :disabled="totalsStoredEnergyCount > 2000"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 🌟 底部结算实时显示：本次操作补充量 & 补充后最终总量 -->
                  <div
                    class="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                  >
                    <span class="font-bold text-slate-500">
                      已选:
                      <strong class="text-slate-800"
                        >{{
                          (supplementFormValues.bigOdCount || 0) +
                          (supplementFormValues.smallOdCount || 0)
                        }}
                        个</strong
                      >
                      | 本次增加:
                      <strong class="text-indigo-600"
                        >+{{ totalSupplementPoints }} 点</strong
                      >
                    </span>
                    <span class="font-bold text-slate-500">
                      奥德补充总计:
                      <strong
                        class="text-sm font-black"
                        :class="
                          (gameplayCharForm.storedEnergy || 0) + totalSupplementPoints >
                          2000
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        "
                      >
                        <!-- {{ (gameplayCharForm.storedEnergy || 0) + totalSupplementPoints }} -->
                        {{ totalsStoredEnergyCount }} / 2000 点
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-stretch">
                <!-- 噩梦补充卡片 -->
                <div
                  class="p-4 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all md:col-span-3 h-full flex flex-col"
                  ref="nightmareSection"
                  :class="
                    validationResult.invalidFields.includes('storedNightmareCount')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <!-- 顶栏标题 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-purple-500"></div>

                      <div class="flex items-center justify-between">
                        <!-- 标题与动态提示 -->
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"
                        >
                          <span>噩梦补充</span>
                          <span
                            class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
                            :class="{
                              'bg-[#45a6d5]/10 text-[#45a6d5]':
                                30 - totalsToredNightmareCountRuns > 5,
                              'bg-amber-500/10 text-amber-600':
                                30 - totalsToredNightmareCountRuns <= 5 &&
                                30 - totalsToredNightmareCountRuns > 0,
                              'bg-rose-500/10 text-rose-600 animate-pulse':
                                30 - totalsToredNightmareCountRuns <= 0,
                            }"
                          >
                            {{
                              30 - totalsToredNightmareCountRuns > 0
                                ? `可补充 ${30 - totalsToredNightmareCountRuns} 次`
                                : "不可补充"
                            }}
                          </span>
                        </div>
                      </div>

                      <span
                        v-if="
                          validationResult.invalidFields.includes('storedNightmareCount')
                        "
                        class="text-[10px] text-red-500 font-bold"
                      >
                        {{ validationResult.errors.storedNightmareCount }}
                      </span>
                    </div>
                    <!-- 提示标签 -->
                    <span class="text-[10px] font-bold text-slate-400">
                      角色总上限：30次
                    </span>
                  </div>

                  <!-- 计数器操作区域 -->
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
                  >
                    <div
                      class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-600"
                      >
                        <span>噩梦次数补充 (每次增加 1 次)</span>
                        <span class="text-purple-600 font-black"
                          >+{{ supplementFormValues.storedNightmareCount || 0 }} 次</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedNightmareCount = Math.max(
                              0,
                              (supplementFormValues.storedNightmareCount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.storedNightmareCount"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedNightmareCount =
                              (supplementFormValues.storedNightmareCount || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- 🌟 底部结算实时显示：单角色统计 -->
                    <div
                      class="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                    >
                      <span class="font-bold text-slate-500">
                        当前角色噩梦补充:
                        <strongg class="text-purple-600"
                          >+{{
                            supplementFormValues.storedNightmareCount || 0
                          }}
                          次</strongg
                        >
                      </span>
                      <span class="font-bold text-slate-500">
                        噩梦补充总计:
                        <strong class="text-sm font-black text-purple-600">
                          {{ totalsToredNightmareCountRuns }}
                          / 30 次
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 觉醒战补充卡片 -->
                <div
                  class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all md:col-span-3 h-full flex flex-col"
                  ref="awakeningSection"
                  :class="
                    validationResult.invalidFields.includes('storedAwakening')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <!-- 顶栏标题 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-purple-500"></div>

                      <div class="flex items-center justify-between">
                        <!-- 标题与动态提示 -->
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"
                        >
                          <span>觉醒战补充</span>
                          <span
                            class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
                            :class="{
                              'bg-[#45a6d5]/10 text-[#45a6d5]':
                                30 - totalStoredAwakeningRuns > 5,
                              'bg-amber-500/10 text-amber-600':
                                30 - totalStoredAwakeningRuns <= 5 &&
                                30 - totalStoredAwakeningRuns > 0,
                              'bg-rose-500/10 text-rose-600 animate-pulse':
                                30 - totalStoredAwakeningRuns <= 0,
                            }"
                          >
                            {{
                              30 - totalStoredAwakeningRuns > 0
                                ? `可补充 ${30 - totalStoredAwakeningRuns} 次`
                                : "不可补充"
                            }}
                          </span>
                        </div>
                      </div>

                      <span
                        v-if="validationResult.invalidFields.includes('storedAwakening')"
                        class="text-[10px] text-red-500 font-bold"
                      >
                        {{ validationResult.errors.storedAwakening }}
                      </span>
                    </div>
                    <!-- 提示标签 -->
                    <span class="text-[10px] font-bold text-slate-400">
                      角色总上限：30次
                    </span>
                  </div>

                  <!-- 计数器操作区域 -->
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
                  >
                    <div
                      class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-600"
                      >
                        <span>觉醒战次数补充 (每次增加 1 次)</span>
                        <span class="text-purple-600 font-black"
                          >+{{ supplementFormValues.storedAwakening || 0 }} 次</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedAwakening = Math.max(
                              0,
                              (supplementFormValues.storedAwakening || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.storedAwakening"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedAwakening =
                              (supplementFormValues.storedAwakening || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- 🌟 底部结算实时显示：单角色统计 -->
                    <div
                      class="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                    >
                      <span class="font-bold text-slate-500">
                        当前角色觉醒战补充:
                        <strong class="text-purple-600"
                          >+{{ supplementFormValues.storedAwakening || 0 }} 次</strong
                        >
                      </span>
                      <span class="font-bold text-slate-500">
                        觉醒战补充总计:
                        <strong class="text-sm font-black text-purple-600">
                          {{ totalStoredAwakeningRuns }}
                          / 30 次
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 每日副本补充卡片 -->
                <div
                  class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all md:col-span-3 h-full flex flex-col"
                  ref="dailyRunsSection"
                  :class="
                    validationResult.invalidFields.includes('storedDailyRuns')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <!-- 顶栏标题 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div class="flex items-center justify-between">
                        <!-- 标题与动态剩余提示 -->
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"
                        >
                          <span>每日副本补充</span>
                          <span
                            class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
                            :class="{
                              'bg-[#45a6d5]/10 text-[#45a6d5]':
                                30 - totalGroupStoredDailyRuns > 5,
                              'bg-amber-500/10 text-amber-600':
                                30 - totalGroupStoredDailyRuns <= 5 &&
                                30 - totalGroupStoredDailyRuns > 0,
                              'bg-rose-500/10 text-rose-600 animate-pulse':
                                30 - totalGroupStoredDailyRuns <= 0,
                            }"
                          >
                            {{
                              30 - totalGroupStoredDailyRuns > 0
                                ? `该账号可补充 ${30 - totalGroupStoredDailyRuns} 次`
                                : "已耗尽不可补充"
                            }}
                          </span>
                        </div>
                      </div>

                      <span
                        v-if="validationResult.invalidFields.includes('storedDailyRuns')"
                        class="text-[10px] text-red-500 font-bold"
                      >
                        {{ validationResult.errors.storedDailyRuns }}
                      </span>
                    </div>
                    <!-- 存储上限提示 -->

                    <span class="text-[10px] font-bold text-slate-400">
                      组内总上限: 30 次
                    </span>
                  </div>

                  <!-- 计数器操作区域 -->
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
                  >
                    <div
                      class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-600"
                      >
                        <span>每日副本卷 (每次增加 1 次)</span>
                        <span class="text-amber-600 font-black"
                          >+{{ supplementFormValues.storedDailyRuns || 0 }} 次</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedDailyRuns = Math.max(
                              0,
                              (supplementFormValues.storedDailyRuns || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.storedDailyRuns"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedDailyRuns =
                              (supplementFormValues.storedDailyRuns || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- 🌟 底部结算实时显示：组内共享统计 -->
                    <div
                      class="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                    >
                      <span class="font-bold text-slate-500">
                        当前角色本次增加:
                        <strong class="text-amber-600"
                          >+{{ supplementFormValues.storedDailyRuns || 0 }} 次</strong
                        >
                      </span>
                      <span class="font-bold text-slate-500">
                        该账号下每日副本补充总计:
                        <strong
                          class="text-sm font-black"
                          :class="
                            totalGroupStoredDailyRuns > 30
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          "
                        >
                          {{ totalGroupStoredDailyRuns }}
                          / 30 次
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 古树庆典小游戏补充卡片 -->
                <div
                  class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all md:col-span-3 h-full flex flex-col"
                  ref="minigameSection"
                  :class="
                    validationResult.invalidFields.includes('storedMinigameCount')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <!-- 顶栏标题 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>

                      <div class="flex items-center justify-between">
                        <!-- 标题与动态剩余提示 -->
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"
                        >
                          <span>古树庆典补充</span>
                          <span
                            class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
                            :class="{
                              'bg-[#45a6d5]/10 text-[#45a6d5]':
                                30 - totalGroupStoredMinigameCount > 5,
                              'bg-amber-500/10 text-amber-600':
                                30 - totalGroupStoredMinigameCount <= 5 &&
                                30 - totalGroupStoredMinigameCount > 0,
                              'bg-rose-500/10 text-rose-600 animate-pulse':
                                30 - totalGroupStoredMinigameCount <= 0,
                            }"
                          >
                            {{
                              30 - totalGroupStoredMinigameCount > 0
                                ? `该账号可补充 ${30 - totalGroupStoredMinigameCount} 次`
                                : "已耗尽不可补充"
                            }}
                          </span>
                        </div>
                      </div>

                      <span
                        v-if="
                          validationResult.invalidFields.includes('storedMinigameCount')
                        "
                        class="text-[10px] text-red-500 font-bold"
                      >
                        {{ validationResult.errors.storedMinigameCount }}
                      </span>
                    </div>
                    <!-- 存储上限提示 -->
                    <span class="text-[10px] font-bold text-slate-400">
                      组内总上限: 30 次
                    </span>
                  </div>

                  <!-- 计数器操作区域 -->
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
                  >
                    <div
                      class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-600"
                      >
                        <span>古树庆典补充 (每次增加 1 次)</span>
                        <span class="text-amber-600 font-black"
                          >+{{ supplementFormValues.storedMinigameCount || 0 }} 次</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedMinigameCount = Math.max(
                              0,
                              (supplementFormValues.storedMinigameCount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.storedMinigameCount"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedMinigameCount =
                              (supplementFormValues.storedMinigameCount || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- 🌟 底部结算实时显示：组内共享统计 -->
                    <div
                      class="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                    >
                      <span class="font-bold text-slate-500">
                        当前角色本次增加:
                        <strong class="text-amber-600"
                          >+{{ supplementFormValues.storedMinigameCount || 0 }} 次</strong
                        >
                      </span>
                      <span class="font-bold text-slate-500">
                        该账号下古树庆典小游戏补充总计:
                        <strong
                          class="text-sm font-black"
                          :class="
                            totalGroupStoredMinigameCount > 30
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          "
                        >
                          {{ totalGroupStoredMinigameCount }}
                          / 30 次
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 次元袭击补充卡片 -->
                <div
                  class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all md:col-span-3 h-full flex flex-col"
                  ref="dimensionalSection"
                  :class="
                    validationResult.invalidFields.includes('storedDimensionalCount')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <!-- 顶栏标题 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>

                      <div class="flex items-center justify-between">
                        <!-- 标题与动态剩余提示 -->
                        <div
                          class="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2"
                        >
                          <span>次元袭击补充</span>
                          <span
                            class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
                            :class="{
                              'bg-[#45a6d5]/10 text-[#45a6d5]':
                                30 - totalGroupStoredDimensionalCount > 5,
                              'bg-amber-500/10 text-amber-600':
                                30 - totalGroupStoredDimensionalCount <= 5 &&
                                30 - totalGroupStoredDimensionalCount > 0,
                              'bg-rose-500/10 text-rose-600 animate-pulse':
                                30 - totalGroupStoredDimensionalCount <= 0,
                            }"
                          >
                            {{
                              30 - totalGroupStoredDimensionalCount > 0
                                ? `该账号可补充 ${
                                    30 - totalGroupStoredDimensionalCount
                                  } 次`
                                : "已耗尽不可补充"
                            }}
                          </span>
                        </div>
                      </div>

                      <span
                        v-if="
                          validationResult.invalidFields.includes(
                            'storedDimensionalCount'
                          )
                        "
                        class="text-[10px] text-red-500 font-bold"
                      >
                        {{ validationResult.errors.storedDimensionalCount }}
                      </span>
                    </div>
                    <!-- 存储上限提示 -->
                    <span class="text-[10px] font-bold text-slate-400">
                      组内总上限: 30 次
                    </span>
                  </div>

                  <!-- 计数器操作区域 -->
                  <div
                    class="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4"
                  >
                    <div
                      class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-600"
                      >
                        <span>次元袭击补充 (每次增加 1 次)</span>
                        <span class="text-amber-600 font-black"
                          >+{{
                            supplementFormValues.storedDimensionalCount || 0
                          }}
                          次</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedDimensionalCount = Math.max(
                              0,
                              (supplementFormValues.storedDimensionalCount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.storedDimensionalCount"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            supplementFormValues.storedDimensionalCount =
                              (supplementFormValues.storedDimensionalCount || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <!-- 🌟 底部结算实时显示：组内共享统计 -->
                    <div
                      class="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                    >
                      <span class="font-bold text-slate-500">
                        当前角色本次增加:
                        <strong class="text-amber-600"
                          >+{{
                            supplementFormValues.storedDimensionalCount || 0
                          }}
                          次</strong
                        >
                      </span>
                      <span class="font-bold text-slate-500">
                        该账号下次元袭击补充总计:
                        <strong
                          class="text-sm font-black"
                          :class="
                            totalGroupStoredDimensionalCount > 30
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          "
                        >
                          {{ totalGroupStoredDimensionalCount }}
                          / 30 次
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 卡片：weeklydaily 日/周常任务 -->
            <div
              v-if="gameplayCharForm?.characterId && activeTab == 'weeklydaily'"
              class="space-y-6"
            >
              <!-- ================= 独立高频每日任务中心 ================= -->
              <div
                class="w-full group relative overflow-hidden p-5 border rounded-3xl transition-all duration-300 shadow-xs"
                :class="
                  gameplayCharForm.dailyMission
                    ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30'
                    : 'bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border-sky-500/20 hover:border-sky-500/40'
                "
              >
                <!-- 背景装饰光晕：根据完成状态动态变色 -->
                <div
                  class="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"
                  :class="
                    gameplayCharForm.dailyMission ? 'bg-emerald-500/10' : 'bg-sky-500/10'
                  "
                ></div>

                <div
                  class="relative flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
                >
                  <!-- 左侧：图标与文本说明 -->
                  <div class="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transform group-hover:-rotate-6 transition-transform duration-300"
                      :class="
                        gameplayCharForm.dailyMission
                          ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-emerald-500/30'
                          : 'bg-gradient-to-tr from-sky-600 to-sky-400 shadow-sky-500/30'
                      "
                    >
                      <!-- 动态图标：未完成时显示时钟，已完成时显示对勾 -->
                      <svg
                        v-if="!gameplayCharForm.dailyMission"
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <!-- 文本信息：标题与副标题 -->
                    <div class="space-y-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <h3
                          class="text-xs font-black tracking-wide uppercase text-slate-800 truncate"
                        >
                          日常每日使命任务
                        </h3>
                        <span
                          v-if="gameplayCharForm.dailyMission"
                          class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 shrink-0"
                        >
                          今日已达成
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 右侧动态控制区：已完成 vs 未完成操作面板 -->
                  <div class="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                    <!-- 状态 A：已完成时的专属优雅占位样式（无输入框与按钮） -->
                    <template v-if="gameplayCharForm.dailyMission">
                      <div
                        class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 border border-emerald-500/20 text-xs font-black text-emerald-700 shadow-2xs"
                      >
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>已完成 (5/5)</span>
                      </div>
                    </template>

                    <!-- 状态 B：未完成时的步进器与快捷拉满操作区 -->
                    <template v-else>
                      <!-- 进度文字提示 -->
                      <div
                        class="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 border border-sky-500/20 text-[11px] font-bold text-sky-700 shadow-2xs"
                      >
                        <span
                          class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"
                        ></span>
                        <span
                          >已完成 {{ weeklydailyFormValues.dailyTaskCount || 0 }} /
                          5</span
                        >
                      </div>

                      <!-- 步进器按钮组 -->
                      <div
                        class="flex items-center gap-1.5 bg-white/90 p-1.5 border border-sky-500/20 rounded-2xl shadow-2xs"
                      >
                        <button
                          type="button"
                          class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            weeklydailyFormValues.dailyTaskCount = Math.max(
                              0,
                              (weeklydailyFormValues.dailyTaskCount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>

                        <input
                          v-model.number="weeklydailyFormValues.dailyTaskCount"
                          min="0"
                          max="5"
                          class="w-9 text-center font-black text-xs text-sky-700 bg-transparent outline-none"
                        />

                        <button
                          type="button"
                          class="w-7 h-7 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer"
                          @click="
                            weeklydailyFormValues.dailyTaskCount = Math.min(
                              5,
                              (weeklydailyFormValues.dailyTaskCount || 0) + 1
                            )
                          "
                        >
                          +
                        </button>
                      </div>

                      <!-- 一键拉满快捷按钮 -->
                      <button
                        type="button"
                        class="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md shadow-sky-600/25 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                        @click="
                          weeklydailyFormValues.dailyTaskCount = 5;
                          weeklydailyFormValues.dailyMission = true;
                        "
                      >
                        <span>拉满</span>
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <!-- ================= 3. 噩梦、觉醒战、战场消耗（一行三列布局） ================= -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- ================= 噩梦消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="nightmareSection"
                  :class="
                    validationResult.invalidFields.includes('nightmareCount')
                      ? 'border-red-500 bg-red-50/20'
                      : ''
                  "
                >
                  <template
                    v-if="
                      (gameplayCharForm?.nightmareCount || 0) +
                        (gameplayCharForm?.storedNightmareCount || 0) >
                      0
                    "
                  >
                    <!-- 头部：标题与状态/报错展示 -->
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50 animate-pulse"
                        ></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-800"
                        >
                          <span>噩梦消耗</span>
                        </div>
                      </div>

                      <!-- 动态错误提示或剩余次数 Badge -->
                      <span
                        v-if="validationResult.invalidFields.includes('nightmareCount')"
                        class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200"
                      >
                        {{ validationResult.errors.nightmareCount }}
                      </span>
                      <span
                        v-else
                        class="text-[10px] px-2.5 py-1 rounded-full font-black bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs"
                      >
                        剩余可消耗: {{ totalsRemainingNightmareCountRuns || 0 }}
                      </span>
                    </div>

                    <!-- 中部：计数输入与快捷操作区 -->
                    <div class="space-y-3 flex-1 flex flex-col justify-between">
                      <!-- 主操作面板 -->
                      <div
                        class="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2.5"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5"
                        >
                          <span>角色消耗次数</span>
                          <span class="text-purple-600 font-black text-xs"
                            >-{{ weeklydailyFormValues.nightmareCount || 0 }}</span
                          >
                        </div>

                        <!-- 步进器输入行 -->
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.nightmareCount = Math.max(
                                0,
                                (weeklydailyFormValues.nightmareCount || 0) - 1
                              )
                            "
                          >
                            -
                          </button>

                          <input
                            v-model.number="weeklydailyFormValues.nightmareCount"
                            type="number"
                            min="0"
                            class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-purple-400 transition-all"
                          />

                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.nightmareCount =
                                (weeklydailyFormValues.nightmareCount || 0) + 1
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- 底部：快捷填充操作按钮 -->
                      <div class="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          class="py-2 px-2 bg-slate-50 hover:bg-purple-50 active:scale-98 border border-slate-200/80 hover:border-purple-200 rounded-xl text-slate-700 hover:text-purple-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center gap-1"
                          @click="weeklydailyFormValues.nightmareCount += 2"
                        >
                          <span class="text-purple-500 font-black">+</span> 增加 2 次
                        </button>

                        <button
                          type="button"
                          class="py-2 px-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-purple-600/25 rounded-xl flex items-center justify-center truncate"
                          @click="
                            weeklydailyFormValues.nightmareCount +=
                              totalsRemainingNightmareCountRuns || 0
                          "
                        >
                          全部 ({{ totalsRemainingNightmareCountRuns || 0 }})
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-400"
                        >
                          <span>噩梦消耗</span>
                        </div>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-400"
                      >
                        无可用
                      </span>
                    </div>

                    <!-- 内部居中的精致空状态面板 -->
                    <div
                      class="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs"
                      >
                        —
                      </div>
                      <p class="text-xs font-bold text-slate-400">暂无可消耗的次数</p>
                    </div>
                  </template>
                </div>

                <!-- ================= 觉醒战消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="awakeningSection"
                  :class="
                    validationResult.invalidFields.includes('awakening')
                      ? 'border-red-500 bg-red-50/20'
                      : ''
                  "
                >
                  <template
                    v-if="
                      (gameplayCharForm?.awakening || 0) +
                        (gameplayCharForm?.storedAwakening || 0) >
                      0
                    "
                  >
                    <!-- 头部：标题与状态/报错展示 -->
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50 animate-pulse"
                        ></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-800"
                        >
                          <span>觉醒战消耗</span>
                        </div>
                      </div>

                      <!-- 动态错误提示或剩余次数 Badge -->
                      <span
                        v-if="validationResult.invalidFields.includes('awakening')"
                        class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200"
                      >
                        {{ validationResult.errors.awakening }}
                      </span>
                      <span
                        v-else
                        class="text-[10px] px-2.5 py-1 rounded-full font-black bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs"
                      >
                        剩余可消耗: {{ totalsRemainingAwakeningCountRuns || 0 }}
                      </span>
                    </div>

                    <!-- 中部：计数输入与快捷操作区 -->
                    <div class="space-y-3 flex-1 flex flex-col justify-between">
                      <!-- 主操作面板 -->
                      <div
                        class="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2.5"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5"
                        >
                          <span>角色消耗次数</span>
                          <span class="text-purple-600 font-black text-xs"
                            >-{{ weeklydailyFormValues.awakening || 0 }}</span
                          >
                        </div>

                        <!-- 步进器输入行 -->
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.awakening = Math.max(
                                0,
                                (weeklydailyFormValues.awakening || 0) - 1
                              )
                            "
                          >
                            -
                          </button>

                          <input
                            v-model.number="weeklydailyFormValues.awakening"
                            type="number"
                            min="0"
                            class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-purple-400 transition-all"
                          />

                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.awakening =
                                (weeklydailyFormValues.awakening || 0) + 1
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- 底部：快捷填充操作按钮 -->
                      <div class="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          class="py-2 px-2 bg-slate-50 hover:bg-purple-50 active:scale-98 border border-slate-200/80 hover:border-purple-200 rounded-xl text-slate-700 hover:text-purple-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center gap-1"
                          @click="weeklydailyFormValues.awakening += 2"
                        >
                          <span class="text-purple-500 font-black">+</span> 增加 2 次
                        </button>

                        <button
                          type="button"
                          class="py-2 px-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-purple-600/25 rounded-xl flex items-center justify-center truncate"
                          @click="
                            weeklydailyFormValues.awakening +=
                              totalsRemainingAwakeningCountRuns || 0
                          "
                        >
                          全部 ({{ totalsRemainingAwakeningCountRuns || 0 }})
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-400"
                        >
                          <span>觉醒战消耗次数</span>
                        </div>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-400"
                      >
                        无可用
                      </span>
                    </div>

                    <!-- 内部居中的精致空状态面板 -->
                    <div
                      class="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs"
                      >
                        —
                      </div>
                      <p class="text-xs font-bold text-slate-400">暂无可消耗的次数</p>
                    </div>
                  </template>
                </div>

                <!-- ================= 战场消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="battlefieldSection"
                  :class="
                    validationResult.invalidFields.includes('battlefield')
                      ? 'border-red-500 bg-red-50/20'
                      : ''
                  "
                >
                  <template v-if="(gameplayCharForm?.battlefield || 0) > 0">
                    <!-- 头部：标题与状态/报错展示 -->
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div
                          class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50 animate-pulse"
                        ></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-800"
                        >
                          <span>战场消耗</span>
                        </div>
                      </div>

                      <!-- 动态错误提示或剩余次数 Badge -->
                      <span
                        v-if="validationResult.invalidFields.includes('battlefield')"
                        class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200"
                      >
                        {{ validationResult.errors.battlefield }}
                      </span>
                      <span
                        v-else
                        class="text-[10px] px-2.5 py-1 rounded-full font-black bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs"
                      >
                        剩余可消耗:
                        {{
                          (gameplayCharForm?.battlefield || 0) -
                          (weeklydailyFormValues?.battlefield || 0)
                        }}
                      </span>
                    </div>

                    <!-- 中部：计数输入与快捷操作区 -->
                    <div class="space-y-3 flex-1 flex flex-col justify-between">
                      <!-- 主操作面板 -->
                      <div
                        class="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2.5"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5"
                        >
                          <span>角色消耗次数</span>
                          <span class="text-purple-600 font-black text-xs"
                            >-{{ weeklydailyFormValues.battlefield || 0 }}</span
                          >
                        </div>

                        <!-- 步进器输入行 -->
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.battlefield = Math.max(
                                0,
                                (weeklydailyFormValues.battlefield || 0) - 1
                              )
                            "
                          >
                            -
                          </button>

                          <input
                            v-model.number="weeklydailyFormValues.battlefield"
                            type="number"
                            min="0"
                            class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-purple-400 transition-all"
                          />

                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.battlefield =
                                (weeklydailyFormValues.battlefield || 0) + 1
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- 底部：快捷填充操作按钮 -->
                      <div class="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          class="py-2 px-2 bg-slate-50 hover:bg-purple-50 active:scale-98 border border-slate-200/80 hover:border-purple-200 rounded-xl text-slate-700 hover:text-purple-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center gap-1"
                          @click="weeklydailyFormValues.battlefield += 2"
                        >
                          <span class="text-purple-500 font-black">+</span> 增加 2 次
                        </button>

                        <button
                          type="button"
                          class="py-2 px-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-purple-600/25 rounded-xl flex items-center justify-center truncate"
                          @click="
                            weeklydailyFormValues.battlefield +=
                              gameplayCharForm.battlefield || 0
                          "
                        >
                          全部 ({{ gameplayCharForm.battlefield || 0 }})
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-400"
                        >
                          <span>战场消耗</span>
                        </div>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-400"
                      >
                        无可用
                      </span>
                    </div>

                    <!-- 内部居中的精致空状态面板 -->
                    <div
                      class="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs"
                      >
                        —
                      </div>
                      <p class="text-xs font-bold text-slate-400">暂无可消耗的次数</p>
                    </div>
                  </template>
                </div>
              </div>

              <!-- ================= 4. 每日副本、古树庆典、次元袭击（一行三列布局） ================= -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- ================= 每日副本消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="dailyRunsSection"
                  :class="
                    validationResult.invalidFields.includes('dailyRuns')
                      ? 'border-red-500 bg-red-50/20'
                      : ''
                  "
                >
                  <template
                    v-if="
                      (getCharGroup?.dailyRuns || 0) +
                        (getCharGroup?.storedDailyRuns || 0) >
                      0
                    "
                  >
                    <!-- 头部：标题与状态/报错展示 -->
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <!-- 动态呼吸圆点 -->
                        <div
                          class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 animate-pulse"
                        ></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-800"
                        >
                          <span>每日副本消耗</span>
                        </div>
                      </div>

                      <!-- 动态错误提示或剩余次数 Badge -->
                      <span
                        v-if="validationResult.invalidFields.includes('dailyRuns')"
                        class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200"
                      >
                        {{ validationResult.errors.dailyRuns || "异常" }}
                      </span>
                      <span
                        v-else
                        class="text-[10px] px-2.5 py-1 rounded-full font-black bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs"
                      >
                        共享可消耗: {{ totalsRemainingDailyRunsCountRuns || 0 }}
                      </span>
                    </div>

                    <!-- 中部：计数输入与快捷操作区 -->
                    <div class="space-y-3 flex-1 flex flex-col justify-between">
                      <!-- 主操作面板 -->
                      <div
                        class="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2.5"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5"
                        >
                          <span>角色消耗次数</span>
                          <span class="text-amber-600 font-black text-xs"
                            >-{{ weeklydailyFormValues.dailyRuns || 0 }}</span
                          >
                        </div>

                        <!-- 步进器输入行 -->
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.dailyRuns = Math.max(
                                0,
                                (weeklydailyFormValues.dailyRuns || 0) - 1
                              )
                            "
                          >
                            -
                          </button>

                          <input
                            v-model.number="weeklydailyFormValues.dailyRuns"
                            type="number"
                            min="0"
                            class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-amber-400 transition-all"
                          />

                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.dailyRuns =
                                (weeklydailyFormValues.dailyRuns || 0) + 1
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- 底部：快捷操作按钮 (两列等宽排列) -->
                      <div class="grid grid-cols-2 gap-2 pt-0.5">
                        <!-- 增加一半 -->
                        <!-- <button
                        type="button"
                        class="py-2 px-1 bg-slate-50 hover:bg-amber-50 active:scale-98 border border-slate-200/80 hover:border-amber-200 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center gap-0.5 truncate"
                        @click="
                          weeklydailyFormValues.dailyRuns += Math.floor(
                            (totalsRemainingDailyRunsCountRuns || 0) / 2
                          )
                        "
                      >
                        <span class="text-amber-500 font-black">+</span>一半
                      </button> -->
                        <!-- 清空 -->
                        <button
                          type="button"
                          class="py-2 px-1 bg-slate-50 hover:bg-red-50 active:scale-98 border border-slate-200/80 hover:border-red-200 rounded-xl text-slate-600 hover:text-red-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center truncate"
                          @click="weeklydailyFormValues.dailyRuns = 0"
                        >
                          清空
                        </button>
                        <!-- 全部 -->
                        <button
                          type="button"
                          class="py-2 px-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-amber-600/25 rounded-xl flex items-center justify-center truncate"
                          @click="
                            weeklydailyFormValues.dailyRuns =
                              (weeklydailyFormValues.dailyRuns || 0) +
                              (totalsRemainingDailyRunsCountRuns || 0)
                          "
                        >
                          全部 ({{ totalsRemainingDailyRunsCountRuns || 0 }})
                        </button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-400"
                        >
                          <span>每日副本消耗</span>
                        </div>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-400"
                      >
                        无可用
                      </span>
                    </div>

                    <!-- 内部居中的精致空状态面板 -->
                    <div
                      class="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs"
                      >
                        —
                      </div>
                      <p class="text-xs font-bold text-slate-400">暂无可消耗的次数</p>
                    </div>
                  </template>
                </div>

                <!-- ================= 古树庆典小游戏消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="minigameSection"
                  :class="
                    validationResult.invalidFields.includes('minigameCount')
                      ? 'border-red-500 bg-red-50/20'
                      : ''
                  "
                >
                  <template
                    v-if="
                      (getCharGroup?.minigameCount || 0) +
                        (getCharGroup?.storedMinigameCount || 0) >
                      0
                    "
                  >
                    <!-- 头部：标题与状态/报错展示 -->
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <!-- 动态呼吸圆点 -->
                        <div
                          class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 animate-pulse"
                        ></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-800"
                        >
                          <span>古树庆典小游戏消耗</span>
                        </div>
                      </div>

                      <!-- 动态错误提示或剩余次数 Badge -->
                      <span
                        v-if="validationResult.invalidFields.includes('minigameCount')"
                        class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200"
                      >
                        {{ validationResult.errors.minigameCount || "异常" }}
                      </span>
                      <span
                        v-else
                        class="text-[10px] px-2.5 py-1 rounded-full font-black bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs"
                      >
                        共享可消耗: {{ totalsRemainingMinigameCountRuns || 0 }}
                      </span>
                    </div>

                    <!-- 中部：计数输入与快捷操作区 -->
                    <div class="space-y-3 flex-1 flex flex-col justify-between">
                      <!-- 主操作面板 -->
                      <div
                        class="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2.5"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5"
                        >
                          <span>角色消耗次数</span>
                          <span class="text-amber-600 font-black text-xs"
                            >-{{ weeklydailyFormValues.minigameCount || 0 }}</span
                          >
                        </div>

                        <!-- 步进器输入行 -->
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.minigameCount = Math.max(
                                0,
                                (weeklydailyFormValues.minigameCount || 0) - 1
                              )
                            "
                          >
                            -
                          </button>

                          <input
                            v-model.number="weeklydailyFormValues.minigameCount"
                            type="number"
                            min="0"
                            class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-amber-400 transition-all"
                          />

                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.minigameCount =
                                (weeklydailyFormValues.minigameCount || 0) + 1
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- 底部：快捷操作按钮 (两列等宽排列) -->
                      <div class="grid grid-cols-2 gap-2 pt-0.5">
                        <!-- 清空 -->
                        <button
                          type="button"
                          class="py-2 px-1 bg-slate-50 hover:bg-red-50 active:scale-98 border border-slate-200/80 hover:border-red-200 rounded-xl text-slate-600 hover:text-red-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center truncate"
                          @click="weeklydailyFormValues.minigameCount = 0"
                        >
                          清空
                        </button>
                        <!-- 全部 -->
                        <button
                          type="button"
                          class="py-2 px-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-amber-600/25 rounded-xl flex items-center justify-center truncate"
                          @click="
                            weeklydailyFormValues.minigameCount =
                              (weeklydailyFormValues.minigameCount || 0) +
                              (totalsRemainingMinigameCountRuns || 0)
                          "
                        >
                          全部 ({{ totalsRemainingMinigameCountRuns || 0 }})
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-400"
                        >
                          <span>古树庆典小游戏消耗</span>
                        </div>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-400"
                      >
                        无可用
                      </span>
                    </div>

                    <!-- 内部居中的精致空状态面板 -->
                    <div
                      class="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs"
                      >
                        —
                      </div>
                      <p class="text-xs font-bold text-slate-400">暂无可消耗的次数</p>
                    </div>
                  </template>
                </div>

                <!-- ================= 次元袭击消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="dimensionalSection"
                  :class="
                    validationResult.invalidFields.includes('dimensionalCount')
                      ? 'border-red-500 bg-red-50/20'
                      : ''
                  "
                >
                  <template
                    v-if="
                      (getCharGroup?.dimensionalCount || 0) +
                        (getCharGroup?.storedDimensionalCount || 0) >
                      0
                    "
                  >
                    <!-- 头部：标题与状态/报错展示 -->
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <!-- 动态呼吸圆点 -->
                        <div
                          class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 animate-pulse"
                        ></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-800"
                        >
                          <span>次元袭击消耗</span>
                        </div>
                      </div>

                      <!-- 动态错误提示或剩余次数 Badge -->
                      <span
                        v-if="validationResult.invalidFields.includes('dimensionalCount')"
                        class="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200"
                      >
                        {{ validationResult.errors.dimensionalCount || "异常" }}
                      </span>
                      <span
                        v-else
                        class="text-[10px] px-2.5 py-1 rounded-full font-black bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs"
                      >
                        共享可消耗: {{ totalsRemainingDimensionalCountRuns || 0 }}
                      </span>
                    </div>

                    <!-- 中部：计数输入与快捷操作区 -->
                    <div class="space-y-3 flex-1 flex flex-col justify-between">
                      <!-- 主操作面板 -->
                      <div
                        class="p-3 bg-slate-50/80 border border-slate-200/70 rounded-2xl space-y-2.5"
                      >
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5"
                        >
                          <span>角色消耗次数</span>
                          <span class="text-amber-600 font-black text-xs"
                            >-{{ weeklydailyFormValues.dimensionalCount || 0 }}</span
                          >
                        </div>

                        <!-- 步进器输入行 -->
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.dimensionalCount = Math.max(
                                0,
                                (weeklydailyFormValues.dimensionalCount || 0) - 1
                              )
                            "
                          >
                            -
                          </button>

                          <input
                            v-model.number="weeklydailyFormValues.dimensionalCount"
                            type="number"
                            min="0"
                            class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-amber-400 transition-all"
                          />

                          <button
                            type="button"
                            class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            @click="
                              weeklydailyFormValues.dimensionalCount =
                                (weeklydailyFormValues.dimensionalCount || 0) + 1
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- 底部：快捷操作按钮 (两列等宽排列) -->
                      <div class="grid grid-cols-2 gap-2 pt-0.5">
                        <!-- 清空 -->
                        <button
                          type="button"
                          class="py-2 px-1 bg-slate-50 hover:bg-red-50 active:scale-98 border border-slate-200/80 hover:border-red-200 rounded-xl text-slate-600 hover:text-red-600 font-bold text-[11px] transition-all cursor-pointer text-center shadow-2xs flex items-center justify-center truncate"
                          @click="weeklydailyFormValues.dimensionalCount = 0"
                        >
                          清空
                        </button>
                        <!-- 全部 -->
                        <button
                          type="button"
                          class="py-2 px-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-amber-600/25 rounded-xl flex items-center justify-center truncate"
                          @click="
                            weeklydailyFormValues.dimensionalCount =
                              (weeklydailyFormValues.dimensionalCount || 0) +
                              (totalsRemainingDimensionalCountRuns || 0)
                          "
                        >
                          全部 ({{ totalsRemainingDimensionalCountRuns || 0 }})
                        </button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="flex items-center justify-between pb-3 border-b border-slate-100"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                        <div
                          class="text-xs font-black uppercase tracking-wider text-slate-400"
                        >
                          <span>次元袭击消耗</span>
                        </div>
                      </div>
                      <span
                        class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-400"
                      >
                        无可用
                      </span>
                    </div>

                    <!-- 内部居中的精致空状态面板 -->
                    <div
                      class="flex-1 flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2"
                    >
                      <div
                        class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs"
                      >
                        —
                      </div>
                      <p class="text-xs font-bold text-slate-400">暂无可消耗的次数</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- 卡片：exchange 兑换任务 -->
            <div
              v-if="
                (gameplayCharForm?.characterId && activeTab === 'exchange') ||
                activeTab == 'exchange'
              "
              class="space-y-6"
            >
              <!-- ================= 角色奥德综合管理模块 ================= -->
              <div
                class="p-5 bg-gradient-to-r from-amber-50/60 via-white to-sky-50/65 border-2 border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
              >
                <!-- 模块标题栏 -->
                <div
                  class="flex items-center justify-between pb-2.5 border-b border-slate-100"
                >
                  <div class="flex items-center gap-2.5">
                    <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div
                      class="text-xs font-black uppercase tracking-wider text-slate-700"
                    >
                      角色奥德综合兑换管理
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400">双模块联动</span>
                </div>

                <!-- 内容网格：左右/上下自适应并排 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <!-- 1. 物质变换 - 角色奥德卡片 -->
                  <div
                    class="p-3.5 border rounded-2xl space-y-2.5 transition-all"
                    :class="
                      (gameplayCharForm?.materialCharOd || 0) >= 4
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200/80'
                    "
                  >
                    <div
                      class="flex items-center justify-between text-xs font-bold text-slate-700"
                    >
                      <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>物质变换：角色奥德</span>
                      </div>
                      <span
                        class="font-black"
                        :class="
                          (gameplayCharForm?.materialCharOd || 0) >= 4
                            ? 'text-amber-700'
                            : 'text-amber-600'
                        "
                      >
                        {{ gameplayCharForm?.materialCharOd || 0 }} / 4
                      </span>
                    </div>

                    <!-- 已达成状态 -->
                    <template v-if="(gameplayCharForm?.materialCharOd || 0) >= 4">
                      <div
                        class="py-3 flex flex-col items-center justify-center space-y-0.5 bg-white/90 border border-amber-200/60 rounded-xl"
                      >
                        <div
                          class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black text-[10px]"
                        >
                          ✓
                        </div>
                        <span class="text-[11px] font-black text-amber-800"
                          >已全部拉满</span
                        >
                      </div>
                    </template>

                    <!-- 未达成控制区 -->
                    <template v-else>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95"
                          @click="
                            exchangeFormValues.materialCharOd = Math.max(
                              0,
                              (exchangeFormValues.materialCharOd || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="exchangeFormValues.materialCharOd"
                          min="0"
                          max="4"
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none focus:border-amber-400 transition-all"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95"
                          @click="
                            exchangeFormValues.materialCharOd = Math.min(
                              4,
                              (exchangeFormValues.materialCharOd || 0) + 1
                            )
                          "
                        >
                          +
                        </button>
                      </div>
                      <div class="flex gap-1 pt-0.5">
                        <button
                          type="button"
                          class="flex-1 py-1 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                          @click="exchangeFormValues.materialCharOd = 0"
                        >
                          清空
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                          @click="exchangeFormValues.materialCharOd = 4"
                        >
                          拉满 (4)
                        </button>
                      </div>
                    </template>
                  </div>

                  <!-- 2. 微风商店 - 角色奥德卡片 -->
                  <div
                    class="p-3.5 border rounded-2xl space-y-2.5 transition-all"
                    :class="
                      (exchangeFormValues.breezeCharOd || 0) >= 4
                        ? 'bg-sky-50/40 border-sky-200'
                        : 'bg-white border-slate-200/80'
                    "
                  >
                    <div
                      class="flex items-center justify-between text-xs font-bold text-slate-700"
                    >
                      <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-[#45a6d5]"></span>
                        <span>微风商店：角色奥德</span>
                      </div>
                      <span
                        class="font-black"
                        :class="
                          (gameplayCharForm?.breezeCharOd || 0) >= 4
                            ? 'text-sky-700'
                            : 'text-[#45a6d5]'
                        "
                      >
                        {{ exchangeFormValues.breezeCharOd || 0 }} / 4
                      </span>
                    </div>

                    <!-- 已达成状态 -->
                    <template v-if="(gameplayCharForm?.breezeCharOd || 0) >= 4">
                      <div
                        class="py-3 flex flex-col items-center justify-center space-y-0.5 bg-white/90 border border-sky-200/60 rounded-xl"
                      >
                        <div
                          class="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-[10px]"
                        >
                          ✓
                        </div>
                        <span class="text-[11px] font-black text-sky-800"
                          >已全部拉满</span
                        >
                      </div>
                    </template>

                    <!-- 未达成控制区 -->
                    <template v-else>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95"
                          @click="
                            exchangeFormValues.breezeCharOd = Math.max(
                              0,
                              (exchangeFormValues.breezeCharOd || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="exchangeFormValues.breezeCharOd"
                          min="0"
                          max="4"
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none focus:border-[#45a6d5] transition-all"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#45a6d5] font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95"
                          @click="
                            exchangeFormValues.breezeCharOd = Math.min(
                              4,
                              (exchangeFormValues.breezeCharOd || 0) + 1
                            )
                          "
                        >
                          +
                        </button>
                      </div>
                      <div class="flex gap-1 pt-0.5">
                        <button
                          type="button"
                          class="flex-1 py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-[#45a6d5] transition-all cursor-pointer"
                          @click="exchangeFormValues.breezeCharOd = 0"
                        >
                          清空
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-[#45a6d5] transition-all cursor-pointer"
                          @click="exchangeFormValues.breezeCharOd = 4"
                        >
                          拉满 (4)
                        </button>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- ================= 1. 物质变换与微风商店兑换管理（交互升级） ================= -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- ================= 物质变换面板 ================= -->
                <div
                  class="p-5 bg-white border-2 border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                >
                  <div
                    class="flex items-center justify-between pb-2.5 border-b border-slate-100"
                  >
                    <div class="flex items-center gap-2.5">
                      <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div
                        class="text-xs font-black uppercase tracking-wider text-slate-700"
                      >
                        物质变换兑换管理
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400">核心材料</span>
                  </div>

                  <div class="grid grid-cols-1 gap-3">
                    <!-- 1. 账号奥德卡片 -->
                    <div
                      class="p-3.5 border rounded-2xl space-y-2 transition-all"
                      :class="
                        (getCharGroup?.materialAccountOd || 0) >= 16
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-slate-50/70 border-slate-200/70'
                      "
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-700"
                      >
                        <span>账号奥德</span>
                        <span
                          class="font-black"
                          :class="
                            (getCharGroup?.materialAccountOd || 0) >= 16
                              ? 'text-amber-700'
                              : 'text-amber-600'
                          "
                        >
                          {{ getCharGroup?.materialAccountOd || 0 }} / 16
                        </span>
                      </div>

                      <!-- 已达成：显示清爽的成功占位样式 -->
                      <template v-if="(getCharGroup?.materialAccountOd || 0) >= 16">
                        <div
                          class="py-4 flex flex-col items-center justify-center space-y-1 bg-white/80 border border-amber-200/60 rounded-xl"
                        >
                          <div
                            class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black text-[10px] shadow-2xs"
                          >
                            ✓
                          </div>
                          <span class="text-[11px] font-black text-amber-800"
                            >账号奥德已拉满</span
                          >
                        </div>
                      </template>

                      <!-- 未达成：显示正常的步进器与按钮 -->
                      <template v-else>
                        <div class="flex items-center gap-1.5">
                          <button
                            type="button"
                            v-if="!getCharGroup?.materialAccountOd"
                            class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95"
                            @click="
                              exchangeFormValues.materialAccountOd = Math.max(
                                0,
                                (exchangeFormValues.materialAccountOd || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <input
                            v-model.number="exchangeFormValues.materialAccountOd"
                            min="0"
                            :max="
                              getCharGroup?.materialAccountOd
                                ? 16 - getCharGroup?.materialAccountOd
                                : 16
                            "
                            class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none focus:border-amber-400 transition-all"
                          />
                          <button
                            type="button"
                            class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer transition-all active:scale-95"
                            @click="
                              exchangeFormValues.materialAccountOd = Math.min(
                                getCharGroup?.materialAccountOd
                                  ? 16 - getCharGroup?.materialAccountOd
                                  : 16,
                                (getCharGroup?.materialAccountOd || 0) + 1
                              )
                            "
                          >
                            +
                          </button>
                        </div>
                        <div class="flex gap-1 pt-1">
                          <button
                            type="button"
                            class="flex-1 py-1 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                            @click="exchangeFormValues.materialAccountOd = 0"
                          >
                            清空
                          </button>
                          <button
                            type="button"
                            class="flex-1 py-1 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                            @click="
                              exchangeFormValues.materialAccountOd = getCharGroup?.materialAccountOd
                                ? 16 - getCharGroup?.materialAccountOd
                                : 16
                            "
                          >
                            拉满({{
                              getCharGroup?.materialAccountOd
                                ? 16 - getCharGroup?.materialAccountOd
                                : 16
                            }})
                          </button>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- ================= 微风商店模块 ================= -->
                <div
                  class="p-5 bg-white border-2 border-slate-200/80 rounded-3xl space-y-4 shadow-sm"
                >
                  <div
                    class="flex items-center justify-between pb-2.5 border-b border-slate-100"
                  >
                    <div class="flex items-center gap-2.5">
                      <div class="w-2.5 h-2.5 rounded-full bg-[#45a6d5]"></div>
                      <div
                        class="text-xs font-black uppercase tracking-wider text-slate-700"
                      >
                        微风商店上限兑换管理
                      </div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400">商店模块</span>
                  </div>

                  <div
                    class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs max-h-[190px] overflow-y-auto pr-1"
                  >
                    <!-- 1. 账号奥德 (上限 16) -->
                    <div
                      class="p-2.5 border rounded-xl space-y-1 transition-all"
                      :class="
                        (exchangeFormValues.breezeAccountOd || 0) >= 16
                          ? 'bg-sky-50/40 border-sky-200'
                          : 'bg-slate-50/70 border-slate-200/70'
                      "
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold"
                        :class="
                          (exchangeFormValues.breezeAccountOd || 0) >= 16
                            ? 'text-sky-800'
                            : 'text-slate-500'
                        "
                      >
                        <span>账号奥德</span>
                        <span
                          :class="
                            (exchangeFormValues.breezeAccountOd || 0) >= 16
                              ? 'text-sky-700 font-black'
                              : 'text-[#45a6d5]'
                          "
                          >{{ exchangeFormValues.breezeAccountOd || 0 }}/16</span
                        >
                      </div>

                      <!-- 已达成状态占位 -->
                      <template v-if="(exchangeFormValues.breezeAccountOd || 0) >= 16">
                        <div
                          class="py-2 flex items-center justify-center gap-1 bg-white/90 border border-sky-200/60 rounded-lg text-sky-700 font-black text-[10px]"
                        >
                          <span
                            class="w-3 h-3 rounded-full bg-sky-100 flex items-center justify-center text-[8px]"
                            >✓</span
                          >
                          <span>已拉满</span>
                        </div>
                      </template>
                      <!-- 未达成输入控制 -->
                      <template v-else>
                        <div class="flex items-center gap-1.5">
                          <input
                            v-model.number="exchangeFormValues.breezeAccountOd"
                            min="0"
                            max="16"
                            class="flex-1 w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none focus:border-[#45a6d5]"
                          />
                          <button
                            type="button"
                            class="flex-1 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded text-center transition-colors truncate cursor-pointer"
                            @click="exchangeFormValues.breezeAccountOd = 16"
                          >
                            最大
                          </button>
                        </div>
                      </template>
                    </div>

                    <!-- 3. 复活石 (上限 7) -->
                    <div
                      class="p-2.5 border rounded-xl space-y-1 transition-all"
                      :class="
                        (exchangeFormValues.breezeReviveStone || 0) >= 7
                          ? 'bg-sky-50/40 border-sky-200'
                          : 'bg-slate-50/70 border-slate-200/70'
                      "
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold"
                        :class="
                          (exchangeFormValues.breezeReviveStone || 0) >= 7
                            ? 'text-sky-800'
                            : 'text-slate-500'
                        "
                      >
                        <span>复活石</span>
                        <span
                          :class="
                            (exchangeFormValues.breezeReviveStone || 0) >= 7
                              ? 'text-sky-700 font-black'
                              : 'text-[#45a6d5]'
                          "
                          >{{ exchangeFormValues.breezeReviveStone || 0 }}/7</span
                        >
                      </div>

                      <template v-if="(exchangeFormValues.breezeReviveStone || 0) >= 7">
                        <div
                          class="py-2 flex items-center justify-center gap-1 bg-white/90 border border-sky-200/60 rounded-lg text-sky-700 font-black text-[10px]"
                        >
                          <span
                            class="w-3 h-3 rounded-full bg-sky-100 flex items-center justify-center text-[8px]"
                            >✓</span
                          >
                          <span>已拉满</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-1.5">
                          <input
                            v-model.number="exchangeFormValues.breezeReviveStone"
                            min="0"
                            max="7"
                            class="flex-1 w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none focus:border-[#45a6d5]"
                          />
                          <button
                            type="button"
                            class="flex-1 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded text-center transition-colors truncate cursor-pointer"
                            @click="exchangeFormValues.breezeReviveStone = 7"
                          >
                            最大
                          </button>
                        </div>
                      </template>
                    </div>

                    <!-- 4. 未知缝隙卷 (上限 21) -->
                    <div
                      class="p-2.5 border rounded-xl space-y-1 transition-all"
                      :class="
                        (exchangeFormValues.breezeRiftTicket || 0) >= 21
                          ? 'bg-sky-50/40 border-sky-200'
                          : 'bg-slate-50/70 border-slate-200/70'
                      "
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold truncate"
                        :class="
                          (exchangeFormValues.breezeRiftTicket || 0) >= 21
                            ? 'text-sky-800'
                            : 'text-slate-500'
                        "
                      >
                        <span>未知缝隙卷</span>
                        <span
                          :class="
                            (exchangeFormValues.breezeRiftTicket || 0) >= 21
                              ? 'text-sky-700 font-black'
                              : 'text-[#45a6d5]'
                          "
                          >{{ exchangeFormValues.breezeRiftTicket || 0 }}/21</span
                        >
                      </div>

                      <template v-if="(exchangeFormValues.breezeRiftTicket || 0) >= 21">
                        <div
                          class="py-2 flex items-center justify-center gap-1 bg-white/90 border border-sky-200/60 rounded-lg text-sky-700 font-black text-[10px]"
                        >
                          <span
                            class="w-3 h-3 rounded-full bg-sky-100 flex items-center justify-center text-[8px]"
                            >✓</span
                          >
                          <span>已拉满</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-1">
                          <input
                            v-model.number="exchangeFormValues.breezeRiftTicket"
                            min="0"
                            max="21"
                            class="flex-1 w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none focus:border-[#45a6d5]"
                          />
                          <button
                            type="button"
                            class="flex-1 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded text-center transition-colors truncate cursor-pointer"
                            @click="exchangeFormValues.breezeRiftTicket = 21"
                          >
                            最大
                          </button>
                        </div>
                      </template>
                    </div>

                    <!-- 5. 完成卷(每日) (上限 21) -->
                    <div
                      class="p-2.5 border rounded-xl space-y-1 transition-all"
                      :class="
                        (exchangeFormValues.breezeDailyTicket || 0) >= 21
                          ? 'bg-sky-50/40 border-sky-200'
                          : 'bg-slate-50/70 border-slate-200/70'
                      "
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold truncate"
                        :class="
                          (exchangeFormValues.breezeDailyTicket || 0) >= 21
                            ? 'text-sky-800'
                            : 'text-slate-500'
                        "
                      >
                        <span>完成卷(每日)</span>
                        <span
                          :class="
                            (exchangeFormValues.breezeDailyTicket || 0) >= 21
                              ? 'text-sky-700 font-black'
                              : 'text-[#45a6d5]'
                          "
                          >{{ exchangeFormValues.breezeDailyTicket || 0 }}/21</span
                        >
                      </div>

                      <template v-if="(exchangeFormValues.breezeDailyTicket || 0) >= 21">
                        <div
                          class="py-2 flex items-center justify-center gap-1 bg-white/90 border border-sky-200/60 rounded-lg text-sky-700 font-black text-[10px]"
                        >
                          <span
                            class="w-3 h-3 rounded-full bg-sky-100 flex items-center justify-center text-[8px]"
                            >✓</span
                          >
                          <span>已拉满</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-1.5">
                          <input
                            v-model.number="exchangeFormValues.breezeDailyTicket"
                            min="0"
                            max="21"
                            class="flex-1 w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none focus:border-[#45a6d5]"
                          />
                          <button
                            type="button"
                            class="flex-1 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded text-center transition-colors truncate cursor-pointer"
                            @click="exchangeFormValues.breezeDailyTicket = 21"
                          >
                            最大
                          </button>
                        </div>
                      </template>
                    </div>

                    <!-- 6. 完成卷(噩梦) (上限 14) -->
                    <div
                      class="p-2.5 border rounded-xl space-y-1 transition-all"
                      :class="
                        (exchangeFormValues.breezeNightmareTicket || 0) >= 14
                          ? 'bg-sky-50/40 border-sky-200'
                          : 'bg-slate-50/70 border-slate-200/70'
                      "
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold truncate"
                        :class="
                          (exchangeFormValues.breezeNightmareTicket || 0) >= 14
                            ? 'text-sky-800'
                            : 'text-slate-500'
                        "
                      >
                        <span>完成卷(噩梦)</span>
                        <span
                          :class="
                            (exchangeFormValues.breezeNightmareTicket || 0) >= 14
                              ? 'text-sky-700 font-black'
                              : 'text-[#45a6d5]'
                          "
                          >{{ exchangeFormValues.breezeNightmareTicket || 0 }}/14</span
                        >
                      </div>

                      <template
                        v-if="(exchangeFormValues.breezeNightmareTicket || 0) >= 14"
                      >
                        <div
                          class="py-2 flex items-center justify-center gap-1 bg-white/90 border border-sky-200/60 rounded-lg text-sky-700 font-black text-[10px]"
                        >
                          <span
                            class="w-3 h-3 rounded-full bg-sky-100 flex items-center justify-center text-[8px]"
                            >✓</span
                          >
                          <span>已拉满</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-1.5">
                          <input
                            v-model.number="exchangeFormValues.breezeNightmareTicket"
                            min="0"
                            max="14"
                            class="flex-1 w-full px-1 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none focus:border-[#45a6d5]"
                          />
                          <button
                            type="button"
                            class="flex-1 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded text-center transition-colors truncate cursor-pointer"
                            @click="exchangeFormValues.breezeNightmareTicket = 14"
                          >
                            最大
                          </button>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ================= 2. 深渊与地区指令书模块（结构化紧凑交互） ================= -->
              <div
                class="p-5 bg-gradient-to-r from-sky-50 via-white to-sky-50/60 border border-sky-200/80 px-4 py-3.5 shadow-2xs space-y-4 rounded-2xl"
              >
                <div
                  class="flex items-center justify-between pb-2 border-b border-sky-100"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
                    <div
                      class="text-xs font-black uppercase tracking-wider text-slate-700"
                    >
                      深渊与地区指令书管理
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400">指令书上限控制</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <!-- 1. 下层深渊指令书 (普通5, 熟练5, 精锐5, 特命5) -->
                  <div
                    class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                  >
                    <div
                      class="flex justify-between font-black text-slate-700 text-xs pb-1 border-b border-slate-100"
                    >
                      <span>下层深渊指令书</span>
                      <span class="text-sky-600">上限各 5</span>
                    </div>
                    <div class="space-y-1.5">
                      <!-- 普通 -->
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >普通 ({{ exchangeFormValues.lowerAbyssNormal || 0 }}/5)</span
                        >
                        <template v-if="(exchangeFormValues.lowerAbyssNormal || 0) >= 5">
                          <span
                            class="px-2 py-0.5 bg-sky-50 text-sky-700 font-black rounded text-[10px]"
                            >✓ 已满</span
                          >
                        </template>
                        <template v-else>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold cursor-pointer"
                              @click="
                                exchangeFormValues.lowerAbyssNormal = Math.max(
                                  0,
                                  (exchangeFormValues.lowerAbyssNormal || 0) - 1
                                )
                              "
                            >
                              -
                            </button>
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-[10px] font-bold cursor-pointer"
                              @click="exchangeFormValues.lowerAbyssNormal = 5"
                            >
                              5
                            </button>
                          </div>
                        </template>
                      </div>

                      <!-- 熟练 -->
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >熟练 ({{ exchangeFormValues.lowerAbyssSkilled || 0 }}/5)</span
                        >
                        <template v-if="(exchangeFormValues.lowerAbyssSkilled || 0) >= 5">
                          <span
                            class="px-2 py-0.5 bg-sky-50 text-sky-700 font-black rounded text-[10px]"
                            >✓ 已满</span
                          >
                        </template>
                        <template v-else>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold cursor-pointer"
                              @click="
                                exchangeFormValues.lowerAbyssSkilled = Math.max(
                                  0,
                                  (exchangeFormValues.lowerAbyssSkilled || 0) - 1
                                )
                              "
                            >
                              -
                            </button>
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-[10px] font-bold cursor-pointer"
                              @click="exchangeFormValues.lowerAbyssSkilled = 5"
                            >
                              5
                            </button>
                          </div>
                        </template>
                      </div>

                      <!-- 精锐 -->
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >精锐 ({{ exchangeFormValues.lowerAbyssElite || 0 }}/5)</span
                        >
                        <template v-if="(exchangeFormValues.lowerAbyssElite || 0) >= 5">
                          <span
                            class="px-2 py-0.5 bg-sky-50 text-sky-700 font-black rounded text-[10px]"
                            >✓ 已满</span
                          >
                        </template>
                        <template v-else>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold cursor-pointer"
                              @click="
                                exchangeFormValues.lowerAbyssElite = Math.max(
                                  0,
                                  (exchangeFormValues.lowerAbyssElite || 0) - 1
                                )
                              "
                            >
                              -
                            </button>
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-[10px] font-bold cursor-pointer"
                              @click="exchangeFormValues.lowerAbyssElite = 5"
                            >
                              5
                            </button>
                          </div>
                        </template>
                      </div>

                      <!-- 特命 -->
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >特命 ({{ exchangeFormValues.lowerAbyssSpecial || 0 }}/5)</span
                        >
                        <template v-if="(exchangeFormValues.lowerAbyssSpecial || 0) >= 5">
                          <span
                            class="px-2 py-0.5 bg-sky-50 text-sky-700 font-black rounded text-[10px]"
                            >✓ 已满</span
                          >
                        </template>
                        <template v-else>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold cursor-pointer"
                              @click="
                                exchangeFormValues.lowerAbyssSpecial = Math.max(
                                  0,
                                  (exchangeFormValues.lowerAbyssSpecial || 0) - 1
                                )
                              "
                            >
                              -
                            </button>
                            <button
                              type="button"
                              class="px-1.5 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-[10px] font-bold cursor-pointer"
                              @click="exchangeFormValues.lowerAbyssSpecial = 5"
                            >
                              5
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- 2. 中层深渊指令书 (熟练5, 特命5) -->
                  <div
                    class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                  >
                    <div
                      class="flex justify-between font-black text-slate-700 text-xs pb-1 border-b border-slate-100"
                    >
                      <span>中层深渊指令书</span>
                      <span class="text-sky-600">上限各 5</span>
                    </div>
                    <div class="space-y-2">
                      <!-- 熟练 -->
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >熟练 ({{ exchangeFormValues.midAbyssSkilled || 0 }}/5)</span
                        >
                        <template v-if="(exchangeFormValues.midAbyssSkilled || 0) >= 5">
                          <span
                            class="px-2 py-0.5 bg-sky-50 text-sky-700 font-black rounded text-[10px]"
                            >✓ 已满</span
                          >
                        </template>
                        <template v-else>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold cursor-pointer"
                              @click="
                                exchangeFormValues.midAbyssSkilled = Math.max(
                                  0,
                                  (exchangeFormValues.midAbyssSkilled || 0) - 1
                                )
                              "
                            >
                              -
                            </button>
                            <button
                              type="button"
                              class="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-[10px] font-bold cursor-pointer"
                              @click="exchangeFormValues.midAbyssSkilled = 5"
                            >
                              5
                            </button>
                          </div>
                        </template>
                      </div>

                      <!-- 特命 -->
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >特命 ({{ exchangeFormValues.midAbyssSpecial || 0 }}/5)</span
                        >
                        <template v-if="(exchangeFormValues.midAbyssSpecial || 0) >= 5">
                          <span
                            class="px-2 py-0.5 bg-sky-50 text-sky-700 font-black rounded text-[10px]"
                            >✓ 已满</span
                          >
                        </template>
                        <template v-else>
                          <div class="flex gap-1">
                            <button
                              type="button"
                              class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold cursor-pointer"
                              @click="
                                exchangeFormValues.midAbyssSpecial = Math.max(
                                  0,
                                  (exchangeFormValues.midAbyssSpecial || 0) - 1
                                )
                              "
                            >
                              -
                            </button>
                            <button
                              type="button"
                              class="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded text-[10px] font-bold cursor-pointer"
                              @click="exchangeFormValues.midAbyssSpecial = 5"
                            >
                              5
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- 3. 地区A指令书 (上限12) -->
                  <div
                    class="p-3 border rounded-2xl space-y-2 transition-all"
                    :class="
                      (exchangeFormValues.regionACount || 0) >= 12
                        ? 'bg-sky-50/40 border-sky-200'
                        : 'bg-white border-slate-200/80'
                    "
                  >
                    <div
                      class="flex justify-between font-black text-xs pb-1 border-b"
                      :class="
                        (exchangeFormValues.regionACount || 0) >= 12
                          ? 'text-sky-800 border-sky-100'
                          : 'text-slate-700 border-slate-100'
                      "
                    >
                      <span>地区A指令书</span>
                      <span
                        :class="
                          (exchangeFormValues.regionACount || 0) >= 12
                            ? 'text-sky-700 font-black'
                            : 'text-sky-600'
                        "
                        >上限 12</span
                      >
                    </div>

                    <!-- 已达成状态占位 -->
                    <template v-if="(exchangeFormValues.regionACount || 0) >= 12">
                      <div
                        class="py-4 flex flex-col items-center justify-center space-y-1 bg-white/90 border border-sky-200/60 rounded-xl"
                      >
                        <div
                          class="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-[10px]"
                        >
                          ✓
                        </div>
                        <span class="text-[11px] font-black text-sky-800"
                          >地区A指令书已拉满</span
                        >
                      </div>
                    </template>

                    <!-- 未达成控制区 -->
                    <template v-else>
                      <div class="space-y-3 pt-1">
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                        >
                          <span>当前数量</span>
                          <span class="text-sky-600 font-black"
                            >{{ exchangeFormValues.regionACount || 0 }} / 12</span
                          >
                        </div>
                        <div class="flex items-center gap-1.5">
                          <button
                            type="button"
                            class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
                            @click="
                              exchangeFormValues.regionACount = Math.max(
                                0,
                                (exchangeFormValues.regionACount || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <input
                            v-model.number="exchangeFormValues.regionACount"
                            min="0"
                            max="12"
                            class="flex-1 px-1 py-0.5 bg-slate-50 border border-slate-200 text-center font-black text-xs rounded outline-none focus:border-sky-400"
                          />
                          <button
                            type="button"
                            class="w-6 h-6 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center cursor-pointer"
                            @click="
                              exchangeFormValues.regionACount = Math.min(
                                12,
                                (exchangeFormValues.regionACount || 0) + 1
                              )
                            "
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          class="w-full py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-600 hover:text-sky-600 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                          @click="exchangeFormValues.regionACount = 12"
                        >
                          一键拉满 (12)
                        </button>
                      </div>
                    </template>
                  </div>

                  <!-- 4. 地区B指令书 (上限12) -->
                  <div
                    class="p-3 border rounded-2xl space-y-2 transition-all"
                    :class="
                      (exchangeFormValues.regionBCount || 0) >= 12
                        ? 'bg-sky-50/40 border-sky-200'
                        : 'bg-white border-slate-200/80'
                    "
                  >
                    <div
                      class="flex justify-between font-black text-xs pb-1 border-b"
                      :class="
                        (exchangeFormValues.regionBCount || 0) >= 12
                          ? 'text-sky-800 border-sky-100'
                          : 'text-slate-700 border-slate-100'
                      "
                    >
                      <span>地区B指令书</span>
                      <span
                        :class="
                          (exchangeFormValues.regionBCount || 0) >= 12
                            ? 'text-sky-700 font-black'
                            : 'text-sky-600'
                        "
                        >上限 12</span
                      >
                    </div>

                    <!-- 已达成状态占位 -->
                    <template v-if="(exchangeFormValues.regionBCount || 0) >= 12">
                      <div
                        class="py-4 flex flex-col items-center justify-center space-y-1 bg-white/90 border border-sky-200/60 rounded-xl"
                      >
                        <div
                          class="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-[10px]"
                        >
                          ✓
                        </div>
                        <span class="text-[11px] font-black text-sky-800"
                          >地区B指令书已拉满</span
                        >
                      </div>
                    </template>

                    <!-- 未达成控制区 -->
                    <template v-else>
                      <div class="space-y-3 pt-1">
                        <div
                          class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                        >
                          <span>当前数量</span>
                          <span class="text-sky-600 font-black"
                            >{{ exchangeFormValues.regionBCount || 0 }} / 12</span
                          >
                        </div>
                        <div class="flex items-center gap-1.5">
                          <button
                            type="button"
                            class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
                            @click="
                              exchangeFormValues.regionBCount = Math.max(
                                0,
                                (exchangeFormValues.regionBCount || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <input
                            v-model.number="exchangeFormValues.regionBCount"
                            min="0"
                            max="12"
                            class="flex-1 px-1 py-0.5 bg-slate-50 border border-slate-200 text-center font-black text-xs rounded outline-none focus:border-sky-400"
                          />
                          <button
                            type="button"
                            class="w-6 h-6 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center cursor-pointer"
                            @click="
                              exchangeFormValues.regionBCount = Math.min(
                                12,
                                (exchangeFormValues.regionBCount || 0) + 1
                              )
                            "
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          class="w-full py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-600 hover:text-sky-600 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                          @click="exchangeFormValues.regionBCount = 12"
                        >
                          一键拉满 (12)
                        </button>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 弹窗底部操作按钮 -->
          <div
            class="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-4 z-10"
          >
            <!-- 确认消耗快捷按钮 -->
            <button
              type="button"
              v-if="gameplayCharForm?.characterId && activeTab === 'consume'"
              :disabled="
                calculatedEnergyCost >
                  (gameplayCharForm?.energy || 0) +
                    (gameplayCharForm?.storedEnergy || 0) || calculatedEnergyCost <= 0
              "
              class="px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2"
              :class="[
                calculatedEnergyCost >
                  (gameplayCharForm?.energy || 0) +
                    (gameplayCharForm?.storedEnergy || 0) || calculatedEnergyCost <= 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 cursor-pointer',
              ]"
              @click="handleExecuteConsume"
            >
              <span
                v-if="
                  calculatedEnergyCost >
                  (gameplayCharForm?.energy || 0) + (gameplayCharForm?.storedEnergy || 0)
                "
              >
                奥德能量不足无法消耗，请补充后重试。
              </span>
              <span v-else>
                确认消耗
                {{ calculatedEnergyCost }} 点奥德并完成记录
              </span>
            </button>

            <button
              type="button"
              v-if="gameplayCharForm?.characterId && activeTab === 'supplement'"
              @click="handleExecuteSupplement"
              :disabled="saving || !validationResult.isValid || !hasSupplementValues"
              class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                saving ? "补充中..." : !hasSupplementValues ? "请填写补充" : "确认补充"
              }}
            </button>
            <button
              type="button"
              v-if="gameplayCharForm?.characterId && activeTab === 'weeklydaily'"
              @click="handleExecuteWeeklyDaily"
              :disabled="saving || !validationResult.isValid || !hasWeeklyDailyValues"
              class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                saving
                  ? "确认中..."
                  : !hasWeeklyDailyValues
                  ? "请正确填写日/周常任务"
                  : "确认完成"
              }}
            </button>
            <template v-if="gameplayCharForm?.characterId && activeTab === 'exchange'">
              <button
                type="button"
                @click="handleExecuteExchangeAll"
                :disabled="isAllExchangesCompleted"
                class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {{ isAllExchangesCompleted ? "已全部兑换完毕 ✓" : "一键全领" }}
              </button>
              <button
                type="button"
                @click="handleExecuteExchange"
                :disabled="
                  saving ||
                  !validationResult.isValid ||
                  !hasExchangeValues ||
                  isAllExchangesCompleted
                "
                class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{
                  saving
                    ? "确认中..."
                    : !hasExchangeValues
                    ? "请正确填写兑换任务"
                    : "确认兑换"
                }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

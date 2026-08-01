<script setup>
import { computed, watch } from "vue";
import { formatCombatPower } from "~/utils/formatCombatPower";
import CharacterCard from "./CharacterCard.vue";
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
  // {
  //   field: "storedAwakening",
  //   label: "存储觉醒战次数",
  //   validate: (form) => (Number(form.storedAwakening) || 0) <= 30,
  //   message: () => "存储噩梦次数不能超过30次",
  // },
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

//验证规则放回返
const validationResult = ref({
  isValid: true, //是否符合要求
  invalidFields: [], //不符合要求的字段名集合（如 'energy', 'sanctuary.s1'）
  errors: {}, //具体的错误信息键值对
});

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
// 配置对象
const cardConfig = reactive({
  columns: 3, // 可选: 1, 2, 3, 4 ，5列布局
  mode: "default", // 可选: 'default'(标准模式) | 'simple'(精简模式) | 'custom'(自定义模式)
  customFields: {
    showCombatPower: true,
    showDungeons: true,
    showEnergy: true,
    showTasks: false, // 自定义模式下隐藏任务按钮
    showNotes: true,
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
const validateCharacterForm = (formData, context = {}) => {
  const invalidFields = []; // 不符合要求的字段名集合
  const errors = {}; // 具体的错误信息键值对

  validationRules?.value?.forEach((rule) => {
    try {
      // 💡 关键修改：把 context（包含 allCharacters 等数据）传给 rule.validate
      const passes = rule.validate(formData, context);
      console.log(
        `🔍 [GroupCharacterPanel:786] %c 进入校验passes1: `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        passes
      );
      if (!passes) {
        console.log(
          `🔍 [GroupCharacterPanel:786] %c 进入校验passes2: `,
          "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
          passes
        );
        console.log(
          `🔍 [GroupCharacterPanel:786] %c 进入校验rule: `,
          "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
          rule
        );
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
const handleTaskClickk = (char, field) => {
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
  // const updatedChar = { ...char, [field]: !char[field] };
  // emit("update-character", updatedChar);
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
const handleClickGameplay = (char) => {
  console.log(
    `🔍 [GroupCharacterPanel:724] %c 点击游玩消耗触发 char: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    char
  );
  console.log(
    `🔍 [GroupCharacterPanel:724] %c 点击游玩消耗触发 gameData: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    props.gameData
  );
  gameplayCharForm.value = char;
  openGameplay.value = true;
  //清空重置默认字段
  //补充奥德
  supplementFormValues.value = {
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
const supplementFormValues = ref({
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
});
// 游玩补充概览卡片配置数据

const summaryItems = computed(() => {
  let suner = [];

  if (activeTab.value === "supplement") {
    suner = [
      {
        key: "nightmare",
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
        getValue: (form) => form?.dailyRuns || 0,
        getStoredValue: () => totalGroupStoredDailyRuns.value || 0,
        colorClass: "text-purple-600",
      },

      {
        key: "minigame",
        label: "古树庆典小游戏",
        getValue: (form) => form?.minigameCount || 0,
        getStoredValue: () => totalGroupStoredMinigameCount.value || 0,
        colorClass: "text-amber-600",
      },
      {
        key: "dimensional",
        label: "次元袭击",
        getValue: (form) => form?.dimensionalCount || 0,
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
  // //触发校验
  // validationResult.value = validateCharacterForm({
  //   storedEnergy: (gameplayCharForm.value.storedEnergy || 0) + total,
  // });
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

  let { isValid } = validateCharacterForm(currentTarget);
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
    ...currentTarget,
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
  supplementFormValues.value = {
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
            (groupLogs[existingLogIndex].kinaGain + calculatedTotalGain.value).toFixed(2)
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
          kinaGain: calculatedTotalGain.value,
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
        (charLogs[charExistingLogIndex].kinaGain + calculatedTotalGain.value).toFixed(2)
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
      kinaGain: calculatedTotalGain.value,
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

// 点击跳转定位方法
const scrollToSection = (key) => {
  let targetElement = null;

  // 根据点击的 key 映射到对应的 DOM 元素
  switch (key) {
    case "dailyRuns":
      targetElement = dailyRunsSection.value;
      break;
    case "energy":
      targetElement = energySection.value;
      break;
    case "minigame":
      targetElement = minigameSection.value;
      break;
    case "dimensional":
      targetElement = dimensionalSection.value;
      break;
    case "awakening":
      targetElement = awakeningSection.value;
      break;
    case "nightmare":
      targetElement = nightmareSection.value;
      break;
  }

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
//================ 日周任务 开始 exchange================
// 日周任务 表单内的控制
const exchangeFormValues = ref({
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
});
// 噩梦剩余次数：角色统计
const totalsRemainingNightmareCountRuns = computed(() => {
  const storedNightmareCount = gameplayCharForm.value?.storedNightmareCount;
  const nightmareCount = gameplayCharForm.value?.nightmareCount;
  // 当前表单里输入的数值
  const currentNightmareCount = exchangeFormValues.value.nightmareCount;

  let totalsRemainingNightmareCountNum =
    storedNightmareCount + nightmareCount - currentNightmareCount;

  return totalsRemainingNightmareCountNum;
});
// 觉醒战剩余次数：角色统计
const totalsRemainingAwakeningCountRuns = computed(() => {
  const storedAwakeningCount = gameplayCharForm.value?.storedAwakeningCount;
  const awakeningCount = gameplayCharForm.value?.awakeningCount;
  // 当前表单里输入的数值
  const currentAwakeningCount = exchangeFormValues.value.awakening;

  let totalsRemainingAwakeningCountNum =
    storedAwakeningCount + awakeningCount - currentAwakeningCount;

  return totalsRemainingAwakeningCountNum;
});

const hasWeeklyDailyValues = computed(() => {
  return (
    exchangeFormValues.value.dailyTaskCount > 0 &&
    exchangeFormValues.value.dimensionalCount > 0 &&
    exchangeFormValues.value.minigameCount > 0 &&
    exchangeFormValues.value.awakening > 0 &&
    exchangeFormValues.value.nightmareCount > 0 &&
    exchangeFormValues.value.dailyRuns > 0
  );
});
const handleExecuteWeeklyDaily = () => {
  console.log(
    `🔍 [GroupCharacterPanel:1560] %c 点击handleExecuteWeeklyDaily: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;"
  );
  if (!hasWeeklyDailyValues.value) {
    return;
  }
};

//================ 日周任务 结束 =====================

// 1. 定义一个通用的字段校验监听工厂函数
const watchFieldLimit = (sourceGetter, fieldName, extraCondition) => {
  watch(sourceGetter, (val) => {
    // if (val > maxLimit && extraCondition()) {
    if (extraCondition(val)) {
      const currentResult = validateCharacterForm({
        [fieldName]: val,
      });
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
        gameplayCharForm.value?.dailyTaskCount != 5
      ) {
        let newExchangeFormValues = {
          ...exchangeFormValues.value,
        };
        newExchangeFormValues.dailyTaskCount = gameplayCharForm.value?.dailyTaskCount;
        exchangeFormValues.value = newExchangeFormValues;
      }
      break;
    case "exchange": //周兑换
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

      if (totalGroupStoredDailyRuns.value > 30) {
        overrideForm.storedDailyRuns = totalGroupStoredDailyRuns.value;
      }
      if (totalGroupStoredMinigameCount.value > 30) {
        overrideForm.storedMinigameCount = totalGroupStoredMinigameCount.value;
      }

      validationResult.value = validateCharacterForm(overrideForm, {
        allCharacters: props.gameData?.characters || [],
        groups: props.gameData?.groups || [],
      });
    } else {
      validationResult.value = {
        isValid: true,
        errors: {},
        invalidFields: [],
      };
    }
  },
  { deep: true, immediate: true }
);

// ==================== 3. 独立字段的实时校验（一句话复用） ====================

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
    gameplayCharForm.value?.storedNightmareCount + gameplayCharForm.value?.nightmareCount
  );
});

watchFieldLimit(
  () => exchangeFormValues.value?.nightmareCount,
  "nightmareCount",
  (val) => {
    return val > nightmareCountSum.value;
  }
);
// 觉醒战消耗

const awakeningCountSum = computed(() => {
  return gameplayCharForm.value?.storedAwakening + gameplayCharForm.value?.awakening;
});

watchFieldLimit(
  () => exchangeFormValues.value?.awakening,
  "awakening",
  (val) => {
    return val > awakeningCountSum.value;
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
// 判断补充表单内是否有任意一个值大于 0
const hasSupplementValues = computed(() => {
  return Object.values(supplementFormValues.value).some((val) => Number(val) > 0);
});
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

    <CharacterCard
      v-if="filteredCharacters.length > 0"
      :characters="filteredCharacters"
      :config="cardConfig"
      :get-group-name="getGroupName"
      :format-combat-power="formatCombatPower"
      @click-gameplay="handleClickGameplay"
      @toggle-lock="(char) => emit('toggle-lock', char)"
      @toggle-task="handleToggleTask"
      @task-click="handleTaskClickk"
      @text-change="handleTextChange"
      @delete="handleDelete"
      :groups="gameData.group"
      :gameData="gameData"
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
            class="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10"
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
              @click="openGameplay = false"
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
                    {{ item.getValue ? item.getValue(gameplayCharForm) : 0 }}
                  </span>

                  <!-- 补充值（仅在有值或大于0时展示，或者安全输出） -->
                  <span :class="['font-black', item.colorClass || 'text-amber-600']">
                    +{{ item.getStoredValue ? item.getStoredValue(gameplayCharForm) : 0 }}
                  </span>

                  <!-- 额度上限（如果有） -->
                  <span v-if="item.limit" class="text-[10px] text-slate-400 font-medium">
                    /{{
                      typeof item.limit === "function"
                        ? item.limit(gameplayCharForm)
                        : item.limit
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 卡片：weeklydaily 周常/日常任务--->
          <div
            v-if="gameplayCharForm?.characterId && activeTab === 'weeklydaily'"
            class="bg-gradient-to-r from-sky-50 via-white to-sky-50/60 border border-sky-200/80 px-4 py-3.5 shadow-2xs space-y-3 rounded-2xl"
          >
            <div v-if="!exchangeFormValues.dailyMission">
              每日使命任务当前完成{{ exchangeFormValues?.dailyTaskCount || 0 }}
            </div>
            <div v-else>已经完成每日使命任务</div>
          </div>

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
                class="w-full group relative overflow-hidden p-5 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/20 hover:border-sky-500/40 rounded-3xl transition-all duration-300 shadow-xs"
              >
                <!-- 背景装饰光晕 -->
                <div
                  class="absolute -right-10 -bottom-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"
                ></div>

                <div
                  class="relative flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
                >
                  <!-- 左侧：图标与文本说明 -->
                  <div class="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/30 shrink-0 transform group-hover:-rotate-6 transition-transform duration-300"
                    >
                      <svg
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
                    </div>

                    <div class="space-y-1 min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <h3
                          class="text-xs font-black tracking-wide text-slate-800 uppercase truncate"
                        >
                          日常每日使命任务
                        </h3>
                        <span
                          class="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500/10 text-sky-700 border border-sky-500/20 shrink-0"
                          >上限 5 次</span
                        >
                      </div>
                      <!-- <p class="text-[11px] font-medium text-slate-500 truncate">
                        完成今日日常活跃目标，稳定获取核心经验与奖励
                      </p> -->
                    </div>
                  </div>

                  <!-- 右侧：高频计数控制区（Stepper 步进器风格） -->
                  <div class="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                    <!-- 进度文字提示 -->
                    <div
                      class="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 border border-sky-500/20 text-[11px] font-bold text-sky-700 shadow-2xs"
                    >
                      <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                      <span>已完成 {{ exchangeFormValues.dailyTaskCount || 0 }} / 5</span>
                    </div>

                    <!-- 步进器按钮组 -->
                    <div
                      class="flex items-center gap-1.5 bg-white/90 p-1.5 border border-sky-500/20 rounded-2xl shadow-2xs"
                    >
                      <button
                        type="button"
                        class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer"
                        @click="
                          exchangeFormValues.dailyTaskCount = Math.max(
                            0,
                            (exchangeFormValues.dailyTaskCount || 0) - 1
                          )
                        "
                      >
                        -
                      </button>

                      <input
                        v-model.number="exchangeFormValues.dailyTaskCount"
                        min="0"
                        max="5"
                        class="w-9 text-center font-black text-xs text-sky-700 bg-transparent outline-none"
                      />

                      <button
                        type="button"
                        class="w-7 h-7 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer"
                        @click="
                          exchangeFormValues.dailyTaskCount = Math.min(
                            5,
                            (exchangeFormValues.dailyTaskCount || 0) + 1
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
                      @click="exchangeFormValues.dailyTaskCount = 5"
                    >
                      <span>拉满</span>
                    </button>
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
                      : 'border-slate-200/80 hover:border-purple-300'
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
                          >-{{ exchangeFormValues.nightmareCount || 0 }}</span
                        >
                      </div>

                      <!-- 步进器输入行 -->
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          @click="
                            exchangeFormValues.nightmareCount = Math.max(
                              0,
                              (exchangeFormValues.nightmareCount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>

                        <input
                          v-model.number="exchangeFormValues.nightmareCount"
                          type="number"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-purple-400 transition-all"
                        />

                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          @click="
                            exchangeFormValues.nightmareCount =
                              (exchangeFormValues.nightmareCount || 0) + 1
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
                        @click="exchangeFormValues.nightmareCount += 2"
                      >
                        <span class="text-purple-500 font-black">+</span> 增加 2 次
                      </button>

                      <button
                        type="button"
                        class="py-2 px-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-purple-600/25 rounded-xl flex items-center justify-center truncate"
                        @click="
                          exchangeFormValues.nightmareCount +=
                            totalsRemainingNightmareCountRuns || 0
                        "
                      >
                        全部 ({{ totalsRemainingNightmareCountRuns || 0 }})
                      </button>
                    </div>
                  </div>
                </div>

                <!-- ================= 觉醒战消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="nightmareSection"
                  :class="
                    validationResult.invalidFields.includes('awakening')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80 hover:border-purple-300'
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
                          >-{{ exchangeFormValues.awakening || 0 }}</span
                        >
                      </div>

                      <!-- 步进器输入行 -->
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          @click="
                            exchangeFormValues.awakening = Math.max(
                              0,
                              (exchangeFormValues.awakening || 0) - 1
                            )
                          "
                        >
                          -
                        </button>

                        <input
                          v-model.number="exchangeFormValues.awakening"
                          type="number"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-purple-400 transition-all"
                        />

                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          @click="
                            exchangeFormValues.awakening =
                              (exchangeFormValues.awakening || 0) + 1
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
                        @click="exchangeFormValues.awakening += 2"
                      >
                        <span class="text-purple-500 font-black">+</span> 增加 2 次
                      </button>

                      <button
                        type="button"
                        class="py-2 px-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-purple-600/25 rounded-xl flex items-center justify-center truncate"
                        @click="
                          exchangeFormValues.awakening +=
                            totalsRemainingAwakeningCountRuns || 0
                        "
                      >
                        全部 ({{ totalsRemainingAwakeningCountRuns || 0 }})
                      </button>
                    </div>
                  </div>
                </div>

   <!-- ================= 战场消耗管理 ================= -->
                <div
                  class="h-full flex flex-col justify-between p-4 bg-white border-2 rounded-3xl space-y-4 shadow-sm transition-all"
                  ref="nightmareSection"
                  :class="
                    validationResult.invalidFields.includes('battlefield')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80 hover:border-purple-300'
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
                      剩余可消耗: {{ gameplayCharForm.battlefield || 0 }}
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
                          >-{{ exchangeFormValues.battlefield || 0 }}</span
                        >
                      </div>

                      <!-- 步进器输入行 -->
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          @click="
                            exchangeFormValues.battlefield = Math.max(
                              0,
                              (exchangeFormValues.battlefield || 0) - 1
                            )
                          "
                        >
                          -
                        </button>

                        <input
                          v-model.number="exchangeFormValues.battlefield"
                          type="number"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center font-black text-xs text-slate-800 outline-none shadow-2xs focus:border-purple-400 transition-all"
                        />

                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                          @click="
                            exchangeFormValues.battlefield =
                              (exchangeFormValues.battlefield || 0) + 1
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
                        @click="exchangeFormValues.battlefield += 2"
                      >
                        <span class="text-purple-500 font-black">+</span> 增加 2 次
                      </button>

                      <button
                        type="button"
                        class="py-2 px-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-black text-[11px] transition-all cursor-pointer text-center shadow-sm shadow-purple-600/25 rounded-xl flex items-center justify-center truncate"
                        @click="
                          exchangeFormValues.battlefield +=
                            gameplayCharForm.battlefield || 0
                        "
                      >
                        全部 ({{ gameplayCharForm.battlefield || 0 }})
                      </button>
                    </div>
                  </div>
                </div>
              
              
              </div>

              <!-- ================= 4. 每日副本、古树庆典、次元袭击（一行三列布局） ================= -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- 每日副本消耗管理 -->
                <div
                  class="p-4 bg-white border-2 rounded-3xl space-y-3 shadow-sm transition-all"
                  ref="dailyRunsSection"
                  :class="
                    validationResult.invalidFields.includes('storedDailyRuns')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <div
                    class="flex items-center justify-between pb-2 border-b border-slate-100"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div
                        class="text-xs font-black uppercase tracking-wider text-slate-700 truncate"
                      >
                        <span>每日副本消耗</span>
                      </div>
                    </div>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 shrink-0"
                      >组:{{ totalGroupStoredDailyRuns }}</span
                    >
                  </div>

                  <div class="space-y-3">
                    <div
                      class="p-3 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                      >
                        <span>角色消耗次数</span>
                        <span class="text-amber-600 font-black"
                          >-{{ supplementFormValues.storedDailyRuns || 0 }}</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
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
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.storedDailyRuns =
                              (supplementFormValues.storedDailyRuns || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="flex-1 py-1.5 px-1 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[10px] transition-all cursor-pointer text-center"
                          @click="
                            supplementFormValues.storedDailyRuns = Math.floor(30 / 2)
                          "
                        >
                          一半(15)
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1.5 px-1 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[10px] transition-all cursor-pointer text-center"
                          @click="supplementFormValues.storedDailyRuns = 30"
                        >
                          全部(30)
                        </button>
                      </div>
                      <div
                        class="px-2.5 py-1.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center justify-between text-[11px]"
                      >
                        <span class="text-slate-400 font-bold text-[10px]">组进度</span>
                        <span
                          class="font-black"
                          :class="
                            totalGroupStoredDailyRuns > 30
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          "
                          >{{ totalGroupStoredDailyRuns
                          }}<span class="text-[9px] text-slate-400">/30</span></span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 古树庆典小游戏消耗管理 -->
                <div
                  class="p-4 bg-white border-2 rounded-3xl space-y-3 shadow-sm transition-all"
                  ref="minigameSection"
                  :class="
                    validationResult.invalidFields.includes('storedMinigameCount')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <div
                    class="flex items-center justify-between pb-2 border-b border-slate-100"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div
                        class="text-xs font-black uppercase tracking-wider text-slate-700 truncate"
                      >
                        <span>古树庆典小游戏</span>
                      </div>
                    </div>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 shrink-0"
                      >组:{{ totalGroupStoredMinigameCount }}</span
                    >
                  </div>

                  <div class="space-y-3">
                    <div
                      class="p-3 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                      >
                        <span>角色消耗次数</span>
                        <span class="text-amber-600 font-black"
                          >-{{ supplementFormValues.storedMinigameCount || 0 }}</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
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
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.storedMinigameCount =
                              (supplementFormValues.storedMinigameCount || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="flex-1 py-1.5 px-1 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[10px] transition-all cursor-pointer text-center"
                          @click="
                            supplementFormValues.storedMinigameCount = Math.floor(30 / 2)
                          "
                        >
                          一半(15)
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1.5 px-1 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[10px] transition-all cursor-pointer text-center"
                          @click="supplementFormValues.storedMinigameCount = 30"
                        >
                          全部(30)
                        </button>
                      </div>
                      <div
                        class="px-2.5 py-1.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center justify-between text-[11px]"
                      >
                        <span class="text-slate-400 font-bold text-[10px]">组进度</span>
                        <span
                          class="font-black"
                          :class="
                            totalGroupStoredMinigameCount > 30
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          "
                          >{{ totalGroupStoredMinigameCount
                          }}<span class="text-[9px] text-slate-400">/30</span></span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 次元袭击消耗管理 -->
                <div
                  class="p-4 bg-white border-2 rounded-3xl space-y-3 shadow-sm transition-all"
                  ref="dimensionalSection"
                  :class="
                    validationResult.invalidFields.includes('storedDimensionalCount')
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-slate-200/80'
                  "
                >
                  <div
                    class="flex items-center justify-between pb-2 border-b border-slate-100"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div
                        class="text-xs font-black uppercase tracking-wider text-slate-700 truncate"
                      >
                        <span>次元袭击消耗</span>
                      </div>
                    </div>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 shrink-0"
                      >组:{{ totalGroupStoredDimensionalCount }}</span
                    >
                  </div>

                  <div class="space-y-3">
                    <div
                      class="p-3 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                      >
                        <span>角色消耗次数</span>
                        <span class="text-amber-600 font-black"
                          >-{{ supplementFormValues.storedDimensionalCount || 0 }}</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
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
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.storedDimensionalCount =
                              (supplementFormValues.storedDimensionalCount || 0) + 1
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="flex-1 py-1.5 px-1 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[10px] transition-all cursor-pointer text-center"
                          @click="
                            supplementFormValues.storedDimensionalCount = Math.floor(
                              30 / 2
                            )
                          "
                        >
                          一半(15)
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1.5 px-1 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 rounded-xl text-slate-700 hover:text-amber-600 font-bold text-[10px] transition-all cursor-pointer text-center"
                          @click="supplementFormValues.storedDimensionalCount = 30"
                        >
                          全部(30)
                        </button>
                      </div>
                      <div
                        class="px-2.5 py-1.5 bg-slate-50/70 border border-slate-200/70 rounded-xl flex items-center justify-between text-[11px]"
                      >
                        <span class="text-slate-400 font-bold text-[10px]">组进度</span>
                        <span
                          class="font-black"
                          :class="
                            totalGroupStoredDimensionalCount > 30
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          "
                          >{{ totalGroupStoredDimensionalCount
                          }}<span class="text-[9px] text-slate-400">/30</span></span
                        >
                      </div>
                    </div>
                  </div>
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
              <!-- ================= 1. 物质变换与微风商店兑换管理（交互升级） ================= -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- 物质变换面板 -->
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

                  <div class="grid grid-cols-2 gap-3">
                    <!-- 账号奥德 -->
                    <div
                      class="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-700"
                      >
                        <span>账号奥德</span>
                        <span class="text-amber-600 font-black"
                          >{{ supplementFormValues.materialAccountOd || 0 }} / 16</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.materialAccountOd = Math.max(
                              0,
                              (supplementFormValues.materialAccountOd || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.materialAccountOd"
                          min="0"
                          max="16"
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.materialAccountOd = Math.min(
                              16,
                              (supplementFormValues.materialAccountOd || 0) + 1
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
                          @click="supplementFormValues.materialAccountOd = 0"
                        >
                          清空
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                          @click="supplementFormValues.materialAccountOd = 16"
                        >
                          拉满(16)
                        </button>
                      </div>
                    </div>

                    <!-- 角色奥德 -->
                    <div
                      class="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2"
                    >
                      <div
                        class="flex items-center justify-between text-xs font-bold text-slate-700"
                      >
                        <span>角色奥德</span>
                        <span class="text-amber-600 font-black"
                          >{{ supplementFormValues.materialCharOd || 0 }} / 4</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.materialCharOd = Math.max(
                              0,
                              (supplementFormValues.materialCharOd || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.materialCharOd"
                          min="0"
                          max="4"
                          class="flex-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-center font-black text-xs text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center cursor-pointer"
                          @click="
                            supplementFormValues.materialCharOd = Math.min(
                              4,
                              (supplementFormValues.materialCharOd || 0) + 1
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
                          @click="supplementFormValues.materialCharOd = 0"
                        >
                          清空
                        </button>
                        <button
                          type="button"
                          class="flex-1 py-1 bg-white hover:bg-amber-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                          @click="supplementFormValues.materialCharOd = 4"
                        >
                          拉满(4)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 微风商店模块 -->
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
                    class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs max-h-[170px] overflow-y-auto pr-1"
                  >
                    <!-- 账号奥德 16 -->
                    <div
                      class="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1"
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold text-slate-500"
                      >
                        <span>账号奥德</span>
                        <span class="text-[#45a6d5]"
                          >{{ supplementFormValues.breezeAccountOd || 0 }}/16</span
                        >
                      </div>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="supplementFormValues.breezeAccountOd"
                          min="0"
                          max="16"
                          class="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none"
                        />
                        <button
                          type="button"
                          class="px-1.5 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded"
                          @click="supplementFormValues.breezeAccountOd = 16"
                        >
                          最大
                        </button>
                      </div>
                    </div>

                    <!-- 角色奥德 4 -->
                    <div
                      class="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1"
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold text-slate-500"
                      >
                        <span>角色奥德</span>
                        <span class="text-[#45a6d5]"
                          >{{ supplementFormValues.breezeCharOd || 0 }}/4</span
                        >
                      </div>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="supplementFormValues.breezeCharOd"
                          min="0"
                          max="4"
                          class="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none"
                        />
                        <button
                          type="button"
                          class="px-1.5 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded"
                          @click="supplementFormValues.breezeCharOd = 4"
                        >
                          max
                        </button>
                      </div>
                    </div>

                    <!-- 复活石 7 -->
                    <div
                      class="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1"
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold text-slate-500"
                      >
                        <span>复活石</span>
                        <span class="text-[#45a6d5]"
                          >{{ supplementFormValues.breezeReviveStone || 0 }}/7</span
                        >
                      </div>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="supplementFormValues.breezeReviveStone"
                          min="0"
                          max="7"
                          class="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none"
                        />
                        <button
                          type="button"
                          class="px-1.5 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded"
                          @click="supplementFormValues.breezeReviveStone = 7"
                        >
                          max
                        </button>
                      </div>
                    </div>

                    <!-- 未知缝隙挑战卷 21 -->
                    <div
                      class="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1"
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold text-slate-500 truncate"
                      >
                        <span>未知缝隙卷</span>
                        <span class="text-[#45a6d5]"
                          >{{ supplementFormValues.breezeRiftTicket || 0 }}/21</span
                        >
                      </div>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="supplementFormValues.breezeRiftTicket"
                          min="0"
                          max="21"
                          class="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none"
                        />
                        <button
                          type="button"
                          class="px-1.5 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded"
                          @click="supplementFormValues.breezeRiftTicket = 21"
                        >
                          max
                        </button>
                      </div>
                    </div>

                    <!-- 立即完成卷：每日副本 21 -->
                    <div
                      class="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1"
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold text-slate-500 truncate"
                      >
                        <span>完成卷(每日)</span>
                        <span class="text-[#45a6d5]"
                          >{{ supplementFormValues.breezeDailyTicket || 0 }}/21</span
                        >
                      </div>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="supplementFormValues.breezeDailyTicket"
                          min="0"
                          max="21"
                          class="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none"
                        />
                        <button
                          type="button"
                          class="px-1.5 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded"
                          @click="supplementFormValues.breezeDailyTicket = 21"
                        >
                          max
                        </button>
                      </div>
                    </div>

                    <!-- 立即完成卷：噩梦 14 -->
                    <div
                      class="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1"
                    >
                      <div
                        class="flex justify-between text-[10px] font-bold text-slate-500 truncate"
                      >
                        <span>完成卷(噩梦)</span>
                        <span class="text-[#45a6d5]"
                          >{{ supplementFormValues.breezeNightmareTicket || 0 }}/14</span
                        >
                      </div>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="supplementFormValues.breezeNightmareTicket"
                          min="0"
                          max="14"
                          class="w-full px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center font-black text-xs outline-none"
                        />
                        <button
                          type="button"
                          class="px-1.5 py-0.5 bg-slate-100 hover:bg-[#45a6d5]/20 text-[10px] font-bold rounded"
                          @click="supplementFormValues.breezeNightmareTicket = 14"
                        >
                          max
                        </button>
                      </div>
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
                  <!-- 下层深渊指令书 (普通5, 熟练5, 精锐5, 特命5) -->
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
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >普通 ({{ supplementFormValues.lowerAbyssNormal || 0 }}/5)</span
                        >
                        <div class="flex gap-1">
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold"
                            @click="
                              supplementFormValues.lowerAbyssNormal = Math.max(
                                0,
                                (supplementFormValues.lowerAbyssNormal || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-bold"
                            @click="supplementFormValues.lowerAbyssNormal = 5"
                          >
                            5
                          </button>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >熟练 ({{
                            supplementFormValues.lowerAbyssSkilled || 0
                          }}/5)</span
                        >
                        <div class="flex gap-1">
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold"
                            @click="
                              supplementFormValues.lowerAbyssSkilled = Math.max(
                                0,
                                (supplementFormValues.lowerAbyssSkilled || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-bold"
                            @click="supplementFormValues.lowerAbyssSkilled = 5"
                          >
                            5
                          </button>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >精锐 ({{ supplementFormValues.lowerAbyssElite || 0 }}/5)</span
                        >
                        <div class="flex gap-1">
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold"
                            @click="
                              supplementFormValues.lowerAbyssElite = Math.max(
                                0,
                                (supplementFormValues.lowerAbyssElite || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-bold"
                            @click="supplementFormValues.lowerAbyssElite = 5"
                          >
                            5
                          </button>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >特命 ({{
                            supplementFormValues.lowerAbyssSpecial || 0
                          }}/5)</span
                        >
                        <div class="flex gap-1">
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold"
                            @click="
                              supplementFormValues.lowerAbyssSpecial = Math.max(
                                0,
                                (supplementFormValues.lowerAbyssSpecial || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <button
                            type="button"
                            class="px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-bold"
                            @click="supplementFormValues.lowerAbyssSpecial = 5"
                          >
                            5
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 中层深渊指令书 (熟练5, 特命5) -->
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
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >熟练 ({{ supplementFormValues.midAbyssSkilled || 0 }}/5)</span
                        >
                        <div class="flex gap-1">
                          <button
                            type="button"
                            class="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold"
                            @click="
                              supplementFormValues.midAbyssSkilled = Math.max(
                                0,
                                (supplementFormValues.midAbyssSkilled || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <button
                            type="button"
                            class="px-2 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-bold"
                            @click="supplementFormValues.midAbyssSkilled = 5"
                          >
                            5
                          </button>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-between text-[11px] text-slate-600"
                      >
                        <span
                          >特命 ({{ supplementFormValues.midAbyssSpecial || 0 }}/5)</span
                        >
                        <div class="flex gap-1">
                          <button
                            type="button"
                            class="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold"
                            @click="
                              supplementFormValues.midAbyssSpecial = Math.max(
                                0,
                                (supplementFormValues.midAbyssSpecial || 0) - 1
                              )
                            "
                          >
                            -
                          </button>
                          <button
                            type="button"
                            class="px-2 py-0.5 bg-sky-50 text-sky-600 rounded text-[10px] font-bold"
                            @click="supplementFormValues.midAbyssSpecial = 5"
                          >
                            5
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 地区A指令书 (上限12) -->
                  <div
                    class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                  >
                    <div
                      class="flex justify-between font-black text-slate-700 text-xs pb-1 border-b border-slate-100"
                    >
                      <span>地区A指令书</span>
                      <span class="text-sky-600">上限 12</span>
                    </div>
                    <div class="space-y-3 pt-1">
                      <div
                        class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                      >
                        <span>当前数量</span>
                        <span class="text-sky-600 font-black"
                          >{{ supplementFormValues.regionACount || 0 }} / 12</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-6 h-6 rounded bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center"
                          @click="
                            supplementFormValues.regionACount = Math.max(
                              0,
                              (supplementFormValues.regionACount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.regionACount"
                          min="0"
                          max="12"
                          class="flex-1 px-1 py-0.5 bg-slate-50 border border-slate-200 text-center font-black text-xs rounded outline-none"
                        />
                        <button
                          type="button"
                          class="w-6 h-6 rounded bg-sky-50 text-sky-700 font-black text-xs flex items-center justify-center"
                          @click="
                            supplementFormValues.regionACount = Math.min(
                              12,
                              (supplementFormValues.regionACount || 0) + 1
                            )
                          "
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        class="w-full py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-600 hover:text-sky-600 font-bold text-[10px] rounded-lg transition-all"
                        @click="supplementFormValues.regionACount = 12"
                      >
                        一键拉满 (12)
                      </button>
                    </div>
                  </div>

                  <!-- 地区B指令书 (上限12) -->
                  <div
                    class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2"
                  >
                    <div
                      class="flex justify-between font-black text-slate-700 text-xs pb-1 border-b border-slate-100"
                    >
                      <span>地区B指令书</span>
                      <span class="text-sky-600">上限 12</span>
                    </div>
                    <div class="space-y-3 pt-1">
                      <div
                        class="flex items-center justify-between text-[11px] font-bold text-slate-600"
                      >
                        <span>当前数量</span>
                        <span class="text-sky-600 font-black"
                          >{{ supplementFormValues.regionBCount || 0 }} / 12</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-6 h-6 rounded bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center"
                          @click="
                            supplementFormValues.regionBCount = Math.max(
                              0,
                              (supplementFormValues.regionBCount || 0) - 1
                            )
                          "
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.regionBCount"
                          min="0"
                          max="12"
                          class="flex-1 px-1 py-0.5 bg-slate-50 border border-slate-200 text-center font-black text-xs rounded outline-none"
                        />
                        <button
                          type="button"
                          class="w-6 h-6 rounded bg-sky-50 text-sky-700 font-black text-xs flex items-center justify-center"
                          @click="
                            supplementFormValues.regionBCount = Math.min(
                              12,
                              (supplementFormValues.regionBCount || 0) + 1
                            )
                          "
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        class="w-full py-1 bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-600 hover:text-sky-600 font-bold text-[10px] rounded-lg transition-all"
                        @click="supplementFormValues.regionBCount = 12"
                      >
                        一键拉满 (12)
                      </button>
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
                  ? "请填写周常任务完成"
                  : "确认完成"
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

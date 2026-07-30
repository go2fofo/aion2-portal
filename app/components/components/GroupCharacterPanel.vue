<script setup>
import { computed, watch } from "vue";
import { formatCombatPower } from "~/utils/formatCombatPower";
// 远征副本，超越副本，圣域副本获得吉纳数和消耗奥德能量（基础单倍版）
const KinahOdSate = {
  // 远征副本
  expedition: [
    {
      stars: 6,
      name: "堕落守护者之城",
      difficulties: [
        { mode: "困难", energy: 60, kina: 360, boundKina: 0, total: 360 },
        { mode: "普通", energy: 40, kina: 201, boundKina: 0, total: 201 },
      ],
    },
    {
      stars: 5,
      name: "青息之岛",
      difficulties: [
        { mode: "困难", energy: 40, kina: 201, boundKina: 0, total: 201 },
        { mode: "普通", energy: 40, kina: 162, boundKina: 0, total: 162 },
      ],
    },
    {
      stars: 5,
      name: "幻影回廊",
      difficulties: [
        { mode: "困难", energy: 40, kina: 201, boundKina: 0, total: 201 },
        { mode: "普通", energy: 40, kina: 162, boundKina: 0, total: 162 },
      ],
    },
    {
      stars: 4,
      name: "无之摇篮",
      difficulties: [
        { mode: "困难", energy: 40, kina: 162, boundKina: 0, total: 162 },
        { mode: "普通", energy: 40, kina: 60, boundKina: 60, total: 120 },
      ],
    },
    {
      stars: 4,
      name: "死亡德拉玛塔巢穴",
      difficulties: [
        { mode: "困难", energy: 40, kina: 162, boundKina: 0, total: 162 },
        { mode: "普通", energy: 40, kina: 60, boundKina: 60, total: 120 },
      ],
    },
    {
      stars: 3,
      name: "凶猛的角窟",
      difficulties: [
        { mode: "困难", energy: 40, kina: 51, boundKina: 51, total: 102 },
        { mode: "普通", energy: 40, kina: 0, boundKina: 102, total: 102 },
      ],
    },
    {
      stars: 3,
      name: "火之神殿",
      difficulties: [
        { mode: "困难", energy: 40, kina: 51, boundKina: 51, total: 102 },
        { mode: "普通", energy: 40, kina: 0, boundKina: 102, total: 102 },
      ],
    },
    {
      stars: 2,
      name: "巴克隆空中岛",
      difficulties: [
        { mode: "困难", energy: 40, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 40, kina: 0, boundKina: 81, total: 81 },
      ],
    },
    {
      stars: 2,
      name: "乌努库库峡谷",
      difficulties: [
        { mode: "困难", energy: 40, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 40, kina: 0, boundKina: 81, total: 81 },
      ],
    },
    {
      stars: 1,
      name: "德拉乌伯尼尔",
      difficulties: [
        { mode: "困难", energy: 40, kina: 0, boundKina: 102, total: 102 },
        { mode: "普通", energy: 40, kina: 0, boundKina: 60, total: 60 },
      ],
    },
    {
      stars: 1,
      name: "克洞穴",
      difficulties: [
        { mode: "困难", energy: 40, kina: 0, boundKina: 102, total: 102 },
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
        { mode: "阶段4", energy: 60, kina: 420, boundKina: 0, total: 420 },
        { mode: "阶段3", energy: 40, kina: 240, boundKina: 0, total: 240 },
        { mode: "阶段2", energy: 40, kina: 201, boundKina: 0, total: 201 },
        { mode: "阶段1", energy: 40, kina: 171, boundKina: 0, total: 171 },
      ],
    },
    {
      stars: 3,
      name: "绯红羁绊之镜",
      difficulties: [
        { mode: "阶段4", energy: 40, kina: 240, boundKina: 0, total: 240 },
        { mode: "阶段3", energy: 40, kina: 201, boundKina: 0, total: 201 },
        { mode: "阶段2", energy: 40, kina: 171, boundKina: 0, total: 171 },
        { mode: "阶段1", energy: 40, kina: 150, boundKina: 0, total: 150 },
      ],
    },
    {
      stars: 2,
      name: "沉没的生命神殿",
      difficulties: [
        { mode: "阶段4", energy: 40, kina: 75, boundKina: 75, total: 150 },
        { mode: "阶段3", energy: 40, kina: 72, boundKina: 69, total: 141 },
        { mode: "阶段2", energy: 40, kina: 66, boundKina: 66, total: 132 },
        { mode: "阶段1", energy: 40, kina: 60, boundKina: 60, total: 120 },
      ],
    },
    {
      stars: 1,
      name: "破碎的雅尔卡尼斯",
      difficulties: [
        { mode: "阶段4", energy: 40, kina: 0, boundKina: 114, total: 114 },
        { mode: "阶段3", energy: 40, kina: 0, boundKina: 90, total: 90 },
        { mode: "阶段2", energy: 40, kina: 0, boundKina: 72, total: 72 },
        { mode: "阶段1", energy: 40, kina: 0, boundKina: 60, total: 60 },
      ],
    },
    {
      stars: 1,
      name: "德乌斯研究基地",
      difficulties: [
        { mode: "阶段4", energy: 40, kina: 0, boundKina: 114, total: 114 },
        { mode: "阶段3", energy: 40, kina: 0, boundKina: 90, total: 90 },
        { mode: "阶段2", energy: 40, kina: 0, boundKina: 72, total: 72 },
        { mode: "阶段1", energy: 40, kina: 0, boundKina: 60, total: 60 },
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
        { mode: "默认", energy: 80, kina: 200, boundKina: 200, total: 400 },
      ],
    },
    {
      stars: 5,
      name: "侵蚀净化所",
      key: "s2",
      difficulties: [
        { mode: "默认", energy: 80, kina: 800, boundKina: 0, total: 800 },
      ],
    },
    {
      stars: 5,
      name: "穆斯费尔圣杯",
      key: "s3",
      difficulties: [
        { mode: "困难", energy: 80, kina: 1200, boundKina: 0, total: 1200 },
        { mode: "普通", energy: 80, kina: 1000, boundKina: 0, total: 1000 },
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
  sanctuary: [
    { maxCount: Infinity, rate: 1.0, label: "无衰减 (基纳获得量 100%)" },
  ],
};
// 验证规则配置数组
const characterValidationRules = [
  //  存储奥德能量 (storedEnergy)
  {
    field: "storedEnergy",
    label: "补充奥德能量",
    validate: (form) => (Number(form?.storedEnergy) || 0) <= 2000,
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
        .filter(
          (char) => char.group === currentGroupId && char.id !== currentFormId,
        )
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
            (char.characterId || char.id) !== currentFormId,
        )
        .reduce(
          (sum, char) => sum + (Number(char?.storedMinigameCount) || 0),
          0,
        );

      // 同组总和 + 当前表单填写的值
      const total = otherGroupSum + (Number(form?.storedMinigameCount) || 0);

      return total <= 30;
    },
    message: () => "同组账号下古树庆典存储补充次数总和不能超过30次",
  },
  // // 4. 存储噩梦次数 (storedNightmareCount)
  // {
  //   field: "storedNightmareCount",
  //   label: "存储噩梦次数",
  //   validate: (form) => (Number(form.storedNightmareCount) || 0) <= 30,
  //   message: () => "存储噩梦次数不能超过30次",
  // },

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

const emit = defineEmits([
  "update-character",
  "delete-character",
  "toggle-lock",
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
/**
 * 校验角色表单数据
 * @param {Object} formData 当前表单对象 (如 newCharForm)
 * @returns {Object} { isValid: boolean, invalidFields: string[], errors: Object }
 */
const validateCharacterForm = (formData, context = {}) => {
  const invalidFields = []; // 不符合要求的字段名集合
  const errors = {}; // 具体的错误信息键值对

  characterValidationRules.forEach((rule) => {
    try {
      // 💡 关键修改：把 context（包含 allCharacters 等数据）传给 rule.validate
      const passes = rule.validate(formData, context);
      if (!passes) {
        invalidFields.push(rule.field);
        errors[rule.field] =
          typeof rule.message === "function"
            ? rule.message(formData)
            : rule.message;
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

// 点击游玩消耗触发
const handleClickGameplay = (char) => {
  gameplayCharForm.value = char;
  openGameplay.value = true;
  //清空重置默认字段
  //补充奥德
  supplementFormValues.value = {
    bigOdCount: 0,
    smallOdCount: 0,
  };
};

// 检查同组是否有角色已配置过每日副本挑战次数
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

// 游玩补充 表单内的控制
const supplementFormValues = ref({
  bigOdCount: 0, //大奥德数量
  smallOdCount: 0, //小奥德数量
  // 每日副本补充
  storedDailyRuns: 0,
  //噩梦补充
  storedNightmareCount: 0,
  // 古树庆典小游戏补充次数
  storedMinigameCount: 0,
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

//  每日副本补充次数：组内全员共享统计
const totalGroupStoredDailyRuns = computed(() => {
  const currentGroupId = gameplayCharForm.value?.group;
  if (!currentGroupId) return gameplayCharForm.value?.storedDailyRuns || 0;

  // 假设你的所有角色列表存在 characters 或 gameData.characters 里
  // 请根据你代码实际存放角色的变量名进行调整（比如 props.gameData.characters 或 characters.value）
  const allCharacters = props.gameData?.characters || [];

  // 筛选出同组的其他角色，并把他们的 storedDailyRuns 累加
  const otherCharactersSum = allCharacters
    .filter((char) => char.group === currentGroupId)
    .reduce((sum, char) => sum + (Number(char.storedDailyRuns) || 0), 0);

  // 加上当前表单里输入的数值
  let totalGroupStoredDailyRunsNum =
    otherCharactersSum +
    (Number(supplementFormValues.value?.storedDailyRuns) || 0);

  console.log("totalGroupStoredDailyRunsNum", totalGroupStoredDailyRunsNum);
  return totalGroupStoredDailyRunsNum;
});

// 古树庆典小游戏补充次数：组内全员共享统计

const totalGroupStoredMinigameCount = computed(() => {
  const currentGroupId = gameplayCharForm.value?.group;
  if (!currentGroupId) return gameplayCharForm.value?.storedMinigameCount || 0;

  // 假设你的所有角色列表存在 characters 或 gameData.characters 里
  // 请根据你代码实际存放角色的变量名进行调整（比如 props.gameData.characters 或 characters.value）
  const allCharacters = props.gameData?.characters || [];

  // 筛选出同组的其他角色，并把他们的 storedMinigameCount 累加
  const otherCharactersSum = allCharacters
    .filter((char) => char.group === currentGroupId)
    .reduce((sum, char) => sum + (Number(char.storedMinigameCount) || 0), 0);

  // 加上当前表单里输入的数值
  let totalGroupStoredMinigameCountNum =
    otherCharactersSum +
    (Number(supplementFormValues.value?.storedMinigameCount) || 0);

  console.log(
    "totalGroupStoredMinigameCountNum",
    totalGroupStoredMinigameCountNum,
  );
  return totalGroupStoredMinigameCountNum;
});

// 计数器加减操作
const handleUpdateOdCount = (type, delta) => {
  if (type === "big") {
    supplementFormValues.value.bigOdCount = Math.max(
      0,
      (supplementFormValues.value.bigOdCount || 0) + delta,
    );
  } else if (type === "small") {
    supplementFormValues.value.smallOdCount = Math.max(
      0,
      (supplementFormValues.value.smallOdCount || 0) + delta,
    );
  }
};
// 执行游玩补充确认（支持奥德、每日副本、古树庆典等多种类型的统一扩展）
const handleExecuteSupplement = async () => {
  const currentTarget = gameplayCharForm.value;
  if (!currentTarget) return;

  // 1. 定义所有补充类型的计算与验证规则（未来新增类型只需在这里加一个配置对象即可！）
  const supplementRules = [
    {
      key: "energy", // 对应后端/角色对象里的字段
      name: "奥德能量",
      unit: "点",
      // 计算本次增加的数量（大奥德*40 + 小奥德*10）
      getAdded: () =>
        (supplementFormValues.value.bigOdCount || 0) * 40 +
        (supplementFormValues.value.smallOdCount || 0) * 10,
      // 计算更新后的总量，并应用上限限制（例如奥德上限 2000）
      getNewValue: (current, added) => Math.min(2000, (current || 0) + added),
      // 重置本次填写的临时表单字段
      resetForm: () => {
        supplementFormValues.value.bigOdCount = 0;
        supplementFormValues.value.smallOdCount = 0;
      },
    },
    {
      key: "storedDailyRuns",
      name: "每日副本补充次数",
      unit: "次",
      getAdded: () => supplementFormValues.value.storedDailyRuns || 0,
      // 组内共享上限 30（此处也可以结合你前面的校验总和，若传了校验结果可直接用）
      getNewValue: (current, added) => Math.min(30, (current || 0) + added),
      resetForm: () => {
        supplementFormValues.value.storedDailyRuns = 0;
      },
    },
    {
      key: "storedMinigameCount",
      name: "古树庆典补充次数",
      unit: "次",
      getAdded: () => supplementFormValues.value.storedMinigameCount || 0,
      getNewValue: (current, added) => Math.min(30, (current || 0) + added),
      resetForm: () => {
        supplementFormValues.value.storedMinigameCount = 0;
      },
    },
    // 💡 【未来拓展示例】如果以后还有新的“某某补充”，只需要在这里追加一个对象：
    // {
    //   key: 'newFeatureCount',
    //   name: '新道具补充',
    //   unit: '个',
    //   getAdded: () => supplementFormValues.value.newFeatureCount || 0,
    //   getNewValue: (current, added) => (current || 0) + added,
    //   resetForm: () => { supplementFormValues.value.newFeatureCount = 0; },
    // },
  ];

  // 2. 遍历规则，收集本次所有有实际操作（新增量 > 0）的变更项
  let hasAnyChange = false;
  const updates = {};
  const successMessages = [];

  for (const rule of supplementRules) {
    const addedCount = rule.getAdded();
    if (addedCount > 0) {
      hasAnyChange = true;
      const currentValue = currentTarget[rule.key] || 0;
      const newValue = rule.getNewValue(currentValue, addedCount);

      updates[rule.key] = newValue;
      successMessages.push(`${rule.name} +${addedCount}${rule.unit}`);
    }
  }

  // 3. 校验是否有选择任何补充内容
  if (!hasAnyChange) {
    $alert("请先选择或输入要补充的数量！");
    return;
  }

  // 4. 组装更新后的完整角色对象
  const updatedCharacter = {
    ...currentTarget,
    ...updates,
  };

  // 5. 更新本地响应式数据
  gameplayCharForm.value = updatedCharacter;

  // 6. 触发持久化保存事件
  emit("update-character", updatedCharacter);

  // 7. 清空所有已参与补充的临时表单字段
  for (const rule of supplementRules) {
    if (rule.getAdded() > 0) {
      rule.resetForm();
    }
  }

  // 8. 统一吐出友好的提示信息
  $alert(`成功完成补充：${successMessages.join("，")}！`);
};

// ========================================副本消耗与吉纳收益计算开始========================================

// 消耗表单与挑战次数状态
const consumeForm = ref({
  dungeonType: localStorage.getItem("aion2_last_dungeon_type") || "expedition",
  selectedDungeonIndex:
    Number(localStorage.getItem("aion2_last_dungeon_idx")) || 0,
  selectedDiffIndex: Number(localStorage.getItem("aion2_last_diff_idx")) || 0,
  multiplier: Number(localStorage.getItem("aion2_last_multiplier")) || 1,
});
// 动态绑定当前角色所属分组的远征或超越通关次数
const currentActiveRuns = computed({
  get() {
    const groupId =
      gameplayCharForm.value?.group ?? gameplayCharForm.value?.groupId;
    const groups = props.gameData?.groups || [];

    // 如果没有绑定分组，直接返回 0
    if (groupId === null || groupId === undefined) return 0;

    const currentGroup = groups.find((g) => g.id === groupId);

    if (consumeForm.value.dungeonType === "expedition") {
      return currentGroup?.runs ?? gameplayCharForm.value?.runs ?? 0;
    } else if (consumeForm.value.dungeonType === "surpass") {
      return (
        currentGroup?.transcendRuns ??
        gameplayCharForm.value?.transcendRuns ??
        0
      );
    }
    return 0;
  },
  set(val) {
    const groupId =
      gameplayCharForm.value?.group ?? gameplayCharForm.value?.groupId;
    const groups = props.gameData?.groups || [];

    if (groupId === null || groupId === undefined) return;

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
  },
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
    dungeonDecayRules[consumeForm.value.dungeonType] ||
    dungeonDecayRules.expedition;
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
  return Number(
    (base * getRewardMultiplier.value * currentDecayRate.value).toFixed(2),
  );
});
// 计算绑定基纳增益
const calculatedBoundKinaGain = computed(() => {
  if (!currentSelectedDiff.value) return 0;
  const base = currentSelectedDiff.value.boundKina || 0;
  return Number(
    (base * getRewardMultiplier.value * currentDecayRate.value).toFixed(2),
  );
});

// 计算吉纳总收益
const calculatedTotalGain = computed(() => {
  return Number(
    (calculatedKinaGain.value + calculatedBoundKinaGain.value).toFixed(2),
  );
});
// 智能判断当前是否应该按双倍消耗计算
const isEffectiveDoubleEnergy = computed(() => {
  // 如果不是会员，绝对不允许双倍，强制为单倍
  if (!gameplayCharForm.value?.premiumMember) return false;
  // 如果是会员，则看用户的选择（默认情况下未定义或为 true 时即为双倍）
  return consumeForm.value.useDoubleEnergy !== false;
});
// 监听会员状态变化，动态校正消耗模式
watch(
  () => gameplayCharForm.value?.premiumMember,
  (isPremium) => {
    if (isPremium) {
      // 切换到会员身份时，默认勾选双倍消耗
      consumeForm.value.useDoubleEnergy = true;
    } else {
      // 切换到非会员身份时，强制切回单倍基础消耗
      consumeForm.value.useDoubleEnergy = false;
    }
  },
  { immediate: true }, // 初始化时立即执行一次
);
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
  const addRunsCount = consumeForm.value.multiplier || 1;
  const dungeonType = consumeForm.value.dungeonType; // 'expedition' | 'surpass' | 'sanctuary'
  const currentDateStr = new Date().toISOString().split("T")[0];
  const nowStr = new Date().toLocaleString();

  // ==================== A. 核心：根据不同副本类型计算当前的衰减率 ====================
  let currentDecayRate = 1.0;

  if (dungeonType === "expedition") {
    // 远征：基于分组共享的 runs 次数计算衰减
    const groupId = gameplayCharForm.value?.group;
    const targetGroup = (props.gameData?.groups || []).find(
      (g) => g.id === groupId,
    );
    const currentRuns = targetGroup?.runs || 0;

    const rule = dungeonDecayRules.expedition.find(
      (r) => currentRuns < r.maxCount,
    );
    currentDecayRate = rule ? rule.rate : 1.0;
  } else if (dungeonType === "surpass") {
    // 超越：基于分组共享的 transcendRuns 次数计算衰减
    const groupId = gameplayCharForm.value?.group;
    const targetGroup = (props.gameData?.groups || []).find(
      (g) => g.id === groupId,
    );
    const currentTranscendRuns = targetGroup?.transcendRuns || 0;

    const rule = dungeonDecayRules.surpass.find(
      (r) => currentTranscendRuns < r.maxCount,
    );
    currentDecayRate = rule ? rule.rate : 1.0;
  } else if (dungeonType === "sanctuary") {
    // 圣域：无衰减 (1.0)，或者如果你有圣域的独立衰减阶梯可以在这里加
    const rule = dungeonDecayRules.sanctuary.find((r) => true);
    currentDecayRate = rule ? rule.rate : 1.0;
  }

  // 计算本次实际获取的基纳/绑定基纳（基础单价 * 衰减率 * 倍率）
  // 假设你的页面中有计算单次基础收益的 computed，如 baseSingleKina, baseSingleBoundKina
  const baseKina =
    typeof baseSingleKina !== "undefined"
      ? baseSingleKina.value
      : consumeForm.value.baseKina || 100;
  const baseBoundKina =
    typeof baseSingleBoundKina !== "undefined"
      ? baseSingleBoundKina.value
      : consumeForm.value.baseBoundKina || 50;

  const totalKinaThisTime = Number(
    (baseKina * currentDecayRate * addRunsCount).toFixed(2),
  );
  const totalBoundKinaThisTime = Number(
    (baseBoundKina * currentDecayRate * addRunsCount).toFixed(2),
  );

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
        (log) => log.date === currentDateStr && log.type === dungeonType,
      );

      if (existingLogIndex !== -1) {
        groupLogs[existingLogIndex] = {
          ...groupLogs[existingLogIndex],
          count: groupLogs[existingLogIndex].count + addRunsCount,
          kinaGain: Number(
            (groupLogs[existingLogIndex].kinaGain + totalKinaThisTime).toFixed(
              2,
            ),
          ),
          boundKinaGain: Number(
            (
              groupLogs[existingLogIndex].boundKinaGain + totalBoundKinaThisTime
            ).toFixed(2),
          ),
          updatedAt: nowStr,
        };
      } else {
        groupLogs.push({
          date: currentDateStr,
          type: dungeonType,
          count: addRunsCount,
          kinaGain: totalKinaThisTime,
          boundKinaGain: totalBoundKinaThisTime,
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
  let updatedTotalTranscendRuns =
    gameplayCharForm.value?.totalTranscendRuns || 0;

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
    (log) => log.date === currentDateStr && log.type === dungeonType,
  );

  if (charExistingLogIndex !== -1) {
    charLogs[charExistingLogIndex] = {
      ...charLogs[charExistingLogIndex],
      count: charLogs[charExistingLogIndex].count + addRunsCount,
      kinaGain: Number(
        (charLogs[charExistingLogIndex].kinaGain + totalKinaThisTime).toFixed(
          2,
        ),
      ),
      boundKinaGain: Number(
        (
          charLogs[charExistingLogIndex].boundKinaGain + totalBoundKinaThisTime
        ).toFixed(2),
      ),
      updatedAt: nowStr,
    };
  } else {
    charLogs.push({
      date: currentDateStr,
      type: dungeonType,
      count: addRunsCount,
      kinaGain: totalKinaThisTime,
      boundKinaGain: totalBoundKinaThisTime,
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

  // 更新本地表单状态
  gameplayCharForm.value = updatedCharacter;

  console.log(
    `🔍 [GroupCharacterPanel] %c 消耗奥德与各副本类型收益计算更新: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    {
      dungeonType,
      currentDecayRate,
      totalKinaThisTime,
      updatedCharacter,
      newGroups,
    },
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
    newList,
  );
  console.log(
    `🔍 [GroupCharacterPanel:674] %c list: `,
    "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
    list,
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
  },
);

// 监听 filteredDungeonList 变化，如果当前选中的副本已经打完了，自动帮用户切换到第一个没打完的副本
watch(
  filteredDungeonList,
  (newList) => {
    if (consumeForm.value.dungeonType === "sanctuary") {
      const currentSelected = newList[consumeForm.value.selectedDungeonIndex];
      // 如果当前选中的项不存在或者已经打完了，就自动寻找第一个没打完的
      if (!currentSelected || currentSelected.isFinished) {
        const firstUnfinishedIndex = newList.findIndex(
          (item) => !item.isFinished,
        );
        if (firstUnfinishedIndex !== -1) {
          consumeForm.value.selectedDungeonIndex = firstUnfinishedIndex;
        }
      }
    }
  },
  { immediate: true, deep: true },
);
// ========================================副本消耗与吉纳收益计算开始========================================

//========================游玩消耗/补充弹框结束========================

//实时校验
watch(
  () => gameplayCharForm.value,
  (newVal) => {
    console.log(
      `🔍 [UsersAdmin:1250] %c 监听gameplayCharForm--校验触发: `,
      "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
      newVal,
    );

    if (newVal && Object.keys(newVal).length > 0) {
      const overrideForm = { ...newVal };

      // 每日副本组内同一账号下不同角色共享道具）校验
      if (totalGroupStoredDailyRuns.value > 30) {
        overrideForm.storedDailyRuns = totalGroupStoredDailyRuns.value;
      }
      //古树庆典小游戏组内（同一账号下不同角色共享道具）校验
      if (totalGroupStoredMinigameCount.value > 30) {
        overrideForm.storedMinigameCount = totalGroupStoredMinigameCount.value;
      }
      console.log(
        `🔍 [UsersAdmin:1250] %c 监听gameplayCharForm--校验触发:overrideForm `,
        "font-size:14px; background:#26A08F; color:#fff;font-weight: bold;",
        overrideForm,
      );

      // 3. 统一将完整带覆盖值的表单和上下文传给验证函数
      validationResult.value = validateCharacterForm(overrideForm, {
        allCharacters: props.gameData?.characters || [],
        groups: props.gameData?.groups || [],
      });
    } else {
      validationResult.value = { isValid: true, errors: {}, invalidFields: [] };
    }
  },
  { deep: true, immediate: true },
);

// 监听古树庆典小游戏实时校验
watch(
  () => totalGroupStoredMinigameCount.value,
  (val) => {
    if (val > 30 && supplementFormValues.value.storedMinigameCount > 0) {
      validationResult.value = validateCharacterForm({
        storedMinigameCount: val,
      });
    }else {
      validationResult.value = { isValid: true, errors: {}, invalidFields: [] };
    }
  },
);

// 监听每日副本实时校验
watch(
  () => totalGroupStoredDailyRuns.value,
  (val) => {
    if (val > 30 && supplementFormValues.value.storedDailyRuns > 0) {
      validationResult.value = validateCharacterForm({
        storedDailyRuns: val,
      });
    }else {
      validationResult.value = { isValid: true, errors: {}, invalidFields: [] };
    }
  },
);

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
          @click="handleClickGameplay(char)"
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
            class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10"
          >
            <div class="flex items-center gap-6">
              <!-- Tab 切换按钮组 -->
              <div
                class="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-200"
              >
                <button
                  type="button"
                  class="flex-1 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-2xs"
                  :class="
                    activeTab === 'consume'
                      ? 'bg-[#45a6d5] text-white shadow-md shadow-[#45a6d5]/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  "
                  @click="activeTab = 'consume'"
                >
                  消耗奥德
                </button>
                <button
                  type="button"
                  class="flex-1 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-2xs"
                  :class="
                    activeTab === 'supplement'
                      ? 'bg-[#45a6d5] text-white shadow-md shadow-[#45a6d5]/30'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  "
                  @click="activeTab = 'supplement'"
                >
                  游玩补充
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
          <!-- 卡片：以奥德为核心的极简状态栏 -->
          <div
            v-if="gameplayCharForm?.characterId"
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
                {{
                  gameplayCharForm?.className ||
                  gameplayCharForm?.class ||
                  "未知"
                }}
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
                v-if="gameplayCharForm?.premiumMember"
                class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded"
              >
                已开通特级会员
              </span>
              <span v-else class="text-[10px] font-bold px-1.5 py-0.5 rounded">
                未开通特级会员
              </span>
            </div>

            <!-- 右侧：绝对C位 —— 凸显当前奥德状态 -->
            <div
              class="flex items-center gap-3 bg-white border border-sky-200/80 px-3.5 py-1.5 rounded-xl shadow-2xs"
            >
              <div class="flex items-center gap-1.5">
                <div
                  class="w-2 h-2 rounded-full bg-[#45a6d5] animate-pulse"
                ></div>
                <span class="text-[11px] font-black text-slate-400">奥德</span>
              </div>

              <div class="flex items-center gap-3 text-xs">
                <!-- 基础奥德（大号高亮） -->
                <div class="flex items-baseline gap-0.5">
                  <span class="text-[10px] font-bold text-slate-400">基</span>
                  <strong class="text-sm font-black text-[#45a6d5]">{{
                    gameplayCharForm?.energy || 0
                  }}</strong>
                  <span class="text-[10px] text-slate-400"
                    >/{{ energyLimit }}</span
                  >
                </div>

                <div class="h-3 w-px bg-slate-200"></div>

                <!-- 存储奥德（大号高亮） -->
                <div class="flex items-baseline gap-0.5">
                  <span class="text-[10px] font-bold text-slate-400">存</span>
                  <strong class="text-sm font-black text-amber-600">{{
                    gameplayCharForm?.storedEnergy || 0
                  }}</strong>
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
                  <template
                    v-if="
                      !(
                        consumeForm.dungeonType === 'sanctuary' &&
                        filteredDungeonList[consumeForm.selectedDungeonIndex]
                          ?.isFinished
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
                          当前收益率: {{ currentDecayRate * 100 }}%
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
                      <label class="text-xs font-bold text-slate-500"
                        >选择具体副本</label
                      >
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
                          {{ "⭐".repeat(item.stars) }} - {{ item.name }}
                          {{
                            consumeForm.value?.dungeonType === "sanctuary"
                              ? `(已消耗: ${item.currentRuns}/${item.maxLimit})${item.isFinished ? " 【已打完】" : ""}`
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
                            (基础耗能: {{ diff.energy }})
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
                          最终消耗奥德: {{ calculatedEnergyCost }} 点
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
                            耗能 {{ currentSelectedDiff?.energy || 0 }}
                          </span>
                        </button>

                        <!-- 档位 2：会员双倍（仅会员可选，非会员置灰加锁提示） -->
                        <button
                          type="button"
                          :disabled="!gameplayCharForm?.premiumMember"
                          class="py-2.5 px-3 rounded-xl font-bold text-xs transition-all border text-center flex flex-col items-center justify-center gap-0.5"
                          :class="[
                            !gameplayCharForm?.premiumMember
                              ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : consumeForm.useDoubleEnergy !== false
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm cursor-pointer'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer',
                          ]"
                          @click="
                            gameplayCharForm?.premiumMember &&
                            (consumeForm.useDoubleEnergy = true)
                          "
                        >
                          <span>
                            双倍消耗
                            <span
                              v-if="!gameplayCharForm?.premiumMember"
                              class="text-[9px] font-normal opacity-75"
                              >(需会员)</span
                            >
                          </span>
                          <span class="text-[10px] opacity-80">
                            耗能 {{ (currentSelectedDiff?.energy || 0) * 2 }}
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
            <template
              v-if="activeTab === 'supplement' && gameplayCharForm?.characterId"
            >
              <!-- 奥德存储补充配置卡片 -->
              <div
                class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all"
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
                      class="text-sm font-black uppercase tracking-wider text-slate-700"
                    >
                      奥德存储补充
                    </div>
                    <span
                      v-if="
                        validationResult.invalidFields.includes('storedEnergy')
                      "
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
                    <span class="text-[10px] font-bold text-slate-400"
                      >当前基础奥德</span
                    >
                    <span class="text-lg font-black text-slate-800 mt-0.5">
                      {{ gameplayCharForm.energy || 0 }}
                      <span class="text-xs font-bold text-slate-400">点</span>
                    </span>
                  </div>
                  <div class="flex flex-col border-l border-slate-200/80 pl-3">
                    <span class="text-[10px] font-bold text-slate-400"
                      >当前已补充存储奥德</span
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
                          type="number"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black flex items-center justify-center transition-all cursor-pointer"
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
                          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="handleUpdateOdCount('small', -1)"
                        >
                          -
                        </button>
                        <input
                          v-model.number="supplementFormValues.smallOdCount"
                          type="number"
                          min="0"
                          class="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-black text-sm text-slate-800 outline-none"
                        />
                        <button
                          type="button"
                          class="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-black flex items-center justify-center transition-all cursor-pointer"
                          @click="handleUpdateOdCount('small', 1)"
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
                      补充后存储总计:
                      <strong
                        class="text-sm font-black"
                        :class="
                          (gameplayCharForm.storedEnergy || 0) +
                            totalSupplementPoints >
                          2000
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        "
                      >
                        {{
                          (gameplayCharForm.storedEnergy || 0) +
                          totalSupplementPoints
                        }}
                        点
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 每日副本补充卡片 -->
              <div
                class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all"
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
                      v-if="
                        validationResult.invalidFields.includes(
                          'storedDailyRuns',
                        )
                      "
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
                        >+{{
                          supplementFormValues.storedDailyRuns || 0
                        }}
                        次</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                        @click="
                          supplementFormValues.storedDailyRuns = Math.max(
                            0,
                            (supplementFormValues.storedDailyRuns || 0) - 1,
                          )
                        "
                      >
                        -
                      </button>
                      <input
                        v-model.number="supplementFormValues.storedDailyRuns"
                        type="number"
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
                        >+{{
                          supplementFormValues.storedDailyRuns || 0
                        }}
                        次</strong
                      >
                    </span>
                    <span class="font-bold text-slate-500">
                      组内补充总计:
                      <strong
                        class="text-sm font-black"
                        :class="
                          totalGroupStoredDailyRuns > 30
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        "
                      >
                        {{ totalGroupStoredDailyRuns }} / 30 次
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 古树庆典小游戏补充卡片 -->
              <div
                class="p-6 bg-white border-2 rounded-3xl space-y-5 shadow-sm transition-all"
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
                        validationResult.invalidFields.includes(
                          'storedMinigameCount',
                        )
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
                        >+{{
                          supplementFormValues.storedMinigameCount || 0
                        }}
                        次</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer"
                        @click="
                          supplementFormValues.storedMinigameCount = Math.max(
                            0,
                            (supplementFormValues.storedMinigameCount || 0) - 1,
                          )
                        "
                      >
                        -
                      </button>
                      <input
                        v-model.number="
                          supplementFormValues.storedMinigameCount
                        "
                        type="number"
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
                        >+{{
                          supplementFormValues.storedMinigameCount || 0
                        }}
                        次</strong
                      >
                    </span>
                    <span class="font-bold text-slate-500">
                      组内补充总计:
                      <strong
                        class="text-sm font-black"
                        :class="
                          totalGroupStoredMinigameCount > 30
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        "
                      >
                        {{ totalGroupStoredMinigameCount }} / 30 次
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </template>
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
                    (gameplayCharForm?.storedEnergy || 0) ||
                calculatedEnergyCost <= 0
              "
              class="px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2"
              :class="[
                calculatedEnergyCost >
                  (gameplayCharForm?.energy || 0) +
                    (gameplayCharForm?.storedEnergy || 0) ||
                calculatedEnergyCost <= 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 cursor-pointer',
              ]"
              @click="handleExecuteConsume"
            >
              <span
                v-if="
                  calculatedEnergyCost >
                  (gameplayCharForm?.energy || 0) +
                    (gameplayCharForm?.storedEnergy || 0)
                "
              >
                奥德能量不足无法消耗，请补充后重试。
              </span>
              <span v-else>
                确认消耗 {{ calculatedEnergyCost }} 点奥德并完成记录
              </span>
            </button>

            <!-- 确认补充按钮 (仅在 supplement 标签页且已选角色时显示) -->
            <button
              type="button"
              v-if="gameplayCharForm?.characterId && activeTab === 'supplement'"
              @click="handleExecuteSupplement"
              :disabled="saving || !validationResult.isValid"
              class="px-8 py-3 rounded-xl bg-[#45a6d5] text-white font-black text-sm hover:bg-[#3b95c0] transition-all shadow-md shadow-sky-500/25 disabled:opacity-50"
            >
              {{ saving ? "补充中..." : "确认补充" }}
              <!-- {{validationResult}} -->
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

/**
 * 游戏日常与副本刷新规则配置字典（完整版）
 * 专为定时任务与状态自动更新而设计
 */
export const gameRulesDictionary = [
  // ==================== 1. 奥德能量相关 ====================
  {
    id: "energy_normal",
    name: "奥德能量恢复（非会员）",
    dimension: "character",
    targetField: "energy",
    lastTimeField: "lastEnergyUpdate",
    maxValue: 560,
    storedMaxValue: 2000,
    refreshType: "interval",
    intervalHours: 3,
    increment: 10,
    condition: (char: any) => !char.premiumMember,
    description:
      "角色单独：非会员状态下，每3小时自动恢复10点奥德能量，能量上限为560点，补充上限为2000点。",
  },
  {
    id: "energy_premium",
    name: "奥德能量恢复（会员）",
    dimension: "character",
    targetField: "energy",
    lastTimeField: "lastEnergyUpdate",
    maxValue: 840,
    storedMaxValue: 2000,
    refreshType: "interval",
    intervalHours: 3,
    increment: 15,
    condition: (char: any) => char.premiumMember,
    description:
      "角色单独：会员状态下，每3小时自动恢复15点奥德能量，能量上限为840点，补充上限为2000点。",
  },
  {
    id: "energy_transform_char_4",
    name: "奥德能量（物质变换-角色）4个大奥德",
    dimension: "character",
    targetField: "isMaterialCharOd",
    lastTimeField: "materialCharOdDate",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    resetValue: false,
    description: "角色单独：物质变换角色奥德能量，于每周三5点重置状态。",
  },
  {
    id: "energy_transform_server_16",
    name: "奥德能量（物质变换-账号组）16个大奥德",
    dimension: "server",
    targetField: "isBreezeAccountOd", // 对应结构中的 breezeAccountOd / isBreezeAccountOd
    lastTimeField: "lastUpdatedAt",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    resetValue: false,
    description: "服务器共享：物质变换账号奥德能量，于每周三5点重置状态。",
  },
  {
    id: "energy_breeze_shop_weekly",
    name: "微风商店上限兑换管理（奥德/复活石/卷轴）",
    dimension: "server",
    targetField: null,
    lastTimeField: "lastUpdatedAt",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    action: (group: any) => {
      group.isMaterialAccountOd = false;
      group.materialAccountOd = 0;
      group.isBreezeReviveStone = false;
      group.breezeReviveStone = 0;
      group.isBreezeRiftTicket = false;
      group.breezeRiftTicket = 0;
      group.isBreezeDailyTicket = false;
      group.breezeDailyTicket = 0;
      group.isBreezeNightmareTicket = false;
      group.breezeNightmareTicket = 0;
    },
    description:
      "服务器共享：微风商会商店周限购项目（奥德能量、复活石、未知缝隙卷、完成卷等），于每周三5点重置。",
  },

  // ==================== 2. 副本与收益衰减规则 ====================
  {
    id: "dungeon_decay_rule",
    name: "副本收益衰减规则（征服/超越）",
    dimension: "server",
    targetField: null,
    lastTimeField: "lastUpdatedAt",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    action: (group: any, characters: any[]) => {
      // 组内所有角色的通关次数归零
      characters.forEach((char) => {
        char.runs = 0;
        char.transcendRuns = 0;
      });
      group.runs = 0;
      group.transcendRuns = 0;
    },
    description:
      "服务器共享：副本收益衰减规则（征服与超越），于每周三5点重置各角色及分组通关次数。",
  },

  // ==================== 3. 每日刷新项目（使命、古树、次元、噩梦） ====================
  {
    id: "daily_sign_in",
    name: "每日签到重置",
    dimension: "server", // 对应每个分组（Group）的签到状态
    targetField: "dailySignIn",
    lastTimeField: "dailySignInDate",
    refreshType: "daily",
    cron: "0 5 * * *",
    action: (group: any) => {
      group.dailySignIn = false;
      // 如果需要顺便清空或记录日期，也可以在这里处理
      // group.dailySignInDate = "";
    },
    description: "服务器共享：每日签到状态，于每天5点重置为未签到状态。",
  },
  {
    id: "mission_daily",
    name: "使命任务",
    dimension: "server",
    targetField: "dailyMission",
    lastTimeField: "lastUpdatedAt",
    refreshType: "daily",
    cron: "0 5 * * *",
    resetValue: false,
    description: "服务器共享：使命任务，于每天5点重置完成状态。",
  },
  {
    id: "ancient_tree",
    name: "古树庆典",
    dimension: "server",
    targetField: "minigameCount",
    storedTargetField: "storedMinigameCount",
    lastTimeField: "lastMinigameUpdate",
    maxCount: 14,
    storedMaxCount: 30,
    refreshType: "daily",
    cron: "0 5 * * *",
    incrementCount: 2,
    description:
      "服务器共享：古树庆典，于每天5点恢复2次，上限14次，补充上限30次。",
  },
  {
    id: "dimensional_raid",
    name: "次元袭击",
    dimension: "server",
    targetField: "dimensionalCount",
    storedTargetField: "storedDimensionalCount",
    lastTimeField: "lastDimensionalUpdate",
    maxCount: 7,
    storedMaxCount: 30,
    refreshType: "daily",
    cron: "0 5 * * *",
    incrementCount: 1, // 补全：原规则每天恢复1次
    description:
      "服务器共享：次元袭击，于每天5点恢复1次，上限7次，补充上限30次。",
  },
  {
    id: "nightmare",
    name: "噩梦",
    dimension: "character",
    targetField: "nightmareCount",
    storedTargetField: "storedNightmareCount",
    lastTimeField: "lastNightmareUpdate",
    maxCount: 14,
    storedMaxCount: 30,
    refreshType: "daily",
    cron: "0 5 * * *",
    incrementCount: 2,
    description:
      "角色单独：噩梦副本，于每天5点恢复2次，上限14次，补充上限30次。",
  },

  // ==================== 4. 每周三刷新项目（觉醒战、战场、圣域） ====================
  {
    id: "awakening_battle",
    name: "觉醒战",
    dimension: "character",
    targetField: "awakening",
    storedTargetField: "storedAwakening",
    lastTimeField: "lastAwakeningUpdate",
    maxCount: 3,
    storedMaxCount: 30,
    refreshType: "weekly",
    cron: "0 5 * * 3",
    incrementCount: 3,
    description:
      "角色单独：觉醒战，于每周三5点恢复3次，上限3次，补充上限30次。",
  },
  {
    id: "battlefield",
    name: "战场",
    dimension: "character",
    targetField: "battlefield",
    lastTimeField: "lastBattlefieldUpdate",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    resetValue: 0,
    description: "角色单独：战场玩法，于每周三5点重置。",
  },
  {
    id: "sanctuary_1",
    name: "圣域1深渊重铸：卢德莱",
    dimension: "character",
    targetField: "sanctuaryRuns.s1",
    lastTimeField: "lastSanctuaryRunsUpdate",
    resetValue: 0,
    refreshType: "weekly",
    cron: "0 5 * * 3",
    description: "角色单独：圣域1深渊重铸：卢德莱，于每周三5点重置次数。",
  },
  {
    id: "sanctuary_2",
    name: "圣域2侵蚀净化所",
    dimension: "character",
    targetField: "sanctuaryRuns.s2",
    lastTimeField: "lastSanctuaryRunsUpdate",
    resetValue: 0,
    refreshType: "weekly",
    cron: "0 5 * * 3",
    description: "角色单独：圣域2侵蚀净化所，于每周三5点重置次数。",
  },
  {
    id: "sanctuary_3",
    name: "圣域3穆斯费尔尔圣杯",
    dimension: "character",
    targetField: "sanctuaryRuns.s3",
    lastTimeField: "lastSanctuaryRunsUpdate",
    resetValue: 0,
    refreshType: "weekly",
    cron: "0 5 * * 3",
    description: "角色单独：圣域3穆斯费尔尔圣杯，于每周三5点重置次数。",
  },

  // ==================== 5. 指令书管理（本地/深渊/地区） ====================
  {
    id: "abyss_instruction",
    name: "深渊指令书（下层 & 中层）",
    dimension: "server",
    targetField: null,
    lastTimeField: "lastUpdatedAt",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    action: (group: any) => {
      group.lowerAbyssNormal = 0;
      group.lowerAbyssSkilled = 0;
      group.lowerAbyssElite = 0;
      group.lowerAbyssSpecial = 0;
      group.isLowerAbyss = false;

      group.midAbyssSkilled = 0;
      group.midAbyssSpecial = 0;
      group.isMidAbyss = false;
    },
    description:
      "服务器共享：深渊指令书（下层与中层），于每周三5点重置购买状态与数量。",
  },
  {
    id: "region_instruction",
    name: "地区指令书（A & B）",
    dimension: "server",
    targetField: null,
    lastTimeField: "lastUpdatedAt",
    refreshType: "weekly",
    cron: "0 5 * * 3",
    action: (group: any) => {
      group.regionACount = 0;
      group.regionBCount = 0;
      group.isRegionACount = false;
      group.isRegionBCount = false;
    },
    description: "服务器共享：地区指令书，于每周三5点重置。",
  },
];

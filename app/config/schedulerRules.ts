// config/schedulerRules.ts

export interface ScheduleRule {
  id: string; // 唯一标识，对应 character 中的字段或逻辑
  name: string; // 规则名称
  type: 'interval' | 'daily_5am' | 'wednesday_5am'; // 规则类型
  
  // interval 类型专有字段
  intervalHours?: number; // 恢复间隔（小时）
  recoverAmountMember?: number; // 会员恢复量
  recoverAmountNonMember?: number; // 非会员恢复量
  maxCapMember?: number; // 会员上限
  maxCapNonMember?: number; // 非会员上限

  // daily / wednesday 类型字段
  recoverAmount?: number; // 恢复/增加的次数
  maxCap?: number; // 存储上限
  resetValue?: any; // 重置目标值（如果是布尔值重置，如 false）
  
  // 作用目标字段映射
  targetField: string; // 角色对象中的目标数值字段
  lastUpdateField: string; // 角色对象中的上一次更新时间字段
  subField?: string; // 如果目标是嵌套对象（如 sanctuary.s1），在此指定 key
}

export const SCHEDULER_RULES: ScheduleRule[] = [
  // 1. 奥德能量恢复 (每3小时)
  {
    id: 'energy_recovery',
    name: '奥德能量恢复',
    type: 'interval',
    intervalHours: 3,
    recoverAmountNonMember: 10,
    recoverAmountMember: 15,
    maxCapNonMember: 560,
    maxCapMember: 840,
    targetField: 'energy',
    lastUpdateField: 'lastEnergyUpdate'
  },

  // 2. 奥德能量物质变换 (周三 05:00 重置)
  {
    id: 'weekly_energy_purchased',
    name: '奥德能量物质变换(消耗品)',
    type: 'wednesday_5am',
    resetValue: false,
    targetField: 'weeklyEnergyPurchased',
    lastUpdateField: 'weeklyEnergyPurchasedDate'
  },
  {
    id: 'breeze_energy_purchased',
    name: '奥德能量物质变换(微风商会)',
    type: 'wednesday_5am',
    resetValue: false,
    targetField: 'breezeEnergyPurchased',
    lastUpdateField: 'breezeEnergyPurchasedDate'
  },

  // 3. 每日 5 点恢复类 (古树庆典、次元袭击、噩梦等)
  {
    id: 'nightmare_recovery',
    name: '噩梦次数恢复',
    type: 'daily_5am',
    recoverAmount: 2,
    maxCap: 14,
    targetField: 'nightmareCount',
    lastUpdateField: 'lastNightmareUpdate'
  },
  {
    id: 'daily_runs_recovery',
    name: '每日副本(古树/次元等)次数',
    type: 'daily_5am',
    recoverAmount: 2,
    maxCap: 14,
    targetField: 'dailyRuns',
    lastUpdateField: 'lastDailyRunsUpdate'
  },

  // 4. 周三 5 点恢复类 - 圣域副本 (s1, s2, s3)
  {
    id: 'sanctuary_s1',
    name: '圣域1深渊重铸',
    type: 'wednesday_5am',
    recoverAmount: 1,
    maxCap: 1,
    targetField: 'sanctuary',
    subField: 's1',
    lastUpdateField: 'lastSanctuaryRunsUpdate'
  },
  {
    id: 'sanctuary_s2',
    name: '圣域2侵蚀净化所',
    type: 'wednesday_5am',
    recoverAmount: 1,
    maxCap: 1,
    targetField: 'sanctuary',
    subField: 's2',
    lastUpdateField: 'lastSanctuaryRunsUpdate'
  },
  {
    id: 'sanctuary_s3',
    name: '圣域3稳斯费尔圣杯',
    type: 'wednesday_5am',
    recoverAmount: 1,
    maxCap: 1,
    targetField: 'sanctuary',
    subField: 's3',
    lastUpdateField: 'lastSanctuaryRunsUpdate'
  },

  // 5. 周三 5 点重置类 - 战局/指令
  {
    id: 'local_order_reset',
    name: '本地指令书',
    type: 'wednesday_5am',
    resetValue: false,
    targetField: 'localOrderCompleted',
    lastUpdateField: 'localOrderDate'
  },
  {
    id: 'abyss_order_reset',
    name: '深渊指令书',
    type: 'wednesday_5am',
    resetValue: false,
    targetField: 'abyssOrderCompleted',
    lastUpdateField: 'abyssOrderDate'
  },
];
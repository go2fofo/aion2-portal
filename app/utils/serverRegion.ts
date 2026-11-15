/**
 * 角色所属服务器区域识别 + 各区域游戏重置时间配置
 *
 * 【设计原则：最小改动】
 * - 不改任何数据结构：区域直接由角色的 serverId 推导（AddChar 时已按规则入库）
 *     台服:   1001-1018 / 2001-2018
 *     韩服:   11001-11021 / 12001-12021（+10000 偏移）
 *     国际服: 21101-21510 / 22101-22510（+20000 偏移）
 * - 时间戳体系不变：全部沿用「北京时间虚拟时间戳」（getBeijingTimestamp 约定），
 *   各区域只差异在「每日重置小时」与「能量恢复锚点小时」，零数据迁移。
 * - 手动兜底：角色对象上可直接写 region 字段（'tw' | 'kr' | 'global'），优先级最高。
 *
 * ⚠️ 需要按官方实际时间调整时，只改下面 regionGameConfig 里的数字即可。
 */
import { isKrServerId } from './aionKrServers'
import { isGlobalServerId } from './aionGlobalServers'

export type RegionId = 'tw' | 'kr' | 'global'

export type RegionGameConfig = {
  id: RegionId
  label: string
  /** 每日重置小时（北京时间，0-23）。台服 5 点；韩服 4 点；国际服按官方实际时间调整 */
  dailyResetHour: number
  /** 每周重置星期（0=周日，3=周三） */
  weeklyResetDay: number
}

export const regionGameConfig: Record<RegionId, RegionGameConfig> = {
  tw: {
    id: 'tw',
    label: '台服',
    dailyResetHour: 5,
    weeklyResetDay: 3,
  },
  kr: {
    id: 'kr',
    label: '韩服',
    // 韩服每日 4 点初始化；若官方实际为「首尔时间 04:00」（= 北京时间 3 点），把这里改成 3 即可
    dailyResetHour: 4,
    weeklyResetDay: 3,
  },
  global: {
    id: 'global',
    label: '国际服',
    // 国际服（Steam/全球服）重置时间请按官方实际行为调整此数字
    dailyResetHour: 5,
    weeklyResetDay: 3,
  },
}

/** 由 serverId 推导所属区域（无法识别时按台服规则处理，保持历史行为） */
export const getRegionByServerId = (serverId: any): RegionId => {
  const id = Number(serverId)
  if (!Number.isFinite(id) || !id) return 'tw'
  if (isKrServerId(id)) return 'kr'
  if (isGlobalServerId(id)) return 'global'
  return 'tw'
}

/** 角色区域：显式 region 字段 > serverId 推导 > 默认台服 */
export const getCharRegion = (char: any): RegionId => {
  const r = char?.region
  if (r && regionGameConfig[r]) return r
  return getRegionByServerId(char?.serverId)
}

export const getRegionLabelByServerId = (serverId: any): string =>
  regionGameConfig[getRegionByServerId(serverId)]?.label || '台服'

/**
 * 指定时间戳所在的「每日重置边界」（最近一次重置时刻）
 * 例：resetHour=5，14:00 -> 当天 5 点；03:00 -> 昨天 5 点
 */
export const getRegionDailyBoundary = (baseTime: number, resetHour: number): number => {
  const date = new Date(baseTime)
  const boundary = new Date(date)
  boundary.setHours(resetHour, 0, 0, 0)
  if (date.getTime() < boundary.getTime()) {
    boundary.setDate(boundary.getDate() - 1)
  }
  return boundary.getTime()
}

/**
 * 指定时间戳所在的「每周重置边界」（最近一次周重置时刻）
 * 例：weeklyResetDay=3（周三）、resetHour=5
 */
export const getRegionWeeklyBoundary = (baseTime: number, cfg: RegionGameConfig): number => {
  const d = new Date(baseTime)
  const day = d.getDay()
  const hour = d.getHours()
  let diffDays = day - cfg.weeklyResetDay
  if (diffDays < 0 || (diffDays === 0 && hour < cfg.dailyResetHour)) {
    diffDays += 7
  }
  d.setDate(d.getDate() - diffDays)
  d.setHours(cfg.dailyResetHour, 0, 0, 0)
  return d.getTime()
}

/**
 * 能量恢复锚点小时（每 3 小时恢复，锚定在每日重置时间）
 * 台服重置 5 点 -> [2,5,8,11,14,17,20,23]（与现有线上行为完全一致）
 * 韩服重置 4 点 -> [1,4,7,10,13,16,19,22]
 */
export const getRegionEnergyRefreshHours = (resetHour: number): number[] => {
  const start = (((resetHour - 3) % 24) + 24) % 24
  return Array.from({ length: 8 }, (_, i) => (start + i * 3) % 24)
}

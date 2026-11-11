/**
 * 永恒之塔2（国际服 / 全球服 / Steam）服务器配置
 * 数据来源：https://aion2.plaync.com/en-us/api/gameinfo/servers?lang=en-US&region=xxx
 *
 * ⚠️ 国际服官方 serverId（race1: 1101-1510，race2: 2101-2510）与台服/韩服可能混淆，
 * 前端与数据库统一使用「偏移 ID」：真实 serverId + 20000
 *   - 天族：21101 ~ 21510
 *   - 魔族：22101 ~ 22510
 * 调用国际服接口时使用 getGlobalRealServerId(offsetId) 还原真实 serverId。
 */
export type GlobalRegionId = 'naw' | 'nae' | 'eu' | 'la' | 'as'

export type AionGlobalRegion = {
  id: GlobalRegionId
  label: string
  /** 接口 localeInfo 参数 */
  localeInfo: string
}

export type AionGlobalServer = {
  regionId: GlobalRegionId
  raceId: 1 | 2
  /** 偏移后的 serverId（系统内部使用） */
  serverId: number
  /** 国际服真实 serverId */
  realServerId: number
  /** 中文服务器名 */
  serverName: string
  /** 英文服务器名（官方接口返回值） */
  serverNameEn: string
  serverShortName: string
}

export const GLOBAL_SERVER_ID_OFFSET = 20000

export const globalRegionList: AionGlobalRegion[] = [
  { id: 'naw', label: '北美洲西部', localeInfo: 'en-US' },
  { id: 'nae', label: '北美洲东部', localeInfo: 'en-US' },
  { id: 'eu', label: '欧洲', localeInfo: 'en-US' },
  { id: 'la', label: '南美洲', localeInfo: 'en-US' },
  { id: 'as', label: '亚洲', localeInfo: 'en-US' },
]

export const getGlobalRegionById = (id: string) =>
  globalRegionList.find((r) => r.id === id) || null

export const aionGlobalServerList: AionGlobalServer[] = [
  // ==================== 北美洲西部 (naw) ====================
  { regionId: 'naw', raceId: 1, serverId: 21201, realServerId: 1201, serverName: '希埃尔', serverNameEn: 'Siel', serverShortName: 'SIE' },
  { regionId: 'naw', raceId: 1, serverId: 21202, realServerId: 1202, serverName: '奈萨肯', serverNameEn: 'Nezekan', serverShortName: 'NEZ' },
  { regionId: 'naw', raceId: 1, serverId: 21203, realServerId: 1203, serverName: '白杰尔', serverNameEn: 'Vaizel', serverShortName: 'VAI' },
  { regionId: 'naw', raceId: 1, serverId: 21204, realServerId: 1204, serverName: '凯西内尔', serverNameEn: 'Kaisinel', serverShortName: 'KAI' },
  { regionId: 'naw', raceId: 1, serverId: 21205, realServerId: 1205, serverName: '尤斯迪埃', serverNameEn: 'Yustiel', serverShortName: 'YUS' },
  { regionId: 'naw', raceId: 2, serverId: 22201, realServerId: 2201, serverName: '伊斯拉佩尔', serverNameEn: 'Israphel', serverShortName: 'ISR' },
  { regionId: 'naw', raceId: 2, serverId: 22202, realServerId: 2202, serverName: '吉凯尔', serverNameEn: 'Zikel', serverShortName: 'ZIK' },
  { regionId: 'naw', raceId: 2, serverId: 22203, realServerId: 2203, serverName: '崔妮尔', serverNameEn: 'Triniel', serverShortName: 'TRI' },
  { regionId: 'naw', raceId: 2, serverId: 22204, realServerId: 2204, serverName: '露梅尔', serverNameEn: 'Lumiel', serverShortName: 'LUM' },
  { regionId: 'naw', raceId: 2, serverId: 22205, realServerId: 2205, serverName: '玛尔库坦', serverNameEn: 'Marchutan', serverShortName: 'MAR' },
  // ==================== 北美洲东部 (nae) ====================
  { regionId: 'nae', raceId: 1, serverId: 21101, realServerId: 1101, serverName: '希埃尔', serverNameEn: 'Siel', serverShortName: 'SIE' },
  { regionId: 'nae', raceId: 1, serverId: 21102, realServerId: 1102, serverName: '奈萨肯', serverNameEn: 'Nezekan', serverShortName: 'NEZ' },
  { regionId: 'nae', raceId: 1, serverId: 21103, realServerId: 1103, serverName: '白杰尔', serverNameEn: 'Vaizel', serverShortName: 'VAI' },
  { regionId: 'nae', raceId: 1, serverId: 21104, realServerId: 1104, serverName: '凯西内尔', serverNameEn: 'Kaisinel', serverShortName: 'KAI' },
  { regionId: 'nae', raceId: 1, serverId: 21105, realServerId: 1105, serverName: '尤斯迪埃', serverNameEn: 'Yustiel', serverShortName: 'YUS' },
  { regionId: 'nae', raceId: 1, serverId: 21106, realServerId: 1106, serverName: '艾瑞尔', serverNameEn: 'Ariel', serverShortName: 'ARI' },
  { regionId: 'nae', raceId: 1, serverId: 21107, realServerId: 1107, serverName: '普雷奇翁', serverNameEn: 'Fregion', serverShortName: 'FRE' },
  { regionId: 'nae', raceId: 1, serverId: 21108, realServerId: 1108, serverName: '梅斯兰泰达', serverNameEn: 'Meslamtaeda', serverShortName: 'MES' },
  { regionId: 'nae', raceId: 1, serverId: 21109, realServerId: 1109, serverName: '希塔尼耶', serverNameEn: 'Hithanya', serverShortName: 'HIT' },
  { regionId: 'nae', raceId: 2, serverId: 22101, realServerId: 2101, serverName: '伊斯拉佩尔', serverNameEn: 'Israphel', serverShortName: 'ISR' },
  { regionId: 'nae', raceId: 2, serverId: 22102, realServerId: 2102, serverName: '吉凯尔', serverNameEn: 'Zikel', serverShortName: 'ZIK' },
  { regionId: 'nae', raceId: 2, serverId: 22103, realServerId: 2103, serverName: '崔妮尔', serverNameEn: 'Triniel', serverShortName: 'TRI' },
  { regionId: 'nae', raceId: 2, serverId: 22104, realServerId: 2104, serverName: '露梅尔', serverNameEn: 'Lumiel', serverShortName: 'LUM' },
  { regionId: 'nae', raceId: 2, serverId: 22105, realServerId: 2105, serverName: '玛尔库坦', serverNameEn: 'Marchutan', serverShortName: 'MAR' },
  { regionId: 'nae', raceId: 2, serverId: 22106, realServerId: 2106, serverName: '阿斯佩尔', serverNameEn: 'Azphel', serverShortName: 'AZP' },
  { regionId: 'nae', raceId: 2, serverId: 22107, realServerId: 2107, serverName: '艾莱修奇卡', serverNameEn: 'Ereshkigal', serverShortName: 'ERE' },
  { regionId: 'nae', raceId: 2, serverId: 22108, realServerId: 2108, serverName: '布里特拉', serverNameEn: 'Beritra', serverShortName: 'BER' },
  { regionId: 'nae', raceId: 2, serverId: 22109, realServerId: 2109, serverName: '奈蒙', serverNameEn: 'Nemon', serverShortName: 'NEM' },
  // ==================== 欧洲 (eu) ====================
  { regionId: 'eu', raceId: 1, serverId: 21301, realServerId: 1301, serverName: '希埃尔', serverNameEn: 'Siel', serverShortName: 'SIE' },
  { regionId: 'eu', raceId: 1, serverId: 21302, realServerId: 1302, serverName: '奈萨肯', serverNameEn: 'Nezekan', serverShortName: 'NEZ' },
  { regionId: 'eu', raceId: 1, serverId: 21303, realServerId: 1303, serverName: '白杰尔', serverNameEn: 'Vaizel', serverShortName: 'VAI' },
  { regionId: 'eu', raceId: 1, serverId: 21304, realServerId: 1304, serverName: '凯西内尔', serverNameEn: 'Kaisinel', serverShortName: 'KAI' },
  { regionId: 'eu', raceId: 1, serverId: 21305, realServerId: 1305, serverName: '尤斯迪埃', serverNameEn: 'Yustiel', serverShortName: 'YUS' },
  { regionId: 'eu', raceId: 1, serverId: 21306, realServerId: 1306, serverName: '艾瑞尔', serverNameEn: 'Ariel', serverShortName: 'ARI' },
  { regionId: 'eu', raceId: 1, serverId: 21307, realServerId: 1307, serverName: '普雷奇翁', serverNameEn: 'Fregion', serverShortName: 'FRE' },
  { regionId: 'eu', raceId: 1, serverId: 21308, realServerId: 1308, serverName: '梅斯兰泰达', serverNameEn: 'Meslamtaeda', serverShortName: 'MES' },
  { regionId: 'eu', raceId: 1, serverId: 21309, realServerId: 1309, serverName: '希塔尼耶', serverNameEn: 'Hithanya', serverShortName: 'HIT' },
  { regionId: 'eu', raceId: 1, serverId: 21310, realServerId: 1310, serverName: '纳尼亚', serverNameEn: 'Nania', serverShortName: 'NAN' },
  { regionId: 'eu', raceId: 1, serverId: 21311, realServerId: 1311, serverName: '塔哈巴达', serverNameEn: 'Tahavatha', serverShortName: 'TAH' },
  { regionId: 'eu', raceId: 1, serverId: 21312, realServerId: 1312, serverName: '路特斯', serverNameEn: 'Luteros', serverShortName: 'LUT' },
  { regionId: 'eu', raceId: 1, serverId: 21313, realServerId: 1313, serverName: '菲尔诺斯', serverNameEn: 'Phernos', serverShortName: 'PHE' },
  { regionId: 'eu', raceId: 1, serverId: 21314, realServerId: 1314, serverName: '达弥努', serverNameEn: 'Daminu', serverShortName: 'DAM' },
  { regionId: 'eu', raceId: 1, serverId: 21315, realServerId: 1315, serverName: '卡萨卡', serverNameEn: 'Kasaka', serverShortName: 'KAS' },
  { regionId: 'eu', raceId: 1, serverId: 21316, realServerId: 1316, serverName: '巴卡尔摩', serverNameEn: 'Bakarma', serverShortName: 'BAK' },
  { regionId: 'eu', raceId: 1, serverId: 21317, realServerId: 1317, serverName: '天加隆', serverNameEn: 'Tsenka', serverShortName: 'TSE' },
  { regionId: 'eu', raceId: 1, serverId: 21318, realServerId: 1318, serverName: '科奇隆', serverNameEn: 'Kochi', serverShortName: 'KOC' },
  { regionId: 'eu', raceId: 1, serverId: 21319, realServerId: 1319, serverName: '伊什塔尔', serverNameEn: 'Ishtar', serverShortName: 'ISH' },
  { regionId: 'eu', raceId: 1, serverId: 21320, realServerId: 1320, serverName: '提亚马特', serverNameEn: 'Tiamat', serverShortName: 'TIA' },
  { regionId: 'eu', raceId: 1, serverId: 21321, realServerId: 1321, serverName: '高斯', serverNameEn: 'Gauss', serverShortName: 'GAU' },
  { regionId: 'eu', raceId: 1, serverId: 21322, realServerId: 1322, serverName: '拉穆阿坦', serverNameEn: 'Lamuatan', serverShortName: 'LAM' },
  { regionId: 'eu', raceId: 1, serverId: 21323, realServerId: 1323, serverName: '纳塔拉', serverNameEn: 'Nathara', serverShortName: 'NAT' },
  { regionId: 'eu', raceId: 2, serverId: 22301, realServerId: 2301, serverName: '伊斯拉佩尔', serverNameEn: 'Israphel', serverShortName: 'ISR' },
  { regionId: 'eu', raceId: 2, serverId: 22302, realServerId: 2302, serverName: '吉凯尔', serverNameEn: 'Zikel', serverShortName: 'ZIK' },
  { regionId: 'eu', raceId: 2, serverId: 22303, realServerId: 2303, serverName: '崔妮尔', serverNameEn: 'Triniel', serverShortName: 'TRI' },
  { regionId: 'eu', raceId: 2, serverId: 22304, realServerId: 2304, serverName: '露梅尔', serverNameEn: 'Lumiel', serverShortName: 'LUM' },
  { regionId: 'eu', raceId: 2, serverId: 22305, realServerId: 2305, serverName: '玛尔库坦', serverNameEn: 'Marchutan', serverShortName: 'MAR' },
  { regionId: 'eu', raceId: 2, serverId: 22306, realServerId: 2306, serverName: '阿斯佩尔', serverNameEn: 'Azphel', serverShortName: 'AZP' },
  { regionId: 'eu', raceId: 2, serverId: 22307, realServerId: 2307, serverName: '艾莱修奇卡', serverNameEn: 'Ereshkigal', serverShortName: 'ERE' },
  { regionId: 'eu', raceId: 2, serverId: 22308, realServerId: 2308, serverName: '布里特拉', serverNameEn: 'Beritra', serverShortName: 'BER' },
  { regionId: 'eu', raceId: 2, serverId: 22309, realServerId: 2309, serverName: '奈蒙', serverNameEn: 'Nemon', serverShortName: 'NEM' },
  { regionId: 'eu', raceId: 2, serverId: 22310, realServerId: 2310, serverName: '哈达尔', serverNameEn: 'Hadala', serverShortName: 'HAD' },
  { regionId: 'eu', raceId: 2, serverId: 22311, realServerId: 2311, serverName: '卢德莱', serverNameEn: 'Ludra', serverShortName: 'LUD' },
  { regionId: 'eu', raceId: 2, serverId: 22312, realServerId: 2312, serverName: '邬尔古伦', serverNameEn: 'Ulgorn', serverShortName: 'ULG' },
  { regionId: 'eu', raceId: 2, serverId: 22313, realServerId: 2313, serverName: '默尼', serverNameEn: 'Munin', serverShortName: 'MUN' },
  { regionId: 'eu', raceId: 2, serverId: 22314, realServerId: 2314, serverName: '奥达尔', serverNameEn: 'Odar', serverShortName: 'ODA' },
  { regionId: 'eu', raceId: 2, serverId: 22315, realServerId: 2315, serverName: '泽姆鲁', serverNameEn: 'Zemurru', serverShortName: 'ZEM' },
  { regionId: 'eu', raceId: 2, serverId: 22316, realServerId: 2316, serverName: '克罗梅德', serverNameEn: 'Kromede', serverShortName: 'KRO' },
  { regionId: 'eu', raceId: 2, serverId: 22317, realServerId: 2317, serverName: '奎灵', serverNameEn: 'Quai', serverShortName: 'QUA' },
  { regionId: 'eu', raceId: 2, serverId: 22318, realServerId: 2318, serverName: '巴巴隆', serverNameEn: 'Baba', serverShortName: 'BAB' },
  { regionId: 'eu', raceId: 2, serverId: 22319, realServerId: 2319, serverName: '法夫尼尔', serverNameEn: 'Fafnir', serverShortName: 'FAF' },
  { regionId: 'eu', raceId: 2, serverId: 22320, realServerId: 2320, serverName: '印德纳特', serverNameEn: 'Indnath', serverShortName: 'IND' },
  { regionId: 'eu', raceId: 2, serverId: 22321, realServerId: 2321, serverName: '阿格妮塔', serverNameEn: 'Agnita', serverShortName: 'AGN' },
  { regionId: 'eu', raceId: 2, serverId: 22322, realServerId: 2322, serverName: '阿蒂尔', serverNameEn: 'Atiel', serverShortName: 'ATI' },
  { regionId: 'eu', raceId: 2, serverId: 22323, realServerId: 2323, serverName: '塔辛', serverNameEn: 'Tassin', serverShortName: 'TAS' },
  // ==================== 南美洲 (la) ====================
  { regionId: 'la', raceId: 1, serverId: 21401, realServerId: 1401, serverName: '希埃尔', serverNameEn: 'Siel', serverShortName: 'SIE' },
  { regionId: 'la', raceId: 1, serverId: 21402, realServerId: 1402, serverName: '奈萨肯', serverNameEn: 'Nezekan', serverShortName: 'NEZ' },
  { regionId: 'la', raceId: 1, serverId: 21403, realServerId: 1403, serverName: '白杰尔', serverNameEn: 'Vaizel', serverShortName: 'VAI' },
  { regionId: 'la', raceId: 1, serverId: 21404, realServerId: 1404, serverName: '凯西内尔', serverNameEn: 'Kaisinel', serverShortName: 'KAI' },
  { regionId: 'la', raceId: 1, serverId: 21405, realServerId: 1405, serverName: '尤斯迪埃', serverNameEn: 'Yustiel', serverShortName: 'YUS' },
  { regionId: 'la', raceId: 1, serverId: 21406, realServerId: 1406, serverName: '艾瑞尔', serverNameEn: 'Ariel', serverShortName: 'ARI' },
  { regionId: 'la', raceId: 2, serverId: 22401, realServerId: 2401, serverName: '伊斯拉佩尔', serverNameEn: 'Israphel', serverShortName: 'ISR' },
  { regionId: 'la', raceId: 2, serverId: 22402, realServerId: 2402, serverName: '吉凯尔', serverNameEn: 'Zikel', serverShortName: 'ZIK' },
  { regionId: 'la', raceId: 2, serverId: 22403, realServerId: 2403, serverName: '崔妮尔', serverNameEn: 'Triniel', serverShortName: 'TRI' },
  { regionId: 'la', raceId: 2, serverId: 22404, realServerId: 2404, serverName: '露梅尔', serverNameEn: 'Lumiel', serverShortName: 'LUM' },
  { regionId: 'la', raceId: 2, serverId: 22405, realServerId: 2405, serverName: '玛尔库坦', serverNameEn: 'Marchutan', serverShortName: 'MAR' },
  { regionId: 'la', raceId: 2, serverId: 22406, realServerId: 2406, serverName: '阿斯佩尔', serverNameEn: 'Azphel', serverShortName: 'AZP' },
  // ==================== 亚洲 (as) ====================
  { regionId: 'as', raceId: 1, serverId: 21501, realServerId: 1501, serverName: '希埃尔', serverNameEn: 'Siel', serverShortName: 'SIE' },
  { regionId: 'as', raceId: 1, serverId: 21502, realServerId: 1502, serverName: '奈萨肯', serverNameEn: 'Nezekan', serverShortName: 'NEZ' },
  { regionId: 'as', raceId: 1, serverId: 21503, realServerId: 1503, serverName: '白杰尔', serverNameEn: 'Vaizel', serverShortName: 'VAI' },
  { regionId: 'as', raceId: 1, serverId: 21504, realServerId: 1504, serverName: '凯西内尔', serverNameEn: 'Kaisinel', serverShortName: 'KAI' },
  { regionId: 'as', raceId: 1, serverId: 21505, realServerId: 1505, serverName: '尤斯迪埃', serverNameEn: 'Yustiel', serverShortName: 'YUS' },
  { regionId: 'as', raceId: 1, serverId: 21506, realServerId: 1506, serverName: '艾瑞尔', serverNameEn: 'Ariel', serverShortName: 'ARI' },
  { regionId: 'as', raceId: 1, serverId: 21507, realServerId: 1507, serverName: '普雷奇翁', serverNameEn: 'Fregion', serverShortName: 'FRE' },
  { regionId: 'as', raceId: 1, serverId: 21508, realServerId: 1508, serverName: '梅斯兰泰达', serverNameEn: 'Meslamtaeda', serverShortName: 'MES' },
  { regionId: 'as', raceId: 1, serverId: 21509, realServerId: 1509, serverName: '希塔尼耶', serverNameEn: 'Hithanya', serverShortName: 'HIT' },
  { regionId: 'as', raceId: 1, serverId: 21510, realServerId: 1510, serverName: '纳尼亚', serverNameEn: 'Nania', serverShortName: 'NAN' },
  { regionId: 'as', raceId: 2, serverId: 22501, realServerId: 2501, serverName: '伊斯拉佩尔', serverNameEn: 'Israphel', serverShortName: 'ISR' },
  { regionId: 'as', raceId: 2, serverId: 22502, realServerId: 2502, serverName: '吉凯尔', serverNameEn: 'Zikel', serverShortName: 'ZIK' },
  { regionId: 'as', raceId: 2, serverId: 22503, realServerId: 2503, serverName: '崔妮尔', serverNameEn: 'Triniel', serverShortName: 'TRI' },
  { regionId: 'as', raceId: 2, serverId: 22504, realServerId: 2504, serverName: '露梅尔', serverNameEn: 'Lumiel', serverShortName: 'LUM' },
  { regionId: 'as', raceId: 2, serverId: 22505, realServerId: 2505, serverName: '玛尔库坦', serverNameEn: 'Marchutan', serverShortName: 'MAR' },
  { regionId: 'as', raceId: 2, serverId: 22506, realServerId: 2506, serverName: '阿斯佩尔', serverNameEn: 'Azphel', serverShortName: 'AZP' },
  { regionId: 'as', raceId: 2, serverId: 22507, realServerId: 2507, serverName: '艾莱修奇卡', serverNameEn: 'Ereshkigal', serverShortName: 'ERE' },
  { regionId: 'as', raceId: 2, serverId: 22508, realServerId: 2508, serverName: '布里特拉', serverNameEn: 'Beritra', serverShortName: 'BER' },
  { regionId: 'as', raceId: 2, serverId: 22509, realServerId: 2509, serverName: '奈蒙', serverNameEn: 'Nemon', serverShortName: 'NEM' },
  { regionId: 'as', raceId: 2, serverId: 22510, realServerId: 2510, serverName: '哈达尔', serverNameEn: 'Hadala', serverShortName: 'HAD' },
]

/** 按区域 + 种族筛选服务器 */
export const getGlobalServersByRegionRace = (regionId: GlobalRegionId, raceId: 1 | 2) =>
  aionGlobalServerList.filter((s) => s.regionId === regionId && s.raceId === raceId)

export const getGlobalServerById = (serverId: number) =>
  aionGlobalServerList.find((s) => s.serverId === Number(serverId)) || null

/** 判断是否为国际服（偏移）serverId */
export const isGlobalServerId = (serverId: number) => {
  const id = Number(serverId)
  return (id >= 21101 && id <= 21510) || (id >= 22101 && id <= 22510)
}

/** 国际服偏移 serverId -> 国际服真实 serverId */
export const getGlobalRealServerId = (serverId: number) => {
  const s = getGlobalServerById(serverId)
  return s ? s.realServerId : null
}

/** 国际服真实 serverId -> 偏移 serverId */
export const toGlobalOffsetServerId = (realServerId: number) => {
  const s = aionGlobalServerList.find((x) => x.realServerId === Number(realServerId))
  return s ? s.serverId : null
}

export const formatGlobalServerDisplay = (serverId: number) => {
  const s = getGlobalServerById(serverId)
  if (!s) return String(serverId)
  const region = getGlobalRegionById(s.regionId)
  return `${region?.label || s.regionId}·${s.serverName}（${s.serverShortName}）`
}

/** 快捷粘贴解析：角色名[简写]，简写支持大小区服缩写（如 SIE/TRI）或中英文服务器名 */
export const parseGlobalNameWithServerShort = (input: string) => {
  const raw = String(input || '').trim()
  const m = raw.match(/^(.+?)\s*\[([^\]]+)\]\s*$/)
  if (!m) return null
  const keyword = m[1].trim()
  const short = m[2].trim()
  if (!keyword || !short) return null
  const shortUpper = short.toUpperCase()
  const server = aionGlobalServerList.find(
    (s) =>
      s.serverShortName.toUpperCase() === shortUpper ||
      s.serverName === short ||
      s.serverNameEn.toLowerCase() === short.toLowerCase()
  )
  if (!server) return null
  return {
    keyword,
    regionId: server.regionId,
    raceId: server.raceId,
    serverId: server.serverId,
    realServerId: server.realServerId,
    serverShortName: server.serverShortName,
  }
}

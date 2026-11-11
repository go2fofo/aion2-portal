/**
 * 永恒之塔2（韩服）服务器配置
 * 数据来源：docs/永恒之塔2韩服角色查询接口.md
 *
 * ⚠️ 韩服 serverId（1001-1021 / 2001-2021）与台服完全重叠，
 * 为避免整个系统内数据/展示冲突，前端与数据库统一使用「偏移 ID」：
 *   - 天族：真实 serverId + 10000 => 11001 ~ 11021
 *   - 魔族：真实 serverId + 10000 => 12001 ~ 12021
 * 调用韩服官方接口时使用 getKrRealServerId(offsetId) 还原真实 serverId。
 */
export type AionKrServer = {
  raceId: 1 | 2
  /** 偏移后的 serverId（系统内部使用） */
  serverId: number
  /** 韩服真实 serverId */
  realServerId: number
  serverName: string
  serverShortName: string
}

export const KR_SERVER_ID_OFFSET = 10000

export const aionKrServerList: AionKrServer[] = [
  { raceId: 1, serverId: 11001, realServerId: 1001, serverName: '시엘', serverShortName: '시엘' },
  { raceId: 1, serverId: 11002, realServerId: 1002, serverName: '네자칸', serverShortName: '네자' },
  { raceId: 1, serverId: 11003, realServerId: 1003, serverName: '바이젤', serverShortName: '바이' },
  { raceId: 1, serverId: 11004, realServerId: 1004, serverName: '카이시넬', serverShortName: '카이' },
  { raceId: 1, serverId: 11005, realServerId: 1005, serverName: '유스티엘', serverShortName: '유스' },
  { raceId: 1, serverId: 11006, realServerId: 1006, serverName: '아리엘', serverShortName: '아리' },
  { raceId: 1, serverId: 11007, realServerId: 1007, serverName: '프레기온', serverShortName: '프레' },
  { raceId: 1, serverId: 11008, realServerId: 1008, serverName: '메스람타에다', serverShortName: '메스' },
  { raceId: 1, serverId: 11009, realServerId: 1009, serverName: '히타니에', serverShortName: '히타' },
  { raceId: 1, serverId: 11010, realServerId: 1010, serverName: '나니아', serverShortName: '나니' },
  { raceId: 1, serverId: 11011, realServerId: 1011, serverName: '타하바타', serverShortName: '타하' },
  { raceId: 1, serverId: 11012, realServerId: 1012, serverName: '루터스', serverShortName: '루터' },
  { raceId: 1, serverId: 11013, realServerId: 1013, serverName: '페르노스', serverShortName: '페르' },
  { raceId: 1, serverId: 11014, realServerId: 1014, serverName: '다미누', serverShortName: '다미' },
  { raceId: 1, serverId: 11015, realServerId: 1015, serverName: '카사카', serverShortName: '카사' },
  { raceId: 1, serverId: 11016, realServerId: 1016, serverName: '바카르마', serverShortName: '바카' },
  { raceId: 1, serverId: 11017, realServerId: 1017, serverName: '챈가룽', serverShortName: '챈가' },
  { raceId: 1, serverId: 11018, realServerId: 1018, serverName: '코치룽', serverShortName: '코치' },
  { raceId: 1, serverId: 11019, realServerId: 1019, serverName: '이슈타르', serverShortName: '이슈' },
  { raceId: 1, serverId: 11020, realServerId: 1020, serverName: '티아마트', serverShortName: '티아' },
  { raceId: 1, serverId: 11021, realServerId: 1021, serverName: '포에타', serverShortName: '포에' },
  { raceId: 2, serverId: 12001, realServerId: 2001, serverName: '이스라펠', serverShortName: '이스' },
  { raceId: 2, serverId: 12002, realServerId: 2002, serverName: '지켈', serverShortName: '지켈' },
  { raceId: 2, serverId: 12003, realServerId: 2003, serverName: '트리니엘', serverShortName: '트리' },
  { raceId: 2, serverId: 12004, realServerId: 2004, serverName: '루미엘', serverShortName: '루미' },
  { raceId: 2, serverId: 12005, realServerId: 2005, serverName: '마르쿠탄', serverShortName: '마르' },
  { raceId: 2, serverId: 12006, realServerId: 2006, serverName: '아스펠', serverShortName: '아스' },
  { raceId: 2, serverId: 12007, realServerId: 2007, serverName: '에레슈키갈', serverShortName: '에레' },
  { raceId: 2, serverId: 12008, realServerId: 2008, serverName: '브리트라', serverShortName: '브리' },
  { raceId: 2, serverId: 12009, realServerId: 2009, serverName: '네몬', serverShortName: '네몬' },
  { raceId: 2, serverId: 12010, realServerId: 2010, serverName: '하달', serverShortName: '하달' },
  { raceId: 2, serverId: 12011, realServerId: 2011, serverName: '루드라', serverShortName: '루드' },
  { raceId: 2, serverId: 12012, realServerId: 2012, serverName: '울고른', serverShortName: '울고' },
  { raceId: 2, serverId: 12013, realServerId: 2013, serverName: '무닌', serverShortName: '무닌' },
  { raceId: 2, serverId: 12014, realServerId: 2014, serverName: '오다르', serverShortName: '오다' },
  { raceId: 2, serverId: 12015, realServerId: 2015, serverName: '젠카카', serverShortName: '젠카' },
  { raceId: 2, serverId: 12016, realServerId: 2016, serverName: '크로메데', serverShortName: '크로' },
  { raceId: 2, serverId: 12017, realServerId: 2017, serverName: '콰이링', serverShortName: '콰이' },
  { raceId: 2, serverId: 12018, realServerId: 2018, serverName: '바바룽', serverShortName: '바바' },
  { raceId: 2, serverId: 12019, realServerId: 2019, serverName: '파프니르', serverShortName: '파프' },
  { raceId: 2, serverId: 12020, realServerId: 2020, serverName: '인드나흐', serverShortName: '인드' },
  { raceId: 2, serverId: 12021, realServerId: 2021, serverName: '이스할겐', serverShortName: '할겐' },
]

export const getKrServersByRace = (raceId: 1 | 2) =>
  aionKrServerList.filter((s) => s.raceId === raceId)

export const getKrServerById = (serverId: number) =>
  aionKrServerList.find((s) => s.serverId === Number(serverId)) || null

/** 判断是否为韩服（偏移）serverId */
export const isKrServerId = (serverId: number) => {
  const id = Number(serverId)
  return (id >= 11001 && id <= 11021) || (id >= 12001 && id <= 12021)
}

/** 韩服偏移 serverId -> 韩服真实 serverId */
export const getKrRealServerId = (serverId: number) => {
  const s = getKrServerById(serverId)
  return s ? s.realServerId : null
}

/** 韩服真实 serverId -> 偏移 serverId */
export const toKrOffsetServerId = (realServerId: number) => {
  const s = aionKrServerList.find((x) => x.realServerId === Number(realServerId))
  return s ? s.serverId : null
}

export const formatKrServerDisplay = (serverId: number) => {
  const s = getKrServerById(serverId)
  if (!s) return String(serverId)
  const code = s.realServerId >= 2000 ? s.realServerId - 2000 : s.realServerId - 1000
  const suffix = `-${s.raceId === 1 ? '天' : '魔'}${code}`
  return `${s.serverName}（${s.serverShortName}）${suffix}`
}

export const parseKrNameWithServerShort = (input: string) => {
  const raw = String(input || '').trim()
  const m = raw.match(/^(.+?)\s*\[([^\]]+)\]\s*$/)
  if (!m) return null
  const keyword = m[1].trim()
  const short = m[2].trim()
  if (!keyword || !short) return null
  const server = aionKrServerList.find(
    (s) => s.serverShortName === short || s.serverName === short
  )
  if (!server) return null
  return {
    keyword,
    raceId: server.raceId,
    serverId: server.serverId,
    realServerId: server.realServerId,
    serverShortName: server.serverShortName,
  }
}

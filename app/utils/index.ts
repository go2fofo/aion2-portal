/*
 * @Author: fofo
 * @Date: 2026-09-10 11:44:54
 * @LastEditTime: 2026-10-20 13:22:47
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/utils/index.ts
 */
/**
 * 获取当前北京时间（UTC+8）的时间戳（毫秒）
 * 不论客户端/服务器处于什么时区，都能精准转换为北京当前时间
 * @param {boolean} [aligned=false] - 是否对齐到最近的 3 小时整点（默认 false：获取当前精确时间）
 * @returns 对应标准绝对毫秒时间戳
 */
export function getBeijingTimestamp(aligned: boolean = false): number {
  const now = Date.now();
  
  // 利用 toLocaleString 强制按北京时间（Asia/Shanghai）解析当前时间，彻底摆脱本地系统时区影响
  const bjDateStr = new Date(now).toLocaleString("en-US", { timeZone: "Asia/Shanghai" });
  const bjDate = new Date(bjDateStr);
  
  if (!aligned) {
    return bjDate.getTime();
  }
  
  const bjHour = bjDate.getHours();
  const refreshHours = [2, 5, 8, 11, 14, 17, 20, 23];
  let targetBjHour = refreshHours[0];
  
  for (const h of refreshHours) {
    if (bjHour >= h) {
      targetBjHour = h;
    }
  }
  
  bjDate.setHours(targetBjHour, 0, 0, 0);
  return bjDate.getTime();
}


/**
 * 根据会员结束时间（yyyy-MM-dd）动态计算精准剩余天数
 * @param {string} endTimeStr 会员结束时间字符串
 * @param {number} [fallbackDays] 如果没有结束时间或解析失败时的备用天数
 * @returns {number} 剩余天数（最小为 0）
 */
 export const calcPremiumRemainingDays = (endTimeStr, fallbackDays = 0) => {
  if (!endTimeStr) return Number(fallbackDays) || 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(endTimeStr);
  endDate.setHours(0, 0, 0, 0);

  // 如果日期格式非法，直接返回备用天数
  if (isNaN(endDate.getTime())) return Number(fallbackDays) || 0;

  // 结束时间减去当前时间，毫秒转换为天数
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

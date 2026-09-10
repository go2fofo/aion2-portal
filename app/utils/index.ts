/*
 * @Author: fofo
 * @Date: 2026-09-10 11:44:54
 * @LastEditTime: 2026-09-10 11:44:58
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
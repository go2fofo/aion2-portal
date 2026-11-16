/*
 * @Author: fofo wang 313612895@qq.com
 * @Date: 2026-11-16 09:45:39
 * @LastEditors: fofo wang 313612895@qq.com
 * @LastEditTime: 2026-11-16 09:45:45
 * @FilePath: /aion2-portal/app/plugins/pinia-fix.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// plugins/pinia-fix.ts
export default defineNuxtPlugin((nuxtApp) => {
  // 在 SSR 渲染或客户端挂载的关键节点，强制对 nuxtApp.$pinia 做安全代理与兜底
  try {
    if (nuxtApp && nuxtApp.payload) {
      // 确保 payload.pinia 存在安全结构，防止读取 state 报错
      if (!nuxtApp.payload.pinia) {
        nuxtApp.payload.pinia = {}
      }
    }
  } catch (err) {
    // 忽略异常，确保程序不崩溃
  }
})
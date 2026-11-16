/*
- @Author: fofo
- @Date: 2026-09-08 15:01:50
 * @LastEditTime: 2026-11-16 09:30:05
 * @LastEditors: fofo wang 313612895@qq.com
- @Description: 
- @FilePath: /aion2-portal/app/plugins/check-update.client.ts
 */
// plugins/check-update.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  // 开发环境直接跳过
  if (process.dev) return;

  // 确保仅在客户端且 nuxtApp 上下文完全就绪时执行
  if (!import.meta.client) return;

  const config = useRuntimeConfig();
  const currentVersion = config.public?.appVersion;
  if (!currentVersion) return;

  // 安全获取或初始化状态，避免 Windows 下上下文断链时报错
  let updateAvailable: any;
  try {
    updateAvailable = useState('updateAvailable', () => false);
  } catch (e) {
    // 降级兜底，防止初始化失败直接 crash
    return;
  }

  const CHECK_INTERVAL = 5 * 60 * 1000; // 每 5 分钟检查一次

  async function checkVersion() {
    try {
      const res: any = await $fetch(`/?t=${Date.now()}`, { parseResponse: txt => txt });
      
      if (typeof res === 'string' && !res.includes(currentVersion)) {
        if (updateAvailable) {
          updateAvailable.value = true;
        }
      }
    } catch (err) {
      // 忽略网络错误
    }
  }

  // 页面切回可见时触发
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    });
  }

  setInterval(checkVersion, CHECK_INTERVAL);
});
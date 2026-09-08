/*
 * @Author: fofo
 * @Date: 2026-09-08 15:01:50
 * @LastEditTime: 2026-09-08 15:01:57
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/app/plugins/check-update.client.ts
 */
// plugins/check-update.client.ts
export default defineNuxtPlugin(() => {
  if (process.dev) return;

  const config = useRuntimeConfig();
  const currentVersion = config.public.appVersion; // 当前客户端运行的版本
  const updateAvailable = useState('updateAvailable', () => false);

  const CHECK_INTERVAL = 5 * 60 * 1000; // 每 5 分钟检查一次

  async function checkVersion() {
    try {
      // 通过抓取首页 HTML（加时间戳防缓存），比对里面内联的或者通过接口拿到的版本号
      // 另一个优雅的方式是请求一个简单的版本检查路由或直接对比静态文件
      const res: any = await $fetch(`/?t=${Date.now()}`, { parseResponse: txt => txt });
      
      // 如果新部署的页面中包含了不同于当前的 appVersion 字样，说明有新版本
      if (typeof res === 'string' && !res.includes(currentVersion)) {
        updateAvailable.value = true;
      }
    } catch (err) {
      // 忽略网络错误
    }
  }

  // 页面切回可见时触发
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkVersion();
    }
  });

  setInterval(checkVersion, CHECK_INTERVAL);
});
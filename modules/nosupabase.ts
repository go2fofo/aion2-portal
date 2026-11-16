import { defineNuxtModule } from "nuxt/kit";

/**
 * 纯本地模式（nosupabase）专用模块。
 *
 * 作用：在所有模块安装完成后，移除 @nuxtjs/supabase 注册的 client / server 插件。
 *
 * 为什么不在 nuxt.config 里直接过滤：模块的 addPlugin 是即时生效的，
 * 放在 config 里的内联模块时机不可靠；用 `modules:done` 钩子可以确保
 * 所有模块（含 @nuxtjs/supabase）都已安装完毕再过滤。
 *
 * 为什么只移除插件、不移除模块：服务端 API 里存在对 `#supabase/server` 的导入，
 * 移除模块会导致构建失败；保留模块但不创建客户端，本地模式就不会有任何
 * Supabase 初始化与请求。这样即使环境里残留了非法的
 * `NUXT_PUBLIC_SUPABASE_URL`（例如缺少 http:// 协议），也不会抛
 * `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.`。
 */
const isNoSupabaseMode = () =>
  process.env.NUXT_NOSUPABASE === "1" ||
  process.env.NUXT_NOSUPABASE === "true";

export default defineNuxtModule({
  meta: {
    name: "nosupabase",
  },
  setup(_options, nuxt) {
    if (!isNoSupabaseMode()) return;

    nuxt.hook("modules:done", () => {
      nuxt.options.plugins = nuxt.options.plugins.filter((plugin: any) => {
        const src = typeof plugin === "string" ? plugin : plugin?.src || "";
        // 统一分隔符，兼容 Windows（路径为反斜杠）与 pnpm 虚拟目录（@nuxtjs+supabase）
        const normalized = String(src).replace(/\\/g, "/");
        return (
          !normalized.includes("@nuxtjs/supabase") &&
          !normalized.includes("@nuxtjs+supabase")
        );
      });
    });
  },
});

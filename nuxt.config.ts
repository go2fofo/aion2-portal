/*
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-11-16 08:35:08
 * @LastEditors: fofo wang 313612895@qq.com
 * @Description:
 * @FilePath: /aion2-portal/nuxt.config.ts
 */
// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"; // 临时添加这一行

/**
 * 纯本地模式（无 Supabase）
 * 通过 `pnpm dev:nosupabase` 启动时注入 NUXT_NOSUPABASE=1。
 * 该模式下：不登录、不鉴权、不请求 Supabase，仅使用浏览器 IndexedDB，
 * 页面只保留「多角色管理」。
 */
const noSupabase =
  process.env.NUXT_NOSUPABASE === "1" ||
  process.env.NUXT_NOSUPABASE === "true";

// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2026-02-11",
  devServer: {
    port: 4444
  },
  // 2. 显式禁用（双重保险）
  telemetry: false,
  experimental: {
    /**
     * 仅开发环境关闭 app manifest。
     * Nuxt 已知问题（nuxt/nuxt#30461）：dev 首次启动时 vite 会误报
     * `Failed to resolve import "#app-manifest"`（该 import 位于 `if (false)` 死代码中），
     * 不影响运行；官方 workaround 即关闭 appManifest。生产构建仍保持默认开启。
     */
    appManifest: process.env.NODE_ENV === "production",
  },
  // Nuxt 3 标准配置
  srcDir: "app/",
  // 添加以下配置指向根目录的 public
  dir: {
    public: "../public",
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "nuxt-echarts", "@pinia/nuxt"],
  devtools: { enabled: true },
  echarts: {
    // 渲染器选择：Canvas 更通用，SVG 在小图表或移动端表现更好
    renderer: "canvas",
    // 按需引入你需要的图表类型
    charts: ["BarChart", "LineChart", "PieChart", "RadarChart"],
    // 按需引入组件
    components: [
      "DatasetComponent",
      "GridComponent",
      "TooltipComponent",
      "LegendComponent",
      "TitleComponent",
    ],
  },
  // 如果你需要进行单页应用部署或混合渲染，可以在这里配置
  routeRules: {
    // 纯本地模式：数据只存在浏览器（IndexedDB），纯客户端渲染，避免 SSR 访问 localStorage
    ...(noSupabase ? { "/": { ssr: false } } : {}),
    // 例如：首页静态化，后台页面只在客户端渲染
    // '/': { prerender: true },
    // '/admin/**': { ssr: false },
    "/api/**": { cors: true }, // 允许 API 跨域
  },
  // Supabase 配置
  supabase: noSupabase
    ? {
        // 本地模式：使用占位地址，避免因缺少环境变量导致初始化失败；
        // 同时关闭 Cookie/Session 恢复，保证不会发出任何 Supabase 请求。
        redirect: false,
        url: "http://127.0.0.1:54321",
        key: "local-mode-placeholder-anon-key",
        useSsrCookies: false,
        clientOptions: {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        },
      }
    : {
        redirect: false, // 门户首页通常允许匿名访问
      },
  runtimeConfig: {
    // 生产环境 Vercel 建议显式映射 process.env
    deepseekApiKey:
      process.env.NUXT_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || "",
    openaiApiKey:
      process.env.NUXT_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "",
    geminiApiKey:
      process.env.NUXT_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "",
    public: {
      // 纯本地模式标记：开启后无登录、无鉴权、仅 IndexedDB + 多角色管理
      noSupabase,
      // 格式：AIon2 S3 v0.1.7 (20260812)
      appVersion: `AIon2 S3 v0.4.12 (${new Date().toISOString().slice(0, 10).replace(/-/g, "")})`,
    },
  },
  tailwindcss: {
    // 强制开启查看器，运行后访问 /_tailwind 检查样式
    viewer: true,
  },
  css: ["~/assets/css/main.css"],
});

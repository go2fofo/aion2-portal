/*
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-02-11 17:01:22
 * @LastEditors: whq
 * @Description:
 * @FilePath: /aion2-portal/nuxt.config.ts
 */
// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"; // 临时添加这一行
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2026-02-11",

  // 2. 显式禁用（双重保险）
  telemetry: false,
  // Nuxt 3 标准配置
  srcDir: "app/",
  // 添加以下配置指向根目录的 public
  dir: {
    public: "../public",
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "nuxt-echarts"],
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
    // 例如：首页静态化，后台页面只在客户端渲染
    // '/': { prerender: true },
    // '/admin/**': { ssr: false },
    '/api/**': { cors: true }, // 允许 API 跨域
  },
  // Supabase 配置
  supabase: {
    redirect: false, // 门户首页通常允许匿名访问
  },
  runtimeConfig: {
    // 生产环境 Vercel 建议显式映射 process.env
    deepseekApiKey: process.env.NUXT_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || '',
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  },
  tailwindcss: {
    // 强制开启查看器，运行后访问 /_tailwind 检查样式
    viewer: true,
  },
  css: ["~/assets/css/main.css"],
});

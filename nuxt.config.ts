/*
 * @Author: whq
 * @Date: 2026-02-08 09:11:19
 * @LastEditTime: 2026-02-10 13:49:35
 * @LastEditors: whq
 * @Description:
 * @FilePath: /aion2-portal/nuxt.config.ts
 */
// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"; // 临时添加这一行
// nuxt.config.ts
export default defineNuxtConfig({
  // 开启 Nuxt 4 的未来特性
  future: {
    compatibilityVersion: 4,
  },
  // 确保 srcDir 指向 app 目录（Nuxt 4 规范）
  srcDir: "app/",
  // 2. 注册模块 (在这里添加，而不是在 future 里)
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  // 开启开发者工具 (非常推荐，按 Shift + Alt + D 唤起)
  devtools: { enabled: true },

  // 如果你需要进行单页应用部署或混合渲染，可以在这里配置
  routeRules: {
    // 例如：首页静态化，后台页面只在客户端渲染
    // '/': { prerender: true },
    // '/admin/**': { ssr: false },
  },
  // Supabase 配置
  supabase: {
    redirect: false, // 门户首页通常允许匿名访问
  },
  tailwindcss: {
    // 强制开启查看器，运行后访问 /_tailwind 检查样式
    viewer: true, 
  },
  css: ['~/assets/css/main.css'],
});

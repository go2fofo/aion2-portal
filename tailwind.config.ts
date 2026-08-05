/*
 * @Author: fofo
 * @Date: 2026-02-11 16:13:29
 * @LastEditTime: 2026-08-05 11:04:37
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/tailwind.config.ts
 */
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}


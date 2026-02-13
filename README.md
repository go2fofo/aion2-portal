# 🚌 B.B.B.S - AION2 军团门户 (AION2 Portal)

B.B.B.S (宝宝巴士) 是一个专为《永恒之塔2》(AION2) 玩家打造的军团门户网站。它集成了角色查询、实时战力分析、AI 深度建议以及高度可配置的后台管理系统。

## 🌟 核心特性

- **🔍 深度角色看板**：全量属性 SVG 矢量化展示，包含装备、技能、称号及详细属性。
- **🤖 AI 战斗素质分析**：集成 DeepSeek/GPT-4o/Gemini，提供 200 字以内的专业战术评估与提升建议。
- **📊 动态可视化**：基于 ECharts 的战力雷达图与趋势折线图。
- **📱 极致移动体验**：
  - 响应式布局适配所有屏幕尺寸。
  - **Peek-a-boo 菜单**：可拖拽的扇形悬浮导航菜单，支持磁吸效果。
- **🛠️ 强力管理后台**：
  - **AI 引擎切换**：全局控制全站 AI 模型及 API Key。
  - **菜单排序**：支持拖拽排序的首页 Tab 导航配置。
  - **内容持久化**：AI 分析结果与站点配置均存储于 Supabase 云端。

## 🚀 技术栈

- **前端框架**: [Nuxt 3](https://nuxt.com/) (Vue 3, SSR)
- **样式引擎**: [Tailwind CSS](https://tailwindcss.com/) + [Typography 插件](https://tailwindcss.com/docs/typography-plugin)
- **后端服务**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **图表库**: [Apache ECharts](https://echarts.apache.org/)
- **AI 渲染**: [Marked](https://marked.js.org/) (Markdown 解析)
- **部署平台**: [Vercel](https://vercel.com/) / [Zeabur](https://zeabur.com/)

## 🛠️ 快速开始

### 1. 克隆并安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在根目录创建 `.env` 文件：

```env
# Supabase 配置
SUPABASE_URL=你的_supabase_url
SUPABASE_KEY=你的_supabase_anon_key

# AI API Keys (可选，也可在后台配置)
NUXT_DEEPSEEK_API_KEY=你的_deepseek_key
NUXT_OPENAI_API_KEY=你的_openai_key
NUXT_GEMINI_API_KEY=你的_gemini_key
```

### 3. 本地开发

```bash
pnpm dev
```

## 📖 文档索引

- [API 接口说明](docs/api-specification.md)：详细描述了对接 NCSoft 的公共接口规范。
- [数据库 Schema](docs/database-schema.md)：项目表结构与 JSONB 字段定义。

## 🛡️ 安全性说明

- 生产环境建议通过 Vercel 控制台设置环境变量，变量名需带 `NUXT_` 前缀。
- API Key 在管理后台支持明文/密文切换，方便管理员直接维护。

---

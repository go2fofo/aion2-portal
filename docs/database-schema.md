# 🗄️ 数据库结构说明 (Database Schema)

项目使用 Supabase (PostgreSQL) 作为后端存储。主要包含站点配置、军团成员数据以及内容发布三大模块。

## 1. 站点配置表 (`site_config`)

用于存储全站通用的配置信息，如 AI 模型选择、API Keys 以及首页 Tab 菜单。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `id` | `int8` (PK) | 唯一自增 ID |
| `key` | `text` (Unique) | 配置项标识 (如: `ai_model_config`, `home_tabs`) |
| `value` | `jsonb` | 具体配置内容 |
| `created_at` | `timestamptz` | 创建时间 |
| `updated_at` | `timestamptz` | 最后更新时间 |

### 核心配置项说明
- **`ai_model_config`**: 存储当前选中的 AI 模型 ID 及各模型的 API Key。
- **`home_tabs`**: 存储首页 Tab 菜单的显示名称、ID、隐藏状态及排序顺序。

---

## 2. 军团成员表 (`legion_members`)

存储同步自官方接口的成员详细数据及 AI 分析报告。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `id` | `int8` (PK) | 唯一自增 ID |
| `character_id` | `text` (Unique) | 官方加密 ID (chQWw...) |
| `name` | `text` | 角色名 |
| `level` | `int4` | 等级 |
| `class_name` | `text` | 职业名称 (如: 護法星) |
| `item_level` | `int4` | 装备分数/装等 |
| `role` | `text` | 军团职位 (leader/officer/member) |
| `ai_analysis_data` | `jsonb` | **AI 分析结果存储** (包含 content, model, updated_at) |
| `stat_list` | `jsonb` | 详细属性数据快照 |
| `board_list` | `jsonb` | 代行者系统进度快照 |
| `profile_url` | `text` | 头像 URL |
| ... | ... | 其他基础同步字段 |

---

## 3. 内容发布表 (`posts`)

用于管理首页各 Tab 下展示的动态内容。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `id` | `int8` (PK) | 唯一自增 ID |
| `title` | `text` | 标题 |
| `content` | `text` | 内容 (支持 Markdown) |
| `type` | `text` | 分类 (news/fresh/analysis/rank) |
| `is_pinned` | `bool` | 是否置顶 |
| `created_at` | `timestamptz` | 发布时间 |

---

## 🛠️ 数据同步说明

- **实时性**: 成员数据在进入详情页时会自动触发后台同步逻辑（如数据过期或不存在）。
- **AI 节流**: 针对同一角色的 AI 分析具有 10 分钟的冷却机制，分析结果会持久化在 `ai_analysis_data` 中，避免重复请求。

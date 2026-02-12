-- 添加新字段到军团成员表
alter table public.legion_members 
add column if not exists gender text, -- 'male' | 'female'
add column if not exists item_level integer, -- 装备分数 (从 stat.statList 中提取)
add column if not exists title_name text, -- 称号
add column if not exists abyss_rank text; -- 深渊/竞技场排名 (从 ranking 中提取)

-- 刷新类型定义 (虽然 Supabase 会自动推导，但最好记录一下)
comment on column public.legion_members.gender is '角色性别';
comment on column public.legion_members.item_level is '装备评分/战力';
comment on column public.legion_members.title_name is '佩戴称号';
comment on column public.legion_members.abyss_rank is '深渊军衔/竞技场段位';

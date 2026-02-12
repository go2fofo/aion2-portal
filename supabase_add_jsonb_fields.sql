-- 添加复杂数据字段 (JSONB)
alter table public.legion_members 
add column if not exists stat_list jsonb,     -- 角色详细属性列表
add column if not exists board_list jsonb,    -- 代行者/守护者系统进度
add column if not exists ranking_list jsonb,  -- 角色排名信息列表
add column if not exists title_list jsonb;    -- 称号列表

-- 刷新类型定义说明
comment on column public.legion_members.stat_list is '角色各项能力值与属性 (JSONB)';
comment on column public.legion_members.board_list is '代行者/守护者系统进度 (JSONB)';
comment on column public.legion_members.ranking_list is '角色各项排名信息 (JSONB)';
comment on column public.legion_members.title_list is '称号列表 (JSONB)';

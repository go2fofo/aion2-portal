-- 添加完整的角色基础档案信息
alter table public.legion_members 
add column if not exists server_name text,     -- 服务器名称
add column if not exists region_name text,     -- 大区/地区名称
add column if not exists pc_id integer,        -- 职业代号ID
add column if not exists gender_name text,     -- 性别名称
add column if not exists title_id integer,     -- 称号ID
add column if not exists title_grade text,     -- 称号品质
add column if not exists race_name text;       -- 种族名称

-- 刷新类型定义说明
comment on column public.legion_members.server_name is '服务器名称';
comment on column public.legion_members.region_name is '大区/地区名称';
comment on column public.legion_members.pc_id is '职业代号ID';
comment on column public.legion_members.gender_name is '性别名称';
comment on column public.legion_members.title_id is '当前佩戴的称号ID';
comment on column public.legion_members.title_grade is '当前称号品质';
comment on column public.legion_members.race_name is '种族名称';

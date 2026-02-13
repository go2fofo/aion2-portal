-- 为 legion_members 表添加 equipment_data 字段，用于缓存聚合后的装备详情、技能、外观等数据
alter table public.legion_members 
add column if not exists equipment_data jsonb;

-- 添加注释说明
comment on column public.legion_members.equipment_data is '聚合后的装备详情、技能、外观等缓存数据 (JSONB)';

create table if not exists public.aion2_update_articles (
  id text primary key,
  title text not null,
  summary text,
  posted_at timestamptz,
  updated_at timestamptz,
  thumbnail_urls jsonb not null default '[]'::jsonb,
  view_count integer not null default 0,
  scrap_count integer not null default 0,
  reply_count integer not null default 0,
  comment_count integer not null default 0,
  raw jsonb,
  detail_html text,
  detail_json jsonb,
  fetched_at timestamptz not null default now()
);

alter table public.aion2_update_articles enable row level security;

drop policy if exists "aion2_update_articles_public_read" on public.aion2_update_articles;
create policy "aion2_update_articles_public_read"
on public.aion2_update_articles
for select
using (true);

drop policy if exists "aion2_update_articles_admin_insert" on public.aion2_update_articles;
create policy "aion2_update_articles_admin_insert"
on public.aion2_update_articles
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_user_list a
    where a.id = auth.uid() and a.role = 'admin'
  )
);

drop policy if exists "aion2_update_articles_admin_update" on public.aion2_update_articles;
create policy "aion2_update_articles_admin_update"
on public.aion2_update_articles
for update
to authenticated
using (
  exists (
    select 1 from public.admin_user_list a
    where a.id = auth.uid() and a.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_user_list a
    where a.id = auth.uid() and a.role = 'admin'
  )
);

drop policy if exists "aion2_update_articles_admin_delete" on public.aion2_update_articles;
create policy "aion2_update_articles_admin_delete"
on public.aion2_update_articles
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_user_list a
    where a.id = auth.uid() and a.role = 'admin'
  )
);


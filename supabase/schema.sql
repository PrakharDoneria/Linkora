-- Run this file in Supabase Dashboard > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_url text not null check (original_url ~ '^https?://'),
  short_code text not null unique check (short_code ~ '^[A-Za-z0-9_-]{4,32}$'),
  clicks integer not null default 0 check (clicks >= 0),
  created_at timestamptz not null default now()
);

create index if not exists links_user_id_created_at_idx
  on public.links (user_id, created_at desc);

alter table public.links enable row level security;

drop policy if exists "Users can view their own links" on public.links;
create policy "Users can view their own links"
  on public.links for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own links" on public.links;
create policy "Users can create their own links"
  on public.links for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own links" on public.links;
create policy "Users can delete their own links"
  on public.links for delete
  using (auth.uid() = user_id);

create or replace function public.resolve_link(code text)
returns table (id uuid, original_url text, short_code text, clicks integer, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select id, original_url, short_code, clicks, created_at
  from public.links
  where short_code = code
  limit 1;
$$;

revoke all on function public.resolve_link(text) from public;
grant execute on function public.resolve_link(text) to anon, authenticated;

create or replace function public.increment_link_click(code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.links
  set clicks = clicks + 1
  where short_code = code;
$$;

revoke all on function public.increment_link_click(text) from public;
grant execute on function public.increment_link_click(text) to anon, authenticated;

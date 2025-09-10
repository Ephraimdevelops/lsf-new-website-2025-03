-- 001_create_profiles_and_policies.sql
-- Creates a server-controlled profiles table and example RLS policies

-- 1) Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Enable RLS on sample sensitive tables (add other tables as needed)
-- Replace or extend these with your real sensitive tables
alter table if exists public.publications enable row level security;
alter table if exists public.paralegals enable row level security;
alter table if exists public.opportunities enable row level security;

-- 3) Policy: allow admins to manage sensitive tables
create policy if not exists publications_admin_manage on public.publications
  for all
  using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy if not exists paralegals_admin_manage on public.paralegals
  for all
  using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy if not exists opportunities_admin_manage on public.opportunities
  for all
  using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 4) Optional: allow authenticated users to read public tables
create policy if not exists publications_public_select on public.publications
  for select
  using (true);

-- 5) Ensure a trigger updates updated_at on profiles (optional)
create or replace function public.set_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_timestamp
  before update on public.profiles
  for each row
  execute function public.set_timestamp();

-- NOTE: Review policies carefully and extend to all tables you want protected.
-- Run this file in Supabase SQL editor.

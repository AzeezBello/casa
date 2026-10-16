-- Migration: Add saved_searches table
-- Stores a user's saved filter set and optional alert settings.

create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  filters jsonb not null, -- exact filters as stored by parseFilters
  alert_enabled boolean not null default false,
  alert_frequency text check (alert_frequency in ('daily','weekly','monthly')) default 'daily',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatically update updated_at timestamp
create trigger saved_searches_touch_updated_at
  before update on public.saved_searches
  for each row execute function public.touch_updated_at();

-- RLS: users can only see their own saved searches; service_role can manage all.
alter table public.saved_searches enable row level security;
create policy "Users can manage own saved searches"
  on public.saved_searches for all
  using (auth.uid() = user_id);

revoke all on public.saved_searches from anon, authenticated;
grant select, insert, update, delete on public.saved_searches to service_role;

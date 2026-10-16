-- Migration: Add agents_profile table
-- Stores additional profile information and verification status for agents.

create table public.agents_profile (
  agent_id uuid primary key references public.agents(id) on delete cascade,
  phone text,
  license_number text,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  verification_token text,
  verification_expires timestamptz
);

-- RLS: agents can read/write their own profile; service_role can manage all.
alter table public.agents_profile enable row level security;
create policy "Agents can manage own profile"
  on public.agents_profile for all
  using (auth.uid() = agent_id);

-- Service role bypasses RLS for admin tasks.
revoke all on public.agents_profile from anon, authenticated;
grant select, insert, update, delete on public.agents_profile to service_role;

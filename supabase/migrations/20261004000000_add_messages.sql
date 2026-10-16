-- Migration: Add messages table for secure agent‑buyer communication
-- Each message belongs to a property and an agent. The sender can be a buyer (identified by a viewing request reference) or the agent.

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  sender text not null check (sender in ('buyer','agent')),
  reference text, -- populated when sender = 'buyer' (maps to viewing_requests.reference)
  content text not null,
  sent_at timestamptz not null default now()
);

-- Indexes for fast retrieval
create index messages_property_idx on public.messages (property_id, sent_at desc);
create index messages_agent_idx on public.messages (agent_id, sent_at desc);

-- Row‑level security: buyers can only see messages for their own viewing request reference.
-- agents can see messages for properties they own.
alter table public.messages enable row level security;

create policy "Buyers can read/write their own messages"
  on public.messages for all
  using (
    auth.uid() = (
      select viewing_requests.user_id from public.viewing_requests where reference = messages.reference limit 1
    )
  );

create policy "Agents can read/write messages for their properties"
  on public.messages for all
  using (auth.uid() = agent_id);

-- Service role bypasses all RLS for admin tasks.
revoke all on public.messages from anon, authenticated;
grant select, insert, update, delete on public.messages to service_role;

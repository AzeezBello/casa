-- CASA initial schema: listings, agents and viewing requests.
--
-- Access model:
--   anon / authenticated  read published listings and public agent names only.
--   service_role          (server only) everything else: agent contact details,
--                         viewing requests and status updates.
-- RLS is enabled on every table; tables without a policy are service-role only.

create extension if not exists pg_trgm;

-- Agents ---------------------------------------------------------------------

create table public.agents (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(name) between 1 and 120),
  company    text not null check (length(company) between 1 and 120),
  created_at timestamptz not null default now()
);

-- Kept apart from agents so contact details can never be exposed by a public read.
create table public.agent_contacts (
  agent_id uuid primary key references public.agents (id) on delete cascade,
  email    text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone    text
);

-- Properties -----------------------------------------------------------------

create table public.properties (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null check (length(title) between 1 and 160),
  area        text not null,
  city        text not null check (city in ('Lagos', 'Abuja')),
  price       bigint not null check (price > 0),           -- naira
  type        text not null check (type in ('Duplex', 'Terrace', 'Detached', 'Modular', 'Villa', 'Apartment')),
  beds        smallint not null check (beds between 0 and 50),
  baths       smallint not null check (baths between 0 and 50),
  size_sqm    integer not null check (size_sqm > 0),
  images      text[] not null check (cardinality(images) > 0),
  has_tour    boolean not null default false,
  verified    boolean not null default false,
  description text not null default '',
  amenities   text[] not null default '{}',
  agent_id    uuid references public.agents (id) on delete set null,
  status      text not null default 'draft' check (status in ('draft', 'published', 'sold', 'archived')),
  search_text text generated always as (lower(title || ' ' || area || ' ' || city || ' ' || type)) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index properties_published_idx on public.properties (city, type, price) where status = 'published';
create index properties_created_idx on public.properties (created_at desc) where status = 'published';
create index properties_search_idx on public.properties using gin (search_text gin_trgm_ops);
create index properties_agent_idx on public.properties (agent_id);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger properties_touch_updated_at
  before update on public.properties
  for each row execute function public.touch_updated_at();

-- Viewing requests -------------------------------------------------------------

create table public.viewing_requests (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique check (reference ~ '^CASA-[A-Z0-9]{8}$'),
  property_id    uuid not null references public.properties (id) on delete cascade,
  name           text not null check (length(name) between 2 and 80),
  phone          text not null check (phone ~ '^\+234[789][01][0-9]{8}$'),
  email          text check (email is null or length(email) <= 254),
  preferred_date date not null,
  message        text check (message is null or length(message) <= 1000),
  status         text not null default 'new' check (status in ('new', 'notified', 'notify_failed', 'contacted', 'closed')),
  created_at     timestamptz not null default now(),
  -- The app maps a violation of this constraint (by name) to "already requested".
  constraint viewing_requests_no_duplicates unique (property_id, phone, preferred_date)
);

create index viewing_requests_property_idx on public.viewing_requests (property_id, created_at desc);
create index viewing_requests_status_idx on public.viewing_requests (status) where status in ('new', 'notify_failed');

-- Row-level security -----------------------------------------------------------

alter table public.agents           enable row level security;
alter table public.agent_contacts   enable row level security;
alter table public.properties       enable row level security;
alter table public.viewing_requests enable row level security;

create policy "Published listings are public"
  on public.properties for select to anon, authenticated
  using (status = 'published');

create policy "Agent names are public"
  on public.agents for select to anon, authenticated
  using (true);

-- agent_contacts and viewing_requests: no policies, so service role only.

-- Supabase grants table privileges to anon/authenticated by default; RLS above is the
-- real guard, but revoke writes too so a future permissive policy can't open them.
revoke insert, update, delete on public.agents, public.agent_contacts, public.properties, public.viewing_requests from anon, authenticated;
revoke select on public.agent_contacts, public.viewing_requests from anon, authenticated;

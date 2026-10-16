-- Migration: Add tour_type and tour_url columns to properties
-- Allows storing either an external iframe URL or a path to self‑hosted panorama assets.

alter table public.properties
  add column tour_type text check (tour_type in ('none','iframe','self')) default 'none',
  add column tour_url text;

-- RLS: keep publishing rule – only agents can set these fields (service_role).
revoke update(tour_type, tour_url) on public.properties from anon, authenticated;
grant update(tour_type, tour_url) on public.properties to service_role;

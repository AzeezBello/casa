-- Migration: Add PostGIS extension and location column to properties
-- Enables geospatial queries and storage of a point (lat/long).

create extension if not exists postgis;

alter table public.properties
  add column location geography(Point, 4326);

-- Populate location for existing rows if latitude/longitude columns exist (assume they are present as separate columns).
-- If you have latitude/longitude columns, you can run an update like:
-- UPDATE public.properties SET location = ST_MakePoint(longitude, latitude)::geography;

-- RLS: allow anonymous and authenticated users to read location for published listings.
create policy "Published listings expose location"
  on public.properties for select to anon, authenticated
  using (status = 'published');

-- Service role can update location; revoke others.
revoke update(location) on public.properties from anon, authenticated;
grant update(location) on public.properties to service_role;

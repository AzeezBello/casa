import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { City, Property, PropertyFilters, PropertyType, SavedSearch, NewSavedSearch, Message, NewMessage } from "../types";
import type { Repository } from "./repository";

// Reads use the anon key so row-level security (published listings only) always applies.
// Writes and agent contact lookups use the service-role key and never reach the browser.

export type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  area: string;
  city: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  size_sqm: number;
  images: string[];
  has_tour: boolean;
  verified: boolean;
  description: string;
  amenities: string[];
  agent: { name: string; company: string } | null;
};

const PROPERTY_SELECT =
  "id, slug, title, area, city, price, type, beds, baths, size_sqm, images, has_tour, verified, description, amenities, agent:agents(name, company)";
const LIST_LIMIT = 60;
const DUPLICATE_CONSTRAINT = "viewing_requests_no_duplicates";

export function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    area: row.area,
    city: row.city as City,
    price: Number(row.price),
    type: row.type as PropertyType,
    beds: row.beds,
    baths: row.baths,
    size: row.size_sqm,
    images: row.images,
    tour: row.has_tour,
    verified: row.verified,
    description: row.description,
    amenities: row.amenities ?? [],
    agent: row.agent ?? { name: "CASA", company: "CASA" }
  };
}

/** Escapes LIKE wildcards and drops `*`, which PostgREST treats as a wildcard too. */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, c => `\\${c}`).replace(/\*/g, "");
}

export type SupabaseEnv = { url: string; anonKey: string; serviceRoleKey: string };

export function createSupabaseRepository(env: SupabaseEnv): Repository {
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const reader: SupabaseClient = createClient(env.url, env.anonKey, options);
  const writer: SupabaseClient = createClient(env.url, env.serviceRoleKey, options);

  const fail = (what: string, error: { message: string }): never => {
    throw new Error(`Supabase ${what} failed: ${error.message}`);
  };

  return {
    persistent: true,

    async listPropertiesByLocation(bounds, filters) {
      // Build PostGIS polygon (envelope) from bounds (longitude/latitude)
      const polygon = `ST_MakeEnvelope(${bounds.sw.lng},${bounds.sw.lat},${bounds.ne.lng},${bounds.ne.lat},4326)`;
      let query = reader
        .from('properties')
        .select(PROPERTY_SELECT)
        .eq('status', 'published')
        .filter('location', 'st_within', polygon);

      // Apply same filters as listProperties if provided
      if (filters) {
        const q = filters.q?.trim().toLowerCase();
        if (q) query = query.ilike('search_text', `%${escapeLike(q)}%`);
        if (filters.type) query = query.eq('type', filters.type);
        if (filters.city) query = query.eq('city', filters.city);
        if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
        if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
        if (filters.minBeds !== undefined) query = query.gte('beds', filters.minBeds);
        if (filters.tour) query = query.eq('has_tour', true);
        query =
          filters.sort === 'price-asc' || filters.sort === 'price-desc'
            ? query.order('price', { ascending: filters.sort === 'price-asc' })
            : query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(LIST_LIMIT).returns<PropertyRow[]>();
      if (error) fail('listPropertiesByLocation', error);
      return (data ?? []).map(rowToProperty);
    },
          async listProperties(filters: PropertyFilters) {
      let query = reader.from('properties').select(PROPERTY_SELECT).eq('status', 'published');
      const q = filters.q?.trim().toLowerCase();
      if (q) query = query.ilike('search_text', `%${escapeLike(q)}%`);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.city) query = query.eq('city', filters.city);
      if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
      if (filters.minBeds !== undefined) query = query.gte('beds', filters.minBeds);
      if (filters.tour) query = query.eq('has_tour', true);
      query = filters.sort === 'price-asc' || filters.sort === 'price-desc'
        ? query.order('price', { ascending: filters.sort === 'price-asc' })
        : query.order('created_at', { ascending: false });
      const { data, error } = await query.limit(LIST_LIMIT).returns<PropertyRow[]>();
      if (error) fail('listProperties', error);
      return (data ?? []).map(rowToProperty);
    },






    async getPropertyBySlug(slug) {
      const { data, error } = await reader.from("properties").select(PROPERTY_SELECT)
        .eq("status", "published").eq("slug", slug).maybeSingle<PropertyRow>();
      if (error) fail("getPropertyBySlug", error);
      return data ? rowToProperty(data) : undefined;
    },

    async getPropertiesByIds(ids) {
      if (ids.length === 0) return [];
      const { data, error } = await reader.from("properties").select(PROPERTY_SELECT)
        .eq("status", "published").in("id", ids).returns<PropertyRow[]>();
      if (error) fail("getPropertiesByIds", error);
      return (data ?? []).map(rowToProperty);
    },

    async listSlugs() {
      const { data, error } = await reader.from("properties").select("slug").eq("status", "published")
        .returns<{ slug: string }[]>();
      if (error) fail("listSlugs", error);
      return (data ?? []).map(r => r.slug);
    },

    async createViewingRequest(input) {
      const { error } = await writer.from("viewing_requests").insert({
        reference: input.reference,
        property_id: input.propertyId,
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        preferred_date: input.preferredDate,
        message: input.message ?? null
      });
      if (!error) return { ok: true };
      if (error.code === "23505") {
        return { ok: false, reason: error.message.includes(DUPLICATE_CONSTRAINT) ? "duplicate" : "reference_taken" };
      }
      return fail("createViewingRequest", error);
    },

    async setViewingRequestStatus(reference, status) {
      const { error } = await writer.from("viewing_requests").update({ status }).eq("reference", reference);
      if (error) fail("setViewingRequestStatus", error);
    },

    async listSavedSearches(userId: string) {
      const { data, error } = await reader.from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .returns<SavedSearch[]>();
      if (error) fail('listSavedSearches', error);
      return data ?? [];
    },

    async createSavedSearch(userId: string, data: NewSavedSearch) {
      const payload = {
        user_id: userId,
        name: data.name,
        filters: data.filters,
        alert_enabled: data.alertEnabled ?? false,
        alert_frequency: data.alertFrequency ?? 'daily',
      } as any;
      const { data: inserted, error } = await writer.from('saved_searches')
        .insert(payload)
        .select()
        .single()
        .returns<SavedSearch>();
      if (error) fail('createSavedSearch', error);
      return inserted as SavedSearch;
    },

    async deleteSavedSearch(id: string) {
      const { error } = await writer.from('saved_searches').delete().eq('id', id);
      if (error) fail('deleteSavedSearch', error);
    },

    async listMessages(propertyId: string) {
      const { data, error } = await reader.from('messages')
        .select('*')
        .eq('property_id', propertyId)
        .order('sent_at', { ascending: true })
        .returns<Message[]>();
      if (error) fail('listMessages', error);
      return data ?? [];
    },

    async createMessage(msg: NewMessage) {
      const payload = {
        property_id: msg.propertyId,
        agent_id: msg.agentId,
        sender: msg.sender,
        reference: msg.reference,
        content: msg.content,
      } as any;
      const { data: inserted, error } = await writer.from('messages')
        .insert(payload)
        .select()
        .single()
        .returns<Message>();
      if (error) fail('createMessage', error);
      return inserted as Message;
    },
    async getAgentEmail(propertyId: string) {
      const { data, error } = await writer.from("properties")
        .select("agent:agents(contact:agent_contacts(email))")
        .eq("id", propertyId)
        .maybeSingle<{ agent: { contact: { email: string } | null } | null }>();
      if (error) fail("getAgentEmail", error);
      return data?.agent?.contact?.email;
    }
  };
}

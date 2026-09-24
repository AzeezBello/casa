import type { Property, PropertyFilters } from "../types";
import type { CreateViewingResult, NewViewingRequest, Repository, ViewingRequestStatus } from "./repository";
import { MOCK_PROPERTIES, sampleAgentEmail } from "./mock-data";

export function filterProperties(all: Property[], filters: PropertyFilters): Property[] {
  const q = filters.q?.trim().toLowerCase();
  const results = all.filter(p =>
    (!q || `${p.title} ${p.area} ${p.city} ${p.type}`.toLowerCase().includes(q)) &&
    (!filters.type || p.type === filters.type) &&
    (!filters.city || p.city === filters.city) &&
    (filters.minPrice === undefined || p.price >= filters.minPrice) &&
    (filters.maxPrice === undefined || p.price <= filters.maxPrice) &&
    (filters.minBeds === undefined || p.beds >= filters.minBeds) &&
    (!filters.tour || p.tour)
  );
  if (filters.sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") results.sort((a, b) => b.price - a.price);
  return results;
}

export function createMockRepository(properties: Property[] = MOCK_PROPERTIES): Repository {
  const requests = new Map<string, NewViewingRequest & { status: ViewingRequestStatus }>();

  return {
    persistent: false,
    async listProperties(filters) {
      return filterProperties(properties, filters);
    },
    async getPropertyBySlug(slug) {
      return properties.find(p => p.slug === slug);
    },
    async getPropertiesByIds(ids) {
      return properties.filter(p => ids.includes(p.id));
    },
    async listSlugs() {
      return properties.map(p => p.slug);
    },
    async createViewingRequest(input): Promise<CreateViewingResult> {
      if (requests.has(input.reference)) return { ok: false, reason: "reference_taken" };
      const duplicate = [...requests.values()].some(r =>
        r.propertyId === input.propertyId && r.phone === input.phone && r.preferredDate === input.preferredDate);
      if (duplicate) return { ok: false, reason: "duplicate" };
      requests.set(input.reference, { ...input, status: "new" });
      return { ok: true };
    },
    async setViewingRequestStatus(reference, status) {
      const r = requests.get(reference);
      if (r) r.status = status;
    },
    async getAgentEmail(propertyId) {
      const p = properties.find(x => x.id === propertyId);
      return p && sampleAgentEmail(p.agent.name);
    }
  };
}

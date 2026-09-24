import "server-only";
import { cache } from "react";
import { repository } from "./data";
import type { Property, PropertyFilters } from "./types";

export { CITIES, PROPERTY_TYPES, SORT_OPTIONS, parseFilters } from "./filters";

export async function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  return repository.listProperties(filters);
}

/** Deduplicated per request, so generateMetadata and the page share one query. */
export const getProperty = cache(async (slug: string): Promise<Property | undefined> => {
  return repository.getPropertyBySlug(slug);
});

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  return repository.getPropertiesByIds(ids);
}

export async function getAllSlugs(): Promise<string[]> {
  return repository.listSlugs();
}

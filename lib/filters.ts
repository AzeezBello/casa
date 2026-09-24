import type { City, PropertyFilters, PropertyType, SortKey } from "./types";

// Pure and client-safe: no data access here.

export const PROPERTY_TYPES: PropertyType[] = ["Duplex", "Terrace", "Detached", "Modular", "Villa", "Apartment"];
export const CITIES: City[] = ["Lagos", "Abuja"];
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" }
];

/** Parses untrusted URL search params into typed filters, dropping anything invalid. */
export function parseFilters(params: Record<string, string | string[] | undefined>): PropertyFilters {
  const one = (key: string) => {
    const v = params[key];
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  };
  const num = (key: string) => {
    const v = Number(one(key));
    return Number.isFinite(v) && v > 0 ? v : undefined;
  };
  const type = one("type") as PropertyType | undefined;
  const city = one("city") as City | undefined;
  const sort = one("sort") as SortKey | undefined;
  return {
    q: one("q")?.slice(0, 100),
    type: type && PROPERTY_TYPES.includes(type) ? type : undefined,
    city: city && CITIES.includes(city) ? city : undefined,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minBeds: num("minBeds"),
    tour: one("tour") === "1",
    sort: sort && SORT_OPTIONS.some(o => o.value === sort) ? sort : undefined
  };
}

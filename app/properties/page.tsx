import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { CITIES, PROPERTY_TYPES, SORT_OPTIONS, getProperties, getPropertiesByLocation, parseFilters } from "@/lib/listings";
import { MapSearch, Bounds } from "@/components/MapSearch";
import { formatNaira } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Homes for Sale in Nigeria",
  description: "Browse verified houses, duplexes, terraces and modular living across Lagos and Abuja. Filter by budget, bedroom count, and 360° virtual tours.",
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    title: "Homes for Sale in Nigeria · Casa",
    description: "Browse verified houses, duplexes, terraces and modular living across Lagos and Abuja.",
    url: "/properties",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Homes for Sale in Nigeria" }],
  },
};

const PRICE_STEPS = [25_000_000, 50_000_000, 100_000_000, 150_000_000, 200_000_000, 300_000_000];

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const bounds = sp.swLat && sp.swLng && sp.neLat && sp.neLng ? {
    sw: { lat: Number(sp.swLat), lng: Number(sp.swLng) },
    ne: { lat: Number(sp.neLat), lng: Number(sp.neLng) }
  } : undefined;
  const results = bounds
    ? await getPropertiesByLocation(bounds, filters)
    : await getProperties(filters);

  const hasFilters = Boolean(filters.q || filters.type || filters.city || filters.minPrice || filters.maxPrice || filters.minBeds || filters.tour);

  return (
    <div className="section listings">
      <div className="section-head">
        <div>
          <div className="eyebrow">HOMES FOR SALE</div>
          <h1>{filters.type ? `${filters.type} homes` : "All homes"}{filters.city ? ` in ${filters.city}` : ""}</h1>
          <p aria-live="polite">{results.length} {results.length === 1 ? "home" : "homes"} found{filters.q ? ` for “${filters.q}”` : ""}</p>
        </div>
      </div>
      <MapSearch />
      <form className="filter-bar" action="/properties" role="search" aria-label="Filter homes">
        <label className="filter wide"><span>Keyword</span>
          <span className="input-icon"><Search size={17} aria-hidden="true"/><input name="q" defaultValue={filters.q} placeholder="Area, city or type" maxLength={100}/></span>
        </label>
        <label className="filter"><span>City</span>
          <select name="city" defaultValue={filters.city ?? ""}><option value="">Any city</option>{CITIES.map(c => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="filter"><span>Type</span>
          <select name="type" defaultValue={filters.type ?? ""}><option value="">Any type</option>{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</select>
        </label>
        <label className="filter"><span>Min price</span>
          <select name="minPrice" defaultValue={filters.minPrice ?? ""}><option value="">No min</option>{PRICE_STEPS.map(v => <option key={v} value={v}>{formatNaira(v)}</option>)}</select>
        </label>
        <label className="filter"><span>Max price</span>
          <select name="maxPrice" defaultValue={filters.maxPrice ?? ""}><option value="">No max</option>{PRICE_STEPS.map(v => <option key={v} value={v}>{formatNaira(v)}</option>)}</select>
        </label>
        <label className="filter"><span>Bedrooms</span>
          <select name="minBeds" defaultValue={filters.minBeds ?? ""}><option value="">Any</option>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}</select>
        </label>
        <label className="filter"><span>Sort</span>
          <select name="sort" defaultValue={filters.sort ?? "newest"}>{SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </label>
        <label className="filter check"><input type="checkbox" name="tour" value="1" defaultChecked={filters.tour}/> <span>Has 360° tour</span></label>
        <div className="filter-actions">
          <button className="dark-btn" type="submit"><SlidersHorizontal size={17} aria-hidden="true"/> Apply</button>
          {hasFilters && <Link className="ghost-btn" href="/properties">Clear</Link>}
        </div>
      </form>

      {results.length > 0 ? (
        <div className="property-grid">
          {results.map((p, i) => <PropertyCard key={p.id} property={p} preload={i < 3}/>)}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="No matching homes found"
          description={filters.q ? `No properties matched “${filters.q}”.` : "No properties matched your current filter selection."}
          tips={[
            "Try broadening your price range or selecting 'Any city'",
            "Clear specific bedroom or property type restrictions",
            "Try searching by neighborhood (e.g. Lekki, Ikoyi, Maitama) or keyword"
          ]}
          ctaLabel="Clear all filters"
          ctaHref="/properties"
        />
      )}
    </div>
  );
}

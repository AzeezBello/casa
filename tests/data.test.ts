import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseFilters } from "@/lib/filters";
import { formatNaira } from "@/lib/format";
import { resolveSiteUrl } from "@/lib/site-url";
import { createMockRepository } from "@/lib/data/mock";
import { MOCK_PROPERTIES } from "@/lib/data/mock-data";
import { escapeLike, rowToProperty, type PropertyRow } from "@/lib/data/supabase";

describe("parseFilters", () => {
  it("drops invalid values instead of passing them to the database", () => {
    assert.deepEqual(parseFilters({ minPrice: "abc", maxPrice: "-5", type: "Castle", sort: "evil", city: "Abuja" }), {
      q: undefined, type: undefined, city: "Abuja", minPrice: undefined, maxPrice: undefined, minBeds: undefined, tour: false, sort: undefined
    });
  });
  it("takes the first of repeated params and caps the keyword length", () => {
    const f = parseFilters({ type: ["Villa", "Duplex"], q: "x".repeat(300), tour: "1" });
    assert.equal(f.type, "Villa");
    assert.equal(f.q?.length, 100);
    assert.equal(f.tour, true);
  });
});

describe("formatNaira", () => {
  it("formats compactly", () => {
    assert.equal(formatNaira(185_000_000), "₦185M");
    assert.equal(formatNaira(1_500_000_000), "₦1.5B");
    assert.equal(formatNaira(950_000), "₦950,000");
  });
});

describe("mock repository", () => {
  const repo = createMockRepository();

  it("filters and sorts", async () => {
    const prices = (await repo.listProperties({ maxPrice: 100_000_000, sort: "price-desc" })).map(p => p.price);
    assert.deepEqual(prices, [95_000_000, 28_000_000]);
    assert.equal((await repo.listProperties({ q: "LEKKI" })).length, 2);
    assert.ok((await repo.listProperties({ tour: true, city: "Abuja" })).every(p => p.tour && p.city === "Abuja"));
  });

  it("looks up by slug and by ids", async () => {
    assert.equal((await repo.getPropertyBySlug("premium-5-bedroom-villa-maitama"))?.beds, 5);
    assert.equal(await repo.getPropertyBySlug("../etc"), undefined);
    assert.equal((await repo.getPropertiesByIds([MOCK_PROPERTIES[0].id, "unknown"])).length, 1);
  });

  it("rejects duplicate viewing requests and reused references", async () => {
    const base = { propertyId: MOCK_PROPERTIES[0].id, name: "Ada Obi", phone: "+2348031234567", preferredDate: "2026-10-01" };
    assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-AAAAAAAA", ...base }), { ok: true });
    assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-BBBBBBBB", ...base }), { ok: false, reason: "duplicate" });
    assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-AAAAAAAA", ...base, preferredDate: "2026-10-02" }), { ok: false, reason: "reference_taken" });
    assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-CCCCCCCC", ...base, preferredDate: "2026-10-02" }), { ok: true });
  });

  it("gives sample agents example.com addresses only", async () => {
    for (const p of MOCK_PROPERTIES) assert.match((await repo.getAgentEmail(p.id)) ?? "", /@example\.com$/);
  });

  it("uses UUID ids, as the database and /api/properties require", () => {
    for (const p of MOCK_PROPERTIES) assert.match(p.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe("supabase mapping", () => {
  it("maps rows to the domain type, including bigint prices and a missing agent", () => {
    const row = {
      id: "id", slug: "s", title: "t", area: "Ikoyi", city: "Lagos", price: "120000000" as unknown as number, type: "Terrace",
      beds: 3, baths: 3, size_sqm: 280, images: ["a"], has_tour: true, verified: false, description: "d", amenities: null as unknown as string[], agent: null
    } satisfies PropertyRow;
    const p = rowToProperty(row);
    assert.equal(p.price, 120_000_000);
    assert.equal(p.size, 280);
    assert.equal(p.tour, true);
    assert.deepEqual(p.amenities, []);
    assert.deepEqual(p.agent, { name: "CASA", company: "CASA" });
  });

  it("escapes LIKE and PostgREST wildcards in search input", () => {
    assert.equal(escapeLike("50%_off\\*"), "50\\%\\_off\\\\");
    assert.equal(escapeLike("lekki phase 1"), "lekki phase 1");
  });
});

describe("resolveSiteUrl", () => {
  it("treats blank values as unset (the Vercel build failure)", () => {
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "" }).href, "http://localhost:3000/");
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "   " }).href, "http://localhost:3000/");
  });
  it("prefers the explicit URL, then Vercel's production URL, then the deployment URL", () => {
    const vercel = { VERCEL_PROJECT_PRODUCTION_URL: "casa.vercel.app", VERCEL_URL: "casa-abc123.vercel.app" };
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://casa.ng", ...vercel }).href, "https://casa.ng/");
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "", ...vercel }).href, "https://casa.vercel.app/");
    assert.equal(resolveSiteUrl({ VERCEL_URL: "casa-abc123.vercel.app" }).href, "https://casa-abc123.vercel.app/");
  });
  it("adds https:// to bare domains and drops paths", () => {
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "casa.ng" }).href, "https://casa.ng/");
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://casa.ng/some/path/" }).href, "https://casa.ng/");
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }).href, "http://localhost:3000/");
  });
  it("fails with a clear message on a malformed value", () => {
    assert.throws(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a url" }), /NEXT_PUBLIC_SITE_URL must be a URL/);
    assert.throws(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "casa" }), /NEXT_PUBLIC_SITE_URL must be a URL/);
  });
});

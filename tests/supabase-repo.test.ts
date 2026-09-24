// Checks the PostgREST requests the Supabase repository sends, using a fake fetch.
import { it } from "node:test";
import assert from "node:assert/strict";
import { createSupabaseRepository } from "@/lib/data/supabase";
const calls: { method: string; url: URL; body?: string; key: string | null; prefer: string | null }[] = [];
let respond: () => Response = () => Response.json([]);
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const h = new Headers(init?.headers);
  calls.push({ method: init?.method ?? "GET", url: new URL(String(input)), body: init?.body as string, key: h.get("apikey"), prefer: h.get("prefer") });
  return respond();
}) as typeof fetch;

it("sends the expected PostgREST requests and maps errors", async () => {
  const repo = createSupabaseRepository({ url: "https://proj.supabase.co", anonKey: "ANON", serviceRoleKey: "SERVICE" });

  await repo.listProperties({ q: " 50%_Lekki* ", type: "Duplex", city: "Lagos", minPrice: 1, maxPrice: 2, minBeds: 3, tour: true, sort: "price-asc" });
  let c = calls.at(-1)!; const p = c.url.searchParams;
  assert.equal(c.url.pathname, "/rest/v1/properties"); assert.equal(c.key, "ANON");
  assert.equal(p.get("status"), "eq.published"); assert.equal(p.get("search_text"), "ilike.%50\\%\\_lekki%");
  assert.equal(p.get("type"), "eq.Duplex"); assert.equal(p.get("city"), "eq.Lagos"); assert.deepEqual(p.getAll("price"), ["gte.1", "lte.2"]);
  assert.equal(p.get("beds"), "gte.3"); assert.equal(p.get("has_tour"), "eq.true"); assert.equal(p.get("order"), "price.asc"); assert.equal(p.get("limit"), "60");
  assert.match(p.get("select")!, /agent:agents\(name,company\)|agent:agents\(name, company\)/);

  await repo.listProperties({}); assert.equal(calls.at(-1)!.url.searchParams.get("order"), "created_at.desc");

  respond = () => new Response(null, { status: 201 });
  assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-AAAAAAAA", propertyId: "pid", name: "Ada", phone: "+2348031234567", preferredDate: "2026-10-01" }), { ok: true });
  c = calls.at(-1)!; assert.equal(c.method, "POST"); assert.equal(c.key, "SERVICE"); assert.equal(JSON.parse(c.body!).email, null);

  const pgErr = (msg: string) => () => Response.json({ code: "23505", message: msg, details: null, hint: null }, { status: 409 });
  respond = pgErr('duplicate key value violates unique constraint "viewing_requests_no_duplicates"');
  assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-B", propertyId: "p", name: "A", phone: "x", preferredDate: "d" }), { ok: false, reason: "duplicate" });
  respond = pgErr('duplicate key value violates unique constraint "viewing_requests_reference_key"');
  assert.deepEqual(await repo.createViewingRequest({ reference: "CASA-B", propertyId: "p", name: "A", phone: "x", preferredDate: "d" }), { ok: false, reason: "reference_taken" });

  respond = () => Response.json({ code: "42501", message: "permission denied" }, { status: 401 });
  await assert.rejects(repo.listProperties({}), /Supabase listProperties failed: permission denied/);

  respond = () => Response.json({ agent: { contact: { email: "a@b.ng" } } });
  assert.equal(await repo.getAgentEmail("pid"), "a@b.ng"); assert.equal(calls.at(-1)!.key, "SERVICE");
  assert.deepEqual(await repo.getPropertiesByIds([]), []);
});

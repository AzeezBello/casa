import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { it } from "node:test";

const root = new URL("../supabase/", import.meta.url);
// Applies the real migration and seed to an in-process Postgres (PGlite) and checks RLS.
it("migration, seed, constraints and row-level security", async () => {
const db = new PGlite({ extensions: { pg_trgm } });
// Recreate the roles Supabase provides.
await db.exec(`create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;`);
await db.exec(readFileSync(new URL("migrations/20260924000000_init.sql", root), "utf8"));
await db.exec(readFileSync(new URL("seed.sql", root), "utf8"));
await db.exec(readFileSync(new URL("seed.sql", root), "utf8")); // idempotent
const one = async (sql, p) => (await db.query(sql, p)).rows;
const ok = () => {};

assert.equal((await one("select count(*)::int n from properties"))[0].n, 6); ok("seed loads and re-runs idempotently");
const newest = (await one("select slug from properties order by created_at desc")).map(r => r.slug);
assert.equal(newest[0], "modern-4-bedroom-duplex-lekki"); ok("newest ordering matches mock array order");
assert.equal((await one(`select count(*)::int n from properties where search_text ilike '%lekki%'`))[0].n, 2); ok("search_text generated column");

// Anonymous reads
await db.exec("update properties set status='draft' where slug='contemporary-family-home-abuja'");
await db.exec("set role anon");
assert.equal((await one("select count(*)::int n from properties"))[0].n, 5); ok("anon sees only published listings");
assert.equal((await one("select count(*)::int n from agents"))[0].n, 5); ok("anon can read agent names");
for (const t of ["agent_contacts", "viewing_requests"]) {
  await assert.rejects(one(`select * from ${t}`), /permission denied/); ok(`anon cannot read ${t}`);
}
await assert.rejects(one(`insert into viewing_requests (reference, property_id, name, phone, preferred_date) values ('CASA-AAAAAAAA','00000000-0000-4000-8000-000000000001','Ada','+2348031234567','2026-10-01')`), /permission denied/); ok("anon cannot insert viewing requests");
await assert.rejects(one(`update properties set price = 1`), /permission denied/); ok("anon cannot modify listings");
// The exact query the app uses for agent contact goes through the service role; anon embedding returns nothing.
await db.exec("reset role");

// Service role writes + constraints
await db.exec("set role service_role");
const ins = (ref, date, phone = "+2348031234567") => one(`insert into viewing_requests (reference, property_id, name, phone, preferred_date) values ($1,'00000000-0000-4000-8000-000000000001','Ada Obi',$2,$3)`, [ref, phone, date]);
await ins("CASA-AAAAAAAA", "2026-10-01"); ok("service role inserts viewing request");
await assert.rejects(ins("CASA-BBBBBBBB", "2026-10-01"), e => e.code === "23505" && /viewing_requests_no_duplicates/.test(e.message)); ok("duplicate → 23505 naming viewing_requests_no_duplicates");
await assert.rejects(ins("CASA-AAAAAAAA", "2026-10-02"), e => e.code === "23505" && !/viewing_requests_no_duplicates/.test(e.message)); ok("reference collision → 23505 on a different constraint");
await assert.rejects(ins("CASA-CCCCCCCC", "2026-10-03", "08031234567"), /check/); ok("non-E.164 phone rejected by check constraint");
await assert.rejects(ins("bad-ref", "2026-10-03"), /check/); ok("malformed reference rejected");
await one("update viewing_requests set status='notified' where reference='CASA-AAAAAAAA'");
await assert.rejects(one("update viewing_requests set status='bogus'"), /check/); ok("status restricted to known values");
const email = await one(`select a.name, c.email from properties p join agents a on a.id=p.agent_id join agent_contacts c on c.agent_id=a.id where p.id='00000000-0000-4000-8000-000000000001'`);
assert.match(email[0].email, /@example\.com$/); ok("agent contact resolvable by service role");
await db.exec("reset role");

const before = (await one("select updated_at from properties where slug='modern-4-bedroom-duplex-lekki'"))[0].updated_at;
await new Promise(r => setTimeout(r, 20));
await db.exec("update properties set price = price + 1 where slug='modern-4-bedroom-duplex-lekki'");
const after = (await one("select updated_at from properties where slug='modern-4-bedroom-duplex-lekki'"))[0].updated_at;
assert.ok(after > before); ok("updated_at trigger fires");
});

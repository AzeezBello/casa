import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateReference, lagosToday, normalizeNigerianPhone, validateViewingRequest } from "@/lib/viewing";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};
const TODAY = "2026-09-24";
const valid = { slug: "some-home", name: "Ada  Obi", phone: "0803 123 4567", date: "2026-10-01" };

describe("normalizeNigerianPhone", () => {
  it("normalises every common format to E.164", () => {
    for (const raw of ["08031234567", "0803 123 4567", "0803-123-4567", "+2348031234567", "2348031234567", "8031234567", "(0803) 123 4567"]) {
      assert.equal(normalizeNigerianPhone(raw), "+2348031234567", raw);
    }
  });
  it("rejects landlines, short numbers and foreign numbers", () => {
    for (const raw of ["", "123", "01234567890", "0803123456", "080312345678", "+447911123456", "06031234567"]) {
      assert.equal(normalizeNigerianPhone(raw), null, raw);
    }
  });
});

describe("lagosToday", () => {
  it("uses Lagos time, not UTC", () => {
    // 23:30 UTC is already 00:30 the next day in Lagos (UTC+1).
    assert.equal(lagosToday(new Date("2026-09-24T23:30:00Z")), "2026-09-25");
    assert.equal(lagosToday(new Date("2026-09-24T12:00:00Z")), "2026-09-24");
  });
});

describe("validateViewingRequest", () => {
  it("accepts a valid request and normalises it", () => {
    const r = validateViewingRequest(form({ ...valid, email: " Ada@Example.com ", message: "  Hi  " }), TODAY);
    assert.ok(r.ok);
    assert.deepEqual(r.value, { slug: "some-home", name: "Ada Obi", phone: "+2348031234567", email: "ada@example.com", date: "2026-10-01", message: "Hi" });
  });
  it("treats blank optional fields as absent", () => {
    const r = validateViewingRequest(form({ ...valid, email: "", message: "   " }), TODAY);
    assert.ok(r.ok);
    assert.equal(r.value.email, undefined);
    assert.equal(r.value.message, undefined);
  });
  it("reports every invalid field at once", () => {
    const r = validateViewingRequest(form({ slug: "x", name: "A", phone: "123", email: "nope", date: "2020-01-01" }), TODAY);
    assert.ok(!r.ok);
    assert.deepEqual(Object.keys(r.errors).sort(), ["date", "email", "name", "phone"]);
  });
  it("accepts today but not yesterday, and caps how far ahead", () => {
    assert.ok(validateViewingRequest(form({ ...valid, date: TODAY }), TODAY).ok);
    assert.ok(!validateViewingRequest(form({ ...valid, date: "2026-09-23" }), TODAY).ok);
    assert.ok(validateViewingRequest(form({ ...valid, date: "2027-03-23" }), TODAY).ok);
    const far = validateViewingRequest(form({ ...valid, date: "2027-03-24" }), TODAY);
    assert.ok(!far.ok && /six months/.test(far.errors.date ?? ""));
  });
  it("rejects malformed and impossible dates", () => {
    for (const date of ["", "tomorrow", "2026-13-01", "2026-9-30", "2026-02-30", "2026-11-31"]) {
      assert.ok(!validateViewingRequest(form({ ...valid, date }), TODAY).ok, date);
    }
  });
  it("truncates long messages to 1000 characters", () => {
    const r = validateViewingRequest(form({ ...valid, message: "x".repeat(5000) }), TODAY);
    assert.ok(r.ok);
    assert.equal(r.value.message?.length, 1000);
  });
});

describe("generateReference", () => {
  it("matches the database check constraint and avoids ambiguous characters", () => {
    for (let i = 0; i < 200; i++) {
      const ref = generateReference();
      assert.match(ref, /^CASA-[A-Z0-9]{8}$/);
      assert.doesNotMatch(ref.slice(5), /[01OIL]/);
    }
  });
});

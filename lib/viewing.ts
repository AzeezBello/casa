// Pure validation for viewing requests, shared by the server action and tests.

export type ViewingField = "name" | "phone" | "email" | "date" | "form";
export type ViewingErrors = Partial<Record<ViewingField, string>>;

export type ViewingInput = {
  slug: string;
  name: string;
  /** E.164, e.g. +2348031234567 */
  phone: string;
  email?: string;
  /** YYYY-MM-DD */
  date: string;
  message?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS_AHEAD = 180;

/** Accepts 0803…, 803…, 234803… or +234803… (spaces/dashes allowed) and returns +234803…, or null. */
export function normalizeNigerianPhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, "");
  const m = /^(?:\+?234|0)?([789][01]\d{8})$/.exec(digits);
  return m ? `+234${m[1]}` : null;
}

/** Today's date in Lagos as YYYY-MM-DD, independent of the server's timezone. */
export function lagosToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(now);
}

/** True only for real calendar dates: rejects 2026-02-30, which Date.parse silently accepts. */
function isCalendarDate(value: string): boolean {
  if (!DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function validateViewingRequest(form: FormData, today: string):
  { ok: true; value: ViewingInput } | { ok: false; errors: ViewingErrors } {
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const name = str("name").replace(/\s+/g, " ");
  const phone = normalizeNigerianPhone(str("phone"));
  const email = str("email").toLowerCase();
  const date = str("date");
  const message = str("message").slice(0, 1000);

  const errors: ViewingErrors = {};
  if (name.length < 2 || name.length > 80) errors.name = "Enter your full name.";
  if (!phone) errors.phone = "Enter a Nigerian mobile number, e.g. 0803 123 4567.";
  if (email && (email.length > 254 || !EMAIL.test(email))) errors.email = "Enter a valid email address.";
  if (!isCalendarDate(date) || date < today) errors.date = "Choose today or a future date.";
  else if (date > addDays(today, MAX_DAYS_AHEAD)) errors.date = "Choose a date within the next six months.";
  if (Object.keys(errors).length || !phone) return { ok: false, errors };

  return { ok: true, value: { slug: str("slug"), name, phone, email: email || undefined, date, message: message || undefined } };
}

const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

export function generateReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `CASA-${Array.from(bytes, b => REF_ALPHABET[b % REF_ALPHABET.length]).join("")}`;
}

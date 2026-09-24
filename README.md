# CASA

A property discovery app for the Nigerian market: search homes for sale in Lagos and Abuja, view listings and 360° tours, save a shortlist and request viewings with agents.

Built with Next.js 16 (App Router), React 19 and TypeScript, with Supabase for data and Resend for email. The app runs on built-in sample data until Supabase is configured, so there's nothing to set up to try it locally.

## Features

- **Search** (`/properties`): filter by keyword, city, property type, price range, bedrooms and 360° tour, and sort by price or newest. Filters live in the URL, so every search can be shared as a link, and the search form works without JavaScript.
- **Listing pages** (`/properties/[slug]`): photo gallery, key facts, features, a 360° tour dialog (the viewer itself is a placeholder), similar homes and per-page metadata.
- **Viewing requests**: a validated form on each listing. Requests are stored with a reference like `CASA-7KQ2MX9P`, and the listing agent is emailed.
- **Saved homes** (`/saved`): tap the heart on any listing. Saved homes are kept in the browser (per device, synced across tabs) until accounts exist.
- **Home page**: hero search, featured homes, modular homes, virtual tours and market-insights teaser. The headline figures come from the live data.
- **Accessibility**: labelled inputs, a native `<dialog>` (Escape closes it, focus stays inside), announced save state, a skip link and visible focus styles.

## Quick start

Requires Node.js 22.18 or later. It's developed on Node 24, and the tests use Node's built-in TypeScript support.

```bash
npm install
npm run dev        # http://localhost:3000, using sample data
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Test suite (Node's built-in test runner) |
| `npm run typecheck` | TypeScript check |
| `npm run db:seed-file` | Regenerates `supabase/seed.sql` from the sample data |

## Configuration

Copy `.env.example` to `.env.local`. Every variable is optional for local development.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in page metadata and in links inside agent emails, e.g. `https://casa.ng`. If blank, the app uses Vercel's production URL on Vercel, otherwise `http://localhost:3000`. A malformed value stops the build with a clear error. |
| `SUPABASE_URL` | Supabase project URL (Settings → API). |
| `SUPABASE_ANON_KEY` | Used for all public reads, so row-level security always applies. |
| `SUPABASE_SERVICE_ROLE_KEY` | Used on the server only, to store viewing requests and look up agent emails. Never expose it to the browser, and never prefix it with `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` | Enables agent emails. |
| `NOTIFY_FROM_EMAIL` | Sender for agent emails, e.g. `CASA <viewings@your-domain.ng>`. Its domain must be verified in Resend. |

Set all three `SUPABASE_*` variables or none of them. If only some are set, the app fails at startup rather than quietly serving sample data in production.

### What each setup does

| Setup | Listings | Viewing requests | Success message shown to the visitor |
|---|---|---|---|
| No Supabase | Sample data | Checked, then kept in memory only | "This is a preview build…" |
| Supabase, no Resend | Database | Stored | "…the CASA team will pass it to {agent}" |
| Supabase and Resend | Database | Stored and emailed to the agent | "{agent} has been emailed…" |

### Connecting Supabase

1. Create a Supabase project and apply the schema with `supabase db push`, or paste `supabase/migrations/20260924000000_init.sql` into the SQL editor.
2. Optionally load the sample listings by running `supabase/seed.sql`. It is safe to run more than once.
3. Set the three `SUPABASE_*` variables and restart the app.
4. For agent emails, add `RESEND_API_KEY` and `NOTIFY_FROM_EMAIL`.

## Architecture

```
app/
  page.tsx                  home page
  properties/page.tsx       search results (rendered per request)
  properties/[slug]/        listing page (static, rebuilt every 5 min) + viewing-request server action
  saved/page.tsx            saved homes
  api/properties/route.ts   GET ?ids=… — listings for the saved-homes page (max 50 IDs)
components/                 UI components; server components unless they need interactivity
lib/
  listings.ts               server-only data API that pages call
  data/repository.ts        the Repository interface
  data/supabase.ts          Supabase implementation
  data/mock.ts, mock-data.ts  in-memory implementation and sample listings
  data/index.ts             chooses the implementation from environment variables
  filters.ts                URL filter parsing (pure; safe to use in the browser)
  viewing.ts                viewing-request validation (pure)
  notify.ts                 agent email via Resend
  saved.ts                  saved-homes store (localStorage)
supabase/
  migrations/               schema, constraints, row-level security
  seed.sql                  generated from lib/data/mock-data.ts; don't edit by hand
tests/                      npm test
```

Pages never talk to a database directly. They call `lib/listings.ts`, which delegates to whichever `Repository` is configured. To add a new backend, implement that interface.

### Data model and security

- **`properties`**: listings. Prices are whole naira (`bigint`). Only rows with `status = 'published'` are publicly readable. Keyword search uses a generated `search_text` column with a trigram index.
- **`agents`**: agent name and company, publicly readable.
- **`agent_contacts`**: agent email, kept in a separate table so a public read can never expose it. Server-only.
- **`viewing_requests`**: server-only. Phone numbers are stored as `+234…`. A unique constraint (`viewing_requests_no_duplicates`) blocks a second request for the same home, phone and date. `status` moves from `new` to `notified` or `notify_failed`.

Row-level security is enabled on every table, and visitors (the `anon` and `authenticated` roles) can't write to any table.

### Viewing requests, step by step

1. The server action checks the form. The name must be 2–80 characters. The phone must be a Nigerian mobile number, in any common format. The date must be a real calendar date from today (Lagos time) up to 180 days ahead. Email and message are optional; messages are capped at 1,000 characters.
2. A hidden honeypot field catches bots. Those submissions get a fake success and nothing is stored.
3. The request is stored. A duplicate gets a friendly message on the date field.
4. After the response is sent, the agent is emailed in plain text and the request's status is updated.

### Images

`next/image` only optimises images that match `images.remotePatterns` in `next.config.ts`:
- **Unsplash**: URLs must use the exact shape in `lib/site-images.ts`. It caps the source at 1600px, because full-size originals are several MB and time out the image optimizer.
- **Supabase Storage**: public buckets of the configured project, once `SUPABASE_URL` is set.

## Managing listings

There's no admin interface yet. Add or edit listings in the Supabase table editor:
- Set `status = 'published'` to make a listing visible.
- Use lowercase-hyphenated slugs (for example `3-bedroom-flat-yaba`).
- Link the listing to an agent that has a row in `agent_contacts`, or no email can be sent.

Changes show on search results immediately, and on the home and listing pages within 5 minutes. A new listing's page is built on its first visit.

To find viewing requests that still need handling, filter `viewing_requests` by `status in ('new', 'notify_failed')`.

## Testing

`npm test` runs 22 tests with no external services:

- `viewing.test.ts`: phone normalisation, Lagos-time dates, form validation, reference format
- `data.test.ts`: URL filter parsing, naira formatting, the in-memory repository
- `supabase-repo.test.ts`: the exact requests the Supabase repository sends (filters, escaping, which key is used) and how errors are mapped, using a fake `fetch`
- `database.test.mjs`: applies the real migration and seed to PGlite (Postgres running in-process) and checks constraints and row-level security

`tests/loader-hooks.mjs` lets Node run the app's TypeScript directly. It resolves the `@/` import alias and stubs the `server-only` package.

## Known gaps

- There's no admin screen for viewing requests or listings.
- Bot protection is a honeypot plus duplicate checks. There's no per-IP rate limit.
- The viewing form needs JavaScript. Without it, submitting on the statically generated listing page just returns the cached page.
- The 360° tour dialog is a placeholder; there's no real panorama viewer yet.
- Saved homes are stored per device until accounts exist.
- There's no linter, because `next lint` was removed in Next 16.

## Roadmap

1. **Phase 4:** sign-in and user profiles; move saved homes to the server
2. Agent and developer onboarding and verification
3. A real 360° tour provider or self-hosted panorama viewer
4. Map search and geospatial filtering
5. Saved searches and alerts
6. Secure messaging and an agent inbox for viewing requests
7. Modular-home configurator and quote workflow
8. Market-data ingestion with source attribution
9. Paystack/Flutterwave for permitted booking and deposit flows
10. Admin dashboard, moderation and audit logs
11. Legal and compliance workflows for property documents

## History

- **Phase 1 (MVP shell):** landing page, naira pricing and Lagos/Abuja sample listings.
- **Phase 2 (Discovery foundation):** full stylesheet, search with filters, listing pages, saved homes, a viewing-request form (not stored at this stage) and accessibility fixes. Made-up marketing figures were replaced with figures from the data.
- **Phase 3 (Real data and viewing requests):** Supabase backend with row-level security, stored viewing requests, agent emails, the test suite and a generated seed file. Sample listing IDs became UUIDs, so homes saved in earlier preview builds no longer appear.

## Design direction

Editorial Nigerian real-estate look: warm off-white surfaces, charcoal type, restrained green and earth accents, generous whitespace, strong photography and a mobile-first layout.
# casa

# Services

## Supabase

[Supabase](https://supabase.com) is the backend for Kiln. It provides:

- **PostgreSQL database** — pieces, photos, and preferences are stored in structured tables with row-level security so each user's data is isolated.
- **Authentication** — user accounts and session management via Supabase Auth.
- **Storage** — photo files are stored in Supabase Storage and referenced by URL in the `piece_photos` table, keeping the database lean.
- **Row-level security (RLS)** — every table enforces RLS policies so a user can only read and write their own records.

The Supabase client is initialised in `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server components / API routes).

> **Note:** Supabase is not yet active in the current build. The app currently reads and writes via `src/lib/store.ts`, which uses `localStorage`. Once the Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are configured and the schema in `supabase/schema.sql` is applied, the store layer will be replaced with Supabase queries.

### Privacy implications

Because Kiln uses Supabase as its backend, user data — piece records, surface layer configurations, photo URLs, and preferences — is transmitted to and stored on Supabase's servers (hosted on AWS). Users should be made aware of this in the privacy policy. Supabase's data processing terms and the applicable AWS region should be referenced. When the Supabase connection goes live, the privacy policy must confirm:

- What data is collected (piece records, photos, preferences).
- Where it is stored (Supabase / AWS region).
- How it is secured (RLS, encrypted at rest and in transit).
- The user's right to delete their data.

## Next.js

The app is built with [Next.js](https://nextjs.org) using the App Router. All pages under `src/app/` are React Server Components or client components as needed.

## Vercel (recommended deployment)

Kiln is designed to deploy on [Vercel](https://vercel.com). Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and any server-side secret key) are set in the Vercel project settings.

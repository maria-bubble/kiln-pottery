# Data Model

## Where data lives

Kiln stores all user data in **Supabase** — a hosted PostgreSQL database with row-level security. Every record is scoped to the authenticated user via `auth.uid()` policies, so no user can read or write another user's data.

> **Note:** The current build uses the browser's `localStorage` as a temporary store while the Supabase connection is being finalised. The `src/lib/store.ts` module wraps `localStorage` under the same API surface that will be replaced with Supabase queries when the environment variables are configured.

The three primary tables are:

| Table | Purpose |
|---|---|
| `pieces` | One row per ceramic piece; includes all metadata and a `surface_layers` JSONB column. |
| `piece_photos` | One row per photo, referencing its piece and holding the Supabase Storage URL. |
| `user_preferences` | One row per user; holds studio defaults and favourite lists as JSONB columns. |

## The Supabase schema

The full schema lives in `supabase/schema.sql`. The schema is the data model — it is not speculative; the `localStorage` code in `src/lib/store.ts` is the temporary layer that will be replaced when Supabase goes live.

```sql
create table pieces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  stage text not null default 'forming'
    check (stage in ('forming','drying','bisque_fired','glazing','glaze_fired','complete')),
  forming_method text,
  clay_body text,
  height_cm numeric,
  width_cm numeric,
  depth_cm numeric,
  weight_grams numeric,
  firing_type text,
  bisque_temp_c numeric,
  glaze_temp_c numeric,
  cone text,
  surface_layers jsonb not null default '[]',
  tags text[] not null default '{}',
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table piece_photos (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid references pieces(id) on delete cascade,
  url text not null,
  caption text,
  stage_at_capture text,
  created_at timestamptz not null default now()
);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  default_clay_body text,
  default_forming_method text,
  default_firing_type text,
  default_cone text,
  favorite_clay_bodies jsonb not null default '[]',
  favorite_surface_products jsonb not null default '[]',
  default_surface_layers jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Row-level security is enabled on all three tables. Policies ensure:

- Users can only select, insert, update, and delete their own `pieces`.
- Users can only access `piece_photos` that belong to their own pieces.
- Each user has exactly one `user_preferences` row, and only they can access it.

## Photo storage

Photos are stored as files in **Supabase Storage**. The `piece_photos` table holds the returned URL, not the file contents. This keeps the database row small regardless of how many photos a piece has and lets Supabase serve images directly via CDN.

> **Note:** The current build embeds photos as base64 strings inside the piece record in `localStorage`. A piece with several photos can produce a large JSON blob in `localStorage`, which is typically capped at ~5 MB per origin. This is a known limitation of the temporary store; it is resolved when Supabase Storage is active.

## TypeScript types

The TypeScript types in `src/types/index.ts` mirror the schema:

| TypeScript type | Supabase table / column |
|---|---|
| `Piece` | `pieces` |
| `PiecePhoto` | `piece_photos` |
| `SurfaceLayer` | `pieces.surface_layers` (JSONB array) |
| `UserPreferences` | `user_preferences` |
| `FavoriteSurfaceProduct` | `user_preferences.favorite_surface_products` (JSONB array) |
| `ClayBody` | `user_preferences.favorite_clay_bodies` (JSONB array) |

## What leaves the app

When Supabase is active, the following data is transmitted over HTTPS to Supabase's servers:

- **Piece records** — all metadata you enter for each piece.
- **Photos** — image files uploaded to Supabase Storage.
- **Preferences** — your studio defaults and favourite lists.

All data is encrypted in transit (TLS) and encrypted at rest by Supabase/AWS. Row-level security ensures only the owning user can access their records.

> **Note:** In the current build, no data leaves the browser. Everything lives in `localStorage` and is not transmitted to any server.

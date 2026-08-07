# My Pieces

**Route:** `/`  
**File:** `src/app/page.tsx`

## What this page does

My Pieces is the home screen of Kiln. When it loads, the app fetches every saved piece from the database and renders them in a responsive grid — one card per piece, sorted most-recently-updated first.

> **Note:** The current build reads pieces from `localStorage` (via `src/lib/store.ts`) while the Supabase connection is being finalised. Once Supabase is live, pieces will be fetched from the cloud and available on any device or browser where you are signed in.

## Layout and controls

### Stage filter bar

Above the grid, a row of pill buttons lets you filter by stage:

- **All** — shows every piece, with a total count.
- **Forming / Drying / Bisque Fired / Glazing / Glaze Fired / Complete** — each shows the count for that stage.

The active filter is highlighted in dark stone. Clicking a stage filters the grid immediately (client-side, no network request).

### Search

A text input with a search icon filters the grid by:

- Piece title (case-insensitive substring)
- Tags
- Clay body

Filtering is live as you type.

### Piece grid

Pieces render in a 1–3 column responsive grid (`PieceCard` component). Each card shows the title, stage badge, clay body, forming method, and the last-updated date. Clicking a card navigates to the piece detail page.

### New Piece button

A **New Piece** button in the top-right corner links to `/pieces/new`.

### Empty state

If no pieces exist, the grid is replaced by a centred empty-state prompt with a **Create First Piece** button.

## Cloud sync

Because pieces are stored in your Supabase account, they are available on any device or browser — sign in and your full studio record loads automatically.

> **Note:** The current build still reads from `localStorage` while Supabase is being connected. In this build, pieces only appear in the browser where they were created.

## Data and privacy

Pieces are stored in the `pieces` table in Supabase (a cloud database). Records include all metadata you enter — title, stage, clay body, forming method, dimensions, firing details, surface layers, tags, and notes — as well as timestamps managed by the server.

Data is transmitted to Supabase's servers over HTTPS and stored encrypted at rest. Row-level security ensures each user can only access their own pieces. See the [Services](services.md) chapter for the full privacy breakdown.

# Piece Detail & Staging

**Route:** `/pieces/[id]`  
**File:** `src/app/pieces/[id]/page.tsx`

## Loading a piece

When the page mounts, the app looks up the piece by its ID from the database. If no matching piece exists, the user is redirected to the home screen.

> **Note:** The current build looks up pieces from `localStorage` via `getPiece(id)` while Supabase is being connected.

## Page layout

The detail page is organised into sections:

- **Header** — title, forming method, clay body, last-updated date, Edit button, and Delete button.
- **Stage progress** — the `StageProgress` component renders all six stages and highlights the current one.
- **Advance stage banner** — shown when the piece is not yet complete (see below).
- **Photos** — a responsive grid of all attached photos with optional captions.
- **Surface Layers** — read-only list of layers (bottom → top) outside of the Glazing stage; the interactive `SurfaceLayerEditor` replaces it during Glazing.
- **Firing Details** — kiln type, cone, bisque temp, and glaze temp.
- **Measurements** — height, width, depth, weight.
- **Notes** — full-width text block.
- **Tags** — pill badges.

## Advancing the stage

When a piece has a next stage available, an amber banner appears with a **Mark as [Next Stage]** button.

Clicking the button opens a confirmation dialog that shows the current stage and the next stage. You must explicitly confirm before the advance is committed.

On confirmation:
- The piece's stage is updated to the next one in the sequence and saved to the database. *(Note: the current build saves to `localStorage`.)*
- If the new stage is **Complete**, `completed_at` is also set to the current timestamp.
- The UI re-renders immediately with the updated stage.

Stage advancement is irreversible from the UI — there is no "go back a stage" button.

## Editing surface layers during Glazing

When the piece is in the **Glazing** stage, the surface layers section switches from a read-only list to the interactive `SurfaceLayerEditor`. Changes made here are saved back to the database immediately. *(Note: the current build saves to `localStorage`.)*

## Editing the full record

The **Edit** button links to `/pieces/[id]/edit`, which renders the same `PieceForm` component pre-filled with the existing piece data. Saving writes the changes back to the database and returns you to the detail page. *(Note: the current build saves to `localStorage`.)*

## Deleting a piece

The trash-icon button in the header prompts a native browser confirm dialog. If confirmed, the piece is permanently deleted from the database and you are redirected to the home screen. *(Note: the current build deletes from `localStorage`.)*

Deletion is irreversible.

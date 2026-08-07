# New Piece Form

**Route:** `/pieces/new`  
**File:** `src/app/pieces/new/page.tsx`  
**Form component:** `src/components/PieceForm.tsx`

## Purpose

The New Piece form is where you create a record for a piece you are starting or have already started. It pre-fills your studio defaults from your preferences so you spend less time on repetitive data entry.

## Pre-filling from preferences

When the page loads, `createNewPiece()` (in `src/lib/store.ts`) reads your saved preferences and populates:

- Default clay body
- Default forming method
- Default firing type
- Default cone
- Default surface layers (each cloned with a fresh ID)

If you have not saved preferences yet, these fields are left blank.

## Fields

| Field | Notes |
|---|---|
| Title | Required. Defaults to "Untitled Piece". |
| Description | Optional free-text. |
| Stage | Always starts at **Forming** for a new piece. |
| Forming method | Select from the supported methods. |
| Clay body | Free-text name of your clay body. |
| Height / Width / Depth | Numeric, in centimetres. |
| Weight | Numeric, in grams. |
| Firing type | Select (Oxidation, Reduction, Wood, Soda, Salt, Raku, Pit). |
| Cone | Free text (e.g. "6", "10", "06"). |
| Bisque temp / Glaze temp | Numeric, in °C. |
| Notes | Multi-line free text. |
| Tags | Comma-separated tags for filtering. |
| Surface layers | Managed inline via `SurfaceLayerEditor`. |
| Photos | Managed inline via `PhotoUploader`. |

## Saving

1. The form validates that a title is present.
2. The piece record is saved to the database. *(Note: the current build writes to `localStorage` while Supabase is being connected.)*
3. You are redirected to the piece detail page (`/pieces/[id]`).

## Stage progress indicator

A `StageProgress` component at the top of the page always shows **Forming** highlighted, since new pieces always start at the first stage.

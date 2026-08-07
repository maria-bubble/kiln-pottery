# Photos

**Component:** `src/components/PhotoUploader.tsx`  
**Type:** `PiecePhoto` in `src/types/index.ts`

## Purpose

The photo feature lets you attach images to a piece at any stage of making. This is useful for comparing a piece at greenware, bisque, and after glaze firing, or for documenting surface layer application.

## Photo storage

Photos are stored in Supabase Storage and referenced by URL in the `piece_photos` table. Each photo record holds:

- `url` — the Supabase Storage URL for the image file.
- `caption` — optional descriptive text.
- `stage_at_capture` — the stage the piece was at when the photo was taken.
- `created_at` — timestamp set by the server.

Because photos live in Supabase Storage rather than in the database record itself, they are backed up independently, do not bloat the `pieces` table, and can be served efficiently at scale.

> **Note:** The current build stores photos as base64 strings embedded directly in the piece record in `localStorage`. This approach is temporary while Supabase Storage is being connected. Base64 images in `localStorage` can be large and are lost if browser storage is cleared — this limitation goes away once cloud storage is live.

## Uploading a photo

The `PhotoUploader` component provides an interface to select an image from your device. On upload:

1. The file is sent to Supabase Storage.
2. The returned URL is saved to the `piece_photos` table linked to the current piece.
3. The photo appears immediately in the piece's photo grid.

## Viewing photos

On the piece detail page, photos render in a responsive 2–3 column grid. Each photo shows the image at a fixed height (`h-40`) with `object-cover` cropping, plus an optional caption below.

## Deleting photos

Photos can be removed from the piece record. Deletion removes the `piece_photos` row and (when Supabase Storage is active) the corresponding file from the bucket.

## Privacy

Photo files are stored in Supabase Storage (hosted on AWS). They are accessible only to the authenticated user who owns the piece, enforced by storage bucket policies. See the [Services](services.md) chapter for the full privacy breakdown.

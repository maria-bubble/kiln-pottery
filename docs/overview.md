# Kiln — Overview

Kiln is a pottery studio tracker that helps ceramicists document, organise, and follow pieces through every stage of the making process — from the first pinch of clay to the final fired piece.

## What it does

Kiln gives you a single place to:

- **Track every piece** through the full pottery workflow: Forming → Drying → Bisque Fired → Glazing → Glaze Fired → Complete.
- **Record surface layers** — glazes, underglazes, stains, slips, engobes, oxides — in the order they are applied, with brand, colour, application method, and coat count.
- **Attach photos** at any stage so you can compare how a piece looks at greenware versus out of the glaze kiln.
- **Log firing details** — kiln type, cone, bisque and glaze temperatures.
- **Save preferences** — your default clay body, forming method, firing type, and surface layer templates — so new pieces start pre-filled with your studio defaults.

## Who it's for

Kiln is built for studio potters who want a lightweight digital notebook alongside their making practice. It is not a sales or inventory tool; it focuses entirely on the craft process.

Data is stored in a Supabase cloud database and synced to your account, so your pieces are accessible from any device or browser. *(Note: the current build stores data locally while Supabase is being connected.)*

## About data storage

Pieces, photos, and preferences are stored in your Supabase account — a cloud database tied to your login. Because data lives in the cloud, it follows you across browsers and devices: sign in anywhere and your full studio record is there.

Photos are stored via Supabase Storage and referenced by URL in the database, so they are backed up independently of the piece record and do not inflate local storage.

> **Note:** The current build stores all data in the browser's `localStorage` while the Supabase connection is being finalised. Once Supabase is live, data will migrate to the cloud automatically.

## Navigation

The app has three main areas:

| Area | Path | Purpose |
|---|---|---|
| My Pieces | `/` | Grid of all pieces with stage filters and search |
| New Piece | `/pieces/new` | Form to create and save a new piece |
| Piece Detail | `/pieces/[id]` | Full record for a single piece, including stage advancement, surface layers, photos, and measurements |
| Preferences | `/preferences` | Studio defaults saved to your account |

## Stages

Pieces move through six stages in sequence:

1. **Forming** — shaping the clay
2. **Drying** — slow drying before bisque firing
3. **Bisque Fired** — first firing to harden the piece
4. **Glazing** — applying surface treatments
5. **Glaze Fired** — final firing to melt glazes
6. **Complete** — finished piece

Stage advancement is one-way and confirmed with a prompt before it is committed.

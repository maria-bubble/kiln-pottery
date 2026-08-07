# Preferences

**Route:** `/preferences`  
**File:** `src/app/preferences/page.tsx`

## Purpose

The Preferences page lets you save studio defaults that are applied whenever you create a new piece. This saves time on repetitive data entry.

## Loading and saving

When the page opens, it reads your saved preferences from the database and fills in all the fields.

> **Note:** The current build reads preferences from `localStorage` while Supabase is being connected.

Changes you make are held in the form state — **they are not saved automatically**.

To persist your changes, click the **Save Preferences** button. The app writes the current form values to the database and briefly shows a **"Saved!"** confirmation message. That message disappears after 2 seconds automatically.

> **Note:** In the current build, preferences are written to `localStorage` rather than the database. Once Supabase is live, saved preferences will follow you across devices and browsers.

## Fields

| Field | Notes |
|---|---|
| Default clay body | Applied to new pieces. |
| Default forming method | Applied to new pieces. |
| Default firing type | Applied to new pieces. |
| Default cone | Applied to new pieces. |
| Favourite clay bodies | A saved list of clay bodies with name, colour, grog percentage, firing range, and notes. |
| Favourite surface products | A saved list of surface products with type, product name, brand, colour, and notes. |
| Default surface layers | The layer stack cloned onto each new piece. |

## Cloud-backed preferences

Preferences are stored in the `user_preferences` table in Supabase, linked to your user account. Because they live in the cloud, they follow you to any device or browser — sign in and your studio defaults load automatically.

> **Note:** The current build stores preferences only in the current browser via `localStorage`. Once Supabase is connected, preferences will sync across devices automatically.

## How preferences affect new pieces

When you create a new piece, `createNewPiece()` reads your preferences and pre-fills:

- Clay body
- Forming method
- Firing type
- Cone
- Surface layers (each cloned with a fresh ID so edits on one piece don't affect others)

Pieces already created are not retroactively updated when you change your preferences.

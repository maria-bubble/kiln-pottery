# Surface Layers

**Component:** `src/components/SurfaceLayerEditor.tsx`

## What surface layers are

A surface layer represents one product applied to the surface of a piece — a glaze, underglaze, stain, engobe, slip, oxide, wax resist, or other material. Layers are ordered from bottom to top, mirroring how they are physically applied.

## Supported layer types

| Type | Label |
|---|---|
| `glaze` | Glaze |
| `underglaze` | Underglaze |
| `stain` | Stain |
| `engobe` | Engobe |
| `slip` | Slip |
| `oxide` | Oxide |
| `wax_resist` | Wax Resist |
| `other` | Other |

## Fields per layer

| Field | Notes |
|---|---|
| Type | Required — one of the types above. |
| Product name | The name of the specific glaze or product. |
| Brand | Optional manufacturer name. |
| Colour description | Optional human-readable description. |
| Application method | E.g. "dipped", "brushed", "sprayed". |
| Coats | Number of coats applied. |
| Notes | Any additional notes. |

## Where surface layers appear

Surface layers appear in two contexts:

1. **New Piece / Edit forms** — via `SurfaceLayerEditor` embedded in `PieceForm`. You can add, reorder, and remove layers here at any stage.
2. **Piece detail page** — read-only display outside of Glazing, and the interactive `SurfaceLayerEditor` during the Glazing stage.

## Reordering

Layers can be reordered by drag-and-drop (or equivalent controls) in the editor. The `order` field on each layer is updated to reflect its position.

## Auto-saving changes

When you make changes to layers on the piece detail page (during Glazing), the `SurfaceLayerEditor` calls `onChange`, which immediately saves the updated layer list back to the piece record in the database. *(Note: the current build saves to the piece record in `localStorage` as long as the piece is already loaded.)*

## Default surface layers in preferences

You can save a set of default surface layers in Preferences. When you create a new piece, those layers are cloned (with fresh IDs) onto the new piece, giving you a starting point you can adjust per-piece.

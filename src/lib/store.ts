'use client'

import { Piece, UserPreferences, SurfaceLayer, Stage, PieceType } from '@/types'
import { generateId } from './utils'

export const DEFAULT_STAGES: Stage[] = [
  { id: 'not_started', label: 'Not started' },
  { id: 'drying', label: 'Drying' },
  { id: 'bisque_firing', label: 'Bisque Firing' },
  { id: 'bisque_fired', label: 'Bisque Fired' },
  { id: 'glaze_firing', label: 'Glaze Firing' },
  { id: 'glaze_fired', label: 'Glaze Fired' },
]

export const DEFAULT_PIECE_TYPES: PieceType[] = [
  { id: 'cup',       label: 'Cup' },
  { id: 'bowl',      label: 'Bowl' },
  { id: 'plate',     label: 'Plate' },
  { id: 'sculpture', label: 'Sculpture' },
  { id: 'vase',      label: 'Vase' },
  { id: 'container', label: 'Container' },
]

const PIECES_KEY = 'pottery_pieces'
const PREFS_KEY = 'pottery_prefs'

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getPieces(): Piece[] {
  return load<Piece[]>(PIECES_KEY, [])
}

export function getPiece(id: string): Piece | undefined {
  return getPieces().find((p) => p.id === id)
}

export function savePiece(piece: Piece) {
  const pieces = getPieces()
  const idx = pieces.findIndex((p) => p.id === piece.id)
  const updated = { ...piece, updated_at: new Date().toISOString() }
  if (idx >= 0) {
    pieces[idx] = updated
  } else {
    pieces.unshift(updated)
  }
  save(PIECES_KEY, pieces)
  return updated
}

export function deletePiece(id: string) {
  const pieces = getPieces().filter((p) => p.id !== id)
  save(PIECES_KEY, pieces)
}

export function createNewPiece(overrides: Partial<Piece> = {}): Piece {
  const prefs = getPreferences()
  const now = new Date().toISOString()
  return {
    id: generateId(),
    user_id: 'local',
    title: 'Untitled Piece',
    stage: prefs.default_stage ?? prefs.stages[0]?.id ?? 'not_started',
    forming_method: prefs.default_forming_method,
    clay_body: prefs.default_clay_body,
    firing_type: prefs.default_firing_type,
    cone: prefs.default_cone,
    surface_layers: prefs.default_surface_layers.map((l) => ({ ...l, id: generateId() })),
    photos: [],
    tags: [],
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function advanceStage(piece: Piece): Piece {
  const stageIds = getPreferences().stages.map((s) => s.id)
  const idx = stageIds.indexOf(piece.stage)
  if (idx < stageIds.length - 1) {
    const next = stageIds[idx + 1]
    const isLast = next === stageIds[stageIds.length - 1]
    return savePiece({
      ...piece,
      stage: next,
      completed_at: isLast ? new Date().toISOString() : piece.completed_at,
    })
  }
  return piece
}

export function getPreferences(): UserPreferences {
  return load<UserPreferences>(PREFS_KEY, {
    id: generateId(),
    user_id: 'local',
    favorite_clay_bodies: [],
    favorite_surface_products: [],
    default_surface_layers: [],
    stages: DEFAULT_STAGES,
    default_stage: 'not_started',
  })
}

export function getStages(): Stage[] {
  return getPreferences().stages
}

export function savePreferences(prefs: UserPreferences) {
  save(PREFS_KEY, prefs)
}

export function addSurfaceLayer(piece: Piece, layer: Omit<SurfaceLayer, 'id' | 'order'>): Piece {
  const layers = piece.surface_layers
  const newLayer: SurfaceLayer = {
    ...layer,
    id: generateId(),
    order: layers.length,
  }
  return { ...piece, surface_layers: [...layers, newLayer] }
}

export function reorderLayers(piece: Piece, fromIdx: number, toIdx: number): Piece {
  const layers = [...piece.surface_layers]
  const [moved] = layers.splice(fromIdx, 1)
  layers.splice(toIdx, 0, moved)
  return {
    ...piece,
    surface_layers: layers.map((l, i) => ({ ...l, order: i })),
  }
}

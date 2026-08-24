export type PieceStage = string

export type SurfaceLayerType =
  | 'glaze'
  | 'underglaze'
  | 'stain'
  | 'engobe'
  | 'slip'
  | 'oxide'
  | 'wax_resist'
  | 'other'

export type FiringType = 'oxidation' | 'reduction' | 'wood' | 'soda' | 'salt' | 'raku' | 'pit'

export type FormingMethod =
  | 'wheel_thrown'
  | 'hand_built'
  | 'slab'
  | 'coil'
  | 'pinch'
  | 'cast'
  | 'extruded'
  | 'mixed'

export type ClayBody = {
  id: string
  name: string
  color: string
  grog_percentage?: number
  firing_range_low?: number
  firing_range_high?: number
  notes?: string
}

export type SurfaceLayer = {
  id: string
  order: number
  type: SurfaceLayerType
  product_name: string
  brand?: string
  color_description?: string
  application_method?: string
  coats?: number
  notes?: string
}

export type Piece = {
  id: string
  user_id: string
  title: string
  description?: string
  stage: PieceStage
  forming_method?: FormingMethod
  clay_body?: string
  height_cm?: number
  width_cm?: number
  depth_cm?: number
  weight_grams?: number
  firing_type?: FiringType
  bisque_temp_c?: number
  glaze_temp_c?: number
  cone?: string
  surface_layers: SurfaceLayer[]
  photos: PiecePhoto[]
  started_at?: string
  completed_at?: string
  notes?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export type PiecePhoto = {
  id: string
  piece_id: string
  url: string
  caption?: string
  stage_at_capture?: PieceStage
  created_at: string
}

export type UserPreferences = {
  id: string
  user_id: string
  default_clay_body?: string
  default_forming_method?: FormingMethod
  default_firing_type?: FiringType
  default_cone?: string
  favorite_clay_bodies: ClayBody[]
  favorite_surface_products: FavoriteSurfaceProduct[]
  default_surface_layers: SurfaceLayer[]
  stages: string[]
  default_stage: string
}

export type FavoriteSurfaceProduct = {
  id: string
  type: SurfaceLayerType
  product_name: string
  brand?: string
  color_description?: string
  notes?: string
}

// Default stages used when initializing a new user's preferences.
export const DEFAULT_STAGES: string[] = [
  'Not started',
  'Drying',
  'Bisque Firing',
  'Bisque Fired',
  'Glaze Firing',
  'Glaze Fired',
  'Done',
]

export const DEFAULT_STAGE = 'Not started'

export const LAYER_TYPE_LABELS: Record<SurfaceLayerType, string> = {
  glaze: 'Glaze',
  underglaze: 'Underglaze',
  stain: 'Stain',
  engobe: 'Engobe',
  slip: 'Slip',
  oxide: 'Oxide',
  wax_resist: 'Wax Resist',
  other: 'Other',
}

export const FORMING_METHOD_LABELS: Record<FormingMethod, string> = {
  wheel_thrown: 'Wheel Thrown',
  hand_built: 'Hand Built',
  slab: 'Slab Built',
  coil: 'Coil Built',
  pinch: 'Pinch Pot',
  cast: 'Slip Cast',
  extruded: 'Extruded',
  mixed: 'Mixed Methods',
}

export const FIRING_TYPE_LABELS: Record<FiringType, string> = {
  oxidation: 'Oxidation',
  reduction: 'Reduction',
  wood: 'Wood Fired',
  soda: 'Soda Fired',
  salt: 'Salt Fired',
  raku: 'Raku',
  pit: 'Pit Fired',
}

// A fixed palette cycled by stage index; fallback for any index beyond the list.
export const STAGE_PALETTE: string[] = [
  'bg-amber-100 text-amber-800',
  'bg-yellow-100 text-yellow-800',
  'bg-orange-100 text-orange-800',
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-teal-100 text-teal-800',
  'bg-rose-100 text-rose-800',
  'bg-sky-100 text-sky-800',
  'bg-indigo-100 text-indigo-800',
]

/** Returns the Tailwind badge classes for a stage given the ordered stages array. */
export function getStageColor(stage: string, stages: string[]): string {
  const idx = stages.indexOf(stage)
  if (idx < 0) return 'bg-stone-100 text-stone-600'
  return STAGE_PALETTE[idx % STAGE_PALETTE.length]
}

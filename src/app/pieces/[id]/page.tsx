'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Piece, STAGE_LABELS, STAGE_ORDER, FORMING_METHOD_LABELS, FIRING_TYPE_LABELS, LAYER_TYPE_LABELS } from '@/types'
import { getPiece, advanceStage, deletePiece } from '@/lib/store'
import { StageProgress } from '@/components/StageProgress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Edit, Trash2, ChevronRight, Camera, Layers, Ruler, Weight, Flame } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const LAYER_TYPE_COLORS: Record<string, string> = {
  glaze: 'bg-blue-50 border-blue-200 text-blue-800',
  underglaze: 'bg-violet-50 border-violet-200 text-violet-800',
  stain: 'bg-rose-50 border-rose-200 text-rose-800',
  engobe: 'bg-orange-50 border-orange-200 text-orange-800',
  slip: 'bg-amber-50 border-amber-200 text-amber-800',
  oxide: 'bg-stone-100 border-stone-300 text-stone-700',
  wax_resist: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  other: 'bg-gray-50 border-gray-200 text-gray-700',
}

export default function PieceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [piece, setPiece] = useState<Piece | null>(null)

  useEffect(() => {
    const p = getPiece(id)
    if (!p) router.push('/')
    else setPiece(p)
  }, [id, router])

  if (!piece) return null

  const currentStageIdx = STAGE_ORDER.indexOf(piece.stage)
  const isComplete = piece.stage === 'complete'
  const nextStage = !isComplete ? STAGE_ORDER[currentStageIdx + 1] : null

  function handleAdvance() {
    if (!piece) return
    const updated = advanceStage(piece)
    setPiece(updated)
  }

  function handleDelete() {
    if (!confirm(`Delete "${piece?.title}"? This cannot be undone.`)) return
    deletePiece(id)
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{piece.title}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            {piece.forming_method && (
              <span className="text-sm text-stone-500">{FORMING_METHOD_LABELS[piece.forming_method]}</span>
            )}
            {piece.clay_body && (
              <span className="text-sm text-stone-500">· {piece.clay_body}</span>
            )}
            <span className="text-sm text-stone-400">· {formatDate(piece.updated_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/pieces/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-stone-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <StageProgress stage={piece.stage} />

      {!isComplete && nextStage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-900">Ready to advance?</p>
            <p className="text-xs text-amber-700 mt-0.5">Move this piece to <strong>{STAGE_LABELS[nextStage]}</strong></p>
          </div>
          <Button variant="clay" size="sm" onClick={handleAdvance}>
            Mark as {STAGE_LABELS[nextStage]}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isComplete && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm font-semibold text-green-800">🎉 This piece is complete!</p>
          {piece.completed_at && (
            <p className="text-xs text-green-600 mt-1">Finished {formatDate(piece.completed_at)}</p>
          )}
        </div>
      )}

      {piece.photos.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Camera className="h-4 w-4" /> Photos
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {piece.photos.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption || ''} className="w-full h-40 object-cover" />
                {photo.caption && (
                  <p className="text-xs text-stone-500 p-2">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {piece.surface_layers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Layers className="h-4 w-4" /> Surface Layers
            <span className="text-xs text-stone-400 font-normal">bottom → top</span>
          </h2>
          <div className="space-y-2">
            {piece.surface_layers.map((layer, i) => (
              <div
                key={layer.id}
                className={cn(
                  'rounded-lg border p-3 flex items-center gap-3',
                  LAYER_TYPE_COLORS[layer.type] || 'bg-gray-50 border-gray-200'
                )}
              >
                <span className="text-xs font-bold w-5 text-center opacity-40">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-wide opacity-60 font-medium">
                      {LAYER_TYPE_LABELS[layer.type]}
                    </span>
                    <span className="font-medium text-sm">
                      {layer.product_name || <span className="opacity-50 italic">unnamed</span>}
                    </span>
                    {layer.brand && <span className="text-xs opacity-60">by {layer.brand}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs opacity-70 flex-wrap">
                    {layer.color_description && <span>{layer.color_description}</span>}
                    {layer.coats && <span>{layer.coats} coats</span>}
                    {layer.application_method && <span>{layer.application_method}</span>}
                  </div>
                  {layer.notes && <p className="text-xs opacity-60 mt-1">{layer.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
          <Flame className="h-4 w-4" /> Firing Details
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {piece.firing_type && (
            <div className="rounded-lg bg-white border border-stone-200 p-3">
              <p className="text-xs text-stone-500">Firing</p>
              <p className="font-medium text-sm">{FIRING_TYPE_LABELS[piece.firing_type]}</p>
            </div>
          )}
          {piece.cone && (
            <div className="rounded-lg bg-white border border-stone-200 p-3">
              <p className="text-xs text-stone-500">Cone</p>
              <p className="font-medium text-sm">{piece.cone}</p>
            </div>
          )}
          {piece.bisque_temp_c && (
            <div className="rounded-lg bg-white border border-stone-200 p-3">
              <p className="text-xs text-stone-500">Bisque Temp</p>
              <p className="font-medium text-sm">{piece.bisque_temp_c}°C</p>
            </div>
          )}
          {piece.glaze_temp_c && (
            <div className="rounded-lg bg-white border border-stone-200 p-3">
              <p className="text-xs text-stone-500">Glaze Temp</p>
              <p className="font-medium text-sm">{piece.glaze_temp_c}°C</p>
            </div>
          )}
        </div>
      </section>

      {(piece.height_cm || piece.width_cm || piece.weight_grams) && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Ruler className="h-4 w-4" /> Measurements
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {piece.height_cm && (
              <div className="rounded-lg bg-white border border-stone-200 p-3">
                <p className="text-xs text-stone-500">Height</p>
                <p className="font-medium text-sm">{piece.height_cm} cm</p>
              </div>
            )}
            {piece.width_cm && (
              <div className="rounded-lg bg-white border border-stone-200 p-3">
                <p className="text-xs text-stone-500">Width</p>
                <p className="font-medium text-sm">{piece.width_cm} cm</p>
              </div>
            )}
            {piece.depth_cm && (
              <div className="rounded-lg bg-white border border-stone-200 p-3">
                <p className="text-xs text-stone-500">Depth</p>
                <p className="font-medium text-sm">{piece.depth_cm} cm</p>
              </div>
            )}
            {piece.weight_grams && (
              <div className="rounded-lg bg-white border border-stone-200 p-3">
                <p className="text-xs text-stone-500">Weight</p>
                <p className="font-medium text-sm">{piece.weight_grams} g</p>
              </div>
            )}
          </div>
        </section>
      )}

      {piece.notes && (
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-stone-800">Notes</h2>
          <p className="text-sm text-stone-600 whitespace-pre-wrap bg-white border border-stone-200 rounded-lg p-4">
            {piece.notes}
          </p>
        </section>
      )}

      {piece.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {piece.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

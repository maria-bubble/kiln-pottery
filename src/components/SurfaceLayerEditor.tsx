'use client'

import { useState } from 'react'
import { SurfaceLayer, SurfaceLayerType, LAYER_TYPE_LABELS } from '@/types'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateId } from '@/lib/utils'

interface SurfaceLayerEditorProps {
  layers: SurfaceLayer[]
  onChange: (layers: SurfaceLayer[]) => void
}

const LAYER_COLORS: Record<SurfaceLayerType, string> = {
  glaze: 'bg-blue-50 border-blue-200',
  underglaze: 'bg-violet-50 border-violet-200',
  stain: 'bg-rose-50 border-rose-200',
  engobe: 'bg-orange-50 border-orange-200',
  slip: 'bg-amber-50 border-amber-200',
  oxide: 'bg-stone-100 border-stone-300',
  wax_resist: 'bg-yellow-50 border-yellow-200',
  other: 'bg-gray-50 border-gray-200',
}

export function SurfaceLayerEditor({ layers, onChange }: SurfaceLayerEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function addLayer() {
    const newLayer: SurfaceLayer = {
      id: generateId(),
      order: layers.length,
      type: 'glaze',
      product_name: '',
      coats: 3,
    }
    onChange([...layers, newLayer])
    setExpandedId(newLayer.id)
  }

  function removeLayer(id: string) {
    onChange(layers.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i })))
  }

  function updateLayer(id: string, patch: Partial<SurfaceLayer>) {
    onChange(layers.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function moveLayer(idx: number, dir: -1 | 1) {
    const next = [...layers]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next.map((l, i) => ({ ...l, order: i })))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Surface Layers</Label>
        <span className="text-xs text-stone-400">Bottom → Top</span>
      </div>

      {layers.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-stone-200 p-6 text-center text-sm text-stone-400">
          No layers yet. Add a glaze, underglaze, or other surface treatment.
        </div>
      )}

      <div className="space-y-2">
        {layers.map((layer, idx) => {
          const expanded = expandedId === layer.id
          return (
            <div
              key={layer.id}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                LAYER_COLORS[layer.type] || 'bg-gray-50 border-gray-200'
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveLayer(idx, -1)}
                    disabled={idx === 0}
                    className="opacity-40 hover:opacity-100 disabled:opacity-20"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <GripVertical className="h-4 w-4 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => moveLayer(idx, 1)}
                    disabled={idx === layers.length - 1}
                    className="opacity-40 hover:opacity-100 disabled:opacity-20"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wide w-20 shrink-0">
                      {LAYER_TYPE_LABELS[layer.type]}
                    </span>
                    <span className="truncate text-sm font-medium text-stone-800">
                      {layer.product_name || (
                        <span className="text-stone-400 italic">unnamed</span>
                      )}
                    </span>
                    {layer.coats && (
                      <span className="text-xs text-stone-400 shrink-0">×{layer.coats}</span>
                    )}
                  </div>
                  {layer.color_description && (
                    <div className="text-xs text-stone-500 mt-0.5">{layer.color_description}</div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : layer.id)}
                    className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded hover:bg-white/50"
                  >
                    {expanded ? 'Done' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLayer(layer.id)}
                    className="text-stone-400 hover:text-red-500 p-1 rounded hover:bg-white/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {expanded && (
                <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-white/50">
                  <div className="space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={layer.type}
                      onValueChange={(v) => updateLayer(layer.id, { type: v as SurfaceLayerType })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LAYER_TYPE_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val} className="text-xs">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Product Name</Label>
                    <Input
                      className="h-8 text-xs"
                      value={layer.product_name}
                      onChange={(e) => updateLayer(layer.id, { product_name: e.target.value })}
                      placeholder="e.g. Floating Blue"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Brand</Label>
                    <Input
                      className="h-8 text-xs"
                      value={layer.brand || ''}
                      onChange={(e) => updateLayer(layer.id, { brand: e.target.value })}
                      placeholder="e.g. Amaco"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Color Description</Label>
                    <Input
                      className="h-8 text-xs"
                      value={layer.color_description || ''}
                      onChange={(e) =>
                        updateLayer(layer.id, { color_description: e.target.value })
                      }
                      placeholder="e.g. deep teal with breaking"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Coats</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      className="h-8 text-xs"
                      value={layer.coats || ''}
                      onChange={(e) =>
                        updateLayer(layer.id, { coats: parseInt(e.target.value) || undefined })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Application</Label>
                    <Input
                      className="h-8 text-xs"
                      value={layer.application_method || ''}
                      onChange={(e) =>
                        updateLayer(layer.id, { application_method: e.target.value })
                      }
                      placeholder="dip, brush, spray..."
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Notes</Label>
                    <Input
                      className="h-8 text-xs"
                      value={layer.notes || ''}
                      onChange={(e) => updateLayer(layer.id, { notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addLayer} className="w-full">
        <Plus className="h-4 w-4" />
        Add Layer
      </Button>
    </div>
  )
}

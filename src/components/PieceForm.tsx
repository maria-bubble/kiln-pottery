'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Piece,
  FORMING_METHOD_LABELS,
  FIRING_TYPE_LABELS,
  FormingMethod,
  FiringType,
} from '@/types'
import { savePiece } from '@/lib/store'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { SurfaceLayerEditor } from './SurfaceLayerEditor'
import { PhotoUploader } from './PhotoUploader'

interface PieceFormProps {
  initialPiece: Piece
  isNew?: boolean
}

export function PieceForm({ initialPiece, isNew }: PieceFormProps) {
  const router = useRouter()
  const [piece, setPiece] = useState<Piece>(initialPiece)
  const [saving, setSaving] = useState(false)

  function update<K extends keyof Piece>(key: K, value: Piece[K]) {
    setPiece((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const saved = savePiece(piece)
    setSaving(false)
    router.push(`/pieces/${saved.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title">Piece Title</Label>
          <Input
            id="title"
            value={piece.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Large Yunomi #3"
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={piece.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What are you making? Any notes on intent or inspiration..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Forming Method</Label>
          <Select
            value={piece.forming_method || ''}
            onValueChange={(v) => update('forming_method', v as FormingMethod)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FORMING_METHOD_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clay_body">Clay Body</Label>
          <Input
            id="clay_body"
            value={piece.clay_body || ''}
            onChange={(e) => update('clay_body', e.target.value)}
            placeholder="e.g. B-Mix, Speckled Buff"
          />
        </div>

        <div className="space-y-2">
          <Label>Firing Type</Label>
          <Select
            value={piece.firing_type || ''}
            onValueChange={(v) => update('firing_type', v as FiringType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select firing..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FIRING_TYPE_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cone">Cone</Label>
          <Input
            id="cone"
            value={piece.cone || ''}
            onChange={(e) => update('cone', e.target.value)}
            placeholder="e.g. ^6, ^10"
          />
        </div>

        <div className="space-y-2">
          <Label>Dimensions (cm)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="H"
              value={piece.height_cm || ''}
              onChange={(e) =>
                update('height_cm', parseFloat(e.target.value) || undefined)
              }
            />
            <Input
              type="number"
              placeholder="W"
              value={piece.width_cm || ''}
              onChange={(e) =>
                update('width_cm', parseFloat(e.target.value) || undefined)
              }
            />
            <Input
              type="number"
              placeholder="D"
              value={piece.depth_cm || ''}
              onChange={(e) =>
                update('depth_cm', parseFloat(e.target.value) || undefined)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (g)</Label>
          <Input
            id="weight"
            type="number"
            value={piece.weight_grams || ''}
            onChange={(e) =>
              update('weight_grams', parseFloat(e.target.value) || undefined)
            }
            placeholder="Weight in grams"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={piece.tags.join(', ')}
            onChange={(e) =>
              update(
                'tags',
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            placeholder="functional, mug, gift, commission..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={piece.notes || ''}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Firing notes, problems encountered, things to try next time..."
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-stone-100 pt-6">
        <SurfaceLayerEditor
          layers={piece.surface_layers}
          onChange={(layers) => update('surface_layers', layers)}
        />
      </div>

      <div className="space-y-3 border-t border-stone-100 pt-6">
        <Label className="text-base font-semibold">Photos</Label>
        <PhotoUploader
          photos={piece.photos}
          pieceId={piece.id}
          onChange={(photos) => update('photos', photos)}
        />
      </div>

      <div className="flex gap-3 border-t border-stone-100 pt-6">
        <Button type="submit" variant="clay" disabled={saving} className="flex-1">
          {saving ? 'Saving...' : isNew ? 'Create Piece' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useState, useRef } from 'react'
import { PiecePhoto, PieceStage, STAGE_LABELS } from '@/types'
import { generateId } from '@/lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Camera, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoUploaderProps {
  photos: PiecePhoto[]
  pieceId: string
  currentStage?: PieceStage
  onChange: (photos: PiecePhoto[]) => void
}

export function PhotoUploader({ photos, pieceId, currentStage, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        const photo: PiecePhoto = {
          id: generateId(),
          piece_id: pieceId,
          url,
          stage_at_capture: currentStage,
          created_at: new Date().toISOString(),
        }
        onChange([...photos, photo])
      }
      reader.readAsDataURL(file)
    })
  }

  function removePhoto(id: string) {
    onChange(photos.filter((p) => p.id !== id))
  }

  function updateCaption(id: string, caption: string) {
    onChange(photos.map((p) => (p.id === id ? { ...p, caption } : p)))
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragging ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-stone-300'
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-stone-300" />
        <p className="text-sm text-stone-500">
          Drop photos here or <span className="text-amber-700 font-medium">browse</span>
        </p>
        <p className="text-xs text-stone-400 mt-1">Stored locally in your browser</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-lg overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || 'Piece photo'}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
              {photo.stage_at_capture && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-0.5">
                  <span className="text-xs text-white">{STAGE_LABELS[photo.stage_at_capture]}</span>
                </div>
              )}
              <Input
                className="mt-1 h-7 text-xs border-0 bg-transparent px-1 rounded-none border-t border-stone-200"
                placeholder="Caption..."
                value={photo.caption || ''}
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

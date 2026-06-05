'use client'

import { Piece, STAGE_LABELS, STAGE_ORDER, FORMING_METHOD_LABELS } from '@/types'
import { cn, formatDate } from '@/lib/utils'
import { Camera, Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StageProgress } from './StageProgress'

interface PieceCardProps {
  piece: Piece
}

export function PieceCard({ piece }: PieceCardProps) {
  const coverPhoto = piece.photos[0]

  return (
    <Link href={`/pieces/${piece.id}`} className="block group">
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden hover:border-amber-300 hover:shadow-md transition-all">
        <div className="relative h-48 bg-stone-100">
          {coverPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverPhoto.url}
              alt={piece.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Camera className="h-10 w-10 text-stone-300" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StageProgress stage={piece.stage} compact />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-stone-900 truncate group-hover:text-amber-800 transition-colors">
            {piece.title}
          </h3>

          <div className="mt-1 flex items-center gap-3 text-xs text-stone-500">
            {piece.forming_method && (
              <span>{FORMING_METHOD_LABELS[piece.forming_method]}</span>
            )}
            {piece.clay_body && <span>{piece.clay_body}</span>}
          </div>

          {piece.description && (
            <p className="mt-2 text-xs text-stone-500 line-clamp-2">{piece.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-stone-400">
              {piece.surface_layers.length > 0 && (
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  {piece.surface_layers.length}
                </span>
              )}
              {piece.photos.length > 0 && (
                <span className="flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  {piece.photos.length}
                </span>
              )}
            </div>
            <span className="text-xs text-stone-400">{formatDate(piece.updated_at)}</span>
          </div>

          {piece.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {piece.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

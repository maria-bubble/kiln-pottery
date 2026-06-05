'use client'

import { useEffect, useState } from 'react'
import { createNewPiece } from '@/lib/store'
import { Piece } from '@/types'
import { PieceForm } from '@/components/PieceForm'
import { StageProgress } from '@/components/StageProgress'

export default function NewPiecePage() {
  const [piece, setPiece] = useState<Piece | null>(null)

  useEffect(() => {
    setPiece(createNewPiece())
  }, [])

  if (!piece) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">New Piece</h1>
        <p className="text-sm text-stone-500 mt-1">Start tracking a new ceramic piece</p>
      </div>
      <StageProgress stage="forming" />
      <PieceForm initialPiece={piece} isNew />
    </div>
  )
}

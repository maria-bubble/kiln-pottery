'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Piece } from '@/types'
import { getPiece } from '@/lib/store'
import { PieceForm } from '@/components/PieceForm'
import { StageProgress } from '@/components/StageProgress'

export default function EditPiecePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [piece, setPiece] = useState<Piece | null>(null)

  useEffect(() => {
    const p = getPiece(id)
    if (!p) router.push('/')
    else setPiece(p)
  }, [id, router])

  if (!piece) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Edit Piece</h1>
        <p className="text-sm text-stone-500 mt-1">{piece.title}</p>
      </div>
      <StageProgress stage={piece.stage} />
      <PieceForm initialPiece={piece} />
    </div>
  )
}

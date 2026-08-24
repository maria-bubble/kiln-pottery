'use client'

import { useState, useEffect } from 'react'
import { Piece, Stage } from '@/types'
import { getPieces, getStages } from '@/lib/store'
import { PieceCard } from '@/components/PieceCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState<string>('all')

  useEffect(() => {
    setPieces(getPieces())
    setStages(getStages())
  }, [])

  const filtered = pieces.filter((p) => {
    const matchStage = filterStage === 'all' || p.stage === filterStage
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      p.clay_body?.toLowerCase().includes(search.toLowerCase())
    return matchStage && matchSearch
  })

  const stageCounts = stages.reduce(
    (acc, s) => ({ ...acc, [s.id]: pieces.filter((p) => p.stage === s.id).length }),
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Pieces</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {pieces.length} piece{pieces.length !== 1 ? 's' : ''} in your studio
          </p>
        </div>
        <Link href="/pieces/new">
          <Button variant="clay">
            <Plus className="h-4 w-4" />
            New Piece
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStage('all')}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            filterStage === 'all'
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          )}
        >
          All ({pieces.length})
        </button>
        {stages.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterStage(s.id)}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              filterStage === s.id
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            )}
          >
            {s.label} ({stageCounts[s.id] || 0})
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input
          className="pl-9"
          placeholder="Search by name, tag, or clay body..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          {pieces.length === 0 ? (
            <div className="space-y-4">
              <div className="text-6xl">🏺</div>
              <div>
                <p className="font-medium text-stone-600">No pieces yet</p>
                <p className="text-sm mt-1">Create your first piece to get started</p>
              </div>
              <Link href="/pieces/new">
                <Button variant="clay">
                  <Plus className="h-4 w-4" />
                  Create First Piece
                </Button>
              </Link>
            </div>
          ) : (
            <p>No pieces match your filters</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((piece) => (
            <PieceCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  )
}

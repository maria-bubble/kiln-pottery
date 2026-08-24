'use client'

import { getStages } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

// Fixed palette cycled by position index so colors stay consistent
// regardless of what the user names their stages.
const STAGE_PALETTE = [
  'bg-gray-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-amber-500',
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
]

// Compact-badge palette: softer tones that read well on white backgrounds
const BADGE_PALETTE = [
  'bg-gray-100 text-gray-800',
  'bg-yellow-100 text-yellow-800',
  'bg-orange-100 text-orange-800',
  'bg-amber-100 text-amber-800',
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
]

interface StageProgressProps {
  stage: string
  compact?: boolean
}

export function StageProgress({ stage, compact }: StageProgressProps) {
  const stages = getStages()
  const currentIdx = stages.findIndex((s) => s.id === stage)
  // If stage id not found (legacy piece), treat as position 0 with raw id as label
  const resolvedIdx = currentIdx === -1 ? 0 : currentIdx
  const currentLabel = currentIdx === -1 ? stage : stages[currentIdx].label

  if (compact) {
    const badgeColor = BADGE_PALETTE[resolvedIdx % BADGE_PALETTE.length]
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          badgeColor
        )}
      >
        {currentLabel}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-0">
      {stages.map((s, i) => {
        const done = i < resolvedIdx
        const active = i === resolvedIdx
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  done && 'border-amber-700 bg-amber-700 text-white',
                  active && 'border-amber-700 bg-white text-amber-700',
                  !done && !active && 'border-stone-300 bg-white text-stone-400'
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] w-14 text-center leading-tight',
                  active ? 'text-amber-700 font-semibold' : 'text-stone-400'
                )}
              >
                {s.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn(
                  'mb-4 h-0.5 w-6',
                  i < resolvedIdx ? 'bg-amber-700' : 'bg-stone-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

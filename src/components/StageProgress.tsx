'use client'

import { PieceStage, STAGE_LABELS, STAGE_ORDER } from '@/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StageProgressProps {
  stage: PieceStage
  compact?: boolean
}

export function StageProgress({ stage, compact }: StageProgressProps) {
  const currentIdx = STAGE_ORDER.indexOf(stage)

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          stageColor(stage)
        )}
      >
        {STAGE_LABELS[stage]}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-0">
      {STAGE_ORDER.map((s, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={s} className="flex items-center">
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
                {STAGE_LABELS[s]}
              </span>
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <div
                className={cn(
                  'mb-4 h-0.5 w-6',
                  i < currentIdx ? 'bg-amber-700' : 'bg-stone-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function stageColor(stage: PieceStage) {
  const colors: Record<PieceStage, string> = {
    forming: 'bg-amber-100 text-amber-800',
    drying: 'bg-yellow-100 text-yellow-800',
    bisque_fired: 'bg-orange-100 text-orange-800',
    glazing: 'bg-blue-100 text-blue-800',
    glaze_fired: 'bg-purple-100 text-purple-800',
    complete: 'bg-green-100 text-green-800',
  }
  return colors[stage]
}

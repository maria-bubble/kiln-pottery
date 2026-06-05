'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, Settings, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-900">
          <Flame className="h-5 w-5 text-amber-700" />
          <span>Kiln</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              pathname === '/'
                ? 'bg-stone-100 text-stone-900'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Pieces
          </Link>
          <Link
            href="/preferences"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              pathname === '/preferences'
                ? 'bg-stone-100 text-stone-900'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            )}
          >
            <Settings className="h-4 w-4" />
            Preferences
          </Link>
        </nav>
      </div>
    </header>
  )
}

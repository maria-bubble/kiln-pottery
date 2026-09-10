'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Flame, Settings, LayoutGrid, LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

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

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-200">
              <span className="text-xs text-stone-500 max-w-[120px] truncate" title={user.email}>
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ml-2 text-amber-700 hover:bg-amber-50"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

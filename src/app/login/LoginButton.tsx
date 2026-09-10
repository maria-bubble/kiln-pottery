'use client'

import { LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginButton() {
  async function handleSignIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={handleSignIn}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium transition-colors"
    >
      <LogIn className="h-4 w-4" />
      Sign in with Google
    </button>
  )
}

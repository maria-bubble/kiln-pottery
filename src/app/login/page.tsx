import { Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './LoginButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/')

  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Flame className="h-10 w-10 text-amber-700" />
            <h1 className="text-2xl font-bold text-stone-900">Kiln</h1>
            <p className="text-sm text-stone-500 text-center">
              Sign in to track your ceramic pieces through every stage of creation
            </p>
          </div>

          {error === 'auth' && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 w-full text-center">
              Authentication failed. Please try again.
            </p>
          )}

          <LoginButton />

          <p className="text-xs text-stone-400 text-center">
            Requires Supabase and Google OAuth to be configured in your environment.
          </p>
        </div>
      </div>
    </div>
  )
}

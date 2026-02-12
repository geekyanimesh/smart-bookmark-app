'use client'

import { createClient } from '@/src/utils/supabase/client'
import { LogOut, User } from 'lucide-react'

export default function AuthButton({ user }: { user: any }) {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return user ? (
    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1 pr-2 rounded-full border border-gray-200 shadow-sm">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {user.email?.[0].toUpperCase()}
      </div>
      <button
        onClick={handleLogout}
        className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <button
      onClick={handleLogin}
      className="group relative px-6 py-2.5 rounded-full font-medium text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full animate-gradient" />
      <span className="relative flex items-center gap-2">
        <User className="w-4 h-4" />
        Login with Google
      </span>
    </button>
  )
}
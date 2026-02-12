import { createClient } from '@/src/utils/supabase/server'
import AuthButton from '@/src/components/AuthButton'

export default async function Home() {
  const supabase = await createClient()

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Smart Bookmark App</h1>
      
      <div className="mb-8">
        <AuthButton user={user} />
      </div>

      {user ? (
        <div className="p-8 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <p className="text-xl">Welcome to your private dashboard!</p>
          {/* We will add the bookmark list here in the next step */}
        </div>
      ) : (
        <p className="text-gray-500">Please sign in to manage your bookmarks.</p>
      )}
    </main>
  )
}
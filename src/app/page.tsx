import { createClient } from '@/src/utils/supabase/server'
import Dashboard from '@/src/components/Dashboard'
import LandingPage from '@/src/components/LandingPage'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <LandingPage />
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return <Dashboard initialBookmarks={bookmarks || []} />
}
'use client'

import { createClient } from '@/src/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Plus, LogOut, Loader2, Globe, Trash2, ExternalLink } from 'lucide-react'

type Bookmark = {
  id: number
  title: string
  url: string
}

export default function Dashboard({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()

  // Real-time Update Logic (Requirement #4)
  useEffect(() => {
    const channel = supabase.channel('realtime bookmarks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookmarks' }, (payload) => {
        setBookmarks((curr) => [payload.new as Bookmark, ...curr])
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookmarks' }, (payload) => {
        setBookmarks((curr) => curr.filter((item) => item.id !== payload.old.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleAdd = async () => {
    if (!newUrl) return
    setIsAdding(true)
    // Inserts bookmark (Requirement #2) - RLS handles Requirement #3
    await supabase.from('bookmarks').insert({ 
      title: newTitle || new URL(newUrl).hostname, 
      url: newUrl 
    })
    setIsAdding(false)
    setNewTitle(''); setNewUrl('')
  }

  const handleDelete = async (id: number) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black tracking-tight">Smart BookMark</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Single-Line Input Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-white border-2 border-gray-100 rounded-2xl focus-within:border-black transition-all">
            <input
              type="text"
              placeholder="Bookmark title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-6 py-3 bg-transparent outline-none text-sm text-black"
            />
          </div>
          <div className="flex-[1.5] bg-white border-2 border-gray-100 rounded-2xl focus-within:border-black transition-all flex items-center pr-2">
            <input
              type="url"
              placeholder="Paste your bookmark URL..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-6 py-3 bg-transparent outline-none text-sm text-black"
            />
            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Full-Width Bookmark Stack */}
        <div className="space-y-3">
          {bookmarks.length > 0 ? (
            bookmarks.map((b) => (
              <div key={b.id} className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-black/20 hover:shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-black truncate">{b.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{b.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <a href={b.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(b.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 text-sm">No bookmarks yet. Start curating your list.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
'use client'

import { createClient } from '@/src/utils/supabase/client'
import { useEffect, useState } from 'react'

type Bookmark = {
  id: number
  title: string
  url: string
  created_at: string
}

export default function Dashboard({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const supabase = createClient()

  // 1. Setup Realtime Subscription
  useEffect(() => {
    const channel = supabase
      .channel('realtime bookmarks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookmarks' }, (payload) => {
        setBookmarks((current) => [...current, payload.new as Bookmark])
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookmarks' }, (payload) => {
        setBookmarks((current) => current.filter((item) => item.id !== payload.old.id))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // 2. Handle Add Bookmark
  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newUrl) return

    const { error } = await supabase.from('bookmarks').insert({ title: newTitle, url: newUrl })
    
    if (error) console.error('Error adding:', error)
    else {
      setNewTitle('')
      setNewUrl('')
    }
  }

  // 3. Handle Delete
  const deleteBookmark = async (id: number) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error('Error deleting:', error)
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Add Bookmark Form */}
      <form onSubmit={addBookmark} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded shadow flex gap-2">
        <input
          type="text"
          placeholder="Title (e.g., Google)"
          className="border p-2 rounded flex-1 dark:bg-gray-700 dark:text-white"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="url"
          placeholder="https://example.com"
          className="border p-2 rounded flex-1 dark:bg-gray-700 dark:text-white"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add
        </button>
      </form>

      {/* Bookmarks List */}
      <ul className="space-y-2">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
              {bookmark.title}
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
        {bookmarks.length === 0 && <p className="text-center text-gray-500">No bookmarks yet.</p>}
      </ul>
    </div>
  )
}
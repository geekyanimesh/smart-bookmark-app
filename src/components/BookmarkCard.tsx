'use client'
import { Globe, Trash2, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface BookmarkCardProps {
  id: number
  title: string
  url: string
  onDelete: (id: number) => void
}

export default function BookmarkCard({ id, title, url, onDelete }: BookmarkCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const domain = new URL(url).hostname

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative bg-card border border-border rounded-2xl p-4 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-foreground">
          <Globe className="w-4 h-4 opacity-70" />
        </div>
        {isHovering && (
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div>
        <h3 className="font-bold text-foreground text-sm line-clamp-2 mb-1">{title}</h3>
        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
          <p className="text-xs text-muted-foreground truncate flex-1">{domain}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:bg-accent transition-colors"
          >
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  )
}
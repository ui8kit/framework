import { useNavigate } from 'react-router-dom'
import { Group, Button } from '@ui8kit/core'
import { useState } from 'react'

export function SearchBar({ initial = '' }: { initial?: string }) {
  const [q, setQ] = useState(initial)
  const nav = useNavigate()

  const handleSearch = () => nav(`/search?q=${encodeURIComponent(q)}`)

  return (
    <Group gap="2" items="center" data-class="search-bar">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
        placeholder="Search..."
        aria-label="Search"
        data-class="search-input"
        className="px-3 py-2 text-sm text-foreground rounded-md border border-input bg-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      />
      <Button onClick={handleSearch} size="sm" data-class="search-button">
        Search
      </Button>
    </Group>
  )
}

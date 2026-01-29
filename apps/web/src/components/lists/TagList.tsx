import { Stack, Title, Badge } from '@ui8kit/core'
import { Link } from 'react-router-dom'

type Tag = { 
  id: number
  name: string
  slug: string
  count?: number 
}

export function TagList({ items }: { items: Tag[] }) {
  return (
    <Stack gap="4" data-class="tag-list">
      <Title 
        fontSize="lg" 
        fontWeight="semibold"
        textColor="foreground"
        data-class="tag-list-title"
      >
        Tags
      </Title>

      <Stack gap="2" data-class="tag-list-items">
        {items.map(t => (
          <Link 
            key={t.id} 
            to={`/tag/${t.slug}`}
            data-class="tag-list-item-link"
          >
            <Badge 
              variant="secondary"
              data-class="tag-list-item"
            >
              {t.name}{typeof t.count === 'number' ? ` (${t.count})` : ''}
            </Badge>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}

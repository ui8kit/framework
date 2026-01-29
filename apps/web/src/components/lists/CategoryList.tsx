import { Stack, Title, Text } from '@ui8kit/core'
import { Link } from 'react-router-dom'

type Category = { 
  id: number
  name: string
  slug: string
  count?: number 
}

export function CategoryList({ items }: { items: Category[] }) {
  return (
    <Stack gap="4" data-class="category-list">
      <Title 
        fontSize="lg" 
        fontWeight="semibold"
        textColor="foreground"
        data-class="category-list-title"
      >
        Categories
      </Title>

      <Stack gap="2" data-class="category-list-items">
        {items.map(c => (
          <Link 
            key={c.id} 
            to={`/category/${c.slug}`}
            data-class="category-list-item-link"
          >
            <Text 
              fontSize="sm" 
              textColor="muted-foreground"
              data-class="category-list-item"
            >
              {c.name}{typeof c.count === 'number' ? ` (${c.count})` : ''}
            </Text>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}

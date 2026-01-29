import { Card, Stack, Title, Text, Button } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { useTheme } from '@/providers/theme'

type Category = { 
  id: number
  name: string
  slug: string
  count?: number 
}

export function CategoryCard({ item }: { item: Category }) {
  const { rounded } = useTheme()

  return (
    <Card 
      p="6" 
      rounded={rounded.default} 
      shadow="sm" 
      bg="card"
      data-class="category-card"
    >
      <Stack gap="4" data-class="category-card-content">
        <Title 
          fontSize="lg" 
          fontWeight="semibold"
          textColor="foreground"
          data-class="category-card-title"
        >
          {item.name}
        </Title>

        {typeof item.count === 'number' && (
          <Text 
            fontSize="sm" 
            textColor="muted-foreground"
            data-class="category-card-count"
          >
            {item.count} posts
          </Text>
        )}

        <Link to={`/category/${item.slug}`} data-class="category-card-link">
          <Button size="sm" data-class="category-card-action">
            View posts
          </Button>
        </Link>
      </Stack>
    </Card>
  )
}

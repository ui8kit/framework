import { Card, Stack, Title, Text, Button, Image, Group } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { useTheme } from '@/providers/theme'

type Author = { 
  id: number
  name: string
  slug: string
  count?: number
  avatarUrl?: string 
}

export function AuthorCard({ item }: { item: Author }) {
  const { rounded } = useTheme()

  return (
    <Card 
      p="6" 
      rounded={rounded.default} 
      shadow="sm" 
      bg="card"
      data-class="author-card"
    >
      <Group gap="4" items="center" data-class="author-card-content">
        {item.avatarUrl && (
          <Image 
            src={item.avatarUrl} 
            alt={item.name} 
            rounded="full" 
            w="auto"
            h="auto"
            aspect="square"
            fit="cover"
            data-class="author-card-avatar"
          />
        )}

        <Stack gap="2" data-class="author-card-body">
          <Title 
            fontSize="lg" 
            fontWeight="semibold"
            textColor="foreground"
            data-class="author-card-title"
          >
            {item.name}
          </Title>

          {typeof item.count === 'number' && (
            <Text 
              fontSize="sm" 
              textColor="muted-foreground"
              data-class="author-card-count"
            >
              {item.count} posts
            </Text>
          )}
        </Stack>
      </Group>

      <Link to={`/author/${item.slug}`} data-class="author-card-link">
        <Button 
          size="sm" 
          m="4"
          data-class="author-card-action"
        >
          View posts
        </Button>
      </Link>
    </Card>
  )
}

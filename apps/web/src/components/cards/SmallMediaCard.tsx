import { Group, Image, Stack, Title, Text, Card } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { useTheme } from '@/providers/theme'

type Item = {
  id: number
  title: string
  slug: string
  excerpt?: string
  thumbnail?: { url: string; alt: string }
}

export function SmallMediaCard({ item }: { item: Item }) {
  const { rounded } = useTheme()

  return (
    <Card 
      p="4" 
      rounded={rounded.default} 
      shadow="none" 
      bg="card" 
      border=""
      data-class="small-media-card"
    >
      <Group gap="4" items="start" data-class="small-media-card-content">
        {item.thumbnail?.url && (
          <Link to={`/post/${item.slug}`} data-class="small-media-card-image-link">
            <Image 
              src={item.thumbnail.url} 
              alt={item.title} 
              rounded={rounded.default} 
              w="auto"
              h="auto"
              aspect="square"
              fit="cover"
              data-class="small-media-card-image"
            />
          </Link>
        )}

        <Stack gap="2" data-class="small-media-card-body">
          <Link to={`/post/${item.slug}`} data-class="small-media-card-title-link">
            <Title 
              fontSize="sm" 
              fontWeight="bold" 
              textColor="foreground"
              data-class="small-media-card-title"
            >
              {item.title}
            </Title>
          </Link>

          {item.excerpt && (
            <Text 
              fontSize="xs" 
              textColor="muted-foreground" 
              lineHeight="relaxed"
              data-class="small-media-card-excerpt"
            >
              {item.excerpt.slice(0, 80)}...
            </Text>
          )}
        </Stack>
      </Group>
    </Card>
  )
}

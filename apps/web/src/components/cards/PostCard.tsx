import { Card, Image, Stack, Title, Text, Group, Badge, Button } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { useTheme } from '@/providers/theme'

type Post = {
  id: number
  title: string
  excerpt: string
  slug: string
  thumbnail?: { url: string; alt: string }
  categories?: { id: number; name: string; slug: string }[]
}

type PostCardProps = {
  post: Post
  media?: 'top' | 'default'
}

export function PostCard({ post, media = 'default' }: PostCardProps) {
  const { rounded } = useTheme()
  const isMediaTop = media === 'top'

  return (
    <Card 
      p={isMediaTop ? "0" : "6"} 
      rounded={rounded.default} 
      shadow="md" 
      bg="card" 
      data-class="post-card"
    >
      <Stack gap={isMediaTop ? "0" : "6"} data-class="post-card-content">
        {post.thumbnail?.url && (
          <Link to={`/post/${post.slug}`} data-class="post-card-image-link">
            <Image
              src={post.thumbnail.url}
              alt={post.thumbnail.alt}
              rounded={isMediaTop ? "none" : rounded.default}
              w="full"
              h="auto"
              fit="cover"
              data-class="post-card-image"
            />
          </Link>
        )}

        <Stack 
          p={isMediaTop ? "4" : "0"} 
          gap="4" 
          data-class="post-card-body"
        >
          <Link to={`/post/${post.slug}`} data-class="post-card-title-link">
            <Title 
              fontSize="xl" 
              fontWeight="semibold" 
              textColor="foreground"
              data-class="post-card-title"
            >
              {post.title}
            </Title>
          </Link>

          <Text 
            fontSize="sm" 
            textColor="muted-foreground" 
            lineHeight="relaxed"
            data-class="post-card-excerpt"
          >
            {post.excerpt}
          </Text>

          {post.categories?.length ? (
            <Group gap="2" items="center" data-class="post-card-categories">
              {post.categories.slice(0, 2).map(cat => (
                <Badge 
                  key={cat.id} 
                  variant="secondary" 
                  data-class={`post-card-category`}
                >
                  {cat.name}
                </Badge>
              ))}
            </Group>
          ) : null}
        </Stack>

        <Stack p={isMediaTop ? "4" : "0"} justify="end" data-class="post-card-footer">
          <Link to={`/post/${post.slug}`}>
            <Button 
              variant="secondary" 
              size="sm"
              data-class="post-card-action"
            >
              Read more
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Card>
  )
}

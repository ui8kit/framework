import { Stack, Title, Text } from '@ui8kit/core'
import { SmallMediaCard } from '@/components/cards/SmallMediaCard'
import { useRenderContext } from '@/~data'

export function PopularPosts() {
  const { context, loading } = useRenderContext()

  const postsData = context?.posts?.posts || []
  const popular = postsData.slice(0, 5)

  if (loading) {
    return (
      <Stack gap="4" data-class="popular-posts-loading">
        <Title 
          fontSize="lg" 
          fontWeight="semibold"
          textColor="foreground"
          data-class="popular-posts-title"
        >
          Popular Posts
        </Title>
        <Text 
          fontSize="sm" 
          textColor="muted-foreground"
          data-class="popular-posts-status"
        >
          Loading...
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="4" data-class="popular-posts">
      <Title 
        fontSize="lg" 
        fontWeight="semibold"
        textColor="foreground"
        data-class="popular-posts-title"
      >
        Popular Posts
      </Title>

      <Stack gap="4" data-class="popular-posts-list">
        {popular.map((p: any) => (
          <SmallMediaCard 
            key={p.id} 
            item={p as any}
            data-class="popular-posts-item"
          />
        ))}
      </Stack>
    </Stack>
  )
}

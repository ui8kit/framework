import { Stack, Title, Text, Grid } from '@ui8kit/core'
import { PostCard } from '@/components/cards/PostCard'
import { useRenderContext } from '@/~data'

export function HomeLatest() {
  const { context, loading, error } = useRenderContext()

  const postsData = context?.posts?.posts || []
  const latest = postsData.slice(0, 4)

  if (loading) {
    return (
      <Stack gap="4" data-class="home-latest-loading">
        <Title 
          fontSize="2xl" 
          fontWeight="bold"
          textColor="foreground"
          data-class="home-latest-title"
        >
          Latest Posts
        </Title>
        <Text 
          fontSize="base" 
          textColor="muted-foreground"
          data-class="home-latest-status"
        >
          Loading posts...
        </Text>
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack gap="4" data-class="home-latest-error">
        <Title 
          fontSize="2xl" 
          fontWeight="bold"
          textColor="foreground"
          data-class="home-latest-title"
        >
          Latest Posts
        </Title>
        <Text 
          fontSize="base" 
          textColor="muted-foreground"
          data-class="home-latest-status"
        >
          Failed to load posts
        </Text>
      </Stack>
    )
  }

  if (!context) {
    return (
      <Stack gap="4" data-class="home-latest-empty">
        <Title 
          fontSize="2xl" 
          fontWeight="bold"
          textColor="foreground"
          data-class="home-latest-title"
        >
          Latest Posts
        </Title>
        <Text 
          fontSize="base" 
          textColor="muted-foreground"
          data-class="home-latest-status"
        >
          No posts available
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="4" data-class="home-latest">
      <Stack gap="2" data-class="home-latest-header">
        <Title 
          fontSize="2xl" 
          fontWeight="bold"
          textColor="foreground"
          data-class="home-latest-title"
        >
          Latest Posts
        </Title>
        <Text 
          fontSize="base" 
          textColor="muted-foreground"
          data-class="home-latest-subtitle"
        >
          Fresh insights from the blog
        </Text>
      </Stack>

      <Grid grid="cols-1" gap="6" data-class="home-latest-grid">
        {latest.map((p: any) => (
          <PostCard 
            key={p.id} 
            post={p as any}
            media="top"
            data-class="home-latest-item"
          />
        ))}
      </Grid>
    </Stack>
  )
}

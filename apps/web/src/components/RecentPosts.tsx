import { Stack, Title, Text, Grid } from '@ui8kit/core'
import { PostCard } from '@/components/cards/PostCard'
import { useRenderContext } from '@/~data'

export function RecentPosts() {
  const { context, loading } = useRenderContext()

  const postsData = context?.posts?.posts || []
  const recent = postsData.slice(0, 3)

  if (loading) {
    return (
      <Stack gap="4" data-class="recent-posts-loading">
        <Title 
          fontSize="2xl" 
          fontWeight="bold"
          textColor="foreground"
          data-class="recent-posts-title"
        >
          Recent Posts
        </Title>
        <Text 
          fontSize="base" 
          textColor="muted-foreground"
          data-class="recent-posts-status"
        >
          Loading...
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="4" data-class="recent-posts">
      <Stack gap="2" data-class="recent-posts-header">
        <Title 
          fontSize="2xl" 
          fontWeight="bold"
          textColor="foreground"
          data-class="recent-posts-title"
        >
          Recent Posts
        </Title>
        <Text 
          fontSize="base" 
          textColor="muted-foreground"
          data-class="recent-posts-subtitle"
        >
          Fresh insights from the blog
        </Text>
      </Stack>

      <Grid grid="cols-1" gap="6" data-class="recent-posts-grid">
        {recent.map((p: any) => (
          <PostCard 
            key={p.id} 
            post={p as any}
            data-class="recent-posts-item"
          />
        ))}
      </Grid>
    </Stack>
  )
}

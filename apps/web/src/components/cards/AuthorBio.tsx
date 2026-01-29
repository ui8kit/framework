import { Card, Group, Image, Stack, Title, Text } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { useTheme } from '@/providers/theme'

type Author = {
  name: string
  role?: string
  avatar?: { url: string; alt: string }
  bio?: string
  slug?: string
}

export function AuthorBio({ author }: { author: Author }) {
  const { rounded } = useTheme()

  return (
    <Card 
      p="6" 
      rounded={rounded.default} 
      shadow="sm" 
      bg="card"
      data-class="author-bio"
    >
      <Link 
        to={author.slug ? `/author/${author.slug}` : '#'} 
        data-class="author-bio-link"
      >
        <Group gap="4" items="start" data-class="author-bio-content">
          {author.avatar?.url && (
            <Image 
              src={author.avatar.url} 
              alt={author.avatar.alt} 
              rounded="full" 
              w="auto"
              h="auto"
              aspect="square"
              fit="cover"
              data-class="author-bio-avatar"
            />
          )}

          <Stack gap="2" data-class="author-bio-body">
            <Title 
              fontSize="sm" 
              fontWeight="bold"
              textColor="foreground"
              data-class="author-bio-name"
            >
              {author.name}
            </Title>

            {author.role && (
              <Text 
                fontSize="xs" 
                fontWeight="bold" 
                textColor="muted-foreground"
                data-class="author-bio-role"
              >
                {author.role}
              </Text>
            )}

            {author.bio && (
              <Text 
                fontSize="xs" 
                textColor="muted-foreground"
                lineHeight="relaxed"
                data-class="author-bio-description"
              >
                {author.bio}
              </Text>
            )}
          </Stack>
        </Group>
      </Link>
    </Card>
  )
}

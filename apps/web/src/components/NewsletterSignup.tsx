import { Stack, Title, Text, Card } from '@ui8kit/core'
import { useTheme } from '@/providers/theme'

export function NewsletterSignup() {
  const { rounded } = useTheme()

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription logic
  }

  return (
    <Card 
      p="6" 
      rounded={rounded.default} 
      shadow="md" 
      bg="primary"
      data-class="newsletter-signup"
    >
      <form onSubmit={handleSubscribe} data-class="newsletter-signup-form">
        <Stack gap="4" data-class="newsletter-signup-content">
          <Title 
            fontSize="xl" 
            fontWeight="bold" 
            textColor="primary-foreground"
            data-class="newsletter-signup-title"
          >
            Subscribe
          </Title>

          <Text 
            fontSize="sm" 
            textColor="primary-foreground" 
            lineHeight="relaxed"
            data-class="newsletter-signup-description"
          >
            Get the latest posts delivered to your inbox.
          </Text>

          <input 
            type="email" 
            placeholder="you@example.com" 
            required
            data-class="newsletter-signup-input"
            className="px-3 py-2 text-sm text-foreground rounded-md border border-white/20 bg-white/10 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
          />

          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-primary bg-white rounded-md hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            data-class="newsletter-signup-button"
          >
            Subscribe
          </button>
        </Stack>
      </form>
    </Card>
  )
}

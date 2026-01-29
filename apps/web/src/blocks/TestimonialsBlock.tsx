import { Block, Grid, Stack, Box, Title, Text, Image } from "@ui8kit/core";

// Testimonials Block - semantic testimonials section
// Demonstrates: Image component, typography variants, avatar pattern

const testimonials = [
  {
    quote: "UI8Kit transformed how we build interfaces. The type safety and semantic output are game changers.",
    author: "Sarah Chen",
    role: "Lead Developer",
    company: "TechCorp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    quote: "Finally, a framework that understands both developer experience and web standards. Highly recommended.",
    author: "Marcus Johnson",
    role: "Frontend Architect",
    company: "StartupXYZ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
  },
  {
    quote: "The static generation capabilities helped us achieve perfect Lighthouse scores without any extra effort.",
    author: "Elena Rodriguez",
    role: "CTO",
    company: "WebAgency",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
  },
];

export function TestimonialsBlock() {
  return (
    <Block component="section" data-class="testimonials-section">
      <Stack gap="8" py="16" items="center">
        <Stack gap="4" items="center" data-class="testimonials-header">
          <Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="testimonials-title">
            Loved by Developers
          </Title>

          <Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="testimonials-description">
            See what developers are saying about UI8Kit
          </Text>
        </Stack>

        <Grid grid="cols-3" gap="6" data-class="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Stack
              key={index}
              gap="4"
              p="6"
              rounded="lg"
              bg="card"
              border=""
              data-class={`testimonial-card-${index}`}
            >
              <Text fontSize="base" data-class="testimonial-quote">
                "{testimonial.quote}"
              </Text>

              <Box flex="" items="center" gap="4" data-class="testimonial-author">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  w="auto"
                  h="auto"
                  rounded="full"
                  fit="cover"
                  aspect="square"
                  data-class="testimonial-avatar"
                />

                <Stack gap="0" data-class="testimonial-info">
                  <Title fontSize="sm" fontWeight="semibold" data-class="testimonial-name">
                    {testimonial.author}
                  </Title>
                  <Text fontSize="xs" textColor="muted-foreground" data-class="testimonial-role">
                    {testimonial.role} at {testimonial.company}
                  </Text>
                </Stack>
              </Box>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}

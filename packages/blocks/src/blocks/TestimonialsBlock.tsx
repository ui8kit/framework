import { Block, Grid, Stack, Box, Title, Text, Image } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar?: string;
}

export interface TestimonialsBlockProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

export function TestimonialsBlock({
  title,
  subtitle,
  testimonials = [],
}: TestimonialsBlockProps) {
  return (
    <Block component="section" data-class="testimonials-section">
      <Stack gap="8" py="16" items="center" data-class="testimonials-container">
        <Stack gap="4" items="center" data-class="testimonials-header">
          <If test="title" value={!!title}>
            <Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="testimonials-title">
              <Var name="title" value={title} />
            </Title>
          </If>

          <If test="subtitle" value={!!subtitle}>
            <Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="testimonials-description">
              <Var name="subtitle" value={subtitle} />
            </Text>
          </If>
        </Stack>

        <Grid grid="cols-3" gap="6" data-class="testimonials-grid">
          <Loop each="testimonials" as="testimonial" data={testimonials}>
            {(testimonial: Testimonial) => (
              <Stack
                gap="4"
                p="6"
                rounded="lg"
                bg="card"
                border=""
                data-class="testimonial-card"
              >
                <Text fontSize="base" data-class="testimonial-quote">
                  "<Var name="testimonial.content" value={testimonial.content} />"
                </Text>

                <Box flex="" items="center" gap="4" data-class="testimonial-author">
                  <If test="testimonial.avatar" value={!!testimonial.avatar}>
                    <Image
                      src={testimonial.avatar || ''}
                      alt={testimonial.name}
                      w="auto"
                      h="auto"
                      rounded="full"
                      fit="cover"
                      aspect="square"
                      data-class="testimonial-avatar"
                    />
                  </If>

                  <Stack gap="0" data-class="testimonial-info">
                    <Title fontSize="sm" fontWeight="semibold" data-class="testimonial-name">
                      <Var name="testimonial.name" value={testimonial.name} />
                    </Title>
                    <If test="testimonial.role" value={!!testimonial.role}>
                      <Text fontSize="xs" textColor="muted-foreground" data-class="testimonial-role">
                        <Var name="testimonial.role" value={testimonial.role} /> at <Var name="testimonial.company" value={testimonial.company} />
                      </Text>
                    </If>
                  </Stack>
                </Box>
              </Stack>
            )}
          </Loop>
        </Grid>
      </Stack>
    </Block>
  );
}

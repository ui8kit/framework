import React from 'react';
import { Block, Grid, Stack, Box, Title, Text, Image } from '@ui8kit/core';

interface TestimonialsBlockProps {
  title?: string;
  subtitle?: string;
  testimonials?: any[];
}

export function TestimonialsBlock(props: TestimonialsBlockProps) {
  const { title, subtitle, testimonials } = props;
  return (
    <Block component="section" data-class="testimonials-section">
      <Stack gap="8" py="16" items="center" data-class="testimonials-container">
        <Stack gap="4" items="center" data-class="testimonials-header">
          {title ? (<><Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="testimonials-title">{title}</Title></>) : null}
          {subtitle ? (<><Text fontSize="lg" textColor="muted-foreground" textAlign="center" max="w-xl" data-class="testimonials-description">{subtitle}</Text></>) : null}
        </Stack>
        <Grid grid="cols-3" gap="6" data-class="testimonials-grid">
          {testimonials.map((testimonial, index) => (
          <React.Fragment key={testimonial.id ?? index}>
          <Stack gap="4" p="6" rounded="lg" bg="card" border="" data-class="testimonial-card"><Text fontSize="base" data-class="testimonial-quote"> "{testimonial.content}" </Text><Box flex="" items="center" gap="4" data-class="testimonial-author">{testimonial.avatar ? (<><Image src={testimonial.avatar || ''} alt={testimonial.name} w="auto" h="auto" rounded="full" fit="cover" aspect="square" data-class="testimonial-avatar"></Image></>) : null}<Stack gap="0" data-class="testimonial-info"><Title fontSize="sm" fontWeight="semibold" data-class="testimonial-name">{testimonial.name}</Title>{testimonial.role ? (<><Text fontSize="xs" textColor="muted-foreground" data-class="testimonial-role">{testimonial.role} at {testimonial.company}</Text></>) : null}</Stack></Box></Stack>
          </React.Fragment>
          ))}
        </Grid>
      </Stack>
    </Block>
  );
}

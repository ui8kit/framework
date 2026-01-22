import { Container } from '@ui8kit/core';
import { HeroBlock, FeaturesBlock } from '@/blocks';

// Route component - composes multiple semantic blocks with critical CSS optimization
export function HomePage() {
  return (
    <Container data-class="page-container">
      <HeroBlock />
      <FeaturesBlock />
    </Container>
  );
}

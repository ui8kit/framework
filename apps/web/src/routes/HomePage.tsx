import { Container } from '@ui8kit/core';
import { HeroBlock, FeaturesBlock, CTABlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

// Route component - composes multiple semantic blocks with critical CSS optimization
export function HomePage() {
  return (
    <Container data-class="page-container">
      <HeroBlock {...fixtures.hero} />
      <FeaturesBlock {...fixtures.features} />
      <CTABlock {...fixtures.cta} />
    </Container>
  );
}

import { HeroBlock, FeaturesBlock } from '@/blocks';

// Route component - composes multiple semantic blocks with critical CSS optimization
export function HomePage() {
  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
    </>
  );
}

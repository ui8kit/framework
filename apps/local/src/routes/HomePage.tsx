import { HeroBlock, FeaturesBlock } from '@/blocks';

// Route component - composes multiple semantic blocks
export function HomePage() {
  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
    </>
  );
}

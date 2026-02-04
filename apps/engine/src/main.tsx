import React from 'react';
import ReactDOM from 'react-dom/client';
import { Block, Stack } from '@ui8kit/core';
import { HeroBlock, FeaturesBlock, CTABlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

function App() {
  return (
    <Block min="h-screen" bg="muted" p="8" data-class="app-root">
      <Stack gap="8" data-class="app-content">
        <HeroBlock {...fixtures.hero} />
        <FeaturesBlock {...fixtures.features} />
        <CTABlock {...fixtures.cta} />
      </Stack>
    </Block>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

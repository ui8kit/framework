import React from 'react';
import ReactDOM from 'react-dom/client';
import { Block, Stack } from '@ui8kit/core';
import { ProductList, UserProfile } from './components';

function App() {
  return (
    <Block min="h-screen" bg="muted" p="8" data-class="app-root">
      <Stack gap="8" data-class="app-content">
        <ProductList
          title="Featured Products"
          products={[
            { id: '1', name: 'Product 1', price: 99 },
            { id: '2', name: 'Product 2', price: 149 },
          ]}
        />

        <UserProfile
          isLoggedIn={true}
          user={{
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            avatar: undefined,
          }}
        />
      </Stack>
    </Block>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

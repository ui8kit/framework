import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProductList } from './components';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ProductList
        title="Featured Products"
        products={[
          { id: '1', name: 'Product 1', price: 99 },
          { id: '2', name: 'Product 2', price: 149 },
        ]}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * ProductList - Example component with Loop
 */

import { Loop, If, Else, Var, Include } from '@ui8kit/template';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductListProps {
  products?: Product[];
  isLoading?: boolean;
  title?: string;
}

export function ProductList({ products, isLoading, title }: ProductListProps) {
  return (
    <section className="product-list">
      <h1 className="text-3xl font-bold mb-6">
        <Var name="title" default="Products" />
      </h1>
      
      <If test="isLoading">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2">Loading products...</span>
        </div>
      </If>
      
      <Else>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Loop each="products" as="product" keyExpr="product.id">
            <Include partial="product-card" props={{ product: "product" }} />
          </Loop>
        </div>
      </Else>
    </section>
  );
}

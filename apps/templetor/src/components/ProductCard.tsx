/**
 * ProductCard - Example component using DSL
 */

import { Var, If, Slot } from '@ui8kit/template';

interface ProductCardProps {
  product?: {
    name: string;
    price: number;
    description?: string;
  };
  isOnSale?: boolean;
  children?: React.ReactNode;
}

export function ProductCard({ product, isOnSale, children }: ProductCardProps) {
  return (
    <article className="product-card border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold">
        <Var>product.name</Var>
      </h2>
      
      <p className="text-gray-600 mt-2">
        <Var name="product.description" default="No description available" />
      </p>
      
      <div className="flex items-center gap-2 mt-4">
        <span className="text-2xl font-bold text-green-600">
          <Var name="product.price" filter="currency" />
        </span>
        
        <If test="isOnSale">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
            SALE
          </span>
        </If>
      </div>
      
      <Slot name="actions">
        {children}
      </Slot>
    </article>
  );
}

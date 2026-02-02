/**
 * ProductList - Example component with Loop
 */

import { Block, Grid, Stack, Box, Title, Text } from '@ui8kit/core';
import { Loop, Var, Include } from '@ui8kit/template';

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
    <Block component="section" data-class="product-list">
      <Stack gap="6" data-class="product-list-inner">
        <Title fontSize="3xl" fontWeight="bold" data-class="product-list-title">
          <Var name="title" default="Products" value={title} />
        </Title>

        {isLoading ? (
          <Stack gap="2" items="center" justify="center" py="8" data-class="product-list-loading">
            <Box rounded="full" border="2" w="8" h="8" data-class="product-list-spinner" />
            <Text data-class="product-list-loading-text">Loading products...</Text>
          </Stack>
        ) : (
          <Grid grid="cols-1" gap="6" data-class="product-list-grid">
            <Loop each="products" as="product" keyExpr="product.id" data={products}>
              <Include partial="product-card" props={{ product: 'product' }} />
            </Loop>
          </Grid>
        )}
      </Stack>
    </Block>
  );
}

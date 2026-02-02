/**
 * ProductCard - Example component using DSL
 */

import { Block, Stack, Group, Title, Text, Badge } from '@ui8kit/core';
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
    <Block component="article" border="" rounded="lg" p="4" shadow="sm" data-class="product-card">
      <Stack gap="2" data-class="product-card-body">
        <Title fontSize="xl" fontWeight="bold" data-class="product-card-title">
          <Var name="product.name" value={product?.name} />
        </Title>

        <Text fontSize="sm" textColor="muted-foreground" data-class="product-card-description">
          <Var name="product.description" default="No description available" value={product?.description} />
        </Text>

        <Group gap="2" items="center" data-class="product-card-price-row">
          <Title fontSize="2xl" fontWeight="bold" textColor="primary" data-class="product-card-price">
            <Var name="product.price" filter="currency" value={product?.price} />
          </Title>
          <If test="isOnSale" value={isOnSale}>
            <Badge variant="destructive" data-class="product-card-sale-badge">
              SALE
            </Badge>
          </If>
        </Group>

        <Slot name="actions">{children}</Slot>
      </Stack>
    </Block>
  );
}

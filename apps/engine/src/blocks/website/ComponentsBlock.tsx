import { Block, Grid, Card, CardHeader, CardTitle, CardDescription, CardContent, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/dsl';

export interface ComponentItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export interface ComponentsBlockProps {
  title?: string;
  subtitle?: string;
  items?: ComponentItem[];
}

export function ComponentsBlock({ title, subtitle, items = [] }: ComponentsBlockProps) {
  return (
    <Block component="section" data-class="components-section">
      <Block py="16" data-class="components-header">
        <If test="title" value={!!title}>
          <Text component="h2" fontSize="3xl" fontWeight="bold" textAlign="center" data-class="components-title">
            <Var name="title" value={title} />
          </Text>
        </If>
        <If test="subtitle" value={!!subtitle}>
          <Text
            fontSize="lg"
            textColor="muted-foreground"
            textAlign="center"
            max="w-xl"
            mx="auto"
            data-class="components-subtitle"
          >
            <Var name="subtitle" value={subtitle} />
          </Text>
        </If>
      </Block>
      <Grid cols="1-2-3" gap="6" data-class="components-grid">
        <Loop each="items" as="item" data={items}>
          {(item: ComponentItem) => (
            <Card data-class="components-item-card">
              <CardHeader>
                <CardTitle order={4} data-class="components-item-title">
                  <Var name="item.title" value={item.title} />
                </CardTitle>
                <CardDescription data-class="components-item-description">
                  <Var name="item.description" value={item.description} />
                </CardDescription>
              </CardHeader>
              <CardContent flex="" justify="between" items="center" data-class="components-item-footer">
                <Text fontSize="lg" fontWeight="semibold" textColor="primary" data-class="components-item-price">
                  $<Var name="item.price" value={item.price} />
                </Text>
              </CardContent>
            </Card>
          )}
        </Loop>
      </Grid>
    </Block>
  );
}

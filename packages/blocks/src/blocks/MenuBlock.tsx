import { Block, Grid, Card, CardHeader, CardTitle, CardDescription, CardContent, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export interface MenuDish {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export interface MenuBlockProps {
  title?: string;
  subtitle?: string;
  dishes?: MenuDish[];
}

export function MenuBlock({ title, subtitle, dishes = [] }: MenuBlockProps) {
  return (
    <Block component="section" data-class="menu-section">
      <Block py="16" data-class="menu-header">
        <If test="title" value={!!title}>
          <Text component="h2" fontSize="3xl" fontWeight="bold" textAlign="center" data-class="menu-title">
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
            data-class="menu-subtitle"
          >
            <Var name="subtitle" value={subtitle} />
          </Text>
        </If>
      </Block>
      <Grid cols="1-2-3" gap="6" data-class="menu-grid">
        <Loop each="dishes" as="dish" data={dishes}>
          {(dish: MenuDish) => (
            <Card data-class="menu-dish-card">
              <CardHeader>
                <CardTitle order={4} data-class="menu-dish-title">
                  <Var name="dish.title" value={dish.title} />
                </CardTitle>
                <CardDescription data-class="menu-dish-description">
                  <Var name="dish.description" value={dish.description} />
                </CardDescription>
              </CardHeader>
              <CardContent flex="" justify="between" items="center" data-class="menu-dish-footer">
                <Text fontSize="lg" fontWeight="semibold" textColor="primary" data-class="menu-dish-price">
                  $<Var name="dish.price" value={dish.price} />
                </Text>
              </CardContent>
            </Card>
          )}
        </Loop>
      </Grid>
    </Block>
  );
}

import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { Block, Grid, Card, CardHeader, CardTitle, CardDescription, CardContent, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';
import { DomainNavButton } from '@/partials';

export interface RecipeItem {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  image?: string;
  date?: string;
}

export interface RecipesPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  recipes: { title?: string; subtitle?: string; recipes?: RecipeItem[] };
}

/**
 * Recipes list Page view — Grid of recipe cards.
 */
export function RecipesPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  recipes,
}: RecipesPageViewProps) {
  const items = recipes.recipes ?? [];
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" data-class="recipes-section">
        <Block py="16" data-class="recipes-header">
          <If test="recipes.title" value={!!recipes.title}>
            <Text component="h2" fontSize="3xl" fontWeight="bold" textAlign="center" data-class="recipes-title">
              <Var name="recipes.title" value={recipes.title} />
            </Text>
          </If>
          <If test="recipes.subtitle" value={!!recipes.subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              max="w-xl"
              mx="auto"
              data-class="recipes-subtitle"
            >
              <Var name="recipes.subtitle" value={recipes.subtitle} />
            </Text>
          </If>
        </Block>
        <Grid cols="1-2-3" gap="6" data-class="recipes-grid">
          <Loop each="items" as="recipe" data={items}>
            {(recipe: RecipeItem) => (
              <Card data-class="recipe-card">
                <CardHeader>
                  <If test="recipe.title" value={!!recipe.title}>
                    <CardTitle order={4} data-class="recipe-card-title">
                      <Var name="recipe.title" value={recipe.title} />
                    </CardTitle>
                  </If>
                  <If test="recipe.excerpt" value={!!recipe.excerpt}>
                    <CardDescription data-class="recipe-card-excerpt">
                      <Var name="recipe.excerpt" value={recipe.excerpt} />
                    </CardDescription>
                  </If>
                </CardHeader>
                <CardContent data-class="recipe-card-actions">
                  <DomainNavButton href={`/recipes/${recipe.slug}`} size="sm" data-class="recipe-card-link">
                    Read Recipe
                  </DomainNavButton>
                </CardContent>
              </Card>
            )}
          </Loop>
        </Grid>
      </Block>
    </MainLayout>
  );
}

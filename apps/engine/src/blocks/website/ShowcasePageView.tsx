import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { Block, Grid, Card, CardHeader, CardTitle, CardDescription, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
  image?: string;
}

export interface ShowcasePageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  showcase: { title?: string; subtitle?: string; promotions?: ShowcaseItem[] };
}

/**
 * Showcase Page view — Grid of project cards.
 */
export function ShowcasePageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  showcase,
}: ShowcasePageViewProps) {
  const items = showcase.promotions ?? [];
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" data-class="showcase-section">
        <Block py="16" data-class="showcase-header">
          <If test="showcase.title" value={!!showcase.title}>
            <Text component="h2" fontSize="3xl" fontWeight="bold" textAlign="center" data-class="showcase-title">
              <Var name="showcase.title" value={showcase.title} />
            </Text>
          </If>
          <If test="showcase.subtitle" value={!!showcase.subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              max="w-xl"
              mx="auto"
              data-class="showcase-subtitle"
            >
              <Var name="showcase.subtitle" value={showcase.subtitle} />
            </Text>
          </If>
        </Block>
        <Grid cols="1-2-3" gap="6" data-class="showcase-grid">
          <Loop each="items" as="item" data={items}>
            {(item: ShowcaseItem) => (
              <Card data-class="showcase-card">
                <CardHeader>
                  <If test="item.title" value={!!item.title}>
                    <CardTitle order={4} data-class="showcase-card-title">
                      <Var name="item.title" value={item.title} />
                    </CardTitle>
                  </If>
                  <If test="item.description" value={!!item.description}>
                    <CardDescription data-class="showcase-card-description">
                      <Var name="item.description" value={item.description} />
                    </CardDescription>
                  </If>
                  <If test="item.validUntil" value={!!item.validUntil}>
                    <Text fontSize="sm" textColor="muted-foreground" data-class="showcase-card-valid">
                      Valid until:{' '}
                      <Text component="span" data-class="showcase-card-valid-value">
                        <Var name="item.validUntil" value={item.validUntil} />
                      </Text>
                    </Text>
                  </If>
                </CardHeader>
              </Card>
            )}
          </Loop>
        </Grid>
      </Block>
    </MainLayout>
  );
}

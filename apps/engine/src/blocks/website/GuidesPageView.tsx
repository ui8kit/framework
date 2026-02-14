import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { Block, Grid, Card, CardHeader, CardTitle, CardDescription, CardContent, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';
import { DomainNavButton } from '@/partials';

export interface GuideItem {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  image?: string;
  date?: string;
}

export interface GuidesPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  guides: { title?: string; subtitle?: string; guides?: GuideItem[] };
}

/**
 * Guides list Page view — Grid of guide cards.
 */
export function GuidesPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  guides,
}: GuidesPageViewProps) {
  const items = guides.guides ?? [];
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" data-class="guides-section">
        <Block py="16" data-class="guides-header">
          <If test="guides.title" value={!!guides.title}>
            <Text component="h2" fontSize="3xl" fontWeight="bold" textAlign="center" data-class="guides-title">
              <Var name="guides.title" value={guides.title} />
            </Text>
          </If>
          <If test="guides.subtitle" value={!!guides.subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              max="w-xl"
              mx="auto"
              data-class="guides-subtitle"
            >
              <Var name="guides.subtitle" value={guides.subtitle} />
            </Text>
          </If>
        </Block>
        <Grid cols="1-2-3" gap="6" data-class="guides-grid">
          <Loop each="items" as="guide" data={items}>
            {(guide: GuideItem) => (
              <Card data-class="guide-card">
                <CardHeader>
                  <If test="guide.title" value={!!guide.title}>
                    <CardTitle order={4} data-class="guide-card-title">
                      <Var name="guide.title" value={guide.title} />
                    </CardTitle>
                  </If>
                  <If test="guide.excerpt" value={!!guide.excerpt}>
                    <CardDescription data-class="guide-card-excerpt">
                      <Var name="guide.excerpt" value={guide.excerpt} />
                    </CardDescription>
                  </If>
                </CardHeader>
                <CardContent data-class="guide-card-actions">
                  <DomainNavButton href={`/guides/${guide.slug}`} size="sm" data-class="guide-card-link">
                    Read Guide
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

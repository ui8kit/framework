import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { Block, Grid, Card, CardHeader, CardTitle, CardDescription, CardContent, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export interface PromotionItem {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
  image?: string;
}

export interface PromotionsPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  promotions: { title?: string; subtitle?: string; promotions?: PromotionItem[] };
}

/**
 * Promotions Page view — Grid of promo cards.
 */
export function PromotionsPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  promotions,
}: PromotionsPageViewProps) {
  const items = promotions.promotions ?? [];
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" data-class="promotions-section">
        <Block py="16" data-class="promotions-header">
          <If test="promotions.title" value={!!promotions.title}>
            <Text component="h2" fontSize="3xl" fontWeight="bold" textAlign="center" data-class="promotions-title">
              <Var name="promotions.title" value={promotions.title} />
            </Text>
          </If>
          <If test="promotions.subtitle" value={!!promotions.subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              max="w-xl"
              mx="auto"
              data-class="promotions-subtitle"
            >
              <Var name="promotions.subtitle" value={promotions.subtitle} />
            </Text>
          </If>
        </Block>
        <Grid cols="1-2-3" gap="6" data-class="promotions-grid">
          <Loop each="items" as="promo" data={items}>
            {(promo: PromotionItem) => (
              <Card data-class="promo-card">
                <CardHeader>
                  <If test="promo.title" value={!!promo.title}>
                    <CardTitle order={4} data-class="promo-title">
                      <Var name="promo.title" value={promo.title} />
                    </CardTitle>
                  </If>
                  <If test="promo.description" value={!!promo.description}>
                    <CardDescription data-class="promo-description">
                      <Var name="promo.description" value={promo.description} />
                    </CardDescription>
                  </If>
                  <If test="promo.validUntil" value={!!promo.validUntil}>
                    <Text fontSize="sm" textColor="muted-foreground" data-class="promo-valid">
                      Valid until:{' '}
                      <Text component="span" data-class="promo-valid-value">
                        <Var name="promo.validUntil" value={promo.validUntil} />
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

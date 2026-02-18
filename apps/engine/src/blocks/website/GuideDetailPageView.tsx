import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { Block, Container, Title, Text } from '@ui8kit/core';
import { If, Var } from '@ui8kit/dsl';

export interface GuideDetailPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  guide?: { slug: string; title: string; excerpt: string; body: string; image?: string; date?: string };
}

/**
 * Guide detail Page view — Article-style guide page.
 */
export function GuideDetailPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  guide,
}: GuideDetailPageViewProps) {
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="article" data-class="guide-detail-section">
        <Container max="w-2xl" py="16">
          <If test="guide" value={!!guide}>
            <Block data-class="guide-detail-content">
              <Title fontSize="4xl" fontWeight="bold" data-class="guide-detail-title">
                <Var name="guide.title" value={guide?.title} />
              </Title>
              <If test="guide.date" value={!!guide?.date}>
                <Text fontSize="sm" textColor="muted-foreground" data-class="guide-detail-date">
                  <Var name="guide.date" value={guide?.date} />
                </Text>
              </If>
              <Block py="8" data-class="guide-detail-body">
                <Text fontSize="base" lineHeight="relaxed" data-class="guide-detail-text">
                  <Var name="guide.body" value={guide?.body} />
                </Text>
              </Block>
            </Block>
          </If>
        </Container>
      </Block>
    </MainLayout>
  );
}

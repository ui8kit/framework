import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { Block, Container, Title, Text } from '@ui8kit/core';
import { If, Var } from '@ui8kit/template';

export interface BlogDetailPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  post?: { slug: string; title: string; excerpt: string; body: string; image?: string; date?: string; author?: string };
}

/**
 * Blog detail Page view — Article-style blog post.
 */
export function BlogDetailPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  post,
}: BlogDetailPageViewProps) {
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="article" data-class="blog-detail-section">
        <Container max="w-2xl" py="16">
          <If test="post" value={!!post}>
            <Block data-class="blog-detail-content">
              <Title fontSize="4xl" fontWeight="bold" data-class="blog-detail-title">
                <Var name="post.title" value={post?.title} />
              </Title>
              <If test="post.author" value={!!post?.author}>
                <Text fontSize="sm" textColor="muted-foreground" data-class="blog-detail-meta">
                  <Var name="post.author" value={post?.author} /> · <Var name="post.date" value={post?.date} />
                </Text>
              </If>
              <Block py="8" data-class="blog-detail-body">
                <Text fontSize="base" lineHeight="relaxed" data-class="blog-detail-text">
                  <Var name="post.body" value={post?.body} />
                </Text>
              </Block>
            </Block>
          </If>
        </Container>
      </Block>
    </MainLayout>
  );
}

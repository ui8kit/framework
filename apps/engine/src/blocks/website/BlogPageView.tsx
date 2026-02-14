import type { ReactNode } from 'react';
import { MainLayout } from '@/layouts';
import { Block, Container, Grid, Stack, Title, Text, Button } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';
import type { BlogFixture, BlogPostFixture } from '@ui8kit/data';

export interface BlogPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  headerTitle?: string;
  headerSubtitle?: string;
  blog: BlogFixture;
}

/**
 * Blog page — 3 posts in card layout (props-only, DSL).
 */
export function BlogPageView({
  navItems,
  headerTitle,
  headerSubtitle,
  blog,
}: BlogPageViewProps) {
  const posts = blog.posts ?? [];
  return (
    <MainLayout
      mode="full"
      navItems={navItems ?? []}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" py="8" data-class="blog-section">
        <Container max="w-6xl" flex="col" gap="8" data-class="blog-container">
          <If test="blog.title" value={!!blog.title}>
            <Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="blog-title">
              <Var name="blog.title" value={blog.title} />
            </Title>
          </If>
          <If test="blog.subtitle" value={!!blog.subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              data-class="blog-subtitle"
            >
              <Var name="blog.subtitle" value={blog.subtitle} />
            </Text>
          </If>
          <Grid grid="cols-3" gap="6" data-class="blog-grid">
            <Loop each="posts" as="post" data={posts}>
              {(post: BlogPostFixture) => (
                <Stack
                  p="6"
                  rounded="lg"
                  bg="card"
                  border=""
                  shadow="sm"
                  gap="4"
                  data-class="blog-card"
                >
                  <If test="post.title" value={!!post.title}>
                    <Title fontSize="xl" fontWeight="semibold" data-class="blog-card-title">
                      <Var name="post.title" value={post.title} />
                    </Title>
                  </If>
                  <If test="post.excerpt" value={!!post.excerpt}>
                    <Text fontSize="sm" textColor="muted-foreground" data-class="blog-card-excerpt">
                      <Var name="post.excerpt" value={post.excerpt} />
                    </Text>
                  </If>
                  <Button
                    variant="outline"
                    size="sm"
                    href={`/blog#${post.slug}`}
                    data-class="blog-card-link"
                  >
                    Read more
                  </Button>
                </Stack>
              )}
            </Loop>
          </Grid>
        </Container>
      </Block>
    </MainLayout>
  );
}

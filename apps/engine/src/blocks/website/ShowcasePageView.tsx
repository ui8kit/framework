import { MainLayout } from '@/layouts';
import { Block, Container, Grid, Stack, Title, Text, Button } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';
import type { ShowcaseFixture, ShowcaseProjectFixture } from '@ui8kit/data';

export interface ShowcasePageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  headerTitle?: string;
  headerSubtitle?: string;
  showcase: ShowcaseFixture;
}

/**
 * Showcase page — 3 project cards (props-only, DSL).
 */
export function ShowcasePageView({
  navItems,
  headerTitle,
  headerSubtitle,
  showcase,
}: ShowcasePageViewProps) {
  const projects = showcase.projects ?? [];
  return (
    <MainLayout
      mode="full"
      navItems={navItems ?? []}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Block component="section" py="8" data-class="showcase-section">
        <Container max="w-6xl" flex="col" gap="8" data-class="showcase-container">
          <If test="showcase.title" value={!!showcase.title}>
            <Title fontSize="3xl" fontWeight="bold" textAlign="center" data-class="showcase-title">
              <Var name="showcase.title" value={showcase.title} />
            </Title>
          </If>
          <If test="showcase.subtitle" value={!!showcase.subtitle}>
            <Text
              fontSize="lg"
              textColor="muted-foreground"
              textAlign="center"
              data-class="showcase-subtitle"
            >
              <Var name="showcase.subtitle" value={showcase.subtitle} />
            </Text>
          </If>
          <Grid grid="cols-3" gap="6" data-class="showcase-grid">
            <Loop each="projects" as="project" data={projects}>
              {(project: ShowcaseProjectFixture) => (
                <Stack
                  p="6"
                  rounded="lg"
                  bg="card"
                  border=""
                  shadow="sm"
                  gap="4"
                  data-class="showcase-card"
                >
                  <If test="project.title" value={!!project.title}>
                    <Title fontSize="xl" fontWeight="semibold" data-class="showcase-card-title">
                      <Var name="project.title" value={project.title} />
                    </Title>
                  </If>
                  <If test="project.description" value={!!project.description}>
                    <Text
                      fontSize="sm"
                      textColor="muted-foreground"
                      data-class="showcase-card-description"
                    >
                      <Var name="project.description" value={project.description} />
                    </Text>
                  </If>
                  <If test="project.url" value={!!project.url}>
                    <Button
                      variant="outline"
                      size="sm"
                      href={project.url ?? '#'}
                      data-class="showcase-card-link"
                    >
                      View project
                    </Button>
                  </If>
                </Stack>
              )}
            </Loop>
          </Grid>
        </Container>
      </Block>
    </MainLayout>
  );
}

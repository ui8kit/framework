import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { Stack, Title, Text } from '@ui8kit/core';

const docsLinks = context.docsSidebarLinks.map((link) => ({
  ...link,
  active: link.href === '/docs',
}));

/**
 * Docs Introduction — motivation and overview.
 */
export function DocsPage() {
  return (
    <DashLayout sidebar={<DashSidebar label="Documentation" links={docsLinks} />}>
      <Stack gap="8" data-class="docs-content">
        <Stack gap="4" data-class="docs-header">
          <Title fontSize="4xl" fontWeight="bold" data-class="docs-title">
            Introduction
          </Title>
          <Text fontSize="lg" textColor="muted-foreground" data-class="docs-lead">
            UI8Kit is a design system that combines React development with semantic
            HTML5/CSS3 output. Build interactive apps during development, generate
            production-ready templates for multiple engines.
          </Text>
        </Stack>
        <Stack gap="6" data-class="docs-sections">
          <Stack gap="2" data-class="docs-section">
            <Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">
              Design system
            </Title>
            <Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">
              Components, variants, and tokens. All styled via semantic props —
              no raw Tailwind. Shadcn-style theming with CSS variables.
            </Text>
          </Stack>
          <Stack gap="2" data-class="docs-section">
            <Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">
              Semantic HTML5
            </Title>
            <Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">
              Valid W3C output. Proper landmarks (header, main, nav, section, article).
              Accessible and SEO-friendly.
            </Text>
          </Stack>
          <Stack gap="2" data-class="docs-section">
            <Title fontSize="xl" fontWeight="semibold" data-class="docs-section-title">
              Multi-engine
            </Title>
            <Text fontSize="base" textColor="muted-foreground" data-class="docs-section-text">
              One source — React DSL. Generate to React, Liquid, Handlebars, Twig, Latte.
              Ready for CDN and MCP registry.
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </DashLayout>
  );
}

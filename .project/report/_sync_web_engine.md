# Детальная архитектура для реализации web <-> engine

## Финальная архитектура Monorepo

```
packages/
├── ui8kit/               # @ui8kit/core - UI примитивы
│   └── src/
│       ├── components/
│       │   └── ui/       # Box, Stack, Container, Title, Text, Button...
│       └── variants/     # badge, button, card, etc.
│
├── template/             # @ui8kit/template - DSL компоненты
│   └── src/
│       └── components/   # Loop, If, Var, Slot, Include, DefineBlock...
│
├── blocks/               # @ui8kit/blocks - НОВЫЙ: бизнес-блоки с DSL
│   ├── package.json
│   ├── src/
│   │   ├── blocks/
│   │   │   ├── HeroBlock.tsx
│   │   │   ├── FeaturesBlock.tsx
│   │   │   ├── CTABlock.tsx
│   │   │   ├── PricingBlock.tsx
│   │   │   ├── TestimonialsBlock.tsx
│   │   │   └── index.ts
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── DashLayout.tsx
│   │   │   └── index.ts
│   │   ├── partials/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── cards/
│   │   │   ├── lists/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── tsconfig.json
│
├── generator/            # @ui8kit/generator - генератор шаблонов
│
└── data/                 # @ui8kit/data - НОВЫЙ: shared data fixtures
    ├── package.json
    ├── src/
    │   ├── fixtures/
    │   │   ├── hero.json
    │   │   ├── features.json
    │   │   ├── products.json
    │   │   ├── testimonials.json
    │   │   └── pricing.json
    │   ├── types.ts
    │   └── index.ts
    └── tsconfig.json

apps/
├── web/                  # Production сайт
│   ├── src/
│   │   ├── pages/        # Страницы (используют @ui8kit/blocks)
│   │   ├── ~data/        # Локальные данные (может переопределять @ui8kit/data)
│   │   └── main.tsx
│   └── package.json      # deps: @ui8kit/blocks, @ui8kit/data
│
├── docs/                 # Документация
│
└── engine/               # Template Engine playground
    ├── src/              # React превью
    │   └── main.tsx      # Использует @ui8kit/blocks + @ui8kit/data
    ├── dist/
    │   └── templates/
    │       ├── liquid/
    │       │   ├── blocks/
    │       │   ├── layouts/
    │       │   └── partials/
    │       └── handlebars/
    ├── test/
    │   ├── apps/
    │   │   ├── liquid/
    │   │   └── handlebars/
    │   ├── snapshots/
    │   └── runner.test.ts
    ├── generator.config.ts
    └── package.json
```

---

## @ui8kit/blocks - Ключевой пакет

**package.json:**
```json
{
  "name": "@ui8kit/blocks",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./blocks": "./dist/blocks/index.js",
    "./layouts": "./dist/layouts/index.js",
    "./partials": "./dist/partials/index.js",
    "./components": "./dist/components/index.js"
  },
  "peerDependencies": {
    "@ui8kit/core": "workspace:*",
    "@ui8kit/template": "workspace:*",
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

**Пример HeroBlock.tsx:**
```tsx
import { Block, Stack, Container, Title, Text, Button, Group } from '@ui8kit/core';
import { If, Var, Loop, Slot } from '@ui8kit/template';

export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export function HeroBlock({
  title,
  subtitle,
  ctaText,
  ctaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  backgroundImage,
  children,
}: HeroBlockProps) {
  return (
    <Block 
      component="section" 
      py="24" 
      bg="background"
      data-class="hero-section"
    >
      <Container max="w-7xl">
        <Stack gap="8" items="center">
          <Stack gap="4" items="center" max="w-3xl">
            <Title 
              fontSize="5xl" 
              fontWeight="bold" 
              textAlign="center"
              data-class="hero-title"
            >
              <Var name="title" value={title} />
            </Title>
            
            <If test="subtitle" value={!!subtitle}>
              <Text 
                fontSize="xl" 
                textColor="muted-foreground" 
                textAlign="center"
                data-class="hero-subtitle"
              >
                <Var name="subtitle" value={subtitle} />
              </Text>
            </If>
          </Stack>
          
          <Group gap="4" data-class="hero-actions">
            <If test="ctaText" value={!!ctaText}>
              <Button 
                size="lg" 
                href={ctaUrl}
                data-class="hero-cta-primary"
              >
                <Var name="ctaText" value={ctaText} />
              </Button>
            </If>
            
            <If test="secondaryCtaText" value={!!secondaryCtaText}>
              <Button 
                variant="outline" 
                size="lg"
                href={secondaryCtaUrl}
                data-class="hero-cta-secondary"
              >
                <Var name="secondaryCtaText" value={secondaryCtaText} />
              </Button>
            </If>
          </Group>
          
          <Slot name="extra">
            {children}
          </Slot>
        </Stack>
      </Container>
    </Block>
  );
}
```

---

## @ui8kit/data - Shared fixtures

**package.json:**
```json
{
  "name": "@ui8kit/data",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./fixtures/*": "./dist/fixtures/*.json"
  }
}
```

**src/fixtures/hero.json:**
```json
{
  "title": "Welcome to UI8Kit",
  "subtitle": "The next generation UI framework",
  "ctaText": "Get Started",
  "ctaUrl": "/docs/getting-started",
  "secondaryCtaText": "Learn More",
  "secondaryCtaUrl": "/about"
}
```

**src/index.ts:**
```ts
import hero from './fixtures/hero.json';
import features from './fixtures/features.json';
import testimonials from './fixtures/testimonials.json';
import pricing from './fixtures/pricing.json';
import products from './fixtures/products.json';

export const fixtures = {
  hero,
  features,
  testimonials,
  pricing,
  products,
};

export * from './types';
```

---

## apps/web использует пакеты

```tsx
// apps/web/src/pages/HomePage.tsx
import { HeroBlock, FeaturesBlock, CTABlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

export function HomePage() {
  return (
    <>
      <HeroBlock {...fixtures.hero} />
      <FeaturesBlock {...fixtures.features} />
      <CTABlock {...fixtures.cta} />
    </>
  );
}
```

---

## apps/engine генерирует шаблоны из тех же блоков

**generator.config.ts:**
```ts
import { TemplateService, Logger } from '@ui8kit/generator';

const config = {
  engine: 'liquid',
  // Генерируем из @ui8kit/blocks
  sourceDirs: ['../../packages/blocks/src'],
  outputDir: './dist/templates',
  include: ['**/*.tsx'],
  exclude: ['**/*.test.tsx', '**/index.ts'],
};
```

---

## Преимущества этой архитектуры

| Аспект | Выгода |
|--------|--------|
| **DRY** | Один источник правды для блоков |
| **Консистентность** | web и engine используют идентичные компоненты |
| **Тестируемость** | Тесты в engine проверяют те же блоки что в web |
| **Масштабируемость** | Легко добавить новый app (landing, admin) |
| **Профессионализм** | Стандартный monorepo паттерн (Vercel, Shopify, etc.) |

---

## План миграции

1. **Создать `packages/blocks`** - перенести блоки из apps/web
2. **Создать `packages/data`** - вынести fixtures
3. **Обновить apps/web** - использовать @ui8kit/blocks
4. **Обновить apps/engine** - генерировать из packages/blocks
5. **Настроить тесты** - test/apps/liquid и test/apps/handlebars

Когда будешь готов к реализации - переключи в Agent mode и начнём с создания `packages/blocks`.
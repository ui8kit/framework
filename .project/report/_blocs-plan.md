---
name: UI8Kit Refactoring
overview: Рефакторинг UI8Kit фреймворка для достижения DRY, консистентности и масштабируемости. Создание новых пакетов (@ui8kit/blocks и @ui8kit/data), миграция блоков из приложений в пакеты, расширение системы генерации шаблонов (Liquid, Handlebars) и установка единого источника истины для компонентов.
todos:
  - id: infrastructure-blocks
    content: "Создать пакет @ui8kit/blocks: package.json, tsconfig.json, vite.config.ts, директорий структура"
    status: pending
  - id: infrastructure-data
    content: "Создать пакет @ui8kit/data: package.json, tsconfig.json, структура fixtures"
    status: pending
  - id: dsl-conventions
    content: Определить DSL соглашения и создать примеры (data-class, If/Var компоненты, мета-файлы)
    status: pending
  - id: migrate-blocks
    content: Мигрировать 6 основных блоков из apps/web/src/blocks → packages/blocks/src/blocks с обновлением импортов
    status: pending
  - id: migrate-data
    content: Создать fixtures из apps/web/src/~data → packages/data/src/fixtures с типизацией
    status: pending
  - id: generator-plugins
    content: "Расширить @ui8kit/generator: плагины для Liquid и Handlebars, обновить generator.config.ts"
    status: pending
  - id: update-apps
    content: "Обновить apps/web и apps/engine: добавить зависимости на @ui8kit/blocks и @ui8kit/data, обновить импорты"
    status: pending
  - id: testing-validation
    content: Добавить тесты генератора, валидировать консистентность между React и Liquid/Handlebars
    status: pending
isProject: false
---

## Архитектурное видение

Трансформация фреймворка из app-centered в package-centered модели:

```
ТЕКУЩЕЕ СОСТОЯНИЕ:
apps/web/src/blocks/ (изолированные блоки)
apps/engine/src/components/ (дублирование)
└─ Проблемы: дублирование кода, синхронизация, масштабируемость

ЦЕЛЕВОЕ СОСТОЯНИЕ:
packages/blocks/ (DRY - один источник истины)
├── React компоненты с DSL (@ui8kit/template)
├── Типы и интерфейсы (HeroBlockProps, etc.)
└── Генерируется в Liquid/Handlebars шаблоны

packages/data/ (Shared fixtures)
└── hero.json, features.json, products.json, etc.

apps/web/ → использует @ui8kit/blocks + @ui8kit/data
apps/engine/ → генерирует из @ui8kit/blocks через generator
```

## Фаза 1: Инфраструктура и подготовка

### 1.1 Создать пакет @ui8kit/blocks

- **Файл**: `[packages/blocks/package.json](packages/blocks/package.json)`
  - name: "@ui8kit/blocks"
  - version: "0.1.0"
  - main: "./dist/index.js"
  - types: "./dist/index.d.ts"
  - exports: основные директории (./blocks, ./layouts, ./partials, ./components)
  - peerDependencies: @ui8kit/core, @ui8kit/template, react ^18||^19
- **Файл**: `[packages/blocks/tsconfig.json](packages/blocks/tsconfig.json)`
- **Файл**: `[packages/blocks/vite.config.ts](packages/blocks/vite.config.ts)`
- **Структура директорий**:
  ```
  packages/blocks/src/
  ├── blocks/
  │   ├── HeroBlock.tsx
  │   ├── FeaturesBlock.tsx
  │   ├── CTABlock.tsx
  │   ├── PricingBlock.tsx
  │   ├── TestimonialsBlock.tsx
  │   ├── DashboardBlock.tsx
  │   └── index.ts
  ├── layouts/
  │   ├── MainLayout.tsx
  │   ├── DashLayout.tsx
  │   └── index.ts
  ├── partials/
  │   ├── Header.tsx
  │   ├── Footer.tsx
  │   ├── Sidebar.tsx
  │   ├── Navbar.tsx
  │   └── index.ts
  ├── components/
  │   ├── cards/
  │   │   ├── PostCard.tsx
  │   │   ├── AuthorCard.tsx
  │   │   ├── etc.
  │   └── index.ts
  └── index.ts (главный экспорт)
  ```

### 1.2 Создать пакет @ui8kit/data

- **Файл**: `[packages/data/package.json](packages/data/package.json)`
  - name: "@ui8kit/data"
  - version: "0.1.0"
  - main: "./dist/index.js"
  - types: "./dist/index.d.ts"
  - exports: сырые JSON и типизированные экспорты
- **Файл**: `[packages/data/tsconfig.json](packages/data/tsconfig.json)`
- **Структура директорий**:
  ```
  packages/data/src/
  ├── fixtures/
  │   ├── hero.json
  │   ├── features.json
  │   ├── pricing.json
  │   ├── testimonials.json
  │   ├── products.json
  │   └── dashboard.json
  ├── types.ts (интерфейсы для каждого fixture)
  └── index.ts (re-exports)
  ```

### 1.3 Обновить root package.json

- Добавить "packages/blocks" и "packages/data" в workspaces (уже используется glob)
- Обновить turbo.json для новых пакетов

### 1.4 Обновить turbo.json

- Добавить build/lint/test tasks для новых пакетов
- Настроить зависимости: @ui8kit/blocks зависит от @ui8kit/core и @ui8kit/template

## Фаза 2: DSL и конфигурация блоков

### 2.1 Определить DSL соглашения

Использовать существующие компоненты из @ui8kit/template с дополнительными атрибутами:

- **Компоненты**: `If`, `Var`, `Loop`, `Slot`, `Block` из @ui8kit/template
- **data-class атрибут**: каждый элемент должен иметь уникальный data-class для CSS generation
- **Паттерн именования**: `[block-name]-[element-type]`, например `hero-section`, `hero-title`, `hero-cta-primary`

**Пример HeroBlock.tsx** с DSL:

```tsx
import { Block, Stack, Container, Title, Text, Button, Group } from '@ui8kit/core';
import { If, Var, Slot } from '@ui8kit/template';

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

export function HeroBlock(props: HeroBlockProps) {
  return (
    <Block component="section" py="24" bg="background" data-class="hero-section">
      <Container max="w-7xl">
        <Stack gap="8" items="center">
          <Stack gap="4" items="center" max="w-3xl">
            <Title fontSize="5xl" fontWeight="bold" textAlign="center" data-class="hero-title">
              <Var name="title" value={props.title} />
            </Title>
            <If test="subtitle" value={!!props.subtitle}>
              <Text fontSize="xl" textColor="muted-foreground" textAlign="center" data-class="hero-subtitle">
                <Var name="subtitle" value={props.subtitle} />
              </Text>
            </If>
          </Stack>
          <Group gap="4" data-class="hero-actions">
            {/* CTAs with Var компоненты */}
          </Group>
          <Slot name="extra">{props.children}</Slot>
        </Stack>
      </Container>
    </Block>
  );
}
```

### 2.2 Создать meta-файлы для генератора

- **Файл**: `[packages/blocks/src/blocks/HeroBlock.meta.ts](packages/blocks/src/blocks/HeroBlock.meta.ts)`
  ```typescript
  export const heroBlockMeta = {
    name: 'HeroBlock',
    template: 'HeroBlock.tsx',
    outputs: {
      liquid: 'hero.liquid',
      handlebars: 'hero.handlebars'
    },
    variables: {
      title: { type: 'string', required: true },
      subtitle: { type: 'string', required: false },
      ctaText: { type: 'string', required: false },
      ctaUrl: { type: 'string', required: false }
    }
  };
  ```

## Фаза 3: Миграция контента (параллельная разработка)

### 3.1 Мигрировать блоки из apps/web → packages/blocks

Источник истины: `apps/web/src/blocks/`
Назначение: `packages/blocks/src/blocks/`

**Блоки для миграции**:

- HeroBlock.tsx
- FeaturesBlock.tsx
- CTABlock.tsx
- PricingBlock.tsx
- TestimonialsBlock.tsx
- DashboardBlock.tsx

**Процесс**:

1. Копировать файл в packages/blocks/src/blocks/
2. Убедиться, что используются компоненты @ui8kit/template (If, Var, Slot, etc.)
3. Обновить импорты: `@ui8kit/core`, `@ui8kit/template`
4. Добавить data-class атрибуты для всех элементов
5. Обновить index.ts в packages/blocks/src/blocks/

### 3.2 Мигрировать партиалы

Источник: `apps/web/src/partials/`
Назначение: `packages/blocks/src/partials/`

- Header.tsx
- Footer.tsx
- Sidebar.tsx

### 3.3 Мигрировать компоненты карточек

Источник: `apps/web/src/components/cards/` и `apps/web/src/components/lists/`
Назначение: `packages/blocks/src/components/`

### 3.4 Мигрировать макеты

Источник: `apps/web/src/layouts/`
Назначение: `packages/blocks/src/layouts/`

- MainLayout.tsx
- DashLayout.tsx

## Фаза 4: Миграция данных

### 4.1 Создать fixtures

Источник: `apps/web/src/~data/`
Назначение: `packages/data/src/fixtures/`

**Процесс**:

1. Анализировать структуру данных в apps/web/src/~data/
2. Создать JSON fixtures:
  - hero.json (из home данных)
  - features.json
  - pricing.json
  - testimonials.json
  - products.json
  - dashboard.json

### 4.2 Создать types.ts

- Типизировать каждый fixture
- Экспортировать интерфейсы (HeroFixture, FeaturesFixture, etc.)

### 4.3 Создать index.ts

- Re-export все fixtures как объект
- Re-export все типы

## Фаза 5: Расширение генератора и плагины

### 5.1 Обновить @ui8kit/generator

- Добавить поддержку плагинов (plugin interface):
  ```typescript
  interface TemplatePlugin {
    name: string;
    language: 'liquid' | 'handlebars' | 'custom';
    transpile(component: ComponentAST, props: BlockProps): string;
  }
  ```
- Создать LiquidPlugin:
  - Трансформировать React компоненты в Liquid синтаксис
  - If → {% if %}, Var → {{ variable }}, Loop → {% for %}
- Создать HandleBarsPlugin:
  - Трансформировать React компоненты в Handlebars синтаксис
  - If → {{#if }}, Var → {{ variable }}, Loop → {{#each }}

### 5.2 Обновить generator.config.ts

Файлы для обновления:

- `[apps/engine/generator.config.ts](apps/engine/generator.config.ts)`:
  ```typescript
  export default {
    engine: ['liquid', 'handlebars'],
    sourceDirs: ['../../packages/blocks/src'],
    outputDir: './dist/templates',
    include: ['**/*.tsx'],
    exclude: ['**/*.test.tsx', '**/*.meta.ts', '**/index.ts'],
    plugins: [
      { name: 'liquid', template: '@ui8kit/generator/plugins/liquid' },
      { name: 'handlebars', template: '@ui8kit/generator/plugins/handlebars' }
    ]
  };
  ```
- `[apps/docs/generator.config.ts](apps/docs/generator.config.ts)`:
  - Аналогично engine, но для документации

### 5.3 Генерируемые шаблоны

**Структура вывода**:

```
apps/engine/dist/templates/
├── liquid/
│   ├── blocks/
│   │   ├── hero.liquid
│   │   ├── features.liquid
│   │   └── ...
│   ├── layouts/
│   │   ├── main.liquid
│   │   └── ...
│   └── partials/
│       └── ...
└── handlebars/
    ├── blocks/
    ├── layouts/
    └── partials/
```

## Фаза 6: Обновление приложений

### 6.1 Обновить apps/web

- **Файл**: `[apps/web/package.json](apps/web/package.json)`
  - Добавить deps: "@ui8kit/blocks": "workspace:*", "@ui8kit/data": "workspace:*"
- **Удалить**: `apps/web/src/blocks/` (используем из пакета)
- **Удалить**: дублирующиеся компоненты, которые в packages/blocks/src/components/
- **Обновить импорты**: везде заменить локальные импорты на "@ui8kit/blocks"

**Пример HomePage.tsx**:

```tsx
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

### 6.2 Обновить apps/engine

- **Файл**: `[apps/engine/package.json](apps/engine/package.json)`
  - Добавить deps: "@ui8kit/blocks": "workspace:*", "@ui8kit/data": "workspace:*"
- Обновить main.tsx:
  ```tsx
  import { HeroBlock } from '@ui8kit/blocks';
  import { fixtures } from '@ui8kit/data';

  export function App() {
    return <HeroBlock {...fixtures.hero} />;
  }
  ```

### 6.3 Обновить apps/docs

- Аналогично (если нужно)

## Фаза 7: Тестирование и валидация

### 7.1 Добавить тесты генератора

- **Директория**: `apps/engine/test/`
  ```
  test/
  ├── apps/
  │   ├── liquid/
  │   │   ├── hero.test.ts
  │   │   ├── features.test.ts
  │   │   └── ...
  │   └── handlebars/
  │       └── ...
  └── snapshots/
      └── *.snapshot.html
  ```
- Каждый тест:
  1. Генерирует шаблон (Liquid/Handlebars) из React компонента
  2. Передает данные (fixtures)
  3. Сравнивает вывод с ожидаемым HTML snapshot

### 7.2 Валидация консистентности

- Проверить, что одни и те же блоки генерируют идентичную разметку
- Сравнить React render vs Liquid/Handlebars render

### 7.3 Build validation

- `npm run build` — build всех пакетов
- `npm run lint` — валидация props
- `npm run generate` — генерация шаблонов

## Фаза 8: Документирование

### 8.1 Обновить README

- `[packages/blocks/README.md](packages/blocks/README.md)` — как использовать блоки
- `[packages/data/README.md](packages/data/README.md)` — как добавлять fixtures

### 8.2 DSL guide

- `[packages/blocks/DSL.md](packages/blocks/DSL.md)` — соглашения для блоков

### 8.3 Generator docs

- `[packages/generator/PLUGINS.md](packages/generator/PLUGINS.md)` — как писать плагины

## Ключевые файлы для отслеживания


| Файл                              | Назначение                              |
| --------------------------------- | --------------------------------------- |
| `packages/blocks/package.json`    | Определение пакета блоков               |
| `packages/data/package.json`      | Определение пакета данных               |
| `packages/blocks/src/index.ts`    | Главный экспорт блоков                  |
| `packages/data/src/index.ts`      | Главный экспорт данных                  |
| `apps/web/package.json`           | Зависимости web приложения              |
| `apps/engine/package.json`        | Зависимости engine                      |
| `apps/engine/generator.config.ts` | Конфигурация генератора шаблонов        |
| `packages/generator/src/plugins/` | Реализация Liquid и Handlebars плагинов |
| `turbo.json`                      | Конфигурация build pipeline             |


## Преимущества архитектуры

- **DRY**: Блоки определяются один раз в packages/blocks
- **Консистентность**: web и engine используют идентичные компоненты
- **Тестируемость**: Тесты в engine проверяют те же блоки что в web
- **Масштабируемость**: Легко добавить новые app (landing, admin, mobile)
- **Профессионализм**: Стандартный monorepo паттерн (как у Vercel, Shopify, Meta)


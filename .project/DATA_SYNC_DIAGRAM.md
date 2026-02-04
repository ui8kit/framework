# Data Synchronization Architecture Diagram

## Synchronization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   @ui8kit/blocks (Package)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ HeroBlock.tsx                                             │  │
│  │ ├─ export interface HeroBlockProps { ... }               │  │
│  │ ├─ export function HeroBlock(props) { ... }              │  │
│  │ └─ Uses DSL: <Var>, <If>, <Loop>, <Slot>                │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Props interface
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│                   @ui8kit/data (Package)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ types.ts                                                  │  │
│  │ ├─ export interface HeroFixture { ... }                  │  │
│  │ │  (matches HeroBlockProps structure)                    │  │
│  │ └─ export interface [Name]Fixture { ... }                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       │ type cast                                │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ index.ts                                                  │  │
│  │ import hero from './fixtures/hero.json';                 │  │
│  │                                                           │  │
│  │ export const fixtures = {                                │  │
│  │   hero: hero as HeroFixture,                             │  │
│  │   features: features as FeaturesFixture,                 │  │
│  │   ...                                                    │  │
│  │ };                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       │ JSON data                                │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ fixtures/hero.json                                        │  │
│  │ {                                                         │  │
│  │   "title": "Welcome to UI8Kit",                          │  │
│  │   "subtitle": "...",                                     │  │
│  │   "ctaText": "Get Started",                              │  │
│  │   ...                                                    │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  │ import
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│                    apps/web or apps/engine                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ src/routes/HomePage.tsx                                  │  │
│  │ import { HeroBlock } from '@ui8kit/blocks';              │  │
│  │ import { fixtures } from '@ui8kit/data';                 │  │
│  │                                                           │  │
│  │ export function HomePage() {                             │  │
│  │   return <HeroBlock {...fixtures.hero} />;              │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│                       │ spreads props                            │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ React Component Render                                   │  │
│  │ ├─ Renders with actual data                              │  │
│  │ ├─ DSL components mark template structure                │  │
│  │ └─ Browser preview with live data                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────────────────────┘
                      │ @ui8kit/generator
                      │ (during build)
                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Template Generation                             │
│                                                                  │
│  ├─ LiquidPlugin transforms DSL → {% if %}, {{ var }}, etc.     │
│  ├─ HandlebarsPlugin transforms DSL → {{#if}}, {{var}}, etc.    │
│  └─ Outputs to dist/templates/[liquid|handlebars]/blocks/       │
└──────────────────────────────────────────────────────────────────┘
```

## Type Synchronization Matrix

```
Block Component Props    Fixture Type Interface    JSON Data
─────────────────────    ──────────────────────    ─────────

HeroBlockProps           HeroFixture               hero.json
├─ title?: string        ├─ title?: string        ├─ "title": "..."
├─ subtitle?: string     ├─ subtitle?: string     ├─ "subtitle": "..."
├─ ctaText?: string      ├─ ctaText?: string      ├─ "ctaText": "..."
├─ ctaUrl?: string       ├─ ctaUrl?: string       ├─ "ctaUrl": "..."
├─ secondaryCtaText      ├─ secondaryCtaText      ├─ "secondaryCtaText"
├─ secondaryCtaUrl       ├─ secondaryCtaUrl       ├─ "secondaryCtaUrl"
├─ backgroundImage       ├─ backgroundImage       ├─ "backgroundImage"
└─ children?: ReactNode  │                        │
                         └─ (ReactNode excluded)  └─ (not in JSON)

FeaturesBlockProps       FeaturesFixture          features.json
├─ title?: string        ├─ title?: string        ├─ "title": "..."
├─ subtitle?: string     ├─ subtitle?: string     ├─ "subtitle": "..."
└─ features?: Feature[]  └─ features?: Feature[]  └─ "features": [...]
   ├─ id: string            ├─ id: string            ├─ "id": "..."
   ├─ title: string         ├─ title: string         ├─ "title": "..."
   ├─ description: string   ├─ description: string   ├─ "description": "..."
   └─ icon?: string         └─ icon?: string         └─ "icon": "..."
```

## Data Flow for Rendering

```
User Request
    │
    ▼
Route Handler
    │
    ├─ imports { HeroBlock } from '@ui8kit/blocks'
    ├─ imports { fixtures } from '@ui8kit/data'
    │
    ▼
Component Instantiation
    │
    ├─ HeroBlock({ ...fixtures.hero })
    │  ├─ title: "Welcome to UI8Kit"
    │  ├─ subtitle: "The next generation UI framework..."
    │  ├─ ctaText: "Get Started"
    │  └─ ctaUrl: "/docs/getting-started"
    │
    ▼
DSL Processing
    │
    ├─ <If test="title" value={!!title}>
    │  └─ Condition: true, renders <Title>
    │
    ├─ <Var name="title" value={title} />
    │  └─ Outputs: "Welcome to UI8Kit"
    │
    └─ Marks template structure for generator
    │
    ▼
React Render
    │
    └─ Outputs: <section class="hero-section">
                  <h1 class="hero-title">Welcome to UI8Kit</h1>
                  ...
                </section>

    │
    ├─ Browser: Displays rendered component
    └─ Generator: Analyzes DSL markers
                 ├─ Extracts: title, subtitle, ctaText, ctaUrl
                 ├─ Generates: Liquid template
                 │            {% if title %}{{ title }}{% endif %}
                 └─ Outputs: dist/templates/liquid/blocks/hero.liquid
```

## Consistency Validation

```
✅ Type-Safe Binding

┌─────────────────────────────────────────┐
│ Type Checking                            │
├─────────────────────────────────────────┤
│ HeroBlockProps.title: string | undefined│
│          ↓                               │
│ HeroFixture.title: string | undefined   │
│          ↓                               │
│ hero.json: { "title": "..." }           │
│                                         │
│ Result: ✅ ALL MATCH                    │
└─────────────────────────────────────────┘

❌ Type Mismatch (before fix)

┌──────────────────────────────────────────┐
│ Type Checking                             │
├──────────────────────────────────────────┤
│ DashboardBlockProps.title: string        │
│          ↓                                │
│ DashboardFixture.widgets: Widget[] ✗     │
│          ↓                                │
│ dashboard.json: { "widgets": [...] } ✗   │
│                                          │
│ Result: ❌ MISMATCH                      │
│ Error: No common properties              │
└──────────────────────────────────────────┘
```

## Fix Applied

```
Before:
  DashboardFixture {
    widgets?: Widget[]  ← ✗ Wrong structure
  }

After:
  DashboardFixture {
    title?: string      ← ✓ Matches block
    description?: string ← ✓ Matches block
    ctaText?: string    ← ✓ Matches block
    ctaUrl?: string     ← ✓ Matches block
  }

Result: ✅ Blank.tsx <DashboardBlock {...fixtures.dashboard} />
```

## Import Hierarchy

```
User Application (apps/web, apps/engine)
    │
    ├─ imports HeroBlock from '@ui8kit/blocks'
    │  └─ packages/blocks/src/blocks/HeroBlock.tsx
    │     └─ imports { Var, If } from '@ui8kit/template'
    │        └─ packages/template/src/components/
    │     └─ imports { Block, Title } from '@ui8kit/core'
    │        └─ packages/core/src/components/ui/
    │
    └─ imports { fixtures } from '@ui8kit/data'
       └─ packages/data/src/index.ts
          ├─ imports hero from './fixtures/hero.json'
          ├─ types from './types.ts'
          └─ exports fixtures object
```

## Validation Checklist Result

```
✅ HeroBlock
  ✅ Component in packages/blocks/src/blocks/HeroBlock.tsx
  ✅ HeroBlockProps interface defined
  ✅ HeroBlock function exported
  ✅ HeroFixture type in types.ts
  ✅ hero.json exists with correct data
  ✅ fixture exported in index.ts
  ✅ Used in HomePage.tsx
  ✅ Types match between all three

✅ FeaturesBlock
  ✅ Component in packages/blocks/src/blocks/FeaturesBlock.tsx
  ✅ FeaturesBlockProps interface defined
  ✅ FeaturesBlock function exported
  ✅ FeaturesFixture type in types.ts
  ✅ features.json exists with correct data
  ✅ fixture exported in index.ts
  ✅ Used in HomePage.tsx
  ✅ Types match between all three

✅ CTABlock
  ✅ Component in packages/blocks/src/blocks/CTABlock.tsx
  ✅ CTABlockProps interface defined
  ✅ CTABlock function exported
  ✅ CTAFixture type in types.ts
  ✅ cta.json exists with correct data
  ✅ fixture exported in index.ts
  ✅ Used in HomePage.tsx
  ✅ Types match between all three

✅ DashboardBlock [FIXED]
  ✅ Component in packages/blocks/src/blocks/DashboardBlock.tsx
  ✅ DashboardBlockProps interface defined
  ✅ DashboardBlock function exported
  ✅ DashboardFixture type UPDATED in types.ts
  ✅ dashboard.json matches updated type
  ✅ fixture exported in index.ts
  ✅ Used in Blank.tsx
  ✅ Types NOW MATCH between all three

✅ PricingBlock
  ✅ Component exists
  ✅ PricingBlockProps interface
  ✅ PricingFixture type matches
  ✅ pricing.json ready

✅ TestimonialsBlock
  ✅ Component exists
  ✅ TestimonialsBlockProps interface
  ✅ TestimonialsFixture type matches
  ✅ testimonials.json ready
```

```go
 давай обсудим отказ от liquid по умолчанию и реализовать React → HTML напрямую

а для liquid, handlebars, latte (php), twig реализуем систему плагинов @packages/generator/src/plugins/PluginManager.ts и будем поддерживать официально эти 4 типа шаблонов по 2 на js/php и наш генератор через эти 4 плагина будет уметь генерировать выбранные шаблоны с помощью описательных schema схем и валидации zod 

мы создадим исчерпывающую документацию так что другие разработчики смогут создать свои версии плагинов для других типов какие им нужно blade, blazor, go quick и так далее

поэтому сейчас нам нужно хорошенько обсудить архитектуру чтобы она была без хардкода и работала в динамической среде приложений react когда струтура может быть очень разной и с разным составом частей и блоков 
```

```bash
Пользователь хочет обсудить серьёзный архитектурный редизайн:
Отказ от Liquid по умолчанию — React → HTML напрямую как основной режим
Система плагинов для шаблонизаторов — Liquid, Handlebars (JS) + Latte, Twig (PHP)
Schema-driven подход с Zod валидацией
Расширяемая архитектура — чтобы другие могли создавать свои плагины
Это большая тема. Давайте глубоко продумаем архитектуру.
Ключевые принципы
React как единственный источник правды — Компоненты определяют структуру
Плагины как адаптеры — Преобразуют React-структуру в целевой формат
Schema как контракт — Zod схемы описывают интерфейс между ядром и плагинами
Zero hardcode — Никаких жёстких путей, имён, паттернов
Архитектура
Core (ядро генератора)
Сканирует React компоненты
Извлекает метаданные (slots, props, structure)
Рендерит React → HTML (default mode)
Передаёт структуру плагинам
Plugin System
Интерфейс ITemplatePlugin
Каждый плагин знает как преобразовать структуру в свой формат
Плагины регистрируются через PluginManager
Schema Layer
Z//od схемы для валидации конфигов
Zod схемы для структуры компонентов и output плагинов определяют контракт между ядром и расширениями
Нужно детально продумать, как эти схемы будут работать вместе.
```

Отличная идея! Это серьёзный архитектурный редизайн. Давайте глубоко проработаем.

---

## Философия: React = Source of Truth

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENTS                                 │
│   (Layouts, Partials, Pages, Blocks — единственный источник правды)     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     STRUCTURE SCANNER    │
                    │   (Извлекает метаданные) │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────▼──────────────────┐
              │           COMPONENT GRAPH           │
              │  (Slots, Props, Hierarchy, Types)   │
              └──────────────────┬──────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐           ┌─────▼─────┐
    │  HTML   │            │  TEMPLATE │           │   SCHEMA  │
    │ (SSG)   │            │  PLUGINS  │           │  OUTPUT   │
    └─────────┘            └───────────┘           └───────────┘
         │                       │                       │
    React →                 ┌────┴────┐            JSON/YAML
    Static HTML             │         │            Schema files
                      ┌─────┴───┐ ┌───┴─────┐
                      │   JS    │ │   PHP   │
                      ├─────────┤ ├─────────┤
                      │ Liquid  │ │ Latte   │
                      │Handlebars│ │ Twig   │
                      └─────────┘ └─────────┘
```

---

## Core Concepts

### 1. Component Graph

Генератор не знает про конкретные компоненты. Он видит **граф**:

```typescript
interface ComponentNode {
  id: string;                    // 'MainLayout', 'Header', 'HeroBlock'
  type: 'layout' | 'partial' | 'page' | 'block';
  path: string;                  // './src/layouts/MainLayout.tsx'
  
  // Extracted from TypeScript
  props: PropDefinition[];
  slots: SlotDefinition[];
  children: ComponentNode[];
  
  // Extracted from component metadata (optional)
  metadata?: ComponentMetadata;
}

interface PropDefinition {
  name: string;
  type: string;                  // 'string', 'boolean', 'ReactNode'
  required: boolean;
  defaultValue?: unknown;
}

interface SlotDefinition {
  name: string;                  // 'header', 'content', 'footer'
  accepts: string[];             // ['Partial', 'Block'] — что можно вставить
  multiple: boolean;             // Может ли быть несколько компонентов
}
```

### 2. Structure Scanner

Сканирует файловую структуру и извлекает граф:

```typescript
interface ScannerConfig {
  // Где искать компоненты (паттерны, не хардкод)
  patterns: {
    layouts: string[];    // ['src/layouts/**/*.tsx']
    partials: string[];   // ['src/partials/**/*.tsx']
    pages: string[];      // ['src/pages/**/*.tsx', 'src/routes/**/*.tsx']
    blocks: string[];     // ['src/blocks/**/*.tsx', 'src/components/**/*.tsx']
  };
  
  // Как определять тип компонента
  typeDetection: 'filename' | 'directory' | 'export' | 'metadata';
  
  // Какие экспорты считать компонентами
  exportPatterns: string[];  // ['default', '*Layout', '*Page', '*Block']
}
```

### 3. Output Modes

```typescript
type OutputMode = 
  | 'html'           // React → Static HTML (default)
  | 'template'       // React → Template files via plugin
  | 'hybrid';        // HTML + Template для динамических частей
```

---

## Plugin Architecture

### ITemplatePlugin Interface

```typescript
interface ITemplatePlugin {
  // Identity
  readonly name: string;           // 'liquid', 'handlebars', 'twig', 'latte'
  readonly version: string;
  readonly runtime: 'js' | 'php';
  
  // Capabilities
  readonly features: PluginFeatures;
  
  // Schema
  readonly configSchema: ZodSchema;
  readonly outputSchema: ZodSchema;
  
  // Lifecycle
  initialize(context: PluginContext): Promise<void>;
  dispose(): Promise<void>;
  
  // Core transformation
  transformComponent(
    node: ComponentNode,
    options: TransformOptions
  ): Promise<TemplateOutput>;
  
  transformLayout(
    layout: ComponentNode,
    slots: Map<string, ComponentNode[]>
  ): Promise<TemplateOutput>;
  
  // Variable syntax
  renderVariable(prop: PropDefinition): string;
  renderConditional(condition: string, content: string): string;
  renderLoop(item: string, collection: string, content: string): string;
  renderInclude(partial: string, props?: Record<string, string>): string;
  
  // Validation
  validate(output: TemplateOutput): ValidationResult;
}

interface PluginFeatures {
  supportsInheritance: boolean;    // Extends/blocks
  supportsPartials: boolean;       // Include/import
  supportsFilters: boolean;        // {{ var | filter }}
  supportsMacros: boolean;         // Reusable snippets
  supportsAsync: boolean;          // Async rendering
}

interface TemplateOutput {
  filename: string;
  content: string;
  dependencies: string[];          // Other templates this depends on
  variables: string[];             // Required runtime variables
}
```

### Plugin Examples

**Liquid Plugin:**
```typescript
class LiquidPlugin implements ITemplatePlugin {
  renderVariable(prop: PropDefinition): string {
    const defaultStr = prop.defaultValue 
      ? ` | default: ${JSON.stringify(prop.defaultValue)}`
      : '';
    return `{{ ${prop.name}${defaultStr} }}`;
  }
  
  renderConditional(condition: string, content: string): string {
    return `{% if ${condition} %}\n${content}\n{% endif %}`;
  }
  
  renderInclude(partial: string, props?: Record<string, string>): string {
    const propsStr = props 
      ? Object.entries(props).map(([k, v]) => `${k}: ${v}`).join(', ')
      : '';
    return `{% include '${partial}'${propsStr ? `, ${propsStr}` : ''} %}`;
  }
}
```

**Twig Plugin:**
```typescript
class TwigPlugin implements ITemplatePlugin {
  renderVariable(prop: PropDefinition): string {
    const defaultStr = prop.defaultValue 
      ? ` ?? ${JSON.stringify(prop.defaultValue)}`
      : '';
    return `{{ ${prop.name}${defaultStr} }}`;
  }
  
  renderConditional(condition: string, content: string): string {
    return `{% if ${condition} %}\n${content}\n{% endif %}`;
  }
  
  renderInclude(partial: string): string {
    return `{% include '${partial}.twig' %}`;
  }
}
```

---

## Schema Layer (Zod)

### Generator Config Schema

```typescript
import { z } from 'zod';

const PatternSchema = z.string().or(z.array(z.string()));

const ScannerConfigSchema = z.object({
  patterns: z.object({
    layouts: PatternSchema.default(['src/layouts/**/*.tsx']),
    partials: PatternSchema.default(['src/partials/**/*.tsx']),
    pages: PatternSchema.default(['src/pages/**/*.tsx']),
    blocks: PatternSchema.default(['src/blocks/**/*.tsx']),
  }).default({}),
  
  typeDetection: z.enum(['filename', 'directory', 'export', 'metadata'])
    .default('directory'),
    
  exportPatterns: z.array(z.string())
    .default(['default', '*Layout', '*Page']),
});

const OutputConfigSchema = z.object({
  mode: z.enum(['html', 'template', 'hybrid']).default('html'),
  
  html: z.object({
    outputDir: z.string().default('./dist/html'),
    minify: z.boolean().default(false),
    prettyPrint: z.boolean().default(true),
  }).optional(),
  
  template: z.object({
    plugin: z.string(),              // 'liquid', 'twig', etc.
    outputDir: z.string().default('./dist/templates'),
    fileExtension: z.string(),       // '.liquid', '.twig'
  }).optional(),
});

export const GeneratorConfigSchema = z.object({
  // App metadata
  app: z.object({
    name: z.string(),
    version: z.string().optional(),
  }),
  
  // Structure scanning
  scanner: ScannerConfigSchema.default({}),
  
  // Output configuration
  output: OutputConfigSchema,
  
  // Plugins
  plugins: z.array(z.string()).default([]),
  
  // Variables available in templates
  variables: z.record(z.unknown()).default({}),
});

export type GeneratorConfig = z.infer<typeof GeneratorConfigSchema>;
```

### Component Metadata Schema

```typescript
const SlotSchema = z.object({
  name: z.string(),
  accepts: z.array(z.string()).default(['*']),
  multiple: z.boolean().default(false),
  required: z.boolean().default(false),
});

const ComponentMetadataSchema = z.object({
  // Slot this component fills
  slot: z.string().optional(),
  
  // Order within slot
  order: z.number().default(0),
  
  // Slots this component provides
  slots: z.array(SlotSchema).default([]),
  
  // Template-specific overrides
  template: z.object({
    // Override prop rendering
    props: z.record(z.string()).optional(),
    
    // Custom wrapper
    wrapper: z.string().optional(),
    
    // Skip template generation
    htmlOnly: z.boolean().default(false),
  }).optional(),
});
```

---

## Dynamic Structure Support

### Problem: Apps have different structures

```
App A:                          App B:
├── layouts/                    ├── templates/
│   └── Main.tsx               │   ├── layouts/
├── partials/                   │   │   └── Base.tsx
│   ├── Header.tsx             │   └── components/
│   └── Footer.tsx             │       ├── Nav.tsx
└── pages/                      │       └── Footer.tsx
    └── Home.tsx               └── views/
                                    └── Home.tsx
```

### Solution: Pattern-based discovery

```typescript
// App A config
const configA = {
  scanner: {
    patterns: {
      layouts: ['src/layouts/**/*.tsx'],
      partials: ['src/partials/**/*.tsx'],
      pages: ['src/pages/**/*.tsx'],
    }
  }
};

// App B config
const configB = {
  scanner: {
    patterns: {
      layouts: ['src/templates/layouts/**/*.tsx'],
      partials: ['src/templates/components/**/*.tsx'],
      pages: ['src/views/**/*.tsx'],
    }
  }
};
```

### Smart Detection (Optional)

Генератор может автоматически определять структуру:

```typescript
interface StructureDetector {
  // Scan common patterns
  detect(rootDir: string): Promise<DetectedStructure>;
  
  // Suggest config based on detection
  suggestConfig(structure: DetectedStructure): Partial<ScannerConfig>;
}

interface DetectedStructure {
  hasLayouts: boolean;
  layoutPaths: string[];
  hasPartials: boolean;
  partialPaths: string[];
  hasPages: boolean;
  pagePaths: string[];
  framework: 'nextjs' | 'remix' | 'vite' | 'cra' | 'unknown';
}
```

---

## Slot System

### Declarative Slots in React

```tsx
// layouts/MainLayout.tsx
import { Slot, defineLayout } from '@ui8kit/generator';

export function MainLayout({ children }: Props) {
  return (
    <html>
      <head>
        <Slot name="head" />
      </head>
      <body>
        <Slot name="header" accepts={['Header', 'Navbar']} />
        
        <main>
          <Slot name="before-content" multiple />
          {children}
          <Slot name="after-content" multiple />
        </main>
        
        <Slot name="footer" />
        <Slot name="scripts" />
      </body>
    </html>
  );
}

// Metadata for generator
MainLayout.generator = defineLayout({
  slots: ['head', 'header', 'before-content', 'after-content', 'footer', 'scripts'],
  defaultSlots: {
    header: 'Header',
    footer: 'Footer',
  }
});
```

### Slot Resolution

```typescript
interface SlotResolver {
  // Resolve which components go into which slots
  resolve(
    layout: ComponentNode,
    availableComponents: ComponentNode[]
  ): SlotAssignment;
}

interface SlotAssignment {
  [slotName: string]: ComponentNode[];
}

// Resolution strategies
type ResolutionStrategy = 
  | 'metadata'      // Use component.metadata.slot
  | 'naming'        // Header → header slot
  | 'explicit';     // Only from config
```

---

## Template Generation Flow

```
1. SCAN
   ├── Read patterns from config
   ├── Find all matching files
   └── Parse TypeScript for props/exports

2. BUILD GRAPH
   ├── Create ComponentNode for each component
   ├── Extract props from TypeScript types
   ├── Extract slots from Slot components
   └── Read metadata from .generator property

3. RESOLVE SLOTS
   ├── Match components to layout slots
   ├── Validate required slots filled
   └── Warn about orphaned components

4. OUTPUT (based on mode)
   ├── HTML: renderToStaticMarkup()
   ├── Template: plugin.transform()
   └── Hybrid: both with markers

5. VALIDATE
   ├── Zod validate all outputs
   ├── Check template syntax (plugin-specific)
   └── Report warnings/errors
```

---

## Example: Full Flow

### Input (React)

```tsx
// src/layouts/MainLayout.tsx
export function MainLayout({ title, children }: Props) {
  return (
    <html>
      <head><title>{title}</title></head>
      <body>
        <Slot name="header" />
        <main>{children}</main>
        <Slot name="footer" />
      </body>
    </html>
  );
}

// src/partials/Header.tsx
export function Header({ siteName = 'My Site' }: Props) {
  return <header><h1>{siteName}</h1></header>;
}
Header.generator = { slot: 'header' };

// src/partials/Footer.tsx  
export function Footer({ year = 2024 }: Props) {
  return <footer>© {year}</footer>;
}
Footer.generator = { slot: 'footer' };
```

### Output: HTML Mode

```html
<!DOCTYPE html>
<html>
<head><title>Home</title></head>
<body>
  <header><h1>My Site</h1></header>
  <main>Page content here</main>
  <footer>© 2024</footer>
</body>
</html>
```

### Output: Liquid Plugin

```liquid
{# layout.liquid #}
<!DOCTYPE html>
<html>
<head><title>{{ title }}</title></head>
<body>
  {% include 'partials/header.liquid', siteName: siteName %}
  <main>{{ content }}</main>
  {% include 'partials/footer.liquid', year: year %}
</body>
</html>

{# partials/header.liquid #}
<header><h1>{{ siteName | default: 'My Site' }}</h1></header>

{# partials/footer.liquid #}
<footer>© {{ year | default: 2024 }}</footer>
```

### Output: Twig Plugin

```twig
{# layout.twig #}
<!DOCTYPE html>
<html>
<head><title>{{ title }}</title></head>
<body>
  {% include 'partials/header.twig' with {siteName: siteName} %}
  <main>{{ content|raw }}</main>
  {% include 'partials/footer.twig' with {year: year} %}
</body>
</html>
```

---

## File Structure

```
packages/generator/
├── src/
│   ├── core/
│   │   ├── scanner/           # Component discovery
│   │   │   ├── FileScanner.ts
│   │   │   ├── TypeExtractor.ts
│   │   │   └── MetadataReader.ts
│   │   ├── graph/             # Component graph
│   │   │   ├── ComponentGraph.ts
│   │   │   ├── SlotResolver.ts
│   │   │   └── DependencyAnalyzer.ts
│   │   ├── renderer/          # Output generation
│   │   │   ├── HtmlRenderer.ts
│   │   │   └── TemplateRenderer.ts
│   │   └── validator/         # Validation
│   │       └── OutputValidator.ts
│   │
│   ├── plugins/
│   │   ├── PluginManager.ts
│   │   ├── ITemplatePlugin.ts
│   │   ├── BasePlugin.ts      # Abstract base
│   │   └── built-in/
│   │       ├── LiquidPlugin.ts
│   │       ├── HandlebarsPlugin.ts
│   │       ├── TwigPlugin.ts
│   │       └── LattePlugin.ts
│   │
│   ├── schema/
│   │   ├── config.schema.ts
│   │   ├── component.schema.ts
│   │   └── output.schema.ts
│   │
│   └── react/
│       ├── Slot.tsx           # Runtime component
│       ├── defineLayout.ts    # Metadata helpers
│       └── defineComponent.ts
│
└── docs/
    ├── architecture.md
    ├── creating-plugins.md
    └── schema-reference.md
```

---

## Вопросы для обсуждения

1. **Slot vs Children** — Использовать явные `<Slot>` или анализировать `{children}`?

2. **TypeScript Extraction** — Как извлекать типы props? AST parsing или runtime reflection?

3. **Hot Reload** — Поддерживать ли watch mode для dev?

4. **Incremental Build** — Перегенерировать только изменённые компоненты?

5. **PHP Plugins** — Как тестировать Twig/Latte без PHP runtime?

Что думаете? Какие аспекты хотите углубить?
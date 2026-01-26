Хороший вопрос! Давай проанализирую текущую архитектуру `@ui8kit/mdx-react` на предмет готовности к использованию без генератора.

[4 tools called]

## Анализ готовности к использованию без генератора

### Текущее состояние: **Частично готов** (~60%)

Пакет имеет хорошее разделение на слои, но некоторые части слишком связаны с генератором.

---

### ✅ Готово для использования в браузере (Tiptap и т.д.)

**Из главного экспорта `@ui8kit/mdx-react`:**

| Функционал | Описание | Готовность |
|------------|----------|------------|
| `parseFrontmatter()` | Парсинг YAML frontmatter | ✅ 100% |
| `extractToc()` | Извлечение оглавления | ✅ 100% |
| `buildHierarchicalToc()` | Вложенная структура TOC | ✅ 100% |
| `extractExcerpt()` | Первый параграф | ✅ 100% |
| `parseMdxFile()` | Всё вместе | ✅ 100% |
| `slugify()` | Генерация slug | ✅ 100% |
| React Context/Hooks | `usePageContent`, `useToc`, `useFrontmatter` | ✅ 100% |
| `MDXProvider`, `useMDXComponents` | Из `@mdx-js/react` | ✅ 100% |

**Пример использования в Tiptap редакторе:**

```tsx
import { parseFrontmatter, extractToc, buildHierarchicalToc } from '@ui8kit/mdx-react'

function MdxPreview({ mdxSource }: { mdxSource: string }) {
  // Парсинг без сервера!
  const { frontmatter, content } = parseFrontmatter(mdxSource)
  const toc = extractToc(content)
  const hierarchicalToc = buildHierarchicalToc(toc)
  
  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <TOCSidebar items={hierarchicalToc} />
      {/* ... */}
    </div>
  )
}
```

---

### ⚠️ Частично готово / Требует доработки

| Функционал | Проблема | Решение |
|------------|----------|---------|
| **MDX → React runtime** | `compile()` из `@mdx-js/mdx` работает в браузере, но тяжёлый (~50KB) | Нужен отдельный экспорт для runtime-компиляции |
| **Компоненты документации** | `ComponentPreview`, `PropsTable` есть, но не оптимизированы для редактора | Ок, можно использовать |

---

### ❌ Не готово (только для генератора)

| Функционал | Причина |
|------------|---------|
| `MdxService` | Завязан на `fs`, Node.js-only |
| `compileMdxFile()` | Использует `readFile`, Node.js-only |
| `scanner.ts` | Сканирование директорий, Node.js-only |
| `props-extractor.ts` | TypeScript AST, Node.js-only |

---

### Что нужно для полной поддержки Tiptap / редакторов

1. **Browser-safe MDX compiler wrapper**:

```typescript
// Предлагаемый новый экспорт: @ui8kit/mdx-react/runtime
export async function compileMdxInBrowser(
  source: string,
  components: Record<string, ComponentType>
): Promise<{
  Content: ComponentType
  frontmatter: Frontmatter
  toc: TocEntry[]
}>
```

2. **Lazy loading для @mdx-js/mdx** (чтобы не тянуть 50KB если не нужен runtime):

```typescript
// Динамический импорт
const { compile, run } = await import('@mdx-js/mdx')
```

3. **Отдельный entry point**:

```json
// package.json exports
"./runtime": {
  "types": "./dist/runtime/index.d.ts",
  "import": "./dist/runtime/index.js"
}
```

---

### Рекомендация

Для использования в Tiptap **прямо сейчас**:

```tsx
import { parseFrontmatter, extractToc } from '@ui8kit/mdx-react'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

async function renderMdxInBrowser(source: string, components: Record<string, any>) {
  const { frontmatter, content } = parseFrontmatter(source)
  const toc = extractToc(content)
  
  // Runtime компиляция
  const compiled = await compile(content, { outputFormat: 'function-body' })
  const { default: MdxContent } = await run(compiled, { ...runtime })
  
  return { MdxContent, frontmatter, toc }
}
```

===========================

## Дорожная карта: `@ui8kit/mdx-react/runtime`

### Цель
Добавить browser-safe entry point для runtime-компиляции MDX (для Tiptap, редакторов контента, live preview).

---

### Фаза 1: Новый entry point `@ui8kit/mdx-react/runtime`

**Файлы:**
```
packages/mdx-react/src/runtime/
├── index.ts          # Главный экспорт
├── compiler.ts       # Browser-safe MDX компилятор
└── types.ts          # Типы для runtime
```

**Экспорты:**
```typescript
// @ui8kit/mdx-react/runtime
export { compileMdx, compileMdxSync } from './compiler'
export { MdxRenderer } from './MdxRenderer'
export type { CompileMdxOptions, CompiledMdx } from './types'
```

---

### Фаза 2: Browser-safe компилятор

**`runtime/compiler.ts`:**
```typescript
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { parseFrontmatter, extractToc } from '../core/parser'

export interface CompileMdxOptions {
  components?: Record<string, ComponentType>
  remarkPlugins?: any[]
  rehypePlugins?: any[]
  tocConfig?: TocConfig
}

export interface CompiledMdx {
  Content: ComponentType
  frontmatter: Frontmatter
  toc: TocEntry[]
  excerpt?: string
}

export async function compileMdx(
  source: string, 
  options: CompileMdxOptions = {}
): Promise<CompiledMdx> {
  const { frontmatter, content } = parseFrontmatter(source)
  const toc = extractToc(content, options.tocConfig)
  
  const compiled = await compile(content, {
    outputFormat: 'function-body',
    development: false,
    remarkPlugins: options.remarkPlugins,
    rehypePlugins: options.rehypePlugins,
  })
  
  const { default: Content } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  })
  
  // Wrap with components
  const WrappedContent = options.components 
    ? () => Content({ components: options.components })
    : Content
  
  return { Content: WrappedContent, frontmatter, toc }
}
```

---

### Фаза 3: React компонент для рендеринга

**`runtime/MdxRenderer.tsx`:**
```typescript
export interface MdxRendererProps {
  source: string
  components?: Record<string, ComponentType>
  fallback?: ReactNode
  onCompiled?: (result: CompiledMdx) => void
  onError?: (error: Error) => void
}

export function MdxRenderer({ 
  source, 
  components, 
  fallback,
  onCompiled,
  onError 
}: MdxRendererProps) {
  const [compiled, setCompiled] = useState<CompiledMdx | null>(null)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    compileMdx(source, { components })
      .then(result => {
        setCompiled(result)
        onCompiled?.(result)
      })
      .catch(err => {
        setError(err)
        onError?.(err)
      })
  }, [source, components])
  
  if (error) return <div className="mdx-error">{error.message}</div>
  if (!compiled) return fallback ?? <div>Loading...</div>
  
  const { Content } = compiled
  return <Content />
}
```

---

### Фаза 4: package.json exports

```json
{
  "exports": {
    ".": { ... },
    "./server": { ... },
    "./service": { ... },
    "./runtime": {
      "types": "./dist/runtime/index.d.ts",
      "import": "./dist/runtime/index.js"
    }
  }
}
```

---

### Фаза 5: Оптимизации (опционально)

1. **Lazy load `@mdx-js/mdx`** — не тянуть 50KB если не используется:
   ```typescript
   let mdxModule: typeof import('@mdx-js/mdx') | null = null
   
   async function getMdxCompiler() {
     if (!mdxModule) {
       mdxModule = await import('@mdx-js/mdx')
     }
     return mdxModule
   }
   ```

2. **Кэширование компиляции** — для редакторов с debounce:
   ```typescript
   const cache = new Map<string, CompiledMdx>()
   
   export async function compileMdxCached(source: string, options) {
     const key = hash(source + JSON.stringify(options))
     if (cache.has(key)) return cache.get(key)!
     const result = await compileMdx(source, options)
     cache.set(key, result)
     return result
   }
   ```

3. **Web Worker** — компиляция в отдельном потоке:
   ```typescript
   // runtime/worker.ts
   export function createMdxWorker(): MdxWorker
   ```

---

### Фаза 6: Тесты

```typescript
// runtime/compiler.test.ts
describe('compileMdx', () => {
  it('should compile simple MDX')
  it('should extract frontmatter')
  it('should extract TOC')
  it('should inject components')
  it('should handle syntax errors gracefully')
})

// runtime/MdxRenderer.test.tsx
describe('MdxRenderer', () => {
  it('should render MDX content')
  it('should show fallback while loading')
  it('should call onError on compilation failure')
})
```

---

### Использование в Tiptap

```tsx
import { MdxRenderer, compileMdx } from '@ui8kit/mdx-react/runtime'
import { Button, Card } from '@/components'

// Вариант 1: Компонент
function TiptapPreview({ markdown }) {
  return (
    <MdxRenderer 
      source={markdown}
      components={{ Button, Card }}
      fallback={<Skeleton />}
    />
  )
}

// Вариант 2: Императивно
const { Content, frontmatter, toc } = await compileMdx(markdown, {
  components: { Button, Card }
})
```

---

### Приоритет задач

| # | Задача | Сложность | Важность |
|---|--------|-----------|----------|
| 1 | `compileMdx()` функция | Низкая | Высокая |
| 2 | Export в package.json | Низкая | Высокая |
| 3 | `MdxRenderer` компонент | Средняя | Средняя |
| 4 | Тесты | Средняя | Средняя |
| 5 | Lazy loading | Низкая | Низкая |
| 6 | Кэширование | Средняя | Низкая |
| 7 | Web Worker | Высокая | Низкая |
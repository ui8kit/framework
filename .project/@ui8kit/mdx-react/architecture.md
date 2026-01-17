# Архитектура @ui8kit/mdx-react

## Обзор

@ui8kit/mdx-react - это легковесный пакет для обработки MDX контента в UI8Kit экосистеме. Он предоставляет унифицированный интерфейс для компиляции MDX в React компоненты с поддержкой UI8Kit дизайн-системы.

## Компоненты архитектуры

### 1. MDX Compiler (`src/compiler.ts`)

Основной компилятор MDX контента.

```typescript
export interface UI8KitMDXOptions {
  components?: Record<string, any>;
  theme?: 'light' | 'dark' | 'auto';
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}

export async function compileUI8KitMDX(
  source: string,
  options: UI8KitMDXOptions = {}
): Promise<string> {
  return compile(source, {
    jsxImportSource: 'react',
    providerImportSource: '@mdx-js/react',
    jsxRuntime: 'automatic',
    remarkPlugins: [
      remarkGfm(), // GitHub Flavored Markdown
      ...options.remarkPlugins || []
    ],
    rehypePlugins: [
      rehypeHighlight(), // Синтаксис highlighting
      ...options.rehypePlugins || []
    ]
  });
}
```

### 2. Vite Plugin (`src/vite-plugin.ts`)

Интеграция с Vite для автоматической обработки .mdx файлов.

```typescript
export function mdxReactPlugin(options: UI8KitMDXOptions = {}): Plugin {
  return {
    name: '@ui8kit/mdx-react',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.mdx')) {
        return compileUI8KitMDX(code, options);
      }
    }
  };
}
```

### 3. React Components (`src/components/`)

Специализированные компоненты для документации.

#### ComponentExample
```typescript
interface ComponentExampleProps {
  title: string;
  code: string;
  component: React.ComponentType;
  variants?: string[];
  sizes?: string[];
}

export function ComponentExample({ ... }: ComponentExampleProps) {
  // Интерактивный пример компонента с переключением вариантов
}
```

#### CodeBlock
```typescript
interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export function CodeBlock({ ... }: CodeBlockProps) {
  // Подсвеченный блок кода с дополнительными возможностями
}
```

#### PropsTable
```typescript
interface PropsTableProps {
  component: React.ComponentType;
}

export function PropsTable({ component }: PropsTableProps) {
  // Автоматическая генерация таблицы свойств из TypeScript типов
}
```

### 4. Utils (`src/utils/`)

Вспомогательные функции.

#### extractFrontmatter
```typescript
export function extractFrontmatter(mdxSource: string): Record<string, any> {
  // Извлечение frontmatter из MDX
}
```

#### generateTOC
```typescript
export function generateTOC(mdxSource: string): TOCItem[] {
  // Генерация оглавления из заголовков
}
```

## Рабочий процесс

### 1. Разработка
```
MDX файл → MDX Compiler → React компонент → Vite → Браузер
```

### 2. Сборка
```
.mdx файлы → Компиляция → JS модули → Бандлинг → Продакшн
```

### 3. Runtime
```
MDXProvider + Компоненты → Рендеринг → HTML
```

## Интеграция с UI8Kit

### Дизайн-токены
Автоматическое применение UI8Kit цветовой схемы к подсветке кода и компонентам.

### Компоненты
Использование UI8Kit компонентов в MDX контенте без дополнительных импортов.

### Темизация
Поддержка светлой/темной темы с автоматическим переключением.

## Производительность

### Оптимизации
- **Tree shaking**: Удаление неиспользуемых плагинов
- **Lazy loading**: Отложенная загрузка больших MDX файлов
- **Caching**: Кеширование скомпилированных компонентов

### Метрики
- Размер пакета: < 50KB gzipped
- Время компиляции: < 100ms для типичного MDX файла
- Runtime overhead: Минимальный

## Расширение

### Кастомные плагины
```typescript
import { remarkCustomPlugin } from './plugins';

const options = {
  remarkPlugins: [remarkCustomPlugin()],
  rehypePlugins: [rehypeCustomPlugin()]
};

compileUI8KitMDX(source, options);
```

### Новые компоненты
```typescript
// Добавление в MDXProvider
const components = {
  ...defaultComponents,
  MyCustomComponent
};
```

## Тестирование

### Unit тесты
```typescript
describe('compileUI8KitMDX', () => {
  it('should compile basic MDX', async () => {
    const result = await compileUI8KitMDX('# Hello');
    expect(result).toContain('React.createElement');
  });
});
```

### Integration тесты
```typescript
describe('Vite plugin', () => {
  it('should transform .mdx files', async () => {
    // Тест интеграции с Vite
  });
});
```

## Безопасность

- **Sanitization**: Очистка пользовательского контента
- **CSP**: Совместимость с Content Security Policy
- **XSS protection**: Защита от XSS атак в MDX контенте
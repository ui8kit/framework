# Настройка @ui8kit/mdx-react

## Требования

- **Node.js**: 16.0.0 или выше
- **Bun**: 1.0+ (рекомендуется)
- **ESM**: Проект должен поддерживать ES модули

## Установка зависимостей

```bash
# Основные зависимости (@mdx-js/mdx v3.1.1)
bun add -d @mdx-js/mdx@^3.1.1 @mdx-js/rollup@^3.1.1 @mdx-js/react@^3.1.1
bun add react@^18.0.0 react-dom@^18.0.0

# Рекомендуемые плагины для расширенной функциональности
bun add -d remark-gfm@^4.0.0 rehype-highlight@^7.0.0 rehype-slug@^6.0.0
bun add -d @types/mdx@^2.0.13

# Опционально: дополнительные плагины
bun add -d remark-frontmatter@^5.0.0 rehype-katex@^7.0.0
```

## Конфигурация Bun

### bunfig.toml
```toml
preload = ["./bun-mdx.ts"]

[compilerOptions]
jsx = "react-jsx"
jsxImportSource = "react"
```

### bun-mdx.ts
```typescript
import mdx from '@mdx-js/esbuild';
import { plugin } from 'bun';

await plugin(mdx({
  providerImportSource: '@mdx-js/react'
}));
```

## Конфигурация Vite

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import path from 'path';

export default defineConfig({
  plugins: [
    // MDX должен идти ПЕРЕД React плагином
    { enforce: 'pre', ...mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        // Ваши remark плагины
      ],
      rehypePlugins: [
        // Ваши rehype плагины
      ]
    })},
    react({
      jsxImportSource: 'react',
      jsx: 'react-jsx',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.mdx'],
  },
  build: {
    target: 'esnext',
  },
});
```

## TypeScript поддержка

### global.d.ts
```typescript
declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
```

### tsconfig.json
```json
{
  "include": [
    "src/**/*",
    "src/**/*.mdx"
  ]
}
```

## Использование в коде

### Простой импорт
```typescript
import Content from './content/page.mdx';

function App() {
  return <Content />;
}
```

### С кастомными компонентами
```typescript
import { MDXProvider } from '@mdx-js/react';
import Content from './content/page.mdx';

const components = {
  h1: ({ children }) => <h1 className="ui8kit-heading">{children}</h1>,
  Button: ({ children, ...props }) => <Button variant="primary" {...props}>{children}</Button>
};

function App() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  );
}
```

## Расширенная конфигурация

### С UI8Kit темами
```typescript
import mdx from '@mdx-js/rollup';

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({
      providerImportSource: '@mdx-js/react',
      // UI8Kit специфичные настройки
      theme: 'auto', // 'light' | 'dark' | 'auto'
      components: {
        // Глобальные компоненты
      }
    })},
    react()
  ]
});
```
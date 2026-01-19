# Компоненты @ui8kit/mdx-react

## Обзор

Пакет предоставляет специализированные компоненты для создания интерактивной документации UI8Kit компонентов.

## ComponentExample

Интерактивный пример компонента с переключением вариантов.

### Использование

```mdx
import { ComponentExample } from '@ui8kit/mdx-react'
import { Button } from '@ui8kit/core'

<ComponentExample
  title="Button Variants"
  component={Button}
  variants={['primary', 'secondary', 'outline']}
  code={`<Button variant="primary">Click me</Button>`}
/>
```

### Props

```typescript
interface ComponentExampleProps {
  title: string;                    // Заголовок примера
  component: React.ComponentType;   // React компонент
  variants?: string[];             // Массив вариантов для переключения
  sizes?: string[];                // Массив размеров
  code?: string;                   // Исходный код для отображения
  showCode?: boolean;              // Показывать ли блок кода
  children?: React.ReactNode;      // Дополнительный контент
}
```

### Пример рендера

```
┌─ Button Variants ──────────────────────────────┐
│  ┌─────────────┐ ┌─────────┐ ┌──────────┐     │
│  │  Primary    │ │Secondary│ │ Outline  │     │
│  └─────────────┘ └─────────┘ └──────────┘     │
│                                               │
│  <Button variant="primary">Click me</Button>  │
└───────────────────────────────────────────────┘
```

## CodeBlock

Расширенный блок кода с подсветкой синтаксиса.

### Использование

```mdx
import { CodeBlock } from '@ui8kit/mdx-react'

<CodeBlock language="tsx" showLineNumbers highlightLines={[2, 4]}>
{`function Button({ children }) {
  return (
    <button className="btn">
      {children}
    </button>
  );
}`}
</CodeBlock>
```

### Props

```typescript
interface CodeBlockProps {
  children: string;              // Исходный код
  language?: string;             // Язык программирования
  showLineNumbers?: boolean;      // Показывать номера строк
  highlightLines?: number[];     // Выделенные строки
  theme?: 'light' | 'dark';      // Тема подсветки
  copyable?: boolean;            // Кнопка копирования
}
```

## PropsTable

Автоматическая генерация таблицы свойств компонента.

### Использование

```mdx
import { PropsTable } from '@ui8kit/mdx-react'
import { Button } from '@ui8kit/core'

<PropsTable component={Button} />
```

### Props

```typescript
interface PropsTableProps {
  component: React.ComponentType;  // React компонент
  exclude?: string[];             // Исключенные свойства
  include?: string[];             // Включенные свойства
  showDefaults?: boolean;         // Показывать значения по умолчанию
}
```

### Пример рендера

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"primary" \| "secondary"` | `"primary"` | Button variant |
| size | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| disabled | `boolean` | `false` | Disabled state |

## LiveDemo

Живой демо компонента с редактором кода.

### Использование

```mdx
import { LiveDemo } from '@ui8kit/mdx-react'

<LiveDemo
  component="Button"
  defaultCode={`<Button variant="primary">Hello</Button>`}
/>
```

### Props

```typescript
interface LiveDemoProps {
  component: string;              // Имя компонента из registry
  defaultCode?: string;           // Начальный код
  scope?: Record<string, any>;    // Переменные в scope редактора
  height?: number;                // Высота редактора
}
```

## Tabs

Вкладки для организации контента.

### Использование

```mdx
import { Tabs, Tab } from '@ui8kit/mdx-react'

<Tabs defaultValue="react">
  <Tab value="react" label="React">
    ```jsx
    <Button>Click me</Button>
    ```
  </Tab>
  <Tab value="html" label="HTML">
    ```html
    <button class="button">Click me</button>
    ```
  </Tab>
</Tabs>
```

### Props

```typescript
interface TabsProps {
  defaultValue?: string;
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  label: string;
  children: React.ReactNode;
}
```

## Callout

Выделенные блоки информации.

### Использование

```mdx
import { Callout } from '@ui8kit/mdx-react'

<Callout type="info">
  This is an informational message.
</Callout>

<Callout type="warning">
  This is a warning message.
</Callout>

<Callout type="error">
  This is an error message.
</Callout>
```

### Props

```typescript
interface CalloutProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
}
```

## ComponentGrid

Сетка для демонстрации компонентов.

### Использование

```mdx
import { ComponentGrid } from '@ui8kit/mdx-react'
import { Button, Input, Card } from '@ui8kit/core'

<ComponentGrid
  components={[
    { name: 'Button', component: Button },
    { name: 'Input', component: Input },
    { name: 'Card', component: Card }
  ]}
/>
```

### Props

```typescript
interface ComponentGridProps {
  components: Array<{
    name: string;
    component: React.ComponentType;
    description?: string;
  }>;
  columns?: number;
}
```

## ThemeSwitcher

Переключатель темы для демо.

### Использование

```mdx
import { ThemeSwitcher, ThemeProvider } from '@ui8kit/mdx-react'

<ThemeProvider>
  <ThemeSwitcher />
  {/* Ваш контент */}
</ThemeProvider>
```

## ResponsiveDemo

Демо responsive поведения.

### Использование

```mdx
import { ResponsiveDemo } from '@ui8kit/mdx-react'

<ResponsiveDemo>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</ResponsiveDemo>
```

### Props

```typescript
interface ResponsiveDemoProps {
  children: React.ReactNode;
  breakpoints?: Array<{
    name: string;
    width: number;
  }>;
}
```

## Кастомизация

Все компоненты поддерживают кастомизацию через CSS переменные UI8Kit:

```css
:root {
  --mdx-code-bg: var(--color-muted);
  --mdx-code-border: var(--color-border);
  --mdx-example-border: var(--color-border);
  --mdx-tabs-border: var(--color-border);
}
```

## Создание новых компонентов

### Шаблон компонента

```typescript
import { forwardRef } from 'react';
import { cn } from '@ui8kit/core';

export interface MyComponentProps {
  // Props
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('my-component', className)}
        {...props}
      />
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### Регистрация в MDXProvider

```typescript
import { MDXProvider } from '@mdx-js/react';
import { MyComponent } from './components';

const components = {
  MyComponent
};

<MDXProvider components={components}>
  <Content />
</MDXProvider>
```
# Примеры @ui8kit/mdx-react

## Обзор

Эта папка содержит примеры использования @ui8kit/mdx-react для создания документации компонентов.

## Структура файлов

- `basic.mdx` - Простой пример с одним компонентом
- `advanced.mdx` - Сложный пример с множеством компонентов и интерактивными элементами

## Запуск примеров

### Локальная разработка

```bash
# В корне проекта
bun run dev:docs
```

### Сборка для production

```bash
bun run build:docs
bun run preview:docs
```

## Использование в документации

Примеры можно использовать как шаблоны для создания документации компонентов:

1. **Копировать структуру** из существующих примеров
2. **Заменять компоненты** на свои
3. **Добавлять необходимые импорты**
4. **Настраивать варианты и размеры**

## Шаблоны

### Шаблон для компонента

```mdx
---
title: Component Name
description: Brief description of the component
---

import { ComponentExample, PropsTable } from '@ui8kit/mdx-react'
import { ComponentName } from '@ui8kit/core'

# ComponentName

Brief description and usage examples.

<ComponentExample
  title="Basic Usage"
  component={ComponentName}
  variants={['default', 'variant1', 'variant2']}
  code={`<ComponentName variant="default">Content</ComponentName>`}
/>

## Props

<PropsTable component={ComponentName} />
```

### Шаблон с несколькими примерами

```mdx
---
title: Component Name
---

import { ComponentExample, Tabs, Tab } from '@ui8kit/mdx-react'
import { ComponentName } from '@ui8kit/core'

# ComponentName

## Basic Examples

<ComponentExample
  component={ComponentName}
  variants={['primary', 'secondary']}
  title="Variants"
/>

## Advanced Usage

<Tabs defaultValue="simple">
  <Tab value="simple" label="Simple">
    <ComponentExample component={ComponentName} />
  </Tab>
  <Tab value="complex" label="Complex">
    <ComponentExample
      component={ComponentName}
      code={`<ComponentName prop1="value1" prop2="value2" />`}
    />
  </Tab>
</Tabs>
```

## Лучшие практики

### 1. Организация контента
- Использовать frontmatter для метаданных
- Группировать связанные примеры
- Добавлять описания для каждого примера

### 2. Компоненты
- Показывать все важные варианты компонента
- Включать примеры с разными размерами
- Демонстрировать состояния (hover, focus, disabled)

### 3. Код
- Использовать синтаксическую подсветку
- Показывать номера строк для больших примеров
- Включать комментарии в коде где необходимо

### 4. Доступность
- Добавлять alt-текст для изображений
- Использовать semantic HTML
- Обеспечивать keyboard navigation

## Интеграция с CI/CD

Примеры автоматически тестируются в CI:

```yaml
- name: Test MDX Examples
  run: bun run test:examples
```

## Генерация документации

Для автоматической генерации документации из компонентов:

```typescript
// scripts/generate-docs.ts
import { compileUI8KitMDX } from '@ui8kit/mdx-react'

export async function generateComponentDocs(componentName: string) {
  // Автоматическая генерация MDX из TypeScript типов
  // и JSDoc комментариев
}
```

## Расширение примеров

### Добавление нового примера

1. Создать `.mdx` файл в папке `examples/`
2. Добавить необходимые импорты
3. Использовать компоненты из `@ui8kit/mdx-react`
4. Обновить `README.md` с описанием

### Кастомные компоненты

Для специфических нужд можно создавать кастомные компоненты:

```typescript
// examples/components/CustomExample.tsx
export function CustomExample({ children }) {
  return <div className="custom-example">{children}</div>
}
```

И использовать их в MDX:

```mdx
import { CustomExample } from '../components/CustomExample'

<CustomExample>
  Custom content here
</CustomExample>
```
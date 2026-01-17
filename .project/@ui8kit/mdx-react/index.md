# @ui8kit/mdx-react

> Пакет для обработки MDX контента в UI8Kit документации

## Быстрый старт

1. [Установка и настройка](setup.md)
2. [Основные компоненты](components.md)
3. [Примеры использования](../examples/)

## Архитектура

- [Обзор архитектуры](architecture.md)
- [Правила разработки](rules.md)

## API Reference

### Компоненты

- `ComponentExample` - Интерактивный пример компонента
- `CodeBlock` - Подсвеченный блок кода
- `PropsTable` - Таблица свойств компонента
- `LiveDemo` - Живой редактор кода
- `Tabs` - Вкладки для организации контента
- `Callout` - Выделенные информационные блоки

### Утилиты

- `compileUI8KitMDX()` - Компиляция MDX в React
- `mdxReactPlugin()` - Vite плагин

### Типы

```typescript
interface UI8KitMDXOptions {
  components?: Record<string, any>;
  theme?: 'light' | 'dark' | 'auto';
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}
```

## Примеры

### Простой MDX файл

```mdx
---
title: Button Component
---

import { ComponentExample } from '@ui8kit/mdx-react'
import { Button } from '@ui8kit/core'

# Button

<ComponentExample
  component={Button}
  variants={['primary', 'secondary']}
  code={`<Button variant="primary">Click me</Button>`}
/>
```

### Конфигурация Vite

```typescript
import { defineConfig } from 'vite'
import { mdxReactPlugin } from '@ui8kit/mdx-react'

export default defineConfig({
  plugins: [
    mdxReactPlugin({
      theme: 'auto'
    }),
    react()
  ]
})
```

## Темизация

Пакет полностью интегрирован с UI8Kit дизайн-системой:

- Автоматическая адаптация к светлой/темной теме
- Использование CSS переменных UI8Kit
- Консистентные цвета и типографика

## Производительность

- **Размер**: < 50KB gzipped
- **Компиляция**: < 100ms на файл
- **Runtime**: Минимальный overhead

## Лицензия

MIT

## Ссылки

- [UI8Kit Framework](../../README.md)
- [Документация компонентов](../components/)
- [Примеры](../examples/)
# @ui8kit/mdx-react

> Спецификация и документация для пакета обработки MDX в UI8Kit экосистеме

## О пакете

`@ui8kit/mdx-react` - это легковесный пакет для обработки MDX контента в UI8Kit документации. Он предоставляет унифицированный интерфейс для компиляции MDX в React компоненты с полной интеграцией UI8Kit дизайн-системы.

## Цели

- **Легковесность**: Минимальный размер бандла (< 50KB gzipped)
- **UI8Kit-native**: Полная интеграция с дизайн-системой
- **Производительность**: Быстрая компиляция и рендеринг
- **Расширяемость**: Поддержка кастомных компонентов и плагинов

## Структура документации

```
.project/@ui8kit/mdx-react/
├── README.md              # Этот файл
├── index.md               # Основной гайд
├── setup.md               # Настройка в Bun.js + Vite
├── architecture.md        # Архитектура пакета
├── components.md          # Компоненты документации
├── rules.md               # Правила разработки
└── examples/              # Примеры использования
    ├── README.md          # Описание примеров
    ├── basic.mdx          # Простой пример
    └── advanced.mdx       # Сложный пример
```

## Быстрый старт

1. **Установка зависимостей**
   ```bash
   bun add @mdx-js/mdx @mdx-js/rollup @mdx-js/react
   ```

2. **Настройка Vite**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite'
   import mdx from '@mdx-js/rollup'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [
       { enforce: 'pre', ...mdx() },
       react()
     ]
   })
   ```

3. **Создание MDX файла**
   ```mdx
   ---
   title: My Component
   ---

   import { ComponentExample } from '@ui8kit/mdx-react'
   import { Button } from '@ui8kit/core'

   # My Component

   <ComponentExample component={Button} variants={['primary']} />
   ```

## Архитектура

### Компоненты
- **MDX Compiler**: Компиляция MDX в React компоненты
- **Vite Plugin**: Интеграция с системой сборки
- **React Components**: Специализированные компоненты документации
- **Utils**: Вспомогательные функции

### Ключевые возможности
- Компиляция MDX с remark/rehype плагинами
- Интерактивные примеры компонентов
- Подсветка синтаксиса кода
- Автоматическая генерация таблиц свойств
- Темизация и responsive дизайн

## Компоненты документации

### ComponentExample
Интерактивный пример компонента с переключением вариантов.

```mdx
<ComponentExample
  component={Button}
  variants={['primary', 'secondary']}
  title="Button Variants"
/>
```

### CodeBlock
Подсвеченный блок кода с дополнительными возможностями.

```mdx
<CodeBlock language="tsx" showLineNumbers>
{`function Button() { return <button>Click</button> }`}
</CodeBlock>
```

### PropsTable
Автоматическая генерация таблицы свойств из TypeScript типов.

```mdx
<PropsTable component={Button} />
```

### И другие компоненты
- `LiveDemo` - Живой редактор кода
- `Tabs` - Вкладки для организации контента
- `Callout` - Информационные блоки
- `ComponentGrid` - Сетка компонентов

## Правила разработки

### Производительность
- Размер бандла < 50KB gzipped
- Время компиляции < 100ms на файл
- Минимальный runtime overhead

### Совместимость
- Поддержка современных браузеров
- Content Security Policy совместимость
- XSS защита

### Качество кода
- Полная TypeScript типизация
- Тестовое покрытие > 90%
- Линтинг и форматирование

## Использование в проектах

### В UI8Kit документации
```typescript
// apps/docs/vite.config.ts
import { defineConfig } from 'vite'
import { mdxReactPlugin } from '@ui8kit/mdx-react'

export default defineConfig({
  plugins: [
    mdxReactPlugin({
      theme: 'auto',
      components: {
        // Глобальные компоненты
      }
    }),
    react()
  ]
})
```

### Кастомизация
```typescript
// Кастомные компоненты
const components = {
  ...defaultComponents,
  MyComponent: MyCustomComponent
}

<MDXProvider components={components}>
  <Content />
</MDXProvider>
```

## Примеры

Смотрите папку [`examples/`](examples/) для готовых примеров использования.

## Разработка пакета

### Структура кода
```
packages/mdx-react/
├── src/
│   ├── compiler.ts         # MDX компилятор
│   ├── vite-plugin.ts      # Vite плагин
│   ├── components/         # React компоненты
│   ├── utils/              # Утилиты
│   └── index.ts            # Экспорты
├── test/                   # Тесты
└── docs/                   # Документация
```

### Добавление компонентов
1. Создать компонент в `src/components/`
2. Добавить типы и тесты
3. Экспортировать в `src/index.ts`
4. Обновить документацию

## Тестирование

```bash
# Unit тесты
bun run test:unit

# Integration тесты
bun run test:integration

# E2E тесты
bun run test:e2e
```

## Сборка и публикация

```bash
# Сборка
bun run build

# Публикация
bun run publish
```

## Мониторинг

- **Bundle size**: < 50KB gzipped
- **Build time**: < 30s
- **Test coverage**: > 90%
- **Lighthouse score**: > 90

## Сообщество

- **GitHub**: [github.com/ui8kit/mdx-react](https://github.com/ui8kit/mdx-react)
- **Discord**: [discord.gg/ui8kit](https://discord.gg/ui8kit)
- **Документация**: [docs.ui8kit.dev](https://docs.ui8kit.dev)

## Лицензия

MIT - см. [LICENSE](../../LICENSE)

---

## Следующие шаги

1. **Изучить документацию** в [`index.md`](index.md)
2. **Посмотреть примеры** в [`examples/`](examples/)
3. **Начать разработку** пакета
4. **Создать документацию** для своего проекта
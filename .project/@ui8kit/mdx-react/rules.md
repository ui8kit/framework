# Правила и инструкции @ui8kit/mdx-react

## Общие правила

### 1. Single Source of Truth
- Вся документация ведется в MDX файлах
- Компоненты документации хранятся в пакете @ui8kit/mdx-react
- Стили документации наследуются от UI8Kit дизайн-системы

### 2. Производительность
- Размер бандла пакета не должен превышать 50KB gzipped
- Компиляция MDX должна занимать < 100ms для типичного файла
- Использовать tree shaking для неиспользуемых плагинов

### 3. Совместимость
- Поддержка всех современных браузеров (Chrome, Firefox, Safari, Edge)
- Совместимость с Content Security Policy
- XSS защита для пользовательского контента

## Правила разработки

### Файловая структура
```
packages/mdx-react/
├── src/
│   ├── compiler.ts         # Основной компилятор
│   ├── vite-plugin.ts      # Vite плагин
│   ├── components/         # Компоненты документации
│   ├── utils/              # Вспомогательные функции
│   └── index.ts            # Экспорты
├── test/                   # Тесты
└── docs/                   # Документация пакета
```

### Компоненты
- Все компоненты должны быть типизированы
- Использовать forwardRef для возможности ref forwarding
- Поддерживать className для кастомизации
- Следовать UI8Kit naming conventions

### MDX файлы
- Использовать .mdx расширение
- Frontmatter для метаданных
- Компоненты импортировать в начале файла
- Использовать semantic HTML элементы

## Правила использования

### Импорты в MDX
```mdx
---
title: Button Component
description: Button component documentation
---

import { ComponentExample, CodeBlock } from '@ui8kit/mdx-react'
import { Button } from '@ui8kit/core'

# Button

<ComponentExample component={Button} variants={['primary', 'secondary']} />

<CodeBlock language="tsx">
{`<Button variant="primary">Click me</Button>`}
</CodeBlock>
```

### Компонент Example
```mdx
<ComponentExample
  title="Button Variants"
  component={Button}
  variants={['primary', 'secondary', 'outline']}
  code={`<Button variant="primary">Click me</Button>`}
/>
```

### CodeBlock
```mdx
<CodeBlock language="tsx" showLineNumbers>
{`function Button({ children }) {
  return (
    <button className="btn">
      {children}
    </button>
  );
}`}
</CodeBlock>
```

## Правила тестирования

### Unit тесты
```typescript
describe('ComponentExample', () => {
  it('should render component with variants', () => {
    render(<ComponentExample component={Button} variants={['primary']} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Integration тесты
```typescript
describe('MDX compilation', () => {
  it('should compile MDX to React component', async () => {
    const result = await compileUI8KitMDX('# Hello');
    expect(result).toContain('React.createElement');
  });
});
```

### E2E тесты
```typescript
describe('Documentation page', () => {
  it('should display component examples', () => {
    cy.visit('/components/button');
    cy.get('[data-testid="component-example"]').should('be.visible');
  });
});
```

## Правила публикации

### Версионирование
- Следовать Semantic Versioning (MAJOR.MINOR.PATCH)
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

### Changelog
```markdown
# Changelog

## [1.2.0] - 2024-01-15
### Added
- New ComponentGrid component
- Support for component descriptions

### Changed
- Improved CodeBlock performance

## [1.1.0] - 2024-01-10
### Added
- LiveDemo component
- Theme switcher support
```

### Release checklist
- [ ] Все тесты проходят
- [ ] Линтинг без ошибок
- [ ] TypeScript типы корректны
- [ ] Документация обновлена
- [ ] Размер бандла в пределах нормы
- [ ] Совместимость с UI8Kit проверена

## Правила поддержки

### Browser support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Node.js support
- Node.js 18+
- Bun 1.0+

### React support
- React 18+
- React DOM 18+

## Правила безопасности

### XSS защита
- Весь пользовательский контент должен быть санитизирован
- Использовать DOMPurify для HTML контента
- Валидация входных данных

### CSP совместимость
- Inline styles не использовать
- External resources только из доверенных источников
- Nonce для inline scripts

## Правила производительности

### Bundle анализ
```bash
bun run build
bunx vite-bundle-analyzer dist
```

### Метрики производительности
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

### Оптимизации
- Lazy loading для больших MDX файлов
- Code splitting по маршрутам
- Image optimization для screenshots

## Правила расширения

### Добавление новых компонентов
1. Создать компонент в `src/components/`
2. Добавить типы в `src/types/`
3. Экспортировать в `src/index.ts`
4. Написать тесты
5. Обновить документацию

### Добавление новых плагинов
1. Выбрать remark/rehype плагин
2. Добавить в `src/compiler.ts`
3. Протестировать совместимость
4. Обновить документацию

### Кастомизация
- CSS переменные для тем
- Props для настройки поведения
- Context для глобальных настроек

## Правила документации

### README
- Краткое описание пакета
- Быстрый старт
- API reference
- Примеры использования

### MDX гайды
- Примеры для каждого компонента
- Best practices
- Troubleshooting

### Changelog
- Подробные изменения
- Migration guides для breaking changes
- Deprecation notices

## Мониторинг и метрики

### Показатели качества
- Test coverage > 90%
- Bundle size < 50KB
- Build time < 30s
- Lighthouse score > 90

### Мониторинг ошибок
- Sentry для runtime ошибок
- GitHub issues для баг репортов
- Discord для community поддержки

### Производительность
- Web Vitals tracking
- Bundle analyzer reports
- Memory usage monitoring
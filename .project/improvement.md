# UI8Kit — Vision & Concepts

## Философия

**UI8Kit = Template Factory** — фабрика шаблонов, где каждый конвейер производит консистентный дизайн для любого формата: веб-сайты, приложения, постеры, визитки, буклеты.

*Всё что связано с `сетка + прямоугольник + текст` — можно брендировать автоматически.*

---

## Почему это работает

### Минимальный Tailwind = Максимальный охват

Мы взяли **минимальный набор Tailwind классов**, который покрывает **90% потребностей дизайна** на уровне прототипов:

- Не требует компилятора Tailwind
- Легко переключать tw3 ↔ tw4
- CSS3 mapping: `className → style`
- Whitelist validation через `@ui8kit/lint`

### Design Tokens = Брендирование

Цветовые решения через **shadcn design tokens**:

- 90% задач по уникализации под брендбук
- Корпоративный уровень консистентности
- Один источник правды для цветов/типографики

### Modes × Engines = Production Lines

```
         │ tailwind │ css3   │ inline │
─────────┼──────────┼────────┼────────┤
React    │    ✓     │   ✓    │   ✓    │
HTML     │    ✓     │   ✓    │   ✓    │
Liquid   │    ✓     │   ✓    │   ✓    │
HBS      │    ✓     │   ✓    │   ✓    │
Twig     │    ✓     │   ✓    │   ✓    │
Latte    │    ✓     │   ✓    │   ✓    │
─────────┴──────────┴────────┴────────┘
         = 18 production lines
```

Каждая линия должна возвращать **валидный синтаксис** независимо от рефакторов.

---

## apps/engine как фабрика

### Сейчас

`apps/engine` — playground для генерации шаблонов из React DSL.

### Эволюция

1. **Playground** → отдельная программа
2. **Программа** → CLI утилита
3. **CLI** → масштабируемая фабрика

*Сколько брендов — столько фабрик. Как Ford после гаража.*

### Принцип развития

> Решения о рефакторинге принимаются при первом обнаружении **трёх источников правды вместо одного**.

Примеры уже сделанных рефакторов:
- `packages/blocks` — блоки были в apps/web
- `packages/data` — fixtures были разбросаны

---

## Выходные форматы

### Web (apps/web, apps/docs)

```
React DSL → React components
React DSL → Static HTML
React DSL → Liquid/HBS/Twig/Latte templates
```

### Beyond Web

```
React DSL → Email templates (inline styles)
React DSL → PDF (print-ready)
React DSL → Social media (fixed dimensions)
React DSL → Business cards, brochures
```

Все форматы используют одну и ту же **систему сетки + токены + компоненты**.

---

## Registry CDN — дистрибуция

### Концепт

После завершения разработки, все шаблоны публикуются в **Registry CDN**:

```bash
npx ui8kit add "https://registry.ui8kit.dev/blocks/hero.json"
```

### Что это даёт

1. **Любое приложение** может установить блоки без копирования кода
2. **Версионирование** — можно обновлять блоки
3. **AI-ready** — MCP сервер вызывает CLI

### Proof of Concept

1. Сгенерировать React шаблоны для apps/web
2. Удалить локальные шаблоны
3. Установить через `npx ui8kit add`
4. Результат идентичен

---

## MCP — AI как пользователь фабрики

### Сценарий

```
User: "Добавь Hero блок с CTA"
AI Agent → MCP Server → npx ui8kit add hero.json
AI Agent → настраивает props через JSON
```

### Требования к MCP

- List available blocks
- Add block by URL
- Configure block props
- Preview result

---

## Гарантии качества

### Каждая линия валидна

Независимо от рефакторов, **18 production lines** должны возвращать:

- Валидный синтаксис (HTML, Liquid, HBS, Twig, Latte, React)
- Консистентный визуал (одинаковый результат рендера)
- Проходящие snapshot tests

### Как обеспечить

1. **Snapshot tests** для каждой линии
2. **Visual regression** (опционально)
3. **Zod schemas** для input/output
4. **CI pipeline** — все 18 линий в каждом PR

---

## Метафора

> UI8Kit — это **типография нового поколения**.
>
> Раньше для каждого формата (буклет, визитка, сайт) нужен был отдельный дизайнер.
> Теперь один **React DSL источник** генерирует всё.
>
> Как Ford стандартизировал производство автомобилей,
> UI8Kit стандартизирует производство брендированных шаблонов.

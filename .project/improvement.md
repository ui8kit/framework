# UI8Kit — Vision & Concepts

## Философия

**UI8Kit = Template Factory** — фабрика шаблонов, где каждый конвейер производит консистентный дизайн для любого формата: веб-сайты, приложения, постеры, визитки, буклеты.

*Всё что связано с `сетка + прямоугольник + текст` — можно брендировать автоматически.*

---

## White Label Platform

### Что такое бренд?

**Бренд = design tokens + theme config.**

Смена цветов, шрифтов, радиусов, теней — и готов новый бренд. Та же структура, те же компоненты, другая айдентика.

### UI8Kit как IT-продукт

После прохождения всех стадий разработки и выхода на уровень контрибуции, UI8Kit становится **white label платформой**:

```
UI8Kit Framework (open source)
    ↓
Web Studio A → Brand 1, Brand 2, Brand 3...
Web Studio B → Brand 4, Brand 5, Brand 6...
Enterprise C → Brand 7, Brand 8, Brand 9...
```

**Одна платформа — неограниченное количество брендов.**

### Что получает пользователь платформы

- 15 production lines (5 engines × 3 modes)
- 50+ готовых блоков (shadcn parity)
- Design tokens система
- CLI для установки компонентов
- MCP для AI-assisted разработки
- Полный контроль над output

### Аналогия

Как WordPress стал платформой для миллионов сайтов с разными темами, UI8Kit станет платформой для генерации брендированных шаблонов в любом формате.

Разница: WordPress — runtime CMS. UI8Kit — **build-time factory**.

---

## Web Standards First

UI8Kit строится на **фундаментальных веб-стандартах**:

- **HTML5** — семантические теги (`<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`)
- **W3C CSS** — валидный CSS3 без vendor hacks
- **ARIA** — доступность для screen readers и assistive technologies
- **Progressive Enhancement** — работает без JavaScript где возможно

Это не опция, а **инженерный фундамент**. Каждый сгенерированный файл должен проходить валидацию.

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

```css
/* Brand A */
:root {
  --primary: 220 90% 56%;
  --radius: 0.5rem;
}

/* Brand B — только токены меняются */
:root {
  --primary: 142 76% 36%;
  --radius: 0;
}
```

Компоненты и блоки остаются **идентичными**.

---

## Production Matrix

### Templates (5 engines)

```
React DSL → React    (JSX components)
React DSL → Liquid   (Shopify, Jekyll)
React DSL → HBS      (universal)
React DSL → Twig     (Symfony, PHP)
React DSL → Latte    (Nette, PHP)
```

### Output Modes (3 styles)

```
tailwind  — utility classes as-is
css3      — mapped to CSS properties  
inline    — style attribute
```

### 15 Production Lines

```
         │ tailwind │ css3   │ inline │
─────────┼──────────┼────────┼────────┤
React    │    ✓     │   ✓    │   ✓    │
Liquid   │    ✓     │   ✓    │   ✓    │
HBS      │    ✓     │   ✓    │   ✓    │
Twig     │    ✓     │   ✓    │   ✓    │
Latte    │    ✓     │   ✓    │   ✓    │
─────────┴──────────┴────────┴────────┘
         = 15 production lines
```

### HTML + CSS = Result, Not Template

**Шаблон** — это исходник с логикой (`{% if %}`, `{{ var }}`).  
**HTML + CSS** — это результат рендера, готовый сайт.

Каждый из 5 template engines может генерировать HTML + CSS в трёх режимах.

---

## Архитектура генерации

### Текущий этап

```
React DSL (apps/engine)
    ↓
5 Template Engines (React, Liquid, HBS, Twig, Latte)
    ↓
apps/web, apps/docs (React templates without DSL)
    ↓
@ui8kit/generator
    ↓
HTML + CSS (static site)
```

### Целевая архитектура

```
Any Template Engine App (React, Liquid, HBS, Twig, Latte)
    ↓
@ui8kit/generator (standalone package)
    ↓
HTML + CSS (3 modes: tailwind, css3, inline)
```

**@ui8kit/generator** станет **изолированным пакетом** в отдельном репозитории:
- Можно поставить в любое приложение
- Работает с любым из 5 template engines
- Генерирует HTML + CSS в трёх режимах

---

## apps/engine — Development Factory

### Сейчас

`apps/engine` — playground для генерации шаблонов из React DSL.

### Эволюция

1. **Playground** → отдельная программа
2. **Программа** → CLI утилита
3. **CLI** → development factory

### Принцип развития

> Решения о рефакторинге принимаются при первом обнаружении **трёх источников правды вместо одного**.

Примеры уже сделанных рефакторов:
- `packages/blocks` — блоки были в apps/web
- `packages/data` — fixtures были разбросаны

---

## apps/web и apps/docs

### Характеристики

- **Чистый React** без DSL синтаксиса
- **Без fixtures** — собственные источники данных
- **Static context** или **API** для данных
- **Готовы к генерации** HTML + CSS через @ui8kit/generator

### Workflow

```
apps/engine (React DSL + fixtures)
    ↓ generates
apps/web, apps/docs (React + own data sources)
    ↓ @ui8kit/generator
dist/ (HTML + CSS static site)
```

---

## Выходные форматы

### Web (apps/web, apps/docs)

```
React → HTML + CSS (static site)
Liquid → HTML + CSS (via Liquid runtime)
HBS → HTML + CSS (via Handlebars runtime)
Twig → HTML + CSS (via PHP runtime)
Latte → HTML + CSS (via PHP runtime)
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

Независимо от рефакторов, **15 production lines** должны возвращать:

- Валидный синтаксис (Liquid, HBS, Twig, Latte, React)
- HTML5 semantic markup
- W3C valid CSS
- ARIA attributes где необходимо
- Консистентный визуал (одинаковый результат рендера)
- Проходящие snapshot tests

### Как обеспечить

1. **Snapshot tests** для каждой линии
2. **HTML/CSS validators** в CI
3. **Zod schemas** для input/output
4. **CI pipeline** — все 15 линий в каждом PR

---

## Метафора

> UI8Kit — это **типография нового поколения**.
>
> Раньше для каждого формата (буклет, визитка, сайт) нужен был отдельный дизайнер.
> Теперь один **React DSL источник** генерирует всё.
>
> Как Ford стандартизировал производство автомобилей,
> UI8Kit стандартизирует производство брендированных шаблонов.
>
> **Сам фреймворк — это завод Ford.**
> **Каждый пользователь фреймворка — владелец своего производства.**
> **Каждый бренд — это просто другой цвет машины с конвейера.**

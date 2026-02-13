# UI8Kit Pipeline — Implementation Checklist

## Pre-commit checklist (apps/engine)

When editing `apps/engine/**`, complete before finalizing:

| # | Command | Location |
|---|---------|----------|
| 1 | `bun run lint` | apps/engine |
| 2 | `bun run lint:dsl` | apps/engine |
| 3 | `bun run sync-dev` | repo root (generate + copy in one step) |

Or run steps 3–4 separately: `bun run generate` in apps/engine, then `bun run copy-templates-to-dev` at repo root.

**Automated:** App.tsx, layouts/partials/routes index files, and PageView→domain mapping are now copied from engine; no manual updates in apps/dev when adding new routes or PageViews.

Report pass/fail for each. If skipped, state why.

---

## Implementation checklist (adoption)

| Step | Action | Status |
|------|--------|--------|
| 1 | Ensure `apps/engine` lint includes `lint:dsl` | done |
| 2 | Add pre-commit hook or CI that runs above 4 commands | optional |
| 3 | Document `context` shape in `@ui8kit/data` | done |
| 4 | Ensure `apps/dev` imports `context` for routes | done |
| 5 | Add Liquid/HBS/Twig/Latte plugins when needed | planned |

---

## Full pipeline flow

### 1. Source of truth: `apps/engine`

```
apps/engine/src/
├── blocks/              ← Page sections (Hero, Examples, DashSidebar)
├── layouts/             ← MainLayout, DashLayout, ExamplesLayout
├── partials/            ← Header, Footer, Sidebar
└── routes/              ← WebsitePage, DocsPage, DashboardPage, etc.
```

- **DSL**: React + `If`, `Loop`, `Var` из `@ui8kit/template`
- **Данные**: `context` из `@ui8kit/data` (без хардкода в компонентах)
- **Контроль**: `@ui8kit/lint` (props + DSL)

### 2. **Генерация → React templates**

```
bun run generate
```

- `apps/engine` → `generator.config.ts` → `packages/generator`
- JSX → HAST → ReactPlugin → `dist/react/`
- DSL → обычный React (JSX, условные выражения, циклы)

### 3. **Синхронизация с dev**

```
bun run scripts/copy-templates-to-dev.ts
```

- `apps/engine/dist/react/` → `apps/dev/src/`
- `apps/dev` — dev-приложение с копией шаблонов

### 4. **Целевая матрица (roadmap)**

```text
5 engines × 3 modes = 15 lines
         │ tailwind │ css3   │ inline │
─────────┼──────────┼────────┼────────┤
React    │    ✓     │   ✓    │   ✓    │
Liquid   │    ✓     │   ✓    │   ✓    │
HBS      │    ✓     │   ✓    │   ✓    │
Twig     │    ✓     │   ✓    │   ✓    │
Latte    │    ✓     │   ✓    │   ✓    │
```

---

## Как вижу пайплайн

### Этап 1: Разработка интерфейса

```
Developer / LLM
    ↓
apps/engine (DSL source)
    ↓
├── rules (engine-dsl-enforcement.mdc)
├── lint (typecheck + validateDSL)
└── @ui8kit/data (context)
```

Нужно: только DSL, без хардкода, данные только из `context`.

### Этап 2: Генерация

```
apps/engine/src/**/*.tsx
    ↓
generator (ReactPlugin)
    ↓
apps/engine/dist/react/**/*.tsx
```

Сейчас: один плагин React.  
Дальше: Liquid, HBS, Twig, Latte.

### Этап 3: Дистрибуция

```
dist/react (или dist/liquid, dist/hbs, …)
    ↓
├── apps/dev (copy-templates-to-dev)
├── apps/web (static HTML)
├── apps/docs (static HTML)
└── BuildY/CDN (future)
```

### Этап 4: Production

```
Static HTML + CSS
    ↓
├── tailwind
├── css3
└── inline
```

---

## Узкие места

1. **Стабильность генератора** — `test`/`value`, `Var`/`name` иногда превращаются в переменные/пропсы, которых нет в `dev`.
2. **Наличие данных** — `context` должен быть в `apps/dev` при рендере (router, provider).
3. **Один pipeline, несколько выходов** — сейчас один путь (React → dev). Для Liquid и др. нужны плагины и отдельные `dist/`.

---

## Идеальный flow

```
1. Разработка в apps/engine (DSL)
2. Lint / validateDSL обязательны
3. generate → dist/{engine}
4. copy → apps/dev (или web/docs)
5. dev build / static build → HTML + CSS
```

Для production: тот же `dist/` можно использовать и в BuildY, и в CDN, и в CLI.
# UI8Kit DSL Workflow (Vite + React)

Пошаговая инструкция, как создать **любое** новое приложение на Vite + React и подключить DSL-подход UI8Kit.

## 1) Create project

```bash
bun create vite my-app --template react-ts
cd my-app
bun add react react-dom
```

## 2) Initialize UI8Kit in project

Можно использовать `npx` (как ты написал) или `bunx`.

```bash
npx ui8kit init
```

или

```bash
bunx ui8kit init
```

Что делает `init`:
- проверяет, что это Vite + React проект;
- создает `ui8kit.config.json` (в root и compatibility-копию в `src/`);
- создает базовые папки:
  - `src/lib`
  - `src/components`
  - `src/components/ui`
  - `src/layouts`
  - `src/blocks`
  - `src/variants`

## 3) Install starter pieces from registry

Установка конкретного registry item:

```bash
npx ui8kit add <component-name>
```

Пример:

```bash
npx ui8kit add blank
```

Если нужно поставить все из registry:

```bash
npx ui8kit add all
```

## 4) Add SDK config for DSL build/validate/generate

`ui8kit init` настраивает CLI-конфиг, но для SDK-режима нужен полный app config.

Создай в root файл `ui8kit.config.json` (если его еще нет в нужной форме) с полями:
- `brand`
- `framework`
- `target`
- `outDir`
- `fixtures`
- `tokens`
- `componentsDir`
- `blocksDir`
- `layoutsDir`
- `partialsDir`
- `libDir`
- `lint`

Минимальный пример:

```json
{
  "$schema": "https://ui.buildy.tw/schema.json",
  "configVersion": "1",
  "brand": "my-app",
  "framework": "vite-react",
  "typescript": true,
  "target": "react",
  "outDir": "./dist/react",
  "aliases": {
    "@": "./src",
    "@/components": "./src/components",
    "@/ui": "./src/components/ui",
    "@/layouts": "./src/layouts",
    "@/blocks": "./src/blocks",
    "@/lib": "./src/lib",
    "@/variants": "./src/variants"
  },
  "fixtures": "./fixtures",
  "tokens": "./src/index.css",
  "componentsDir": "./src/components",
  "blocksDir": "./src/blocks",
  "layoutsDir": "./src/layouts",
  "partialsDir": "./src/partials",
  "libDir": "./src/lib",
  "registry": "@ui8kit",
  "lint": {
    "strict": true,
    "dsl": true
  }
}
```

## 5) Create minimal DSL source

Создай:
- `src/layouts/MainLayout.tsx`
- `src/blocks/HomePageView.tsx`

И используй DSL-примитивы (`If`, `Var`, `Loop`) из `@ui8kit/template` внутри block-уровня.

## 6) Validate and generate

Из root проекта:

```bash
npx ui8kit-inspect --cwd .
npx ui8kit-validate --cwd .
npx ui8kit-generate --cwd . --target react --out-dir ./dist/react
```

После этого в `dist/react` будет сгенерированный React-код без DSL-артефактов.

## 7) Run app in dev mode

Для обычного Vite runtime:

```bash
bun run dev
```

Для CLI dev-проверки:

```bash
npx ui8kit dev --cwd .
```

---

## Quick command chain (copy/paste)

```bash
bun create vite my-app --template react-ts
cd my-app
bun add react react-dom
npx ui8kit init
npx ui8kit add blank
npx ui8kit-inspect --cwd .
npx ui8kit-validate --cwd .
npx ui8kit-generate --cwd . --target react --out-dir ./dist/react
bun run dev
```
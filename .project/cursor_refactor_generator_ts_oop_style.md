# Refactor generator.ts OOP Style
_Exported on 1/21/2026 at 11:11:45 GMT+3 from Cursor (2.3.41)_

---

**User**

@packages/generator/src/generator.ts сделай пожалуйста разбор файла в виде mind map карты чтобы понять как лучше всего организовать рефакторинг в ООП стиле

---

**Cursor**

Вот mind map‑разбор `packages/generator/src/generator.ts`, чтобы наметить рефакторинг в ООП стиле.

## Mind Map (структура/ответственности)

- **Generator (class)**
- **Lifecycle orchestration** (`generate`)
  - ensureLayouts
  - generateViews
  - generateCss
  - prepareProductionCss
  - generateHtml
  - generateClientScript
  - runUncss
  - copyAssets
  - generateVariantElements

- **Configuration model**
  - GeneratorConfig (app, css, html, clientScript, uncss, assets, elements)
  - RouteConfig (seo, data)
  - Html mode options: tailwind/semantic/inline
  - Partials config + props map

- **Liquid / templating**
  - constructor: Liquid setup + templatesDir
  - registerFilters (json/lowercase/uppercase)
  - ensureLayouts (copy default layouts if missing)
  - generateHtml
    - read view
    - render layout.liquid
    - buildMetaTags
    - processHtmlContent

- **View generation (React → Liquid)**
  - generateViews
  - generateViewContent (renderRoute)
  - generatePartials
    - renderComponent
    - unescapeLiquidTags
    - write partials

- **CSS generation**
  - generateCss
    - emitVariantsApplyCss
    - getComponentSelectorIgnorePatterns
    - htmlConverter.convertHtmlToCss
    - mergeCssFiles
    - write apply/pure css
  - prepareProductionCss (copy hashed css into dist/html assets)

- **HTML post‑processing**
  - processHtmlContent
    - removeClassAttributes
    - removeDataClassAttributes
    - convertDataClassAttributesToClass
    - minifyCss + injectInlineStyles
  - convertDataClassToClass (legacy, not used)

- **Client script**
  - generateClientScript (template read + selector replace)

- **UnCSS cleanup**
  - runUncss
  - processWithUncss

- **Assets**
  - copyAssets (glob + direct)
  - copyAssetFile
  - ensureDir

- **Variants / elements**
  - generateVariantElements (emitVariantElements)
  - emitVariantsApplyCss
  - resolveVariantsDir

## ООП‑направления для рефакторинга (по узлам)

- **Coordinator / Pipeline**
  - `Generator` оставить как фасад/оркестратор
  - вынести этапы в сервисы: `ViewsService`, `CssService`, `HtmlService`, `AssetsService`, `UncssService`, `ClientScriptService`, `VariantsService`, `LayoutsService`

- **Infrastructure / IO**
  - `FileSystem` abstraction (read/write/ensureDir/copy/glob/stat) — сейчас разбросано
  - `PathResolver` (compute output paths, views/partials/layouts, routes → filenames)

- **Rendering**
  - `ReactRenderer` (wrap `renderRoute`, `renderComponent`)
  - `LiquidRenderer` (init, filters, render layout, meta tags)

- **HTML transformation**
  - `HtmlModeProcessor` (tailwind/semantic/inline)
  - `DataClassTransformer` (remove/convert/dedupe)
  - `CssInliner` (minify + inject)

- **CSS**
  - `CssGenerator`
    - `VariantsCssEmitter`
    - `HtmlToCssConverterAdapter` (wrap `htmlConverter`)
    - `CssMerger`
  - `ProductionCssPreparer`

- **UnCSS**
  - `UncssRunner` (options + per‑HTML processing)

- **Assets**
  - `AssetCopier` (pattern resolution + mapping + copy)

## Связи/зависимости (для выделения интерфейсов)
- `generateCss` → `htmlConverter`, `emitVariantsApplyCss`, `getComponentSelectorIgnorePatterns`, `mergeCssFiles`
- `generateViews` → `generatePartials`, `generateViewContent`
- `generateHtml` → `Liquid`, `processHtmlContent`, `buildMetaTags`
- `processHtmlContent` → `removeClassAttributes`, `convertDataClassAttributesToClass`, `minifyCss`, `injectInlineStyles`
- `runUncss` → `processWithUncss`

Если хочешь, могу разложить это в конкретные классы/интерфейсы и предложить целевой пакетный расклад (например `services/`, `render/`, `pipeline/`).

---

**User**

теперь визуально прямо в чате

---

**Cursor**

```
                                    ┌─────────────────────────────────────┐
                                    │           GENERATOR.TS              │
                                    │         (~988 lines)                │
                                    └──────────────┬──────────────────────┘
                                                   │
          ┌────────────────────────────────────────┼────────────────────────────────────────┐
          │                                        │                                        │
          ▼                                        ▼                                        ▼
┌─────────────────────┐              ┌─────────────────────────┐              ┌─────────────────────┐
│   CONFIGURATION     │              │      CLASS Generator    │              │      INTERFACES     │
│                     │              │                         │              │                     │
│ • GeneratorConfig   │              │ • liquid: Liquid        │              │ • GeneratorConfig   │
│   - app             │              │ • templatesDir: string  │              │ • RouteConfig       │
│   - css             │              │                         │              │                     │
│   - html            │              │ constructor()           │              └─────────────────────┘
│   - clientScript    │              │   └─ registerFilters()  │
│   - uncss           │              │                         │
│   - assets          │              │ generate(config)        │
│   - elements        │              │   └─ PIPELINE ──────────┼──────────────────────┐
│                     │              │                         │                      │
│ • RouteConfig       │              └─────────────────────────┘                      │
│   - title, seo      │                                                               │
│   - data            │                                                               │
└─────────────────────┘                                                               │
                                                                                      │
┌─────────────────────────────────────────────────────────────────────────────────────┘
│
│  ═══════════════════════════════════════════════════════════════════════════════════
│                                  PIPELINE (8 шагов)
│  ═══════════════════════════════════════════════════════════════════════════════════
│
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  │    1    │──▶│    2    │──▶│    3    │──▶│    4    │──▶│    5    │──▶│    6    │──▶│    7    │──▶│    8    │
│  │ LAYOUTS │   │  VIEWS  │   │   CSS   │   │PROD CSS │   │  HTML   │   │ SCRIPT  │   │  UNCSS  │   │ ASSETS  │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
│       │             │             │             │             │             │             │             │
│       ▼             ▼             ▼             ▼             ▼             ▼             ▼             ▼
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  │ensure   │   │generate │   │generate │   │prepare  │   │generate │   │generate │   │run      │   │copy     │
│  │Layouts  │   │Views    │   │Css      │   │Prod.Css │   │Html     │   │Client   │   │Uncss    │   │Assets   │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   │Script   │   └─────────┘   └─────────┘
│                                                                        └─────────┘
│
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────

  ════════════════════════════════════════════════════════════════════════════════════════════════════════════
                                          ДЕТАЛИЗАЦИЯ ШАГОВ
  ════════════════════════════════════════════════════════════════════════════════════════════════════════════


  ┌─ 1. LAYOUTS ─────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   ensureLayouts()                                                                                        │
  │       │                                                                                                  │
  │       ├── ensureDir(layoutsDir)                                                                          │
  │       └── copy layout.liquid, page.liquid (if missing)                                                   │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 2. VIEWS (React → Liquid) ──────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   generateViews()                                                                                        │
  │       │                                                                                                  │
  │       ├── generatePartials()                     ◄─── optional                                           │
  │       │       │                                                                                          │
  │       │       ├── readdir(sourceDir)                                                                     │
  │       │       ├── renderComponent() ──────────── @ui8kit/render                                          │
  │       │       └── unescapeLiquidTags()                                                                   │
  │       │                                                                                                  │
  │       └── for each route:                                                                                │
  │               │                                                                                          │
  │               ├── generateViewContent()                                                                  │
  │               │       └── renderRoute() ──────── @ui8kit/render                                          │
  │               └── writeFile(viewPath)                                                                    │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 3. CSS GENERATION ──────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   generateCss()                                                                                          │
  │       │                                                                                                  │
  │       ├── emitVariantsApplyCss() ────────────────┐                                                       │
  │       │       │                                  │                                                       │
  │       │       └── resolveVariantsDir()           │                                                       │
  │       │                                          ▼                                                       │
  │       ├── getComponentSelectorIgnorePatterns()   variants.apply.css                                      │
  │       │                                                                                                  │
  │       ├── for each route + partials + layouts:                                                           │
  │       │       │                                                                                          │
  │       │       └── htmlConverter.convertHtmlToCss() ──── html-converter.ts                                │
  │       │                                                                                                  │
  │       ├── mergeCssFiles()                                                                                │
  │       │                                                                                                  │
  │       └── Bun.write() → tailwind.apply.css, ui8kit.local.css                                             │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 4. PRODUCTION CSS ──────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   prepareProductionCss()                                                                                 │
  │       │                                                                                                  │
  │       └── copyFile(index-*.css → dist/html/assets/css/styles.css)                                        │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 5. HTML GENERATION ─────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   generateHtml()                                                                                         │
  │       │                                                                                                  │
  │       ├── mode: tailwind | semantic | inline                                                             │
  │       │                                                                                                  │
  │       └── for each route:                                                                                │
  │               │                                                                                          │
  │               ├── read viewContent                                                                       │
  │               ├── liquid.renderFile('layouts/layout.liquid')                                             │
  │               │       └── buildMetaTags()                                                                │
  │               │                                                                                          │
  │               ├── processHtmlContent(mode) ──────────────────────────┐                                   │
  │               │       │                                              │                                   │
  │               │       ├── tailwind: removeDataClassAttributes()      │                                   │
  │               │       ├── semantic: removeClassAttributes()          │                                   │
  │               │       │             convertDataClassAttributesToClass│                                   │
  │               │       └── inline:   + minifyCss()                    │                                   │
  │               │                     + injectInlineStyles()           │                                   │
  │               │                                                      │                                   │
  │               └── writeFile(htmlPath)                                │                                   │
  │                                                                      │                                   │
  │   ┌─ HTML TRANSFORMERS ──────────────────────────────────────────────┘                                   │
  │   │                                                                                                      │
  │   │   • removeClassAttributes()          remove class="..."                                              │
  │   │   • removeDataClassAttributes()      remove data-class="..."                                         │
  │   │   • convertDataClassAttributesToClass()  data-class → class (dedupe)                                 │
  │   │   • minifyCss()                      strip comments/whitespace                                       │
  │   │   • injectInlineStyles()             add <style> to <head>                                           │
  │   │                                                                                                      │
  │   └──────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 6. CLIENT SCRIPT ───────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   generateClientScript()  ◄─── optional (clientScript.enabled)                                           │
  │       │                                                                                                  │
  │       ├── readFile(entry-client.tsx)                                                                     │
  │       ├── replace selectors                                                                              │
  │       └── writeFile()                                                                                    │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 7. UNCSS ───────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   runUncss()  ◄─── optional (uncss.enabled)                                                              │
  │       │                                                                                                  │
  │       └── for each htmlFile:                                                                             │
  │               │                                                                                          │
  │               ├── readFile(html + css)                                                                   │
  │               ├── processWithUncss() ─────────── uncss (CommonJS)                                        │
  │               └── writeFile(unused.css)                                                                  │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ┌─ 8. ASSETS + VARIANTS ───────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                          │
  │   copyAssets()                                                                                           │
  │       │                                                                                                  │
  │       └── for each pattern:                                                                              │
  │               ├── glob() or direct                                                                       │
  │               └── copyAssetFile()                                                                        │
  │                                                                                                          │
  │   generateVariantElements()  ◄─── optional (elements.enabled)                                            │
  │       │                                                                                                  │
  │       └── emitVariantElements() ──────────── emit-variant-elements.ts                                    │
  │                                                                                                          │
  └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ════════════════════════════════════════════════════════════════════════════════════════════════════════════
                                     ПРЕДЛОЖЕНИЕ ООП-РЕФАКТОРИНГА
  ════════════════════════════════════════════════════════════════════════════════════════════════════════════


                              ┌─────────────────────────────────────┐
                              │         Generator (Facade)          │
                              │         ─────────────────           │
                              │   • generate(config)                │
                              │   • координирует сервисы            │
                              └──────────────┬──────────────────────┘
                                             │
         ┌───────────────┬───────────────┬───┴───┬───────────────┬───────────────┬───────────────┐
         │               │               │       │               │               │               │
         ▼               ▼               ▼       ▼               ▼               ▼               ▼
  ┌─────────────┐ ┌─────────────┐ ┌───────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │LayoutService│ │ ViewService │ │CssService │ │ HtmlService │ │ScriptService│ │UncssService │ │AssetService │
  │             │ │             │ │           │ │             │ │             │ │             │ │             │
  │ensureLayouts│ │generateViews│ │generateCss│ │generateHtml │ │generateScript│ │runUncss    │ │copyAssets   │
  │             │ │generateParts│ │prepProdCss│ │processContent│             │ │processUncss │ │copyFile     │
  └─────────────┘ └──────┬──────┘ └─────┬─────┘ └──────┬──────┘ └─────────────┘ └─────────────┘ └─────────────┘
                         │              │              │
                         ▼              ▼              ▼
                  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐
                  │ReactRenderer│ │VariantsEmit │ │  HtmlTransformer    │
                  │             │ │             │ │                     │
                  │renderRoute  │ │emitVariants │ │removeClassAttributes│
                  │renderCompon.│ │emitApplyCss │ │convertDataClass     │
                  └─────────────┘ └─────────────┘ │minifyCss            │
                                                  │injectStyles         │
                                                  └─────────────────────┘
                                                             │
                                   ┌─────────────────────────┴─────────────────────────┐
                                   │                                                   │
                                   ▼                                                   ▼
                            ┌─────────────┐                                     ┌─────────────┐
                            │LiquidRenderer│                                    │ FileSystem  │
                            │             │                                     │             │
                            │renderFile   │                                     │read/write   │
                            │buildMeta    │                                     │ensureDir    │
                            │filters      │                                     │copy/glob    │
                            └─────────────┘                                     └─────────────┘
```


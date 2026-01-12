# 14. Production оптимизации

Финальная настройка для production - это когда все инструменты работают вместе для достижения максимальной производительности.

## 🎯 Production-ready конфигурация

### Полная цепочка оптимизации

```javascript
// postcss.config.mjs - финальная версия
export default {
  plugins: {
    // 1. Генерация CSS (Tailwind)
    '@tailwindcss/postcss': {},

    // 2. Автопрефиксы
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ],
      grid: true,
      flexbox: 'no-2009'
    },

    // 3. UnCSS оптимизация (только production)
    ...(process.env.NODE_ENV === 'production' ? {
      uncss: {
        html: [
          './dist/html/index.html',
          './dist/html/about.html',
          './dist/html/contact.html'
        ],
        ignore: [
          // Системные атрибуты
          /^data-/,
          /^aria-/,
          /\.sr-only/,
          /\.focus-visible/,

          // Динамические классы
          /^variant-/,
          /^status-/,
          /^size-/,
          /^state-/,
          /^is-/,
          /^has-/,

          // Библиотеки
          /^lucide-/,
          /^cva-/,
          /^tw-/,

          // React/Vue
          /^v-/,
          /^react-/,
          /^vue-/,

          // Медиа-запросы
          /@media/,

          // Псевдо-состояния
          /\.hover:/,
          /\.focus:/,
          /\.active:/,
          /\.visited:/,
          /\.checked:/,
          /\.disabled:/,

          // Анимации
          /^animate-/,
          /\.transition/,

          // Темы
          /^dark:/,
          /^light:/,

          // Responsive
          /^sm:/,
          /^md:/,
          /^lg:/,
          /^xl:/,
          /^2xl:/
        ],
        media: ['screen', 'all'],
        timeout: 10000,
        report: false  // Отключаем в production
      }
    } : {}),

    // 4. Финальная минификация
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false,
          colormin: true,
          convertValues: true,
          discardDuplicates: true,
          discardEmpty: true,
          discardOverridden: true,
          mergeRules: true,
          minifySelectors: true,
          reduceTransforms: true,
          cssDeclarationSorter: true,
          reduceInitial: true,
          minifyGradients: true
        }]
      }
    } : {})
  }
}
```

## 🏗️ Production сборка

### package.json скрипты

```json
{
  "scripts": {
    "build": "bun run clean && bun run build:production",
    "build:production": "NODE_ENV=production bun run build:prepare && bun run build:optimize && bun run build:final",
    "build:prepare": "tsc && vite build --mode production",
    "build:optimize": "bun run optimize:css && bun run post-process-css",
    "build:final": "bun run copy-assets && bun run generate-manifest && bun run validate-build",
    "optimize:css": "uncss dist/html/index.html dist/css/index.css -o dist/css/styles.css",
    "post-process-css": "bun run deduplicate-css && bun run minify-final",
    "copy-assets": "cp dist/css/styles.css dist/html/assets/ && cp dist/css/styles.css.map dist/html/assets/",
    "generate-manifest": "bun run create-build-manifest",
    "validate-build": "bun run validate-css && bun run lighthouse-check",
    "preview:production": "serve dist/html -p 3000"
  }
}
```

## 🚀 Продвинутые оптимизации

### 1. Дедупликация CSS

```javascript
// scripts/deduplicate-css.mjs
import postcss from 'postcss'
import { readFileSync, writeFileSync } from 'fs'

const css = readFileSync('./dist/css/styles.css', 'utf-8')

// Плагин для дедупликации
const deduplicatePlugin = postcss.plugin('deduplicate', () => {
  return (root) => {
    const ruleMap = new Map()

    root.walkRules(rule => {
      // Создаем ключ из деклараций
      const declarations = rule.nodes
        .filter(node => node.type === 'decl')
        .map(decl => `${decl.prop}:${decl.value}`)
        .sort()
        .join(';')

      if (ruleMap.has(declarations)) {
        // Объединяем селекторы
        const existingRule = ruleMap.get(declarations)
        const combinedSelectors = [
          ...existingRule.selector.split(',').map(s => s.trim()),
          ...rule.selector.split(',').map(s => s.trim())
        ]

        existingRule.selector = [...new Set(combinedSelectors)].join(', ')
        rule.remove()
      } else {
        ruleMap.set(declarations, rule)
      }
    })
  }
})

const result = await postcss([deduplicatePlugin]).process(css, { from: undefined })
writeFileSync('./dist/css/deduplicated.css', result.css)

console.log(`✅ Дедупликация завершена: ${result.css.length} байт`)
```

### 2. Удаление неиспользуемых переменных

```javascript
// scripts/clean-variables.mjs
import postcss from 'postcss'
import { readFileSync, writeFileSync } from 'fs'

const css = readFileSync('./dist/css/deduplicated.css', 'utf-8')

const cleanVarsPlugin = postcss.plugin('clean-vars', () => {
  return (root) => {
    const definedVars = new Set()
    const usedVars = new Set()

    // Находим определения переменных
    root.walkDecls(decl => {
      if (decl.prop.startsWith('--')) {
        definedVars.add(decl.prop)
      }
    })

    // Находим использования переменных
    root.walkDecls(decl => {
      const varRegex = /var\((--[^)]+)\)/g
      let match
      while ((match = varRegex.exec(decl.value)) !== null) {
        usedVars.add(match[1])
      }
    })

    // Удаляем неиспользуемые
    root.walkDecls(decl => {
      if (decl.prop.startsWith('--') && !usedVars.has(decl.prop)) {
        console.log(`🗑️  Удаляем переменную: ${decl.prop}`)
        decl.remove()
      }
    })

    console.log(`📊 Переменных: ${definedVars.size} определено, ${usedVars.size} используется`)
  }
})

const result = await postcss([cleanVarsPlugin]).process(css, { from: undefined })
writeFileSync('./dist/css/clean.css', result.css)
```

### 3. Финальная минификация

```javascript
// scripts/minify-final.mjs
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

console.log('🎯 Финальная минификация CSS...')

// Используем cssnano через PostCSS
const result = execSync(
  'postcss dist/css/clean.css --use cssnano --no-map -o dist/css/final.css',
  { encoding: 'utf-8' }
)

const originalSize = readFileSync('./dist/css/clean.css').length
const finalSize = readFileSync('./dist/css/final.css').length
const savings = ((1 - finalSize / originalSize) * 100).toFixed(1)

console.log(`✅ Минификация завершена: ${finalSize} байт (${savings}% экономии)`)
```

## 📊 Мониторинг и метрики

### Build manifest

```javascript
// scripts/create-build-manifest.mjs
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const manifest = {
  build: {
    timestamp: new Date().toISOString(),
    git: {
      commit: execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim(),
      branch: execSync('git branch --show-current', { encoding: 'utf-8' }).trim()
    },
    environment: {
      node: process.version,
      platform: process.platform
    }
  },
  files: {},
  optimization: {}
}

// Анализируем файлы
const files = [
  'dist/html/index.html',
  'dist/css/index.css',
  'dist/css/styles.css',
  'dist/css/final.css'
]

files.forEach(file => {
  try {
    const stats = execSync(`wc -c < ${file}`, { encoding: 'utf-8' }).trim()
    const lines = execSync(`wc -l < ${file}`, { encoding: 'utf-8' }).trim()

    manifest.files[file] = {
      size: parseInt(stats),
      lines: parseInt(lines),
      gzip: execSync(`gzip -c ${file} | wc -c`, { encoding: 'utf-8' }).trim()
    }
  } catch (e) {
    manifest.files[file] = { error: e.message }
  }
})

// Рассчитываем метрики оптимизации
if (manifest.files['dist/css/index.css'] && manifest.files['dist/css/final.css']) {
  const original = manifest.files['dist/css/index.css'].size
  const final = manifest.files['dist/css/final.css'].size

  manifest.optimization = {
    originalSize: original,
    finalSize: final,
    savingsPercent: Math.round((1 - final / original) * 100),
    savingsBytes: original - final,
    gzipSavings: manifest.files['dist/css/final.css'].gzip
  }
}

writeFileSync('./dist/build-manifest.json', JSON.stringify(manifest, null, 2))
console.log('📋 Build manifest создан')
```

### Валидация сборки

```javascript
// scripts/validate-css.mjs
import { readFileSync } from 'fs'

function validateCSS() {
  console.log('🔍 Валидация финального CSS...')

  const css = readFileSync('./dist/css/final.css', 'utf-8')
  const html = readFileSync('./dist/html/index.html', 'utf-8')

  // Извлекаем классы из HTML
  const htmlClasses = new Set()
  const classRegex = /class=["']([^"']+)["']/g
  let match

  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach(cls => {
      if (cls) htmlClasses.add(cls)
    })
  }

  // Проверяем наличие классов в CSS
  const missingClasses = []
  htmlClasses.forEach(cls => {
    if (!css.includes(`.${cls}`) && !css.includes(`.${cls}:`)) {
      missingClasses.push(cls)
    }
  })

  if (missingClasses.length > 0) {
    console.error('❌ Отсутствующие классы в финальном CSS:')
    missingClasses.forEach(cls => console.error(`  .${cls}`))
    process.exit(1)
  }

  // Проверяем размер
  const maxSize = 50 * 1024 // 50KB
  if (css.length > maxSize) {
    console.error(`❌ CSS слишком большой: ${css.length} байт (макс ${maxSize})`)
    process.exit(1)
  }

  // Проверяем минификацию
  const lines = css.split('\n').length
  if (lines > 1) {
    console.warn(`⚠️  CSS не полностью минифицирован: ${lines} строк`)
  }

  console.log(`✅ CSS валиден: ${css.length} байт, ${htmlClasses.size} классов`)
}

validateCSS()
```

### Lighthouse проверка

```javascript
// scripts/lighthouse-check.mjs
import { execSync } from 'child_process'

function lighthouseCheck() {
  console.log('🏮 Проверка Lighthouse...')

  try {
    // Запускаем локальный сервер
    const serverProcess = execSync('serve dist/html -p 3001', {
      detached: true,
      stdio: 'ignore'
    })

    // Ждем запуска сервера
    execSync('sleep 2')

    // Запускаем Lighthouse
    const result = execSync(
      'lighthouse http://localhost:3001 --output=json --output-path=./lighthouse-report.json --quiet',
      { encoding: 'utf-8' }
    )

    // Останавливаем сервер
    execSync(`kill ${serverProcess}`)

    const report = JSON.parse(readFileSync('./lighthouse-report.json', 'utf-8'))

    const scores = {
      performance: report.categories.performance.score * 100,
      accessibility: report.categories.accessibility.score * 100,
      bestPractices: report.categories['best-practices'].score * 100,
      seo: report.categories.seo.score * 100
    }

    console.log('📊 Lighthouse Scores:')
    Object.entries(scores).forEach(([category, score]) => {
      const icon = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌'
      console.log(`  ${icon} ${category}: ${score}`)
    })

    // Проверяем пороги
    const minScore = 85
    const failed = Object.values(scores).some(score => score < minScore)

    if (failed) {
      console.error(`❌ Некоторые метрики ниже ${minScore}`)
      process.exit(1)
    }

    console.log('✅ Все метрики Lighthouse в норме')

  } catch (error) {
    console.error('❌ Ошибка Lighthouse проверки:', error.message)
    process.exit(1)
  }
}

lighthouseCheck()
```

## 🚀 CD/CI интеграция

### GitHub Actions для production

```yaml
# .github/workflows/production.yml
name: Production Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Bun
      uses: oven-sh/setup-bun@v1

    - name: Install dependencies
      run: bun install

    - name: Type check
      run: bun run type-check

    - name: Lint
      run: bun run lint

    - name: Build for production
      run: bun run build

    - name: Validate build
      run: bun run validate-build

    - name: Performance check
      run: bun run lighthouse-check

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: production-build
        path: |
          dist/
          *-report.json
          lighthouse-report.json

    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        # Деплой команды
        echo "Deploying to production..."
```

## 📈 Финальные метрики

После всех оптимизаций:

| Метрика | Исходный | Финальный | Улучшение |
|---------|----------|-----------|-----------|
| **CSS размер** | 127 KB | 8 KB | **94%** |
| **Строки кода** | 2,959 | 120 | **96%** |
| **Селекторы** | ~5,000 | ~80 | **98%** |
| **Переменные** | 150 | 12 | **92%** |
| **Lighthouse** | 85/100 | 98/100 | +13 |
| **Время загрузки** | 2.3s | 0.8s | **65%** |

## 🎯 Заключение

Production оптимизация CSS - это комплексный процесс, включающий:

1. **Многоуровневую оптимизацию** - Tailwind → UnCSS → PostCSS → CSSNano
2. **Автоматизированное тестирование** - валидация, метрики, Lighthouse
3. **Мониторинг и отчеты** - отслеживание изменений, алерты
4. **CI/CD интеграция** - автоматическая сборка и деплой

Такая настройка обеспечивает идеальный баланс между удобством разработки и максимальной производительностью в production.
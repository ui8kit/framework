# 13. Отладка и troubleshooting

UnCSS может иногда удалять нужные стили или не удалять ненужные. Давайте научимся диагностировать и решать такие проблемы.

## 🔍 Основные инструменты отладки

### 1. Включение отчетов

```javascript
// postcss.config.mjs
{
  uncss: {
    html: ['./dist/html/**/*.html'],
    report: true,  // Включаем детальный отчет
    timeout: 5000
  }
}
```

### 2. Анализ отчета

```bash
# После сборки смотрим отчет
cat dist/css/optimization-report.json | jq '.selectors'

# Или используем наш анализатор
bun run analyze-css
```

### 3. Визуальная проверка

```javascript
// scripts/visual-check.mjs
import { readFileSync, writeFileSync } from 'fs'

function createDebugHTML() {
  const css = readFileSync('./dist/css/clean.css', 'utf-8')
  const html = readFileSync('./dist/html/index.html', 'utf-8')

  // Создаем HTML с встроенными стилями для проверки
  const debugHTML = html.replace(
    '<head>',
    `<head>
    <style>
    /* Оригинальные стили для сравнения */
    ${css}
    </style>
    <style>
    /* Маркеры для проверки */
    .uncss-debug-used { outline: 2px solid green !important; }
    .uncss-debug-unused { outline: 2px solid red !important; }
    </style>`
  )

  writeFileSync('./dist/html/debug.html', debugHTML)
  console.log('✅ Создан debug HTML: ./dist/html/debug.html')
}

createDebugHTML()
```

## 🚨 Распространенные проблемы

### Проблема 1: UnCSS удаляет нужные стили

#### Симптомы
- После оптимизации сайт выглядит сломанным
- Некоторые компоненты потеряли стили
- Консоль показывает ошибки применения стилей

#### Диагностика

```javascript
// scripts/diagnose-missing-styles.mjs
import { readFileSync } from 'fs'

function diagnoseMissingStyles() {
  const originalCSS = readFileSync('./dist/css/index.css', 'utf-8')
  const optimizedCSS = readFileSync('./dist/css/clean.css', 'utf-8')
  const html = readFileSync('./dist/html/index.html', 'utf-8')

  // Находим классы в HTML
  const htmlClasses = new Set()
  const classRegex = /class=["']([^"']+)["']/g
  let match
  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach(cls => htmlClasses.add(cls))
  }

  console.log(`📄 Найдено классов в HTML: ${htmlClasses.size}`)

  // Проверяем каждый класс
  const missingClasses = []
  htmlClasses.forEach(cls => {
    const classSelector = `.${cls}`
    if (!optimizedCSS.includes(classSelector) && originalCSS.includes(classSelector)) {
      missingClasses.push(cls)
    }
  })

  if (missingClasses.length > 0) {
    console.log('❌ Отсутствующие классы:', missingClasses.slice(0, 10))
    if (missingClasses.length > 10) {
      console.log(`... и ещё ${missingClasses.length - 10} классов`)
    }

    // Создаем паттерны для игнора
    const patterns = missingClasses.map(cls => {
      // Ищем паттерны (например, variant-primary -> ^variant-)
      const parts = cls.split('-')
      if (parts.length > 1) {
        return `^${parts[0]}-`
      }
      return `^${cls}$`
    })

    console.log('💡 Рекомендуемые паттерны для ignore:')
    console.log([...new Set(patterns)])
  } else {
    console.log('✅ Все классы найдены!')
  }

  return missingClasses
}

diagnoseMissingStyles()
```

#### Решения

1. **Добавить в ignore паттерны:**
```javascript
{
  uncss: {
    ignore: [
      // Добавьте найденные паттерны
      /^variant-/,
      /^status-/,
      /^btn-/
    ]
  }
}
```

2. **Проверить HTML генерацию:**
```bash
# Убедитесь, что HTML содержит все нужные классы
grep -o 'class="[^"]*"' dist/html/index.html | head -20
```

3. **Добавить тестовый HTML:**
```javascript
// Создайте HTML со всеми вариантами классов
const testHTML = `
<div class="variant-primary variant-secondary btn-large btn-small"></div>
`
```

### Проблема 2: UnCSS не удаляет ненужные стили

#### Симптомы
- Оптимизация слабая (меньше 50% экономии)
- Много неиспользуемых селекторов остается
- Файл все еще большой

#### Диагностика

```javascript
// scripts/analyze-unused.mjs
import { readFileSync } from 'fs'

function analyzeUnusedSelectors() {
  const css = readFileSync('./dist/css/clean.css', 'utf-8')
  const html = readFileSync('./dist/html/index.html', 'utf-8')

  // Извлекаем все селекторы из CSS
  const cssSelectors = new Set()
  const selectorRegex = /\.([a-zA-Z][\w-]*)/g
  let match
  while ((match = selectorRegex.exec(css)) !== null) {
    cssSelectors.add(match[1])
  }

  // Извлекаем классы из HTML
  const htmlClasses = new Set()
  const classRegex = /class=["']([^"']+)["']/g
  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach(cls => htmlClasses.add(cls))
  }

  // Находим неиспользуемые
  const unusedSelectors = []
  cssSelectors.forEach(selector => {
    if (!htmlClasses.has(selector)) {
      unusedSelectors.push(selector)
    }
  })

  console.log(`🎯 Всего селекторов в CSS: ${cssSelectors.size}`)
  console.log(`📄 Используемых в HTML: ${htmlClasses.size}`)
  console.log(`🗑️  Неиспользуемых: ${unusedSelectors.length}`)

  if (unusedSelectors.length > 0) {
    console.log('Примеры неиспользуемых селекторов:')
    unusedSelectors.slice(0, 20).forEach(sel => console.log(`  .${sel}`))

    // Анализируем паттерны
    const patterns = unusedSelectors.map(sel => {
      const parts = sel.split('-')
      return parts.length > 1 ? `${parts[0]}-*` : sel
    })

    console.log('\n💡 Возможные паттерны для удаления:')
    console.log([...new Set(patterns)].slice(0, 10))
  }

  return unusedSelectors
}

analyzeUnusedSelectors()
```

#### Решения

1. **Проверить content в Tailwind:**
```javascript
// tailwind.config.ts
export default {
  content: [
    './dist/html/**/*.html',  // Добавьте HTML файлы
    './src/**/*.{js,ts,jsx,tsx}'
  ]
}
```

2. **Улучшить HTML генерацию:**
```tsx
// Убедитесь, что все компоненты рендерятся
export function App() {
  return (
    <div>
      {/* Рендерим все варианты компонентов */}
      <Button variant="primary" />
      <Button variant="secondary" />
      <StatusBadge status="success" />
      <StatusBadge status="error" />
    </div>
  )
}
```

3. **Использовать более строгие правила:**
```javascript
{
  uncss: {
    // Убрать слишком широкие ignore паттерны
    ignore: [
      // Только конкретные исключения
      /^data-/,
      /^aria-/,
      '.sr-only'
    ]
  }
}
```

### Проблема 3: UnCSS работает слишком медленно

#### Симптомы
- Сборка занимает много времени
- Таймауты в консоли
- Большое потребление памяти

#### Диагностика

```javascript
// scripts/performance-check.mjs
import { execSync } from 'child_process'
import { performance } from 'perf_hooks'

async function performanceCheck() {
  console.log('⚡ Проверка производительности UnCSS\n')

  const startTime = performance.now()

  try {
    execSync('uncss dist/html/index.html dist/css/styles.css -o dist/css/temp.css --report', {
      stdio: 'pipe'
    })
  } catch (error) {
    console.error('Ошибка выполнения UnCSS:', error.message)
    return
  }

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log(`⏱️  Время выполнения: ${duration}s`)

  // Анализ файлов
  const htmlSize = execSync('wc -c < dist/html/index.html').toString().trim()
  const cssSize = execSync('wc -c < dist/css/styles.css').toString().trim()

  console.log(`📄 Размер HTML: ${Math.round(htmlSize / 1024)}KB`)
  console.log(`🎨 Размер CSS: ${Math.round(cssSize / 1024)}KB`)

  // Рекомендации
  if (parseFloat(duration) > 10) {
    console.log('\n💡 Рекомендации для ускорения:')
    console.log('• Уменьшите количество HTML файлов')
    console.log('• Используйте ignore паттерны для исключения ненужных селекторов')
    console.log('• Разделите обработку на чанки')
  }
}

performanceCheck()
```

#### Решения

1. **Оптимизировать HTML:**
```javascript
{
  uncss: {
    html: [
      './dist/html/index.html',  // Только главная страница
      // Исключить другие страницы если они похожи
    ]
  }
}
```

2. **Увеличить производительность:**
```javascript
{
  uncss: {
    timeout: 10000,  // Увеличить таймаут
    // Добавить больше ignore паттернов
    ignore: [
      /^unused-/,
      /^temp-/,
      /^debug-/
    ]
  }
}
```

3. **Кэширование результатов:**
```javascript
// scripts/cache-uncss.mjs
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { createHash } from 'crypto'

function getCacheKey(html, css) {
  const hash = createHash('md5')
  hash.update(html + css)
  return hash.digest('hex')
}

function cachedUnCSS(htmlPath, cssPath, outputPath) {
  const html = readFileSync(htmlPath, 'utf-8')
  const css = readFileSync(cssPath, 'utf-8')
  const cacheKey = getCacheKey(html, css)
  const cachePath = `./.cache/uncss-${cacheKey}.css`

  if (existsSync(cachePath)) {
    console.log('🎯 Используем кэшированный результат')
    execSync(`cp ${cachePath} ${outputPath}`)
    return
  }

  // Выполняем оптимизацию
  execSync(`uncss ${htmlPath} ${cssPath} -o ${outputPath}`)

  // Сохраняем в кэш
  execSync(`cp ${outputPath} ${cachePath}`)
  console.log('💾 Результат сохранен в кэш')
}
```

## 🛠️ Расширенная диагностика

### Создание диагностического отчета

```javascript
// scripts/diagnostic-report.mjs
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

class DiagnosticReporter {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      environment: {},
      files: {},
      optimization: {},
      issues: [],
      recommendations: []
    }
  }

  async generate() {
    console.log('🔍 Генерация диагностического отчета...')

    await this.collectEnvironmentInfo()
    await this.analyzeFiles()
    await this.testOptimization()
    this.analyzeIssues()
    this.generateRecommendations()

    writeFileSync('./diagnostic-report.json', JSON.stringify(this.report, null, 2))
    console.log('✅ Отчет сохранен: diagnostic-report.json')

    this.printSummary()
  }

  async collectEnvironmentInfo() {
    this.report.environment = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cwd: process.cwd()
    }

    try {
      this.report.environment.uncssVersion = execSync('uncss --version', {
        encoding: 'utf-8'
      }).trim()
    } catch (e) {
      this.report.environment.uncssVersion = 'unknown'
    }
  }

  async analyzeFiles() {
    const files = [
      'dist/html/index.html',
      'dist/css/index.css',
      'dist/css/clean.css'
    ]

    files.forEach(file => {
      try {
        const content = readFileSync(file, 'utf-8')
        this.report.files[file] = {
          size: content.length,
          lines: content.split('\n').length,
          exists: true
        }
      } catch (e) {
        this.report.files[file] = { exists: false }
      }
    })
  }

  async testOptimization() {
    try {
      const start = Date.now()
      execSync('uncss dist/html/index.html dist/css/index.css -o dist/css/test.css --report', {
        stdio: 'pipe'
      })
      const duration = Date.now() - start

      this.report.optimization = {
        duration,
        success: true
      }
    } catch (error) {
      this.report.optimization = {
        success: false,
        error: error.message
      }
    }
  }

  analyzeIssues() {
    const { files } = this.report

    // Проверяем размеры файлов
    if (files['dist/css/clean.css']?.size > files['dist/css/index.css']?.size * 0.8) {
      this.report.issues.push({
        type: 'poor_optimization',
        message: 'Оптимизация слабая - размер уменьшился менее чем на 20%'
      })
    }

    // Проверяем длительность
    if (this.report.optimization.duration > 5000) {
      this.report.issues.push({
        type: 'slow_performance',
        message: 'UnCSS работает слишком медленно (>5s)'
      })
    }
  }

  generateRecommendations() {
    this.report.issues.forEach(issue => {
      switch (issue.type) {
        case 'poor_optimization':
          this.report.recommendations.push(
            'Добавьте больше HTML файлов в анализ',
            'Проверьте ignore паттерны',
            'Убедитесь что все классы используются в HTML'
          )
          break

        case 'slow_performance':
          this.report.recommendations.push(
            'Уменьшите количество анализируемых файлов',
            'Добавьте больше ignore паттернов',
            'Используйте кэширование результатов'
          )
          break
      }
    })
  }

  printSummary() {
    console.log('\n📊 Сводка диагностики:')
    console.log(`Продолжительность: ${this.report.optimization.duration}ms`)
    console.log(`Оптимизация: ${this.calculateSavings()}%`)

    if (this.report.issues.length > 0) {
      console.log('\n⚠️  Найденные проблемы:')
      this.report.issues.forEach(issue => {
        console.log(`• ${issue.message}`)
      })
    }

    if (this.report.recommendations.length > 0) {
      console.log('\n💡 Рекомендации:')
      this.report.recommendations.forEach(rec => {
        console.log(`• ${rec}`)
      })
    }
  }

  calculateSavings() {
    const original = this.report.files['dist/css/index.css']?.size || 0
    const optimized = this.report.files['dist/css/clean.css']?.size || 0

    if (original === 0) return 0
    return Math.round((1 - optimized / original) * 100)
  }
}

new DiagnosticReporter().generate()
```

## 🎯 Профилактика проблем

### Автоматизированные проверки

```javascript
// scripts/pre-build-checks.mjs
function runPreBuildChecks() {
  const checks = [
    {
      name: 'HTML файлы существуют',
      check: () => existsSync('./dist/html/index.html'),
      fix: 'Запустите сборку HTML: bun run build:html'
    },
    {
      name: 'CSS файлы существуют',
      check: () => existsSync('./dist/css/index.css'),
      fix: 'Запустите сборку CSS: bun run build:css'
    },
    {
      name: 'UnCSS установлен',
      check: () => {
        try {
          execSync('uncss --version', { stdio: 'pipe' })
          return true
        } catch {
          return false
        }
      },
      fix: 'Установите UnCSS: bun add -D uncss'
    }
  ]

  let allPassed = true

  checks.forEach(({ name, check, fix }) => {
    const passed = check()
    console.log(`${passed ? '✅' : '❌'} ${name}`)

    if (!passed) {
      console.log(`   💡 Исправление: ${fix}`)
      allPassed = false
    }
  })

  if (!allPassed) {
    console.log('\n❌ Некоторые проверки не прошли. Исправьте проблемы перед продолжением.')
    process.exit(1)
  }

  console.log('\n✅ Все проверки пройдены!')
}

runPreBuildChecks()
```

### Мониторинг изменений

```javascript
// scripts/monitor-changes.mjs
import { readFileSync, writeFileSync, existsSync } from 'fs'

function monitorOptimizationChanges() {
  const historyFile = './optimization-history.json'
  const currentStats = {
    timestamp: new Date().toISOString(),
    originalSize: getFileSize('./dist/css/index.css'),
    optimizedSize: getFileSize('./dist/css/clean.css'),
    savings: 0
  }

  if (currentStats.originalSize && currentStats.optimizedSize) {
    currentStats.savings = Math.round(
      (1 - currentStats.optimizedSize / currentStats.originalSize) * 100
    )
  }

  // Загружаем историю
  let history = []
  if (existsSync(historyFile)) {
    history = JSON.parse(readFileSync(historyFile, 'utf-8'))
  }

  history.push(currentStats)

  // Оставляем только последние 10 записей
  if (history.length > 10) {
    history = history.slice(-10)
  }

  writeFileSync(historyFile, JSON.stringify(history, null, 2))

  // Анализируем тренд
  if (history.length >= 2) {
    const previous = history[history.length - 2]
    const change = currentStats.savings - previous.savings

    if (Math.abs(change) > 5) {
      console.log(`⚠️  Изменение оптимизации: ${change > 0 ? '+' : ''}${change}%`)
    }
  }

  console.log(`📊 Текущая оптимизация: ${currentStats.savings}%`)
}

function getFileSize(path) {
  try {
    return readFileSync(path).length
  } catch {
    return null
  }
}

monitorOptimizationChanges()
```

## 🚀 Заключение

Отладка UnCSS требует системного подхода:

1. **Включайте отчеты** для понимания что происходит
2. **Создавайте диагностические скрипты** для анализа проблем
3. **Тестируйте изменения** перед деплоем
4. **Мониторьте метрики** оптимизации
5. **Автоматизируйте проверки** в CI/CD

Правильная отладка позволяет быстро находить и решать проблемы, обеспечивая стабильную и эффективную оптимизацию CSS.
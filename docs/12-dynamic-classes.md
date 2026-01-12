# 12. Работа с динамическими классами

Одна из главных проблем UnCSS - работа с динамически генерируемыми классами в JavaScript фреймворках. Давайте разберемся, как правильно обрабатывать такие случаи.

## 🎯 Проблема динамических классов

### Когда UnCSS удаляет нужные стили

```tsx
// src/components/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Динамический класс на основе пропса
  const className = `status-${status}`

  return <div className={className}>Status</div>
}

// В HTML это станет:
// <div class="status-success">Status</div>
// <div class="status-error">Status</div>
// <div class="status-warning">Status</div>
```

UnCSS видит только статический HTML и не знает, что классы `status-error` и `status-warning` тоже используются!

## 🛠️ Решения для динамических классов

### 1. Игнорирование по паттернам

```javascript
// postcss.config.mjs
{
  uncss: {
    ignore: [
      // Игнорируем все статусы
      /^status-/,

      // Или конкретные паттерны
      /\.status-(success|error|warning)/,

      // Универсальный паттерн для динамических классов
      /^dynamic-/,
      /^state-/,
      /^variant-/
    ]
  }
}
```

### 2. Использование data-атрибутов

```tsx
// Лучший подход - использовать data-атрибуты
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div
      className="status-badge"
      data-status={status}  // UnCSS игнорирует data-атрибуты
    >
      Status
    </div>
  )
}

// CSS
.status-badge {
  @apply px-3 py-1 rounded-full text-sm font-medium;
}

.status-badge[data-status="success"] {
  @apply bg-green-100 text-green-800;
}

.status-badge[data-status="error"] {
  @apply bg-red-100 text-red-800;
}

.status-badge[data-status="warning"] {
  @apply bg-yellow-100 text-yellow-800;
}
```

### 3. Смешивание статических и динамических классов

```tsx
export function Button({ variant, size, loading }: ButtonProps) {
  return (
    <button
      className={cn(
        // Статические классы (всегда присутствуют)
        "btn inline-flex items-center justify-center",

        // Динамические классы (могут меняться)
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-loading': loading
        }
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
```

### 4. Создание карты всех возможных классов

```javascript
// scripts/generate-class-map.mjs
import { writeFileSync } from 'fs'

// Все возможные комбинации классов из вашего приложения
const classMap = {
  // Компоненты
  buttons: [
    'btn',
    'btn-primary', 'btn-secondary', 'btn-outline',
    'btn-sm', 'btn-md', 'btn-lg',
    'btn-loading', 'btn-disabled'
  ],

  // Статусы
  statuses: [
    'status-success', 'status-error', 'status-warning', 'status-info'
  ],

  // Состояния
  states: [
    'is-active', 'is-disabled', 'is-loading', 'is-open', 'is-closed',
    'has-error', 'has-success', 'has-warning'
  ],

  // Модификаторы
  modifiers: [
    'variant-primary', 'variant-secondary', 'variant-outline',
    'size-sm', 'size-md', 'size-lg'
  ]
}

// Генерируем HTML с всеми классами для UnCSS
function generateClassHTML() {
  const allClasses = Object.values(classMap).flat()

  return `
<!DOCTYPE html>
<html>
<head><title>Class Map</title></head>
<body>
  <div class="${allClasses.join(' ')}">
    This div contains all possible dynamic classes
  </div>
</body>
</html>
  `.trim()
}

writeFileSync('./dist/html/class-map.html', generateClassHTML())
console.log('✅ Создана карта классов: ./dist/html/class-map.html')
```

## 🎨 Продвинутые паттерны

### 1. CSS-in-JS анализ

```javascript
// scripts/analyze-css-in-js.mjs
import { readFileSync } from 'fs'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

// Анализируем исходный код на наличие динамических классов
function analyzeCSSinJS(filePath) {
  const code = readFileSync(filePath, 'utf-8')
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  })

  const dynamicClasses = new Set()

  traverse(ast, {
    // Находим строковые литералы в className
    JSXAttribute(path) {
      if (path.node.name.name === 'className') {
        if (path.node.value.type === 'StringLiteral') {
          // Статические классы
          path.node.value.value.split(' ').forEach(cls => {
            if (cls) dynamicClasses.add(cls)
          })
        } else if (path.node.value.type === 'JSXExpressionContainer') {
          // Динамические выражения
          extractClassesFromExpression(path.node.value.expression, dynamicClasses)
        }
      }
    },

    // Находим cn(), clsx() вызовы
    CallExpression(path) {
      if (path.node.callee.name === 'cn' || path.node.callee.name === 'clsx') {
        path.node.arguments.forEach(arg => {
          extractClassesFromExpression(arg, dynamicClasses)
        })
      }
    }
  })

  return Array.from(dynamicClasses)
}

function extractClassesFromExpression(node, classes) {
  switch (node.type) {
    case 'StringLiteral':
      node.value.split(' ').forEach(cls => {
        if (cls) classes.add(cls)
      })
      break

    case 'ObjectExpression':
      // { 'class-name': condition }
      node.properties.forEach(prop => {
        if (prop.key.type === 'StringLiteral') {
          classes.add(prop.key.value)
        }
      })
      break

    case 'ArrayExpression':
      // ['class1', 'class2']
      node.elements.forEach(el => {
        if (el.type === 'StringLiteral') {
          classes.add(el.value)
        }
      })
      break
  }
}

// Использование
const files = [
  './src/components/**/*.tsx',
  './src/pages/**/*.tsx'
]

const allDynamicClasses = new Set()

files.forEach(pattern => {
  // Используем glob для поиска файлов
  // Для каждого файла вызываем analyzeCSSinJS
})

console.log('🎯 Найденные динамические классы:', Array.from(allDynamicClasses))
```

### 2. Автоматическая генерация игнор-листа

```javascript
// scripts/generate-ignore-list.mjs
import { readFileSync, writeFileSync } from 'fs'
import glob from 'glob'

// Анализируем компоненты и генерируем паттерны для игнора
function generateIgnoreList() {
  const componentFiles = glob.sync('./src/components/**/*.tsx')
  const ignorePatterns = new Set([
    // Базовые паттерны
    '^data-',
    '^aria-',
    '\\.sr-only',
    '\\.focus-visible'
  ])

  componentFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8')

    // Ищем паттерны динамических классов
    const patterns = [
      // variant-${value}
      /variant-\$\{[^}]+\}/g,
      // size-${value}
      /size-\$\{[^}]+\}/g,
      // status-${value}
      /status-\$\{[^}]+\}/g,
      // is-${value}
      /is-\$\{[^}]+\}/g
    ]

    patterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          // Конвертируем в regex паттерн
          const regexPattern = match
            .replace(/\$\{[^}]+\}/g, '[a-zA-Z-]+')
            .replace(/\./g, '\\.')
          ignorePatterns.add(`^${regexPattern}`)
        })
      }
    })
  })

  // Создаем конфиг
  const config = {
    uncss: {
      ignore: Array.from(ignorePatterns).sort()
    }
  }

  writeFileSync('./uncss-ignore.config.json', JSON.stringify(config, null, 2))
  console.log('✅ Сгенерирован игнор-лист в uncss-ignore.config.json')
}

generateIgnoreList()
```

### 3. Интеграция с TypeScript

```typescript
// types/uncss.d.ts
declare module 'uncss' {
  interface UnCSSOptions {
    html?: string[]
    ignore?: Array<string | RegExp>
    media?: string[]
    timeout?: number
    report?: boolean
    ignoreSheets?: Array<string | RegExp>
    // Дополнительные опции для динамических классов
    dynamicClassPatterns?: string[]
    classMapFile?: string
  }

  function init(
    files: string | string[],
    options?: UnCSSOptions,
    callback?: (error: Error | null, output: string, report?: any) => void
  ): Promise<string>

  export = init
}
```

## 🧪 Тестирование динамических классов

### Создание тестового HTML

```javascript
// scripts/generate-test-html.mjs
import { writeFileSync } from 'fs'

function generateTestHTML() {
  // Все возможные комбинации классов
  const variants = ['primary', 'secondary', 'outline', 'ghost']
  const sizes = ['sm', 'md', 'lg', 'xl']
  const states = ['loading', 'disabled', 'active', 'hover']

  const combinations = []

  variants.forEach(variant => {
    sizes.forEach(size => {
      states.forEach(state => {
        combinations.push(`btn-${variant} btn-${size} is-${state}`)
      })
    })
  })

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Dynamic Classes</title>
</head>
<body>
  <div class="test-container">
    ${combinations.map(classes => `<button class="${classes}">Test</button>`).join('\n    ')}
  </div>

  <!-- Дополнительные тестовые элементы -->
  <div class="status-success">Success</div>
  <div class="status-error">Error</div>
  <div class="status-warning">Warning</div>

  <div class="modal is-open">Modal</div>
  <div class="dropdown is-active">Dropdown</div>
</body>
</html>
  `.trim()

  writeFileSync('./dist/html/test-classes.html', html)
  console.log('✅ Сгенерирован тестовый HTML: ./dist/html/test-classes.html')
}

generateTestHTML()
```

### Автоматизированное тестирование

```javascript
// scripts/test-uncss.mjs
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

async function testUnCSS() {
  console.log('🧪 Тестирование UnCSS с динамическими классами\n')

  // Генерируем тестовый HTML
  execSync('bun run generate-test-html')

  // Запускаем UnCSS
  execSync('uncss dist/html/test-classes.html dist/css/styles.css -o dist/css/test-output.css --report')

  // Анализируем результат
  const originalCSS = readFileSync('./dist/css/styles.css', 'utf-8')
  const optimizedCSS = readFileSync('./dist/css/test-output.css', 'utf-8')

  const stats = {
    original: {
      size: originalCSS.length,
      lines: originalCSS.split('\n').length
    },
    optimized: {
      size: optimizedCSS.length,
      lines: optimizedCSS.split('\n').length
    }
  }

  stats.savings = {
    size: ((1 - stats.optimized.size / stats.original.size) * 100).toFixed(1) + '%',
    lines: ((1 - stats.optimized.lines / stats.original.lines) * 100).toFixed(1) + '%'
  }

  console.log('📊 Результаты тестирования:')
  console.table(stats)

  // Проверяем, что все нужные классы остались
  const requiredClasses = [
    'btn-primary', 'btn-secondary', 'is-loading', 'status-success'
  ]

  const missingClasses = requiredClasses.filter(cls =>
    !optimizedCSS.includes(cls)
  )

  if (missingClasses.length > 0) {
    console.error('❌ Отсутствуют классы:', missingClasses)
    return false
  }

  console.log('✅ Все необходимые классы сохранены')
  return true
}

testUnCSS().then(success => {
  process.exit(success ? 0 : 1)
})
```

## 📋 Лучшие практики

### 1. Предсказуемые паттерны

```tsx
// ✅ Хорошо - предсказуемые паттерны
const variants = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white',
  outline: 'border border-blue-500 text-blue-500'
}

// ✅ Ещё лучше - CSS классы
const variants = {
  primary: 'variant-primary',
  secondary: 'variant-secondary'
}

/* CSS */
.variant-primary { @apply bg-blue-500 text-white; }
.variant-secondary { @apply bg-gray-500 text-white; }
```

### 2. Избегайте случайных классов

```tsx
// ❌ Плохо - случайные имена
const className = `custom-${Math.random()}`

// ✅ Хорошо - предопределенные варианты
const className = variants[variant] || variants.default
```

### 3. Документируйте динамические классы

```javascript
// uncss-dynamic-classes.config.js
export const dynamicClasses = {
  // Компонент Button
  button: [
    'btn-{variant}',     // btn-primary, btn-secondary
    'btn-{size}',        // btn-sm, btn-md, btn-lg
    'is-{state}'         // is-loading, is-disabled
  ],

  // Компонент Modal
  modal: [
    'modal',
    'modal-{size}',      // modal-sm, modal-lg
    'is-{visibility}'    // is-open, is-closed
  ]
}

// Генерируем паттерны для UnCSS
export function generateIgnorePatterns() {
  const patterns = []

  Object.values(dynamicClasses).forEach(componentClasses => {
    componentClasses.forEach(pattern => {
      // Конвертируем в regex: btn-{variant} -> ^btn-[a-zA-Z-]+$
      const regex = pattern
        .replace(/\{[^}]+\}/g, '[a-zA-Z-]+')
        .replace(/^\^?/, '^')
        .replace(/\$?$/, '$')

      patterns.push(regex)
    })
  })

  return patterns
}
```

## 🎯 Заключение

Работа с динамическими классами требует баланса между оптимизацией и функциональностью. Ключевые принципы:

1. **Используйте предсказуемые паттерны** для классов
2. **Документируйте все варианты** в конфигурации
3. **Генерируйте тестовый HTML** со всеми комбинациями
4. **Автоматизируйте анализ** исходного кода
5. **Тестируйте оптимизацию** на каждом билде

Правильная обработка динамических классов позволяет сохранить все нужные стили, минимизируя итоговый размер CSS файла.
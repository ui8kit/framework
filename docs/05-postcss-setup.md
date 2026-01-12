# 5. Интеграция PostCSS

PostCSS - это инструмент для обработки CSS с помощью JavaScript плагинов. Это позволяет трансформировать CSS код на лету.

## 📦 Установка PostCSS

### Шаг 1: Установка основных пакетов

```bash
# Основные плагины
bun add -D postcss autoprefixer cssnano

# Для работы с Tailwind
bun add -D @tailwindcss/postcss

# Для оптимизации
bun add -D uncss postcss-uncss
```

### Шаг 2: Создание конфигурации

```javascript
// postcss.config.mjs
export default {
  plugins: {
    // 1. Tailwind CSS - генерация утилит
    '@tailwindcss/postcss': {},

    // 2. Autoprefixer - вендорные префиксы
    autoprefixer: {
      grid: true,  // Поддержка CSS Grid
      flexbox: true  // Поддержка Flexbox
    },

    // 3. UnCSS - удаление неиспользуемых стилей
    uncss: {
      html: ['./dist/html/**/*.html'],
      ignore: [
        // Селекторы которые нужно игнорировать
        /^data-/,
        /^aria-/,
        /\.sr-only/,
        /\.focus-visible/
      ]
    },

    // 4. CSSNano - минификация (только для production)
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false
        }]
      }
    } : {})
  }
}
```

## ⚙️ Детальная настройка плагинов

### 1. @tailwindcss/postcss

```javascript
// В postcss.config.mjs
{
  '@tailwindcss/postcss': {
    // Путь к конфигурации Tailwind
    config: './tailwind.config.ts',

    // Режим разработки
    base: process.env.NODE_ENV === 'development'
  }
}
```

### 2. Autoprefixer

```javascript
{
  autoprefixer: {
    // Поддержка браузеров
    overrideBrowserslist: [
      '> 1%',
      'last 2 versions',
      'not dead',
      'not ie 11'
    ],

    // Дополнительные настройки
    grid: true,
    flexbox: 'no-2009',
    remove: false  // Не удалять старые префиксы
  }
}
```

### 3. UnCSS - самая важная часть

```javascript
{
  uncss: {
    // HTML файлы для анализа
    html: [
      './dist/html/**/*.html',
      './index.html'
    ],

    // Игнорировать эти селекторы
    ignore: [
      // Динамические классы
      /^data-/,
      /^aria-/,
      /^js-/,

      // Состояния доступности
      /\.sr-only/,
      /\.focus-visible/,

      // Медиа запросы
      /@media/
    ],

    // Дополнительные опции
    timeout: 1000,
    strictSSL: true,

    // Репорт для анализа
    report: process.env.NODE_ENV === 'development'
  }
}
```

### 4. CSSNano

```javascript
{
  cssnano: {
    preset: ['default', {
      // Настройки минификации
      discardComments: {
        removeAll: true
      },
      normalizeWhitespace: false,
      colormin: true,
      convertValues: true,
      discardDuplicates: true,
      discardEmpty: true,
      discardOverridden: true,
      mergeRules: true,
      minifySelectors: true,
      reduceTransforms: true
    }]
  }
}
```

## 🛠️ Интеграция с Vite.js

### Обновление vite.config.ts

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],

  css: {
    // PostCSS конфигурация
    postcss: './postcss.config.mjs',

    // Source maps для разработки
    devSourcemap: true,

    // Модульные стили
    modules: {
      localsConvention: 'camelCase'
    }
  },

  build: {
    // Минификация CSS
    cssMinify: process.env.NODE_ENV === 'production',

    rollupOptions: {
      output: {
        // Разделение CSS файлов
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return process.env.NODE_ENV === 'production'
              ? 'assets/[name]-[hash][extname]'
              : 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
```

## 🎯 Создание кастомных плагинов

### Пример плагина для анализа

```javascript
// postcss.config.mjs
import postcss from 'postcss'

const cssAnalyzer = postcss.plugin('css-analyzer', (options = {}) => {
  return (css) => {
    let ruleCount = 0
    let classCount = 0

    css.walkRules(rule => {
      ruleCount++
      classCount += rule.selector.split(',').length
    })

    console.log(`📊 CSS анализ:
      Правил: ${ruleCount}
      Селекторов: ${classCount}
      Размер: ${css.toString().length} байт`)
  }
})

export default {
  plugins: [
    // ... другие плагины
    cssAnalyzer()
  ]
}
```

## 🚀 Скрипты для работы с PostCSS

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:css": "postcss src/assets/css/index.css -o dist/css/styles.css",
    "optimize:css": "postcss dist/css/styles.css -o dist/css/optimized.css --env production",
    "analyze:css": "postcss src/assets/css/index.css --verbose",
    "clean:css": "uncss dist/html/index.html dist/css/styles.css -o dist/css/clean.css"
  }
}
```

## 📊 Мониторинг и анализ

### Создание скрипта анализа CSS

```javascript
// scripts/analyze-css.mjs
import fs from 'fs'
import postcss from 'postcss'

const css = fs.readFileSync('./dist/css/styles.css', 'utf-8')

const analyzer = postcss.plugin('analyzer', () => {
  return (root) => {
    const stats = {
      rules: 0,
      selectors: 0,
      declarations: 0,
      size: css.length
    }

    root.walkRules(rule => {
      stats.rules++
      stats.selectors += rule.selector.split(',').length
    })

    root.walkDecls(() => {
      stats.declarations++
    })

    console.table(stats)
  }
})

postcss([analyzer])
  .process(css, { from: undefined })
  .then(() => console.log('✅ Анализ завершён'))
```

## 🔧 Решение проблем

### Проблема: UnCSS не удаляет нужные стили

```javascript
// postcss.config.mjs
{
  uncss: {
    // Добавить игнорируемые селекторы
    ignore: [
      // Динамически добавляемые классы
      /\.active/,
      /\.open/,
      /\.visible/,

      // Классы от JavaScript библиотек
      /^swiper-/,
      /^modal-/,

      // Атрибуты
      /\[data-/
    ]
  }
}
```

### Проблема: CSS не минифицируется

```javascript
// Проверить переменную окружения
console.log('NODE_ENV:', process.env.NODE_ENV)

// В package.json
{
  "scripts": {
    "build": "NODE_ENV=production vite build"
  }
}
```

## 🎯 Результат оптимизации

После настройки PostCSS с UnCSS:

| Стадия | Размер | Оптимизация |
|--------|--------|-------------|
| Исходный Tailwind | 2,959 строк | - |
| После Autoprefixer | 2,980 строк | +0.7% |
| После UnCSS | 611 строк | **-79%** |
| После CSSNano | 580 строк | -5% |

## 🚀 Следующие шаги

Теперь у вас настроен PostCSS с цепочкой оптимизации. Следующий шаг - глубокое изучение UnCSS и его архитектуры.
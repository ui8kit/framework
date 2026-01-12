# 8. Конфигурация UnCSS

UnCSS имеет множество опций для тонкой настройки процесса оптимизации. Давайте разберем все доступные параметры.

## 📋 Основные опции

### HTML источники

```javascript
uncss(['index.html', 'about.html'], {
  // Файлы для анализа
  html: [
    './dist/**/*.html',     // Все HTML файлы
    './src/**/*.html',      // Исходники
    'https://example.com'   // URL (если нужно)
  ]
});
```

### Игнорирование селекторов

```javascript
{
  ignore: [
    // Регулярные выражения
    /^data-/,
    /^aria-/,
    /\.sr-only/,

    // Точные совпадения
    '.ignore-me',
    '#temp-id',

    // Динамические классы
    /\.is-/,
    /\.has-/,
    /\.js-/
  ]
}
```

### Стили и медиа-запросы

```javascript
{
  // Медиа-типы для обработки
  media: ['screen', 'print', 'all'],

  // Таймаут загрузки (мс)
  timeout: 1000,

  // Проверка SSL сертификатов
  strictSSL: true,

  // User-Agent для HTTP запросов
  userAgent: 'UnCSS/1.0.0'
}
```

## 🎯 Продвинутые опции

### Работа с путями

```javascript
{
  // Корневая папка для HTML
  htmlroot: './dist',

  // Папка для CSS файлов
  csspath: './css',

  // Баннеры в CSS для отладки
  banner: true
}
```

### CSS источники

```javascript
{
  // Прямые CSS файлы
  stylesheets: [
    'styles.css',
    'components.css'
  ],

  // Сырой CSS код
  raw: `
    .custom-class { color: red; }
    .another-class { font-size: 14px; }
  `,

  // Функция инъекции в страницу
  inject: function(window) {
    // Динамическое добавление стилей
    const style = window.document.createElement('style');
    style.textContent = '.dynamic { display: block; }';
    window.document.head.appendChild(style);
  }
}
```

### Отчеты и отладка

```javascript
{
  // Генерировать отчет
  report: true,

  // Функция для обработки отчета
  report: function(report) {
    console.log('UnCSS Report:');
    console.log('Used selectors:', report.selectors.used.length);
    console.log('Unused selectors:', report.selectors.unused.length);
  }
}
```

## 🛠️ Конфигурация в PostCSS

### postcss.config.mjs

```javascript
export default {
  plugins: {
    // Сначала генерируем CSS
    tailwindcss: {},

    // Потом оптимизируем
    uncss: {
      // HTML файлы для анализа
      html: [
        './dist/html/**/*.html',
        './index.html'
      ],

      // Игнорируемые селекторы
      ignore: [
        // Динамические классы
        /^data-/,
        /^aria-/,
        /\.js-/,
        /\.is-/,
        /\.has-/,

        // Состояния доступности
        /\.sr-only/,
        /\.focus-visible/,

        // Библиотеки
        /^swiper-/,
        /^modal-/,
        /^tooltip-/,

        // Tailwind состояния
        /\.hover:/,
        /\.focus:/,
        /\.active:/,
        /\.disabled:/,

        // Медиа-запросы
        /@media/
      ],

      // Медиа-типы
      media: ['screen', 'all'],

      // Таймаут
      timeout: 1000,

      // Отчет для анализа
      report: process.env.NODE_ENV === 'development'
    },

    // Минификация для production
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: 'default'
      }
    } : {})
  }
}
```

## 🎨 Конфигурация для разных сценариев

### Для React/Vue приложений

```javascript
{
  uncss: {
    html: ['./dist/**/*.html'],

    ignore: [
      // Динамические классы фреймворков
      /^v-/,
      /^data-v-/,
      /^router-link/,

      // React
      /^react-/,

      // События
      /\.onClick/,
      /\.onHover/
    ]
  }
}
```

### Для статических сайтов

```javascript
{
  uncss: {
    html: [
      './dist/index.html',
      './dist/about.html',
      './dist/contact.html'
    ],

    ignore: [
      // Навигация
      /\.active/,
      /\.current/,

      // Модальные окна
      /\.modal/,
      /\.overlay/,

      // Анимации
      /\.animate/,
      /\.fade/
    ]
  }
}
```

### Для больших проектов

```javascript
{
  uncss: {
    html: [
      './dist/**/*.html',
      '!./dist/admin/**/*.html'  // Исключить админку
    ],

    ignore: [
      // Общие паттерны
      /^admin-/,
      /^debug-/,

      // Третьи стороны
      /^ga-/,
      /^fb-/,
      /^twitter-/
    ],

    // Увеличенный таймаут
    timeout: 5000,

    // Пакетная обработка
    batchSize: 10
  }
}
```

## 🔧 Конфигурация через .uncssrc

### Файл .uncssrc

```json
{
  "html": ["./dist/**/*.html"],
  "ignore": [
    "/^data-/",
    "/^aria-/",
    ".ignore-me"
  ],
  "media": ["screen", "all"],
  "timeout": 1000,
  "strictSSL": true,
  "banner": true
}
```

### Использование

```javascript
// Автоматически загрузит .uncssrc
const uncss = require('uncss');

uncss(['index.html'], {
  uncssrc: '.uncssrc'  // Путь к файлу
});
```

## 📊 Анализ результатов

### Получение отчета

```javascript
uncss(['index.html'], {
  report: true
}, (error, output, report) => {
  console.log('📊 UnCSS Report:');
  console.log('Всего селекторов:', report.selectors.all.length);
  console.log('Используемых:', report.selectors.used.length);
  console.log('Неиспользуемых:', report.selectors.unused.length);
  console.log('Экономия:', Math.round(
    (report.selectors.unused.length / report.selectors.all.length) * 100
  ) + '%');
});
```

### Пример отчета

```
📊 UnCSS Report:
Всего селекторов: 1200
Используемых: 320
Неиспользуемых: 880
Экономия: 73%
```

## 🚨 Распространенные проблемы

### Проблема: UnCSS удаляет нужные стили

**Решение:**
```javascript
{
  ignore: [
    // Добавьте паттерн для динамических классов
    /\.dynamic-/,
    /\.js-/
  ]
}
```

### Проблема: Медленная обработка

**Решение:**
```javascript
{
  // Увеличьте таймаут
  timeout: 5000,

  // Ограничьте количество файлов
  html: ['./dist/index.html'], // Только главная

  // Кэширование
  cache: true
}
```

### Проблема: Неправильные пути

**Решение:**
```javascript
{
  htmlroot: './dist',
  csspath: './css'
}
```

## 🎯 Рекомендуемая конфигурация

### Для production

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    uncss: {
      html: ['./dist/**/*.html'],
      ignore: [
        /^data-/,
        /^aria-/,
        /\.sr-only/,
        /\.focus-visible/,
        /\.js-/,
        /\.is-/,
        /\.has-/,
        /^v-/,
        /^router-link/
      ],
      media: ['screen', 'all'],
      timeout: 3000,
      report: false
    },
    cssnano: {
      preset: 'default'
    }
  }
}
```

### Для разработки

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    uncss: {
      html: ['./dist/**/*.html'],
      ignore: [
        // Все игнорируемые паттерны
      ],
      report: true,
      timeout: 1000
    }
  }
}
```

## 🔄 Командная строка

### Базовые команды

```bash
# Простая очистка
uncss index.html styles.css > clean.css

# С опциями
uncss --ignore '.temp' --media screen index.html styles.css

# С отчетом
uncss --report index.html styles.css

# Из stdin
cat styles.css | uncss index.html > clean.css
```

### Продвинутые опции

```bash
# Множественные HTML
uncss index.html about.html styles.css

# С конфигом
uncss --config config.json index.html styles.css

# Только определенные стили
uncss --stylesheets styles.css index.html
```

Эта конфигурация позволяет добиться максимальной оптимизации CSS при сохранении всех необходимых стилей.
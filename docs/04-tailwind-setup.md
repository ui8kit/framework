# 4. Конфигурация Tailwind CSS

Tailwind CSS - это утилитарный CSS фреймворк, который генерирует тысячи классов для быстрой разработки интерфейсов.

## 📦 Установка Tailwind CSS

### Шаг 1: Установка пакетов

```bash
# Установка Tailwind CSS 4
bun add -D @tailwindcss/cli tailwindcss

# Дополнительные плагины
bun add -D @tailwindcss/typography @tailwindcss/forms
```

### Шаг 2: Инициализация конфигурации

```bash
# Создание конфигурационных файлов
npx tailwindcss init -p
```

Будут созданы:
- `tailwind.config.js` - конфигурация Tailwind
- `postcss.config.mjs` - конфигурация PostCSS

## ⚙️ Конфигурация Tailwind

### tailwind.config.ts

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{html,liquid}",
    "./dist/html/**/*.html"  // Для анализа UnCSS
  ],

  theme: {
    extend: {
      // Ваши кастомные настройки
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
  },

  plugins: [
    // Дополнительные плагины
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],

  // Отключаем неиспользуемые фичи для оптимизации
  corePlugins: {
    // Отключаем редко используемые
    container: false,  // Мы будем использовать свой
    accessibility: false,
    pointerEvents: false,
    visibility: false,
    position: false,
    isolation: false,
    zIndex: false,
    order: false,
    float: false,
    clear: false,
    objectFit: false,
    objectPosition: false,
    overflow: false,
    overscrollBehavior: false,
    scrollBehavior: false,
    scrollPadding: false,
    listStyleType: false,
    appearance: false,
    columns: false,
    breakBefore: false,
    breakInside: false,
    breakAfter: false,
    gridAutoColumns: false,
    gridAutoFlow: false,
    gridAutoRows: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
    flexDirection: false,
    flexWrap: false,
    placeContent: false,
    placeItems: false,
    alignContent: false,
    alignItems: false,
    justifyContent: false,
    justifyItems: false,
    gap: false,
    space: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
    divideOpacity: false,
    placeSelf: false,
    alignSelf: false,
    justifySelf: false
  }
}
```

## 🎨 Создание CSS файлов

### src/assets/css/tailwind.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Кастомные компоненты */
@layer components {
  .btn {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }

  .card {
    @apply bg-white shadow-md rounded-lg p-6;
  }
}

/* Кастомные утилиты */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### src/assets/css/index.css - точка входа

```css
/* Импорт Tailwind */
@import "./tailwind.css";

/* Дизайн токены (shadcn/ui или ваши) */
@import "./shadcn.css";

/* Глобальные стили */
@import "./globals.css";
```

### src/assets/css/shadcn.css - дизайн токены

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 187.1 95.8% 42.8%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 187.1 95.8% 42.8%;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 🛠️ Настройка PostCSS

### postcss.config.mjs

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // UnCSS будет добавлен позже
  },
}
```

## 🎯 Использование в компонентах

### Пример React компонента

```tsx
// src/components/Button.tsx
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Базовые стили
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",

        // Варианты размера
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg'
        },

        // Варианты цвета
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary'
        },

        className
      )}
      {...props}
    />
  )
}
```

### Использование компонента

```tsx
// src/App.tsx
import { Button } from './components/Button'

export function App() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Мой проект</h1>

      <Button variant="primary" size="lg">
        Большая кнопка
      </Button>

      <Button variant="secondary" size="sm">
        Маленькая кнопка
      </Button>
    </div>
  )
}
```

## 🏗️ Сборка и анализ

### Проверка генерации CSS

```bash
# Сборка проекта
bun run build

# Проверка размера CSS
ls -la dist/assets/
# index-abc123.css - это ваш Tailwind CSS
```

### Анализ содержимого

```bash
# Посмотреть что сгенерировал Tailwind
head -50 dist/assets/index-*.css
tail -50 dist/assets/index-*.css
```

### Проверка количества классов

```bash
# Подсчет строк в CSS
wc -l dist/assets/index-*.css
# Ожидаемый результат: ~2000-3000 строк
```

## 🎯 Оптимизация конфигурации

### Для минимального бандла

Если хотите ещё больше оптимизировать:

```typescript
// tailwind.config.ts - минимальная версия
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  // Только самые необходимые утилиты
  corePlugins: {
    // Включить только то, что используете
    margin: true,
    padding: true,
    backgroundColor: true,
    textColor: true,
    fontSize: true,
    borderRadius: true,
    display: true,
    flex: true,
    // ... остальные false
  }
}
```

## 🚀 Следующие шаги

Теперь у вас настроен Tailwind CSS. Следующий шаг - интеграция PostCSS для обработки и оптимизации CSS.
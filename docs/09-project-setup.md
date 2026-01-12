# 9. Создание тестового проекта

Давайте создадим тестовый проект с нуля, чтобы увидеть UnCSS в действии. Мы создадим простой сайт с Tailwind CSS и оптимизируем его.

## 🚀 Создание проекта

### Шаг 1: Инициализация

```bash
# Создаем новый проект
mkdir uncss-demo
cd uncss-demo

# Инициализируем package.json
bun init -y

# Устанавливаем зависимости
bun add -D vite @vitejs/plugin-react-swc react react-dom typescript
bun add -D tailwindcss postcss autoprefixer uncss @tailwindcss/cli
bun add lucide-react class-variance-authority clsx tailwind-merge
```

### Шаг 2: Структура проекта

```
uncss-demo/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── css/
│   │       ├── index.css
│   │       └── shadcn.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── vite.config.ts
```

## ⚙️ Настройка конфигураций

### package.json

```json
{
  "name": "uncss-demo",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:css": "postcss src/assets/css/index.css -o dist/css/styles.css",
    "optimize:css": "uncss dist/html/index.html -o dist/css/clean.css",
    "build:optimized": "bun run build && bun run optimize:css",
    "preview": "vite preview",
    "analyze": "bun run build:optimized && ls -la dist/css/"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.1.9",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.9",
    "typescript": "~5.8.3",
    "uncss": "^0.17.3",
    "vite": "^6.3.5"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^2.5.4"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  css: {
    postcss: './postcss.config.mjs',
    devSourcemap: true
  },

  build: {
    outDir: 'dist/html',
    assetsDir: '../assets',
    cssMinify: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return '../css/[name]-[hash][extname]'
          }
          return '../assets/[name]-[hash][extname]'
        },
        chunkFileNames: '../js/[name]-[hash].js',
        entryFileNames: '../js/[name]-[hash].js'
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./dist/html/**/*.html"
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    },
  },

  plugins: []
} satisfies Config
```

### postcss.config.mjs

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      uncss: {
        html: ['./dist/html/**/*.html'],
        ignore: [
          /^data-/,
          /^aria-/,
          /\.sr-only/
        ],
        report: true
      },
      cssnano: {
        preset: 'default'
      }
    } : {})
  }
}
```

## 🎨 Создание компонентов

### src/assets/css/index.css

```css
@import "tailwindcss";

@layer base {
  html {
    font-family: 'Inter', sans-serif;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

### src/assets/css/shadcn.css

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --primary: 187.1 95.8% 42.8%;
  --primary-foreground: 0 0% 100%;
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

### src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### src/components/ui/Button.tsx

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### src/components/ui/Card.tsx

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
```

### src/components/index.ts

```typescript
export { Button } from './ui/Button'
export { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
```

## 🏗️ Создание страниц

### public/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UnCSS Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### src/main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### src/App.tsx

```tsx
import { Button } from './components'
import { Card, CardHeader, CardTitle, CardContent } from './components'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Заголовок */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            UnCSS Demo Project
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Демонстрация оптимизации CSS с помощью UnCSS. Этот проект показывает,
            как сократить размер CSS файла на 80% без потери функциональности.
          </p>
        </div>

        {/* Карточки с компонентами */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Кнопки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="default">Обычная кнопка</Button>
              <Button variant="secondary">Вторичная кнопка</Button>
              <Button variant="outline">Контурная кнопка</Button>
              <Button size="sm">Маленькая кнопка</Button>
              <Button size="lg">Большая кнопка</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Типографика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-semibold">Заголовок H2</h2>
              <h3 className="text-xl font-medium">Заголовок H3</h3>
              <p className="text-base">
                Обычный текст с <strong className="font-semibold">выделением</strong> и
                <em className="italic">курсивом</em>.
              </p>
              <p className="text-sm text-muted-foreground">
                Мелкий текст для дополнительной информации.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Раскладка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary text-primary-foreground p-4 rounded">
                  Колонка 1
                </div>
                <div className="bg-secondary text-secondary-foreground p-4 rounded">
                  Колонка 2
                </div>
                <div className="bg-accent text-accent-foreground p-4 rounded">
                  Колонка 3
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Формы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="your@email.com"
                />
              </div>
              <Button type="submit" className="w-full">
                Отправить
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Футер */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Этот проект демонстрирует мощь UnCSS в оптимизации CSS.
            Сравните размеры файлов до и после оптимизации!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
```

## 🚀 Тестирование

### Запуск разработки

```bash
# Запуск dev сервера
bun run dev

# Откройте http://localhost:5173
```

### Сборка и оптимизация

```bash
# Полная сборка с оптимизацией
bun run build:optimized

# Анализ результатов
bun run analyze
```

### Сравнение размеров

```bash
# Проверка размеров файлов
ls -la dist/css/

# Вывод будет примерно таким:
# -rw-r--r-- 1 user staff 127KB Jan 12 12:00 index-abc123.css  # Оригинальный
# -rw-r--r-- 1 user staff  18KB Jan 12 12:00 clean.css         # Оптимизированный
```

## 📊 Результаты

После запуска вы увидите:

### До оптимизации
- **CSS файл**: ~127 KB (2,959 строк)
- **Lighthouse Score**: ~85/100
- **Unused CSS**: ~80%

### После UnCSS
- **CSS файл**: ~18 KB (611 строк)
- **Lighthouse Score**: ~98/100
- **Unused CSS**: ~0%

## 🔧 Отладка

### Если что-то не работает

1. **Проверьте HTML структуру**
```bash
cat dist/html/index.html | head -20
```

2. **Проверьте CSS**
```bash
head -10 dist/css/index-*.css
```

3. **Запустите с отчетом**
```bash
uncss dist/html/index.html dist/css/index-*.css --report
```

### Распространенные проблемы

- **Классы не находятся**: Проверьте `ignore` опции в конфиге
- **Файлы не создаются**: Проверьте пути в `vite.config.ts`
- **Стили не применяются**: Проверьте порядок плагинов в PostCSS

## 🎯 Следующие шаги

Теперь у вас есть рабочий проект! Попробуйте:

1. **Добавить новые компоненты**
2. **Протестировать разные конфигурации UnCSS**
3. **Измерить производительность**
4. **Добавить больше страниц**

Этот проект - отличная основа для понимания, как UnCSS оптимизирует CSS в реальных приложениях.
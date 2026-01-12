# 3. Установка и настройка Vite.js

Vite.js - это современный bundler, который обеспечивает быструю разработку и оптимизированную сборку для production.

## 🚀 Установка Vite.js

### Шаг 1: Создание нового проекта

```bash
# Создаем новый проект
bun create vite my-app --template react-ts
cd my-app

# Или добавляем к существующему
bun add -D vite @vitejs/plugin-react-swc typescript
```

### Шаг 2: Базовая конфигурация

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

## 📁 Структура проекта

```
my-app/
├── public/           # Статические файлы
├── src/
│   ├── assets/       # CSS, изображения
│   ├── components/   # React компоненты
│   ├── App.tsx       # Главный компонент
│   └── main.tsx      # Точка входа
├── dist/            # Сборка (после build)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── vite.config.ts
```

## ⚙️ Настройка для CSS оптимизации

### Конфигурация для работы с Tailwind + UnCSS

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // Пути для CSS
  css: {
    postcss: './postcss.config.mjs',
    devSourcemap: true
  },

  build: {
    // Отдельная папка для HTML
    outDir: 'dist/html',
    assetsDir: '../assets',

    // Не минифицировать CSS (сделаем это через PostCSS)
    cssMinify: false,

    rollupOptions: {
      output: {
        // Разделяем CSS и JS
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

  // Алиасы для импортов
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
})
```

## 🎨 Настройка CSS сборки

### Файловая структура для CSS

```
src/
├── assets/
│   └── css/
│       ├── index.css          # Главный CSS файл
│       ├── tailwind.css       # Директивы Tailwind
│       └── shadcn.css         # Дизайн токены
├── components/
│   └── ui/                    # UI компоненты
└── styles/
    └── globals.css            # Глобальные стили
```

### index.css - точка входа

```css
/* src/assets/css/index.css */
@import "tailwindcss";

/* Ваши кастомные стили */
@import "./shadcn.css";
```

### Использование в main.tsx

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/index.css'  // Импорт CSS
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 🛠️ Скрипты в package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:css": "vite build --mode css-only",
    "preview": "vite preview",
    "generate": "bun run build && bun run optimize-css",
    "optimize-css": "uncss dist/html/index.html -o dist/html/assets/clean.css"
  }
}
```

## 🔧 Настройка TypeScript

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## 🚀 Запуск и разработка

### Режим разработки

```bash
# Запуск dev сервера
bun run dev

# С горячей перезагрузкой
# Автоматически перестраивает при изменениях
```

### Сборка для production

```bash
# Полная сборка
bun run build

# Только CSS
bun run build:css
```

## 🔍 Проверка результатов

После сборки проверьте структуру файлов:

```
dist/
├── html/
│   ├── index.html
│   └── assets/
│       ├── clean.css    # Оптимизированный CSS
│       └── index-*.js
├── css/
│   └── index-*.css      # Оригинальный CSS
└── assets/
    └── index-*.js       # JavaScript
```

## 🎯 Следующие шаги

Теперь у вас настроен Vite.js. Следующий шаг - настройка Tailwind CSS для генерации утилитарных классов.
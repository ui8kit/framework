# Partials

Переиспользуемые части компоновки (шапка, подвал, сайдбар) для структурирования приложения.

## Структура

```
partials/
├── Header.tsx    # Шапка с навигацией и темой
├── Footer.tsx    # Подвал с разделами ссылок
└── Sidebar.tsx   # Сайдбар для контента
```

## Использование

### Header

```tsx
import { Header } from '@/partials/Header'

<Header 
  title="UI8Kit"
  subtitle="Design System"
  navItems={[
    { id: 'home', title: 'Home', url: '/' },
    { id: 'blog', title: 'Blog', url: '/blog' },
  ]}
/>
```

**Props:**
- `title`: Название бренда (default: 'UI8Kit')
- `subtitle`: Подзаголовок бренда (default: 'Design System')
- `navItems`: Массив элементов навигации

**Особенности:**
- ✅ Автоматическое определение мобильного устройства
- ✅ Меню на мобильных в Sheet компоненте
- ✅ Кнопка переключения темы (Sun/Moon)
- ✅ SearchBar в мобильном меню

### Footer

```tsx
import { Footer } from '@/partials/Footer'

<Footer 
  copyright="© 2025 UI8Kit Design System"
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
      ]
    }
  ]}
/>
```

**Props:**
- `copyright`: Текст копирайта (default: '© 2025 UI8Kit Design System. All rights reserved.')
- `sections`: Массив секций с ссылками

**Особенности:**
- ✅响应式layout с flex-wrap
- ✅ Красивая типография для ссылок
- ✅ Семантический HTML (footer, nav)

### Sidebar

```tsx
import { Sidebar } from '@/partials/Sidebar'

<Sidebar position="right">
  <SearchBar />
  <CategoryList items={categories} />
  <PopularPosts />
</Sidebar>
```

**Props:**
- `children`: Контент для сайдбара
- `position`: 'left' | 'right' (default: 'right')

**Особенности:**
- ✅ Минимальный компонент для гибкости
- ✅ Используется с Grid в MainLayout
- ✅ Правильная семантика (aside)

## Архитектура

Все партиалы:
- ✅ Используют `@ui8kit/core` компоненты (Block, Container, Group, Stack)
- ✅ Имеют `data-class` для CSS генерации
- ✅ Семантический HTML (header, footer, aside)
- ✅ Поддерживают темизацию через `useTheme()`
- ✅ Типизированы через TypeScript

## Интеграция с MainLayout

Все партиалы интегрируются в `MainLayout`:

```tsx
import { MainLayout } from '@/layouts/MainLayout'

<MainLayout
  navItems={navItems}
  footerSections={footerSections}
  sidebar={<YourSidebar />}
>
  {children}
</MainLayout>
```

## CSS Generation

Каждый партиал имеет data-class для CSS генерации:

- `data-class="header"` — главная шапка
- `data-class="header-brand"` — логотип
- `data-class="header-nav"` — основная навигация
- `data-class="header-controls"` — управление (тема, меню)
- `data-class="footer"` — главный подвал
- `data-class="footer-sections"` — секции ссылок
- `data-class="sidebar"` — главный сайдбар

Это позволяет легко стилизировать части через CSS.

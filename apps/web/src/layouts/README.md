# Layouts

Главные макеты приложения для структурирования страниц.

## Структура

```
layouts/
├── MainLayout.tsx    # Главный макет с header, footer, sidebar
└── DashLayout.tsx    # Макет для админ-панели (дополнительный)
```

## MainLayout

Основной макет для большинства страниц приложения.

### Использование

```tsx
import { MainLayout } from '@/layouts/MainLayout'

<MainLayout
  mode="with-sidebar"
  navItems={navItems}
  footerSections={footerSections}
  sidebar={<SidebarContent />}
  headerTitle="UI8Kit"
  headerSubtitle="Design System"
>
  <YourPageContent />
</MainLayout>
```

### Props

```typescript
type MainLayoutProps = {
  children: ReactNode                    // Основной контент
  mode?: 'full' | 'with-sidebar' | 'sidebar-left'  // Вариант макета
  sidebar?: ReactNode                    // Контент для сайдбара
  navItems?: NavItem[]                   // Элементы навигации
  footerSections?: FooterSection[]       // Секции подвала
  headerTitle?: string                   // Название бренда
  headerSubtitle?: string                // Подзаголовок
  footerCopyright?: string              // Текст копирайта
  showHeader?: boolean                   // Показать шапку
  showFooter?: boolean                   // Показать подвал
}
```

### Режимы

#### 1. `full` — Полная ширина

Без сайдбара, контент занимает всю ширину.

```tsx
<MainLayout mode="full">
  <Content />
</MainLayout>
```

**Grid структура:**
```
┌─────────────────────────────────┐
│         Full Width              │
├─────────────────────────────────┤
│    cols: 1 (полная ширина)      │
└─────────────────────────────────┘
```

#### 2. `with-sidebar` — С сайдбаром справа (default)

Сайдбар справа, контент слева (2:1 соотношение 2 колонки контента / 1 колонка сайдбара).

```tsx
<MainLayout mode="with-sidebar" sidebar={<Sidebar />}>
  <Content />
</MainLayout>
```

**Grid структура:**
```
┌────────────────────────┬──────────┐
│   Content (2 cols)     │ Sidebar  │
│                        │  (1 col) │
├────────────────────────┼──────────┤
│ grid-cols-3 gap-8      │          │
│ col-span-2             │ col-span-1
└────────────────────────┴──────────┘

Десктоп (3 колонки):
- Контент: 2 колонки (66%)
- Сайдбар: 1 колонка (33%)

Мобайл (адаптивный через Tailwind):
- Обе части по полной ширине, сайдбар под контентом
```

**Таблица адаптивности:**
| Разрешение | Grid | Content | Sidebar |
|-----------|------|---------|---------|
| Desktop (≥768px) | grid-cols-3 | col-span-2 (66%) | col-span-1 (33%) |
| Mobile (<768px) | grid-cols-1 | col-span-1 (100%) | col-span-1 (100%) |

#### 3. `sidebar-left` — С сайдбаром слева

Сайдбар слева, контент справа (1:2 соотношение 1 колонка сайдбара / 2 колонки контента).

```tsx
<MainLayout mode="sidebar-left" sidebar={<Sidebar />}>
  <Content />
</MainLayout>
```

**Grid структура:**
```
┌──────────┬────────────────────────┐
│ Sidebar  │   Content (2 cols)     │
│  (1 col) │                        │
├──────────┼────────────────────────┤
│ col-span-1| col-span-2            │
│ order-1  │ order-2                │
└──────────┴────────────────────────┘

Десктоп (3 колонки):
- Сайдбар: 1 колонка (33%)
- Контент: 2 колонки (66%)

Мобайл (адаптивный):
- Обе части по полной ширине, контент перед сайдбаром
```

### Grid Props

Использованные пропсы ui8kit для правильной адаптивности:

```tsx
<Grid 
  grid="cols-3"           // 3 колонки на десктопе (md и выше)
  gap="8"                 // gap: 2rem между элементами
  data-class="main-layout-grid"
  className="md:grid-cols-3 grid-cols-1"  // Мобайл: 1 колонка, Десктоп: 3 колонки
>
  {/* Content Column */}
  <Stack 
    col="span-2"                           // 2 колонки из 3 на десктопе = 66%
    gap="6"
    order={isSidebarLeft ? "2" : "1"}
    data-class="main-layout-main"
    className="md:col-span-2 col-span-1"   // Мобайл: 1 колонка (full), Десктоп: 2 колонки
  >
    {children}
  </Stack>

  {/* Sidebar Column */}
  <Stack
    col="span-1"                            // 1 колонка из 3 на десктопе = 33%
    order={isSidebarLeft ? "1" : "2"}
    data-class="main-layout-sidebar-wrapper"
    className="md:col-span-1 col-span-1"   // Мобайл: 1 колонка (full), Десктоп: 1 колонка
  >
    <Sidebar>
      {sidebar}
    </Sidebar>
  </Stack>
</Grid>
```

### Медиа-запросы (Tailwind)

```
md:grid-cols-3    → На md (≥768px): 3 колонки
grid-cols-1       → На мобайле (<768px): 1 колонка

md:col-span-2     → На md: контент занимает 2 колонки (66%)
col-span-1        → На мобайле: 1 колонка (full width)

md:col-span-1     → На md: сайдбар занимает 1 колонку (33%)
col-span-1        → На мобайле: 1 колонка (full width)
```

## Визуализация адаптивности

### Десктоп (with-sidebar, md≥768px)

```
┌─────────────────────────────────────────────┐
│              Header                         │
├────────────────────────┬────────────────────┤
│                        │                    │
│  Content (col-span-2)  │ Sidebar (col-span-1)
│  66% ширины            │ 33% ширины         │
│  order-1 (default)     │ order-2 (default)  │
│                        │                    │
├────────────────────────┴────────────────────┤
│              Footer                         │
└─────────────────────────────────────────────┘
```

### Мобайл (with-sidebar, <768px)

```
┌──────────────────────┐
│      Header          │
├──────────────────────┤
│                      │
│ Content (col-span-1) │
│ 100% ширины          │
│ order-1              │
│                      │
├──────────────────────┤
│ Sidebar (col-span-1) │
│ 100% ширины          │
│ order-2              │
├──────────────────────┤
│      Footer          │
└──────────────────────┘
```

### Desktop sidebar-left (md≥768px)

```
┌─────────────────────────────────────────────┐
│              Header                         │
├────────────────────┬────────────────────────┤
│                    │                        │
│ Sidebar (col-span-1)│ Content (col-span-2)
│ 33% ширины         │ 66% ширины             │
│ order-1            │ order-2                │
│                    │                        │
├────────────────────┴────────────────────────┤
│              Footer                         │
└─────────────────────────────────────────────┘
```

### Мобайл sidebar-left (<768px)

```
┌──────────────────────┐
│      Header          │
├──────────────────────┤
│ Content (col-span-1) │
│ 100% ширины          │
│ order-2              │
├──────────────────────┤
│ Sidebar (col-span-1) │
│ 100% ширины          │
│ order-1              │
├──────────────────────┤
│      Footer          │
└──────────────────────┘
```

---

## Адаптивность

Адаптивность достигается через комбинацию ui8kit пропсов и Tailwind CSS классов:

### Как это работает

1. **ui8kit пропсы** устанавливают базовые значения:
   - `grid="cols-3"` — базовая структура для Grid
   - `col="span-2"` — базовое распределение для контента
   - `col="span-1"` — базовое распределение для сайдбара

2. **Tailwind className** переопределяют на мобайле:
   - `className="md:grid-cols-3 grid-cols-1"` → Grid
   - `className="md:col-span-2 col-span-1"` → Content
   - `className="md:col-span-1 col-span-1"` → Sidebar

3. **Результат**:
   - **Desktop (md≥768px)**: 3 колонки (2+1) — контент 66%, сайдбар 33%
   - **Mobile (<768px)**: 1 колонка — контент 100%, сайдбар под ним 100%

### Breakpoints (Tailwind)

- **xs** — <640px (мобильные телефоны)
- **sm** — ≥640px (большие телефоны)
- **md** — ≥768px (планшеты и выше) ← **используется в MainLayout**
- **lg** — ≥1024px (десктопы)
- **xl** — ≥1280px (большие десктопы)
- **2xl** — ≥1536px (очень большие экраны)

### Order для sidebar-left

При использовании `mode="sidebar-left"`:
- Сайдбар получает `order={true ? "1" : "2"}` → `order-1` (первым)
- Контент получает `order={true ? "2" : "1"}` → `order-2` (вторым)

Это переворачивает порядок элементов в Grid.

### Таблица адаптивности

| Разрешение | Grid | Content | Sidebar | Использование |
|-----------|------|---------|---------|---|
| Desktop (≥768px) | grid-cols-3 | col-span-2 (66%) | col-span-1 (33%) | Основная верстка |
| Mobile (<768px) | grid-cols-1 | col-span-1 (100%) | col-span-1 (100%) | Мобильная верстка |

### Data Classes

Для CSS генерации используются следующие data-class:

```
main-layout                    # Главный контейнер (Stack с gap-0)
├── main-layout-header        # Шапка
├── main-layout-content       # Основной контент (Block main)
│   ├── main-layout-container # Контейнер (max-width + padding)
│   ├── main-layout-grid      # Grid контейнер (when sidebar)
│   │   ├── main-layout-main     # Основной контент (col-span-2)
│   │   └── main-layout-sidebar-wrapper  # Обертка сайдбара (col-span-1)
│   └── main-layout-full      # Полная ширина (no sidebar)
└── main-layout-footer        # Подвал
```

### Пример с реальными данными

```tsx
import { MainLayout } from '@/layouts/MainLayout'
import { menu } from '@/~data/wpfasty/context'
import { SearchBar, CategoryList, PopularPosts } from '@/components'

const navItems = menu.primary.items.map(item => ({
  id: `nav-${item.id}`,
  title: item.title,
  url: item.url,
}))

const footerSections = [
  { title: 'Product', links: [...] },
  { title: 'Company', links: [...] },
]

const SidebarContent = () => (
  <Stack gap="6">
    <SearchBar />
    <CategoryList items={categories} />
    <PopularPosts />
  </Stack>
)

export default function App() {
  return (
    <MainLayout
      mode="with-sidebar"
      navItems={navItems}
      footerSections={footerSections}
      sidebar={<SidebarContent />}
    >
      <Outlet />
    </MainLayout>
  )
}
```

## DashLayout

Специализированный макет для админ-панели (может быть использован позже).

## Архитектура

### Компонирование

MainLayout использует:
- ✅ `Header` из partials
- ✅ `Footer` из partials
- ✅ `Sidebar` из partials
- ✅ `Container`, `Grid`, `Stack` из @ui8kit/core

### Responsive Design

Макет полностью адаптивен благодаря правильным пропсам Grid:

- **col="span-2"** — контент занимает 2 из 3 колонок (66%)
- **col="span-1"** — сайдбар занимает 1 из 3 колонок (33%)
- **order prop** — переворот элементов для sidebar-left режима
- **Tailwind автоматизм** — мобайл адаптивность встроена

### CSS Generation

Все слои макета имеют data-class для генерации CSS:

```css
/* Auto-generated from data-class */
[data-class="main-layout"] { /* styles */ }
[data-class="main-layout-header"] { /* styles */ }
[data-class="main-layout-content"] { /* styles */ }
[data-class="main-layout-grid"] { /* styles */ }
[data-class="main-layout-main"] { /* styles */ }
[data-class="main-layout-sidebar-wrapper"] { /* styles */ }
[data-class="main-layout-footer"] { /* styles */ }
```

## Best Practices

1. ✅ Используйте в App.tsx как главный оборот
2. ✅ Передавайте навигацию из контекста (menu)
3. ✅ Кастомизируйте Footer через footerSections
4. ✅ Используйте режимы для разных типов страниц:
   - `full` для landing pages, одноколончного контента
   - `with-sidebar` для blog, архивов с боковыми виджетами
   - `sidebar-left` для альтернативной верстки
5. ✅ Сайдбар должен быть легким и быстрым
6. ✅ Используйте `col="span-X"` для правильного grid распределения
7. ✅ На мобайле (<768px) автоматически переходит на 1 колонку

## Верстка и адаптивность

### Правильное использование Grid

```tsx
// ❌ Неправильно (контент получит 1/3 вместо 2/3)
<Grid grid="cols-1">
  <Stack>{content}</Stack>
  <Stack>{sidebar}</Stack>
</Grid>

// ✅ Правильно (контент получит 2/3)
<Grid grid="cols-3">
  <Stack col="span-2">{content}</Stack>
  <Stack col="span-1">{sidebar}</Stack>
</Grid>
```

### Автоматическая мобайл адаптивность

Благодаря комбинации ui8kit пропсов и Tailwind className:

```tsx
<Grid 
  grid="cols-3"                           // ui8kit основа
  className="md:grid-cols-3 grid-cols-1"  // Tailwind медиа
>
  <Stack 
    col="span-2"                           // ui8kit основа
    className="md:col-span-2 col-span-1"   // Tailwind медиа
  >
    Content
  </Stack>
  <Stack 
    col="span-1"                           // ui8kit основа
    className="md:col-span-1 col-span-1"   // Tailwind медиа
  >
    Sidebar
  </Stack>
</Grid>
```

**Результат:**
- На десктопе (md≥768px): 3 колонки (2+1)
- На мобайле (<768px): 1 колонка (стакируется вертикально)

## Планы

- [ ] Добавить Breadcrumb в Header
- [ ] Поддерживать разные варианты Header (compact, full)
- [ ] Добавить Support для скрытого сайдбара (hamburger)
- [ ] Интегрировать Analytics/Events
- [ ] Адаптивные точки разлома (breakpoints)


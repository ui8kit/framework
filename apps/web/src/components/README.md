# Components

Переиспользуемые компоненты приложения, соответствующие архитектуре ui8kit.

## Структура

```
components/
├── cards/               # Переиспользуемые карточки
│   ├── PostCard.tsx    # Карточка поста (с вариантом media: 'top' | 'default')
│   ├── SmallMediaCard.tsx  # Компактная карточка с изображением
│   ├── CategoryCard.tsx # Карточка категории
│   ├── AuthorCard.tsx  # Карточка автора
│   └── AuthorBio.tsx   # Блиц-биография автора
├── lists/              # Списки компонентов
│   ├── CategoryList.tsx # Список категорий
│   └── TagList.tsx     # Список тегов
├── SearchBar.tsx       # Поиск
├── PopularPosts.tsx    # Популярные посты (с контекстом)
├── RecentPosts.tsx     # Недавние посты (с контекстом)
├── HomeLatest.tsx      # Последние посты (с контекстом)
├── NewsletterSignup.tsx # Подписка на рассылку
├── Pagination.tsx      # Пагинация
├── SEO.tsx            # SEO и JSON-LD
└── index.ts           # Центральный экспорт
```

## Использование

### Карточки

```tsx
import { PostCard, SmallMediaCard, CategoryCard } from '@/components'

// Карточка поста (default layout)
<PostCard 
  post={post}
  media="default"
/>

// Карточка поста (top image layout)
<PostCard 
  post={post}
  media="top"
/>

// Компактная карточка
<SmallMediaCard item={item} />

// Карточка категории
<CategoryCard item={category} />
```

### Списки

```tsx
import { CategoryList, TagList } from '@/components'

// Список категорий
<CategoryList items={categories} />

// Список тегов
<TagList items={tags} />
```

### Утилиты

```tsx
import { 
  SearchBar, 
  PopularPosts, 
  RecentPosts, 
  HomeLatest,
  NewsletterSignup,
  Pagination,
  SEO
} from '@/components'

// Поиск (использует router для навигации)
<SearchBar initial="query" />

// Блоки с контекстом (используют useRenderContext)
<PopularPosts />
<RecentPosts />
<HomeLatest />

// Рассылка
<NewsletterSignup />

// Пагинация
<Pagination 
  page={1} 
  total={10}
  onPrev={() => {}}
  onNext={() => {}}
/>

// SEO
<SEO title="Page Title" description="Description" />
```

## Props Паттерны

Все компоненты следуют ui8kit архитектуре:

- ✅ Используют семантические пропсы: `gap="6"`, `fontSize="xl"`, `textColor="primary"`
- ✅ Все элементы имеют `data-class` для CSS генерации
- ✅ Используют `useTheme()` для консистентности стилей
- ✅ TypeScript типы для всех пропсов
- ✅ Экспортируют компоненты как именованные функции (PascalCase)

## Типы данных

### Post

```typescript
type Post = {
  id: number
  title: string
  excerpt: string
  slug: string
  thumbnail?: { url: string; alt: string }
  categories?: { id: number; name: string; slug: string }[]
}
```

### Category

```typescript
type Category = {
  id: number
  name: string
  slug: string
  count?: number
}
```

### Author

```typescript
type Author = {
  id: number
  name: string
  slug: string
  count?: number
  avatarUrl?: string
}
```

## Планы для документации

Эти компоненты служат основой для:

1. **Storybook** — визуальная документация с вариантами
2. **shadcn-style пакета** — для @ui8kit/components
3. **Примеров в @ui8kit/docs** — реальные use cases
4. **Генерации CSS** — через data-class семантику

## Рекомендации

- Используйте `useTheme()` для доступа к токенам дизайна (rounded, colors)
- Передавайте `data-class` для всех контейнеров для правильной CSS генерации
- Не добавляйте `className` напрямую — используйте семантические пропсы
- Все ссылки используют react-router-dom `<Link>`
- Контекст для данных подтягивается через `useRenderContext()`

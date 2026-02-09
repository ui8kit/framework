Система готова. Можно создавать компоненты в apps/engine и получать готовые к переиспользованию шаблоны в dist/react. 

Вот стандарты:

---

## Что работает

- Props с типами → interface в dist
- Spread-атрибуты → `{...context.hero}` сохраняются
- Include с children → `<Sidebar>{sidebar}</Sidebar>`
- Имена → `CTABlock` остаётся `CTABlock`
- Текст между выражениями → пробелы сохраняются
- Routes без ложных props

---

## Стандарты для engine-компонентов

### 1. Всегда типизированные props-интерфейс

```tsx
export interface MyBlockProps {
  title?: string;
  items?: Array<{ id: string; label: string }>;
}

export function MyBlock({ title, items = [] }: MyBlockProps) {
```

Генератор найдёт интерфейс через TypeAnnotation и выпустит типы. Если интерфейса нет — будет `any`.

### 2. Деструктуризация в параметрах, не в теле

```tsx
// Хорошо — генератор видит props
export function MyBlock({ title, items }: MyBlockProps) {

// Плохо — генератор не извлечёт props
export function MyBlock(props: MyBlockProps) {
  const { title, items } = props;
```

### 3. DSL для условий и циклов

Используй `<If>`, `<Loop>`, `<Var>` из `@ui8kit/template` — генератор превращает их в `{condition ? ... : null}`, `.map()`, `{value}` для всех 5 движков. Без DSL — обычный JSX тоже работает (ternary, &&, .map), но DSL гарантирует единообразие.

### 4. UI-примитивы из @ui8kit/core

`Block`, `Stack`, `Group`, `Grid`, `Container`, `Box`, `Title`, `Text`, `Button`, `Badge`, `Image` — они passthrough, сохраняются как есть с `data-class`.

### 5. Обязательный data-class

Каждый элемент должен иметь `data-class="semantic-name"` — это нужно для CSS-генерации в других движках.

### 6. Не используй const-переменные перед return

Генератор выпускает только return-часть. Если нужна логика — инлайни в JSX:

```tsx
// Плохо — hasSidebar потеряется
const hasSidebar = !!sidebar;
return hasSidebar ? <Grid>...</Grid> : <Stack>...</Stack>;

// Хорошо — логика в JSX
return sidebar ? <Grid>...</Grid> : <Stack>...</Stack>;
```

### 7. Partials (Header, Footer, Sidebar, кастомные) — отдельные файлы

Компоненты в `src/partials/` автоматически становятся Include. Если partial принимает children — они сохранятся в dist.

### 8. Примитивные типы в props

Используй `string`, `boolean`, `number`, `ReactNode`, `string[]`. Внешние типы (`NavItem[]`, `LayoutMode`) заменятся на `any` — это нормально для standalone dist, но лучше если можно обойтись примитивами или inline-типами:

```tsx
// Хорошо — тип inline, попадёт как есть
items?: Array<{ id: string; label: string }>;

// Ок — заменится на any[]
items?: NavItem[];
```

### 9. Один export на файл, совпадающий с именем

`DashSidebar.tsx` → `export function DashSidebar`. Не делай alias (Dashboard + DashLayout в одном файле) — генератор берёт компонент по имени файла.

### 10. Routes используют context из @ui8kit/data

Routes — это сборка: layout + blocks + context. Они не имеют своих props. Генератор правильно выпустит `export function Page()` без деструктуризации.

---

## Рабочий цикл

1. Создаёшь/редактируешь компонент в `apps/engine/src/{blocks,layouts,partials,routes}/`
2. `cd apps/engine && bun run generate`
3. Проверяешь `dist/react/` — готово к копированию
4. `bun run scripts/copy-templates-to-dev.ts` — синхронизация в apps/dev

Система готова к масштабированию.
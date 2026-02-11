в текущем виде это хрупко и “слетает” после регенерации.

### Что именно ломается сейчас

Ключевая проблема: генератор пытается **догадаться props из используемых переменных**.  
Это конфликтует с локальными переменными из `context`/`useLocation`.

Пример в сгенерированном `DocsComponentsPage`:

```11:15:apps/dev/src/routes/DocsComponentsPage.tsx
export function DocsComponentsPage(props: DocsComponentsPageProps) {
  const { lead, title } = props;

  const { title, lead } = context.docsComponents;
```

Двойное объявление `title/lead` => ошибки.

Почему так происходит:
- В `ReactPlugin` есть fallback: если нет явных props из сигнатуры, он берет `collectVariables(...)` и делает из них props.
- В preamble-сборщике локальные переменные собираются только как `Identifier`, но не из object destructuring (`const { title, lead } = ...`).

```161:166:packages/generator/src/plugins/template/built-in/ReactPlugin.ts
private getEmittedPropNames(...) {
  const fromMeta = tree.meta?.props?.map((p) => p.name)...
  if (fromMeta && fromMeta.length > 0) return fromMeta;
```

```361:365:packages/generator/src/transformer/hast-builder.ts
if (stmt.type === 'VariableDeclaration') {
  for (const decl of stmt.declarations) {
    if (decl.id.type === 'Identifier') {
      preambleVars.push(decl.id.name);
```

---

## Архитектурно как упростить (рекомендую)

### 1) Разделить “Container” и “Template” слои в `apps/engine`

- **Template/View-компоненты** (генерируемые): только `props`, JSX/DSL, без `context`, без `useLocation`, без бизнес-логики.
- **Container-компоненты** (не генерируемые): берут `context`, `router hooks`, вычисляют данные и прокидывают в Template.

Примерно:
- `ExamplesLayoutView` (чистый, `tabs`, `examples`, `children`)
- `ExamplesLayoutContainer` (useLocation + context.getExamplesSidebarLinks)

Это сразу убирает 80% сложности генератора.

---

### 2) В генераторе убрать “магическое” выведение props

Для React-target лучше правило:
- props = **только** то, что явно в сигнатуре компонента (ObjectPattern params + type).
- если сигнатуры нет — генерировать компонент **без props** (а не угадывать).

Fallback через `collectVariables` оставить только для legacy-режима (флагом).

---

### 3) Нормализовать Symbol Table (если inference все же нужен)

Если хотите сохранить inference:
- вести таблицу символов: `imports`, `params`, `locals`, `loop vars`.
- в props допускаются только `params`.
- `locals` (в т.ч. destructuring) никогда не попадают в props.

---

### 4) Добавить “контрактный” этап в pipeline

После генерации:
1. `tsc --noEmit` по `apps/engine/dist/react` и `apps/dev/src`
2. smoke checks на критичные паттерны:
   - нет `const { ... } = props` + повторного `const { ... } = ...` с теми же именами
   - нет auto-props у компонентов без параметров

---

## Практичный план миграции (без big-bang)

1. **Срочно**: отключить fallback inference для `layout/page` компонентов.  
2. **Коротко**: исправить извлечение `preambleVars` для object destructuring.  
3. **Среднесрочно**: перевести engine на Container/View split.  
4. **Долгосрочно**: полный отказ от inference props в React-плагине.

---

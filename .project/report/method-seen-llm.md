# DSL UI8Kit — План улучшений для LLM

## Выполнено

- [x] Устранить опечатки в whitelist (`col-tart` → `col-start`)
- [x] Удалить дубликаты в `utility-props.map.ts`
- [x] Исправить невалидные классы в CVA variants (`foreground0` → `foreground`)

---

## TODO: Инструментарий валидации

- [ ] **Создать машиночитаемую карту** `prop → values → class` (JSON) для автокомплита и валидации
- [ ] **Реализовать автовалидацию whitelist** — скрипт сверяет `ui8kit.map.json` с `utility-props.map.ts`
- [ ] **Добавить механизм closest_match** — при ошибке выводить ближайшее валидное значение (Levenshtein)
- [ ] **Реализовать линтер с форматом ошибок** (см. раздел "Формат ошибок")

## TODO: Ограничения и правила

- [ ] **Запретить className в primitives** — добавить ESLint-правило или скрипт проверки для `components/ui/*`
- [ ] **Задокументировать правило "или DSL, или className"** — в одном слое не смешивать подходы
- [ ] **Разрешить className в Grid** только для responsive-модификаторов (`md:grid-cols-3`)

## TODO: Семантика и алиасы

- [ ] **Добавить семантические алиасы** для `text-*` prop:
  - `fontSize` → `text-{size}` (xs, sm, base, lg, xl, 2xl...)
  - `textColor` → `text-{color}` (foreground, muted-foreground, primary...)
  - `textAlign` → `text-{align}` (left, center, right, justify)

## TODO: Генерация и оптимизация

- [ ] **Реализовать compact mode** — вывод `gap=6` вместо `gap="6"` для экономии токенов
- [ ] **Создать preset-шаблоны** в `blocks/` (hero, card, pricing, testimonial)

---

## Формат ошибок линтера

Структурированный формат для машинной обработки и самоисправления LLM:

```typescript
interface LintError {
  error_code: string;       // Уникальный код ошибки
  message: string;          // Человекочитаемое описание
  prop: string;             // Название пропа (gap, text, bg...)
  received: string;         // Полученное невалидное значение
  expected: string[];       // Массив допустимых значений
  closest_match?: string;   // Ближайшее валидное значение (Levenshtein)
  suggested_fix: string;    // Готовое исправление для применения
  location: {               // Позиция в коде
    file: string;
    line: number;
    column: number;
  };
}
```

### Коды ошибок

| error_code | Описание | Пример |
|------------|----------|--------|
| `INVALID_PROP_VALUE` | Значение пропа не в whitelist | `gap="5"` → gap не содержит "5" |
| `UNKNOWN_PROP` | Проп не существует | `gapp="4"` → нет пропа "gapp" |
| `CLASSNAME_WITHOUT_DATACLASS` | className без data-class | `<Box className="x">` |
| `CLASSNAME_IN_PRIMITIVE` | className в UI-примитиве | `<Stack className="x">` |
| `RESPONSIVE_IN_PROP` | Responsive-модификатор в пропе | `gap="4 md:gap-6"` |
| `DUPLICATE_PROP` | Конфликтующие пропы | `text="lg" text="sm"` |

### Пример вывода

```json
{
  "error_code": "INVALID_PROP_VALUE",
  "message": "Invalid value '5' for prop 'gap'",
  "prop": "gap",
  "received": "5",
  "expected": ["0", "1", "2", "4", "6", "8", "10", "12"],
  "closest_match": "4",
  "suggested_fix": "gap=\"4\"",
  "location": {
    "file": "src/blocks/HeroBlock.tsx",
    "line": 12,
    "column": 8
  }
}
```

### Дополнительные форматы для рассмотрения

| Формат | Назначение |
|--------|------------|
| `severity` | Уровень: "error" / "warning" / "info" |
| `rule_id` | ID правила для отключения (`// @ui8kit-ignore`) |
| `autofix_available` | Можно ли применить автоисправление |
| `context` | Фрагмент кода вокруг ошибки |

---

## WARNING

**Ключевая проблема**: Много "полу-вариантов". Если в проекте одновременно:
- CVA variants
- DSL utility props  
- Свободный className

...без явного правила выбора — это увеличивает ошибки LLM. Нужна чёткая документация: **когда что использовать**.

---

## Ключевые поля формата ошибок

| Поле | Назначение | Почему критично для LLM |
|------|------------|------------------------|
| `error_code` | Уникальный идентификатор типа ошибки | LLM может иметь заготовленные стратегии исправления для каждого кода |
| `received` | Что было написано | LLM видит своё "неправильное" значение |
| `expected` | Массив валидных значений | LLM выбирает из конечного списка, а не галлюцинирует |
| `closest_match` | Ближайшее валидное по Levenshtein | Для опечаток типа `cente` → `center` — моментальное исправление |
| `suggested_fix` | Готовый код для замены | LLM копирует напрямую, минимум интерпретации |

---

## Дополнительные форматы для рассмотрения

| Поле | Когда нужно |
|------|-------------|
| `severity` | Если есть warnings (не блокируют) vs errors (блокируют) |
| `autofix_available` | LLM понимает, можно ли применить fix автоматически |
| `context` | Фрагмент кода (3-5 строк) — помогает LLM понять контекст без перечитывания файла |
| `rule_id` | Для игнорирования правила комментарием `// @ui8kit-ignore RULE_ID` |

---

## Рекомендация по приоритету

**Минимальный набор** (must-have):
- `error_code`
- `received`
- `expected`
- `suggested_fix`

**Расширенный** (nice-to-have):
- `closest_match` — критично для опечаток
- `location` — для точного позиционирования
- `severity` — если нужны warnings

---

## Запланировано для MCP-сервера (отдельный проект)

- [ ] Создать компактный reference для промптов (LLM_CHEATSHEET)
- [ ] Задокументировать предпочтительные значения (`gap` → чаще 4/6/8)
- [ ] Реализовать макро-шаблоны: `preset="hero"` разворачивается в набор props
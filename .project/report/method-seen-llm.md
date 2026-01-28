# DSL UI8Kit — План улучшений для LLM

CLOSED RESOLVED 100%

## Выполнено

- [x] Устранить опечатки в whitelist (`col-tart` → `col-start`)
- [x] Удалить дубликаты в `utility-props.map.ts`
- [x] Исправить невалидные классы в CVA variants (`foreground0` → `foreground`)

---

## TODO: Инструментарий валидации

- [x] **Создать машиночитаемую карту** `prop → values → class` (JSON) для автокомплита и валидации
  - Реализовано в `@ui8kit/lint` — используется `utility-props.map.ts` как источник
- [x] **Реализовать автовалидацию whitelist** — скрипт сверяет `ui8kit.map.json` с `utility-props.map.ts`
  - CLI: `bun run packages/lint/src/cli/validate-whitelist.ts`
  - Функция: `syncWhitelist()`, `validateWhitelistSync()`
- [x] **Добавить механизм closest_match** — при ошибке выводить ближайшее валидное значение (Levenshtein)
  - Модуль: `packages/lint/src/levenshtein.ts`
  - Функции: `findClosestMatch()`, `findAllMatches()`, `levenshtein()`
- [x] **Реализовать линтер с форматом ошибок** (см. раздел "Формат ошибок")
  - Пакет: `@ui8kit/lint` (packages/lint)
  - 66 тестов, все проходят
  - Форматы: JSON, Pretty, Compact, LLM-optimized

## TODO: Ограничения и правила

- [x] **Запретить className в primitives** — добавить ESLint-правило или скрипт проверки для `components/ui/*`
  - Функция: `validateDataClass(hasClassName, hasDataClass, isPrimitive)`
  - Код ошибки: `CLASSNAME_IN_PRIMITIVE`
- [x] **Задокументировать правило "или DSL, или className"** — в одном слое не смешивать подходы
- [x] **Разрешить className в Grid** только для responsive-модификаторов (`md:grid-cols-3`)

## TODO: Семантика и алиасы

- [x] **Добавить семантические алиасы** для `text-*` prop:
  - `fontSize` → `text-{size}` (xs, sm, base, lg, xl, 2xl...)
  - `textColor` → `text-{color}` (foreground, muted-foreground, primary...)
  - `textAlign` → `text-{align}` (left, center, right, justify)

## TODO: Генерация и оптимизация

- [x] **Реализовать compact mode** — вывод `gap=6` вместо `gap="6"` для экономии токенов
- [x] **Создать preset-шаблоны** в `blocks/` (hero, card, pricing, testimonial)

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
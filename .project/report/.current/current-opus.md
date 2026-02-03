# Информация о проекте из системного промпта

## Общая информация
- **ОС**: Windows 10 (10.0.19045)
- **Shell**: bash
- **Workspace**: `e:\_@Bun\@ui8kit-framework`
- **Git**: репозиторий на ветке `main`, синхронизирован с `origin/main`
- **Дата контекста**: 3 февраля 2026

---

## Структура монорепозитория

### `/packages/` - основные пакеты

| Пакет | Описание | Файлы |
|-------|----------|-------|
| **core** | Ядро фреймворка | 31 файл (15 tsx, 13 ts) |
| **generator** | Генератор кода | 103 ts файла, Liquid шаблоны, Vite/Vitest конфиги |
| **lint** | Линтинг и валидация | validator, formatter, whitelist-sync, levenshtein |
| **mdx-react** | MDX компоненты | parser, scanner, nav-generator, props-extractor, Vite plugin |
| **template** | DSL Template Engine | Block, If/Else/ElseIf, Loop, Slot, Var, Include, Extends, Raw |

### `/apps/` - приложения
- 12 файлов (5 mdx, 3 css, 1 json)

### `/.project/` - документация проекта
- 96 файлов (65 md, 9 css, 6 jpg)

---

## Cursor Rules (доступные правила)

1. **ui8kit-architecture.mdc** - архитектура UI8kit, дизайн-система, компоненты, темы
2. **project-structure.mdc** - структура проекта, архитектура монорепо
3. **best-practices.mdc** - лучшие практики, стандарты кода, паттерны

---

## Git Status (snapshot)

### Удалённые файлы:
- `.project/report/_brainstorm-impoved-generator.md`
- `.project/report/_current-project.md`
- `.project/report/_plugin-system-template-engine.md`

### Изменённые:
- `.project/roadmap.md`

### Untracked (новые):
- `.project/current-gemini.md`
- `.project/current.md`

---

## MCP серверы

| Сервер | Назначение |
|--------|------------|
| **cursor-ide-browser** | Автоматизация браузера, тестирование UI |
| **cursor-browser-extension** | Взаимодействие с веб-страницами |
| **user-context7** | Актуальная документация библиотек |

---

## Открытые файлы в IDE

- `current.md` (в фокусе)
- `current-gemini.md` (39 строк)
- `_mcp-plan.md` (6 строк)
- `roadmap.md` (166 строк)
- `_sync_web_engine.md` (313 строк)
- `backlog.md` (59 строк)
- `settings.json` (45 строк)

---

## Ключевые технологии (по структуре)

- **Bun** - runtime (из пути `@Bun`)
- **TypeScript/TSX** - основной язык
- **Vite** - сборщик
- **Vitest** - тестирование
- **Liquid** - шаблонизатор
- **MDX** - документация с компонентами
- **Turbo** - монорепо менеджер (`turbo.json`)

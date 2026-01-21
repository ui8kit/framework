# План рефакторинга (модульный, OOP‑friendly)

### 1) Разделить ответственность на этапы (Pipeline)
Вместо монолита `Generator` — набор шагов с общим интерфейсом:
- `SourceScanStep` — ищет источники (routes, mdx, partials)
- `TransformStep` — превращает исходники в “RenderUnit” (frontmatter + template + metadata)
- `RenderStep` — рендерит в HTML/Liquid/JSON
- `PostprocessStep` — CSS/uncss, merge, copy assets

**Контракт:** каждый шаг принимает и возвращает общий `GenerationContext` (shared state).

### 2) Ввести `GenerationContext`
Единый объект контекста:
- `config` (общая и модульная части)
- `logger`
- `fs` (абстракция IO)
- `registries` (реестр источников/шаблонов/конвертеров)
- `outputs` (куда писать результаты)

Это даёт расширяемость без жёстких зависимостей.

### 3) Ввести модульные “плагины”
Каждый модуль (MDX, HTML routes, partials) регистрируется как плагин:

```ts
interface GeneratorPlugin {
  name: string;
  register(ctx: GenerationContext): void;
  steps(): GenerationStep[];
}
```

MDX‑модуль добавляет:
- источник `.mdx` файлов
- парсер frontmatter
- генератор навигации
- renderer

### 4) Единый реестр источников (Registrar)
Чтобы можно было «просто отправить контент» и он обработался:
- `registerSource({ type, id, content, meta })`
- `registerTemplate({ key, content, meta })`

MDX модуль может подписаться на `type: "mdx"` и рендерить автоматически.

### 5) Конфигурация как DSL
Конфиг задаёт:
- какие плагины включены
- какие источники активны
- какие пайплайны запускать

Примерно:
```ts
generatorConfig = {
  plugins: ["html", "mdx", "css"],
  sources: {
    mdx: { docsDir, basePath },
    routes: { entryPath }
  }
}
```

### 6) Очередь генерации
Вместо «сразу рендерим», делай очередь `RenderQueue`:
- на вход: список `RenderUnit`
- на выход: файлы/артефакты
Это позволяет batch/parallel и масштабирование.

## Как это применить к `frontmatter` и «шаблону»
Ты можешь:
1) Парсить frontmatter на этапе `TransformStep`
2) Регистрировать результат в `RenderUnit`
3) Рендерить дальше одинаково для MDX и HTML

Унифицированный формат:
```ts
type RenderUnit = {
  id: string;
  type: "mdx" | "html";
  content: string;
  frontmatter?: Record<string, string>;
  outputPath: string;
};
```

## Минимальная “дорожная карта”
1. **Выделить `GeneratorContext` и `GenerationStep` интерфейсы**
2. **Перенести текущие шаги в отдельные классы**
3. **Сделать MDX шаги отдельным модулем**
4. **Добавить реестр источников** (чтобы регистрировать content)
5. **Добавить очередь RenderQueue**  
6. **Сделать конфиг плагиновым**
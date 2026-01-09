# Backlog

- [x]  Генератор OOP Typescript + отд пакет react зависимый для render static markup (content)
- [x]  bun run html вместо классов уставляиваются стили прямо в тег
- [x]  не создаются остальные роуты, только главный
- [x]  макет имеет не существующий в react тег `<main class="min-h-screen">`
- [x]  `isValidTailwindClass` валидация по карте `ui8kit.map.json` с вырезанием лишнего, например: preline to ui8kit
- [x]  дублируются классы в local.css `.feature-description`
- [x]  дублируются классы в селекторах apply `.feature-card-0`, `.feature-card-1` -> `@apply p-6 border rounded-lg`
- [x]  добавить в конфиг `generator.config.ts` режимы генерации для `html:tailwind, tailwind --pure, semantic`, `css:tailwind, css3, css3inline`. Чистые классы tw без атрибутов (--pure)
- [x]  partials генерировать из реакт или пропускать
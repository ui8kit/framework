# 7. Архитектура UnCSS

UnCSS состоит из 4 основных файлов, каждый из которых отвечает за определенную часть процесса оптимизации CSS. Давайте разберем архитектуру по файлам.

## 📁 Структура файлов

```
src/
├── uncss.js      # Главный API и координация
├── lib.js        # Ядро обработки CSS
├── jsdom.js      # Работа с HTML/DOM
└── utility.js    # Вспомогательные функции
```

## 🎯 uncss.js - Главный API

### Назначение

`uncss.js` - это основной файл, который координирует всю работу UnCSS. Он отвечает за:

- Парсинг входных параметров
- Загрузку HTML и CSS файлов
- Запуск процесса оптимизации
- Возврат результатов

### Основные функции

#### `init(files, options, callback)` - главная функция

```javascript
function init(files, options, callback) {
  // 1. Установка опций по умолчанию
  options = _.merge(defaultOptions, options);

  // 2. Загрузка HTML файлов
  return getHTML(files, options)
    .then(getStylesheets)      // 3. Извлечение CSS ссылок
    .then(getCSS)             // 4. Загрузка CSS содержимого
    .then(processWithTextApi) // 5. Обработка и оптимизация
    .then(cleanup);           // 6. Очистка ресурсов
}
```

#### `process(options)` - внутренний процесс

```javascript
async function process(opts) {
  const pages = await getHTML(opts.html, opts);
  const cleanup = result => {
    pages.forEach(page => page.window.close());
    return result;
  };

  return getStylesheets(opts.files, opts, pages)
    .then(getCSS)
    .then(processWithTextApi)
    .then(cleanup);
}
```

### Конвейер обработки

```
HTML файлы → getHTML() → JSDOM страницы
                    ↓
CSS ссылки → getStylesheets() → Список CSS файлов
                    ↓
CSS контент → getCSS() → Объединенный CSS
                    ↓
Оптимизация → processWithTextApi() → Чистый CSS
```

## 🧠 lib.js - Ядро обработки

### Назначение

`lib.js` содержит основную логику анализа и оптимизации CSS. Это сердце UnCSS.

### Ключевые функции

#### `filterUnusedSelectors(selectors, ignore, usedSelectors)`

```javascript
function filterUnusedSelectors(selectors, ignore, usedSelectors) {
  return selectors.filter(selector => {
    selector = dePseudify(selector);  // Удаляем псевдо-классы

    // Проверяем в игнорируемых
    for (let i = 0, len = ignore.length; i < len; ++i) {
      if (_.isRegExp(ignore[i]) && ignore[i].test(selector)) {
        return true;  // Оставить
      }
      if (ignore[i] === selector) {
        return true;  // Оставить
      }
    }

    // Проверяем используется ли селектор
    return usedSelectors.indexOf(selector) !== -1;
  });
}
```

#### `getUsedSelectors(page, css)`

Извлекает все селекторы, которые используются в данной HTML странице:

```javascript
function getUsedSelectors(page, css) {
  let usedSelectors = [];
  css.walkRules(rule => {
    // Добавляем все селекторы из CSS
    usedSelectors = _.concat(usedSelectors, rule.selectors.map(dePseudify));
  });

  // Проверяем какие из них есть в HTML
  return jsdom.findAll(page.window, usedSelectors);
}
```

#### `filterUnusedRules(css, ignore, usedSelectors)`

Главная функция оптимизации:

```javascript
function filterUnusedRules(css, ignore, usedSelectors) {
  css.walk(rule => {
    if (rule.type === 'rule') {
      // Оставляем только используемые селекторы
      const usedRuleSelectors = filterUnusedSelectors(
        rule.selectors,
        ignore,
        usedSelectors
      );

      if (usedRuleSelectors.length === 0) {
        rule.remove();  // Удаляем правило целиком
      } else {
        rule.selectors = usedRuleSelectors;  // Оставляем только используемые
      }
    }
  });

  filterEmptyAtRules(css);     // Удаляем пустые @media
  filterKeyframes(css, unusedRules);  // Очищаем @keyframes

  return css;
}
```

### `dePseudify` - обработка псевдо-классов

```javascript
const dePseudify = (() => {
  const ignoredPseudos = [
    ':link', ':visited', ':hover', ':active', ':focus',
    ':enabled', ':disabled', ':checked', ':required',
    '::before', '::after', '::first-line', '::first-letter'
  ];

  const transform = selectors => {
    selectors.walkPseudos(selector => {
      if (pseudosRegex.test(selector.value)) {
        selector.remove();  // Удаляем игнорируемые псевдо-классы
      }
    });
  };

  const processor = postcssSelectorParser(transform);
  return selector => processor.processSync(selector);
})();
```

## 🌐 jsdom.js - Работа с HTML/DOM

### Назначение

`jsdom.js` отвечает за создание виртуального браузера и анализ HTML документов.

### Основные функции

#### `fromSource(src, options)` - загрузка страницы

```javascript
async function fromSource(src, options) {
  const config = _.cloneDeep(options.jsdom);

  // Настройка загрузчика ресурсов
  config.resources = new CustomResourcesLoader(
    options.htmlroot,
    options.strictSSL,
    options.userAgent
  );

  let page;
  if (isURL(src)) {
    page = await JSDOM.fromURL(src, config);
  } else if (isHTML(src)) {
    page = new JSDOM(src, config);
  } else {
    page = await JSDOM.fromFile(src, config);
  }

  return page;
}
```

#### `CustomResourcesLoader` - загрузчик ресурсов

```javascript
class CustomResourcesLoader extends ResourceLoader {
  fetch(originalUrl, options) {
    // Загружает CSS, JS, изображения для JSDOM
    // Имитирует реальный браузер
  }
}
```

#### `findAll(window, sels)` - поиск селекторов

```javascript
function findAll(window, sels) {
  const { document } = window;

  // Разворачиваем <noscript> теги
  const noscripts = document.getElementsByTagName('noscript');
  Array.prototype.forEach.call(noscripts, ns => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = ns.textContent;
    // Вставляем содержимое как sibling
  });

  // Проверяем каждый селектор
  return sels.filter(selector => {
    try {
      return document.querySelector(selector);
    } catch (e) {
      return false;  // Игнорируем невалидные селекторы
    }
  });
}
```

#### `getStylesheets(window, options)` - извлечение CSS ссылок

```javascript
function getStylesheets(window, options) {
  const media = _.union(['', 'all', 'screen'], options.media);
  const elements = window.document.querySelectorAll('link[rel="stylesheet"]');

  return Array.prototype.map.call(elements, link => ({
    href: link.getAttribute('href'),
    media: link.getAttribute('media') || '',
  })).filter(sheet => media.indexOf(sheet.media) !== -1);
}
```

## 🛠️ utility.js - Вспомогательные функции

### Назначение

`utility.js` содержит вспомогательные функции для работы с файлами, путями и ошибками.

### Основные функции

#### `readStylesheets(files, outputBanner)` - чтение CSS файлов

```javascript
async function readStylesheets(files, outputBanner) {
  const res = await Promise.all(
    files.map(filename => {
      if (isURL(filename)) {
        // Загрузка по HTTP
        return new Promise((resolve, reject) => {
          request({ url: filename }, (err, response, body) => {
            if (err) reject(err);
            else resolve(body);
          });
        });
      } else {
        // Чтение из файла
        return new Promise((resolve, reject) => {
          fs.readFile(filename, 'utf-8', (err, contents) => {
            if (err) reject(err);
            else resolve(stripBom(contents));
          });
        });
      }
    })
  );

  // Добавляем баннеры для отладки
  if (outputBanner) {
    res.forEach((content, i) => {
      const banner = `/*** uncss> filename: ${files[i]} ***/\n`;
      res[i] = banner + content;
    });
  }

  return res;
}
```

#### `parsePaths(source, stylesheets, options)` - разбор путей

```javascript
function parsePaths(source, stylesheets, options) {
  return stylesheets.map(sheet => {
    // Обработка относительных путей
    if (sheet[0] === '/' && options.htmlroot) {
      return path.join(options.htmlroot, sheet);
    }

    // Обработка HTML строк
    if (isHTML(source)) {
      return path.join(options.csspath, sheet);
    }

    // Относительные пути
    return path.join(path.dirname(source), options.csspath, sheet);
  });
}
```

#### `parseErrorMessage(error, cssStr)` - красивые ошибки

```javascript
function parseErrorMessage(error, cssStr) {
  if (error.line) {
    const lines = cssStr.split('\n');
    const start = Math.max(0, error.line - 6);
    const end = Math.min(lines.length, error.line + 5);

    // Показываем контекст ошибки
    for (let i = start; i < end; i++) {
      const marker = i === error.line - 1 ? ' -> ' : '    ';
      error.message += `\n\t${i + 1}:    ${marker}${lines[i]}`;
    }
  }

  return error;
}
```

## 🔄 Полный цикл работы

### 1. Инициализация

```
uncss(['index.html'], options) 
  ↓
init() → process() → getHTML()
```

### 2. Загрузка HTML

```
getHTML() → jsdom.fromSource() → JSDOM страницы
  ↓
getStylesheets() → Извлечение <link> тегов
  ↓
getCSS() → Загрузка CSS файлов
```

### 3. Анализ и оптимизация

```
processWithTextApi()
  ↓
postcss.parse() → Парсинг CSS
  ↓
uncss() → getUsedSelectors() → findAll()
  ↓
filterUnusedRules() → filterUnusedSelectors()
  ↓
Очистка пустых @media и @keyframes
```

### 4. Результат

```
postcss.stringify() → Финальный CSS
  ↓
cleanup() → Закрытие JSDOM
  ↓
return [css, report]
```

## 🎯 Архитектурные принципы

### Разделение ответственности

- **uncss.js** - API и координация
- **lib.js** - бизнес-логика оптимизации
- **jsdom.js** - работа с DOM
- **utility.js** - вспомогательные функции

### Асинхронность

Все операции асинхронны для производительности:

```javascript
// Параллельная загрузка
Promise.all(files.map(file => jsdom.fromSource(file, options)))

// Параллельная обработка страниц
Promise.all(pages.map(page => getUsedSelectors(page, css)))
```

### Безопасность

- Игнорирование опасных псевдо-классов
- Правильная обработка ошибок
- Очистка ресурсов после работы

Эта архитектура позволяет UnCSS эффективно анализировать HTML и удалять неиспользуемые CSS правила, что дает впечатляющие результаты оптимизации.
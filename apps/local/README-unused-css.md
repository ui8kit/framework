# Тестирование Unused CSS

После генерации UI8Kit создает файлы `unused.css` рядом с каждым `index.html`.

## Структура файлов

```
dist/html/
├── index.html
├── unused.css          # Оптимизированный CSS для главной страницы
└── about/
    ├── index.html
    └── unused.css      # Оптимизированный CSS для страницы about
```

## Как протестировать

Для тестирования оптимизированного CSS замените ссылку на основной CSS:

```html
<!-- Вместо -->
<link rel="stylesheet" href="./assets/css/styles.css">

<!-- Используйте для теста -->
<link rel="stylesheet" href="unused.css">
```

## Пример для главной страницы

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="unused.css">
    <title>Test - Main Page</title>
</head>
<body>
    <!-- Содержимое главной страницы -->
</body>
</html>
```

## Пример для страницы about

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="unused.css">
    <title>Test - About Page</title>
</head>
<body>
    <!-- Содержимое страницы about -->
</body>
</html>
```

## Статистика оптимизации

- **Главная страница**: 43,745 байт → 12,296 байт (71.9% экономии)
- **Страница About**: 43,745 байт → 12,067 байт (72.4% экономии)

## Когда использовать

- **Development**: Используйте для проверки, что все стили загружаются правильно
- **Production**: Основной CSS файл `styles.css` уже оптимизирован
- **Debugging**: `unused.css` помогает найти проблемы со стилями
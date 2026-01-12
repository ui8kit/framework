#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const uncss = require('uncss');

// Пути к файлам
const htmlFile = path.join(__dirname, 'dist/html/index.html');
const baseCssFile = path.join(__dirname, 'dist/html/assets/base.css');
const outputCssFile = path.join(__dirname, 'dist/html/assets/clean.css');

// Проверяем существование файлов
if (!fs.existsSync(htmlFile)) {
  console.error('HTML файл не найден:', htmlFile);
  process.exit(1);
}

if (!fs.existsSync(baseCssFile)) {
  console.error('CSS файл не найден:', baseCssFile);
  process.exit(1);
}

// Читаем файлы
const html = fs.readFileSync(htmlFile, 'utf8');
const css = fs.readFileSync(baseCssFile, 'utf8');

console.log('Начинаем очистку CSS...');
console.log('HTML файл:', path.relative(process.cwd(), htmlFile));
console.log('CSS файл:', path.relative(process.cwd(), baseCssFile));
console.log('Выходной файл:', path.relative(process.cwd(), outputCssFile));

// Настройки UnCSS
const options = {
  ignore: [
    // Игнорируем классы, которые могут использоваться динамически
    /\.js-/,
    /\.data-/,
    /\.focus:/,
    /\.hover:/,
    /\.active:/,
    /::before/,
    /::after/
  ],
  // HTML может содержать встроенные стили или быть фрагментом
  htmlroot: path.dirname(htmlFile),
  // Отключаем загрузку внешних CSS файлов
  ignoreSheets: [/\s/],
  // Игнорируем медиа-запросы
  media: true
};

uncss(html, {
  raw: css,
  ...options
}, (error, output) => {
  if (error) {
    console.error('Ошибка при очистке CSS:', error);
    process.exit(1);
  }

  // Записываем результат
  fs.writeFileSync(outputCssFile, output, 'utf8');

  // Статистика
  const originalSize = css.length;
  const cleanSize = output.length;
  const reduction = ((originalSize - cleanSize) / originalSize * 100).toFixed(1);

  console.log('✅ CSS успешно очищен!');
  console.log(`📊 Размер оригинала: ${originalSize} байт`);
  console.log(`📊 Размер очищенного: ${cleanSize} байт`);
  console.log(`📊 Сокращение: ${reduction}%`);
});
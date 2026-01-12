#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Пути к файлам
const htmlFile = path.join(__dirname, 'dist/html/index.html');
const baseCssFile = path.join(__dirname, 'dist/html/assets/base.css');
const outputCssFile = path.join(__dirname, 'dist/html/assets/clean.css');

// Проверяем существование файлов
if (!fs.existsSync(htmlFile)) {
  console.error('❌ HTML файл не найден:', htmlFile);
  process.exit(1);
}

if (!fs.existsSync(baseCssFile)) {
  console.error('❌ CSS файл не найден:', baseCssFile);
  process.exit(1);
}

console.log('🧹 Начинаем очистку CSS с UnCSS...');
console.log('📄 HTML файл:', path.relative(process.cwd(), htmlFile));
console.log('🎨 CSS файл:', path.relative(process.cwd(), baseCssFile));
console.log('💾 Выходной файл:', path.relative(process.cwd(), outputCssFile));

// Получаем размер оригинального файла
const originalSize = fs.statSync(baseCssFile).size;

// Читаем CSS файл
const css = fs.readFileSync(baseCssFile, 'utf8');

try {
  // Используем UnCSS через его API с правильными настройками
  const uncss = require('uncss');

  // Создаем временный HTML файл с встроенными стилями
  const tempHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
</head>
<body>
  ${fs.readFileSync(htmlFile, 'utf8').match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || ''}
</body>
</html>`;

  const options = {
    ignore: [
      /:hover/,
      /:focus/,
      /:active/,
      /:visited/,
      /\.js-/,
      /\.is-/,
      /\.has-/,
      /\[.*\]/,
      /::before/,
      /::after/,
      /::placeholder/,
      /^:root/,
      /^html/,
      /^body/,
      /^button/,
      /^\*/,
      /@layer/,
      /@property/
    ],
    media: true,
    banner: false,
    timeout: 5000,
    report: false
  };

  uncss(tempHtml, options, (error, output) => {
    if (error) {
      console.error('❌ Ошибка при очистке CSS:', error);
      process.exit(1);
    }

    // Записываем результат
    fs.writeFileSync(outputCssFile, output, 'utf8');

    // Получаем размер очищенного файла
    const cleanSize = fs.statSync(outputCssFile).size;
    const reduction = ((originalSize - cleanSize) / originalSize * 100).toFixed(1);

    console.log('✅ CSS успешно очищен с UnCSS!');
    console.log(`📊 Размер оригинала: ${originalSize} байт`);
    console.log(`📊 Размер очищенного: ${cleanSize} байт`);
    console.log(`📊 Сокращение: ${reduction}%`);
  });

} catch (error) {
  console.error('❌ Ошибка при очистке CSS:', error.message);
  process.exit(1);
}
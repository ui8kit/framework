#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Пути к файлам
const htmlFile = path.join(__dirname, 'dist/html/index.html');
const baseCssFile = path.join(__dirname, 'dist/html/assets/base.css');
const outputCssFile = path.join(__dirname, 'dist/html/assets/clean-uncss.css');

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

// Создаем временный HTML с встроенными стилями
const css = fs.readFileSync(baseCssFile, 'utf8');
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

// Создаем временный HTML файл
const tempHtmlFile = path.join(__dirname, 'temp-uncss.html');
fs.writeFileSync(tempHtmlFile, tempHtml, 'utf8');

try {
  // Запускаем UnCSS через CLI
  execSync(`bunx uncss "${tempHtmlFile}" --output "${outputCssFile}" --ignore ":hover,:focus,:active,:visited,.js-,.is-,.has-,[],::before,::after,::placeholder,:root,html,body,button,*,@layer,@property" --media --no-banner --timeout 10000`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Удаляем временный файл
  fs.unlinkSync(tempHtmlFile);

  // Получаем размер очищенного файла
  const cleanSize = fs.statSync(outputCssFile).size;
  const reduction = ((originalSize - cleanSize) / originalSize * 100).toFixed(1);

  console.log('✅ CSS успешно очищен с UnCSS!');
  console.log(`📊 Размер оригинала: ${originalSize} байт`);
  console.log(`📊 Размер очищенного: ${cleanSize} байт`);
  console.log(`📊 Сокращение: ${reduction}%`);

} catch (error) {
  // Удаляем временный файл в случае ошибки
  if (fs.existsSync(tempHtmlFile)) {
    fs.unlinkSync(tempHtmlFile);
  }

  console.error('❌ Ошибка при очистке CSS:', error.message);
  process.exit(1);
}
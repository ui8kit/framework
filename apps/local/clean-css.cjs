#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Пути к файлам
const uncssResultFile = path.join(__dirname, 'dist/html/assets/clean-uncss.css');
const outputCssFile = path.join(__dirname, 'dist/html/assets/clean.css');

// Проверяем существование файла с результатом UnCSS
if (!fs.existsSync(uncssResultFile)) {
  console.error('❌ Файл с результатом UnCSS не найден:', uncssResultFile);
  console.log('💡 Сначала запустите: node clean-css-uncss.cjs');
  process.exit(1);
}

console.log('🧹 Используем результат очистки UnCSS...');
console.log('📄 Файл с результатом UnCSS:', path.relative(process.cwd(), uncssResultFile));
console.log('💾 Выходной файл:', path.relative(process.cwd(), outputCssFile));

// Копируем результат UnCSS как clean.css
fs.copyFileSync(uncssResultFile, outputCssFile);

// Статистика
const baseCssFile = path.join(__dirname, 'dist/html/assets/base.css');
if (fs.existsSync(baseCssFile)) {
  const originalSize = fs.statSync(baseCssFile).size;
  const cleanSize = fs.statSync(outputCssFile).size;
  const reduction = ((originalSize - cleanSize) / originalSize * 100).toFixed(1);

  console.log('✅ CSS успешно очищен!');
  console.log(`📊 Размер оригинала: ${originalSize} байт`);
  console.log(`📊 Размер очищенного: ${cleanSize} байт`);
  console.log(`📊 Сокращение: ${reduction}%`);
} else {
  console.log('✅ Результат UnCSS скопирован в clean.css');
}
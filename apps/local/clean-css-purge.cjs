#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const purgecss = require('@fullhuman/postcss-purgecss').default || require('@fullhuman/postcss-purgecss');

// Пути к файлам
const htmlFile = path.join(__dirname, 'dist/html/index.html');
const baseCssFile = path.join(__dirname, 'dist/html/assets/base.css');
const outputCssFile = path.join(__dirname, 'dist/html/assets/clean-purge.css');

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

console.log('Начинаем очистку CSS с PurgeCSS...');
console.log('HTML файл:', path.relative(process.cwd(), htmlFile));
console.log('CSS файл:', path.relative(process.cwd(), baseCssFile));
console.log('Выходной файл:', path.relative(process.cwd(), outputCssFile));

(async () => {
  try {
    const result = await postcss([
      purgecss({
        content: [{
          raw: html,
          extension: 'html'
        }],
        // Сохраняем важные селекторы
        safelist: {
          standard: [
            /^:root/,
            /^:host/,
            /^html/,
            /^body/,
            /^button/,
            /^\*/,
            /::before/,
            /::after/,
            /:hover/,
            /:focus/,
            /:active/
          ],
          // Сохраняем все CSS переменные
          variables: [/^--/],
          // Сохраняем @layer директивы
          deep: [/^@layer/]
        },
        // Отключаем удаление неиспользуемых медиа-запросов
        keyframes: true,
        fontFace: true,
        variables: true
      })
    ]).process(css, { from: baseCssFile, to: outputCssFile });

    // Записываем результат
    fs.writeFileSync(outputCssFile, result.css, 'utf8');

    // Статистика
    const originalSize = css.length;
    const cleanSize = result.css.length;
    const reduction = ((originalSize - cleanSize) / originalSize * 100).toFixed(1);

    console.log('✅ CSS успешно очищен с PurgeCSS!');
    console.log(`📊 Размер оригинала: ${originalSize} байт`);
    console.log(`📊 Размер очищенного: ${cleanSize} байт`);
    console.log(`📊 Сокращение: ${reduction}%`);

    if (result.warnings && result.warnings.length > 0) {
      console.log('⚠️  Предупреждения:');
      result.warnings.forEach(warning => console.log('  -', warning.text));
    }

  } catch (error) {
    console.error('Ошибка при очистке CSS:', error);
    process.exit(1);
  }
})();
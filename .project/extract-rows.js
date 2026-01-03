const fs = require('fs');
const path = require('path');

const SRC_DOCS_DIR = path.join(__dirname, 'src-docs');
const OUTPUT_FILE = path.join(__dirname, 'all-rows-map.json');

// Функция для извлечения rows из MDX файла
function extractRowsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Находим ApiTable компонент
  const apiTableMatch = content.match(/<ApiTable\s+rows=\{([\s\S]*?)\}\s*\/>/);
  if (!apiTableMatch) return null;

  const rowsContent = apiTableMatch[1];

  // Если есть ссылки на colors, пропускаем этот файл пока
  if (rowsContent.includes('colors') || rowsContent.includes('Object.entries')) {
    console.log(`⚠️  Skipping ${path.basename(filePath)} - contains dynamic content`);
    return null;
  }

  try {
    // Простой парсинг для статических массивов
    // Ищем паттерн [["key", "value"], ["key2", "value2"]]
    const arrayMatch = rowsContent.match(/^\s*\[([\s\S]*?)\]\s*$/);
    if (!arrayMatch) return null;

    const arrayContent = arrayMatch[1];

    // Разбираем массив пар
    const pairs = [];
    const pairRegex = /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g;
    let match;

    while ((match = pairRegex.exec(arrayContent)) !== null) {
      pairs.push([match[1], match[2]]);
    }

    return pairs.length > 0 ? pairs : null;

  } catch (e) {
    console.error(`Error parsing rows in ${filePath}:`, e.message);
  }

  return null;
}

// Основная функция
function main() {
  const allRows = {};

  // Получаем все .mdx файлы
  const files = fs.readdirSync(SRC_DOCS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(SRC_DOCS_DIR, file));

  console.log(`Processing ${files.length} MDX files...`);

  for (const file of files) {
    const rows = extractRowsFromFile(file);
    if (rows) {
      // Добавляем все пары ключ-значение в общий объект
      for (const [key, value] of rows) {
        if (typeof key === 'string' && typeof value === 'string') {
          allRows[key] = value;
        }
      }
      console.log(`✓ Processed ${path.basename(file)} (${rows.length} entries)`);
    } else {
      console.log(`✗ Failed to process ${path.basename(file)}`);
    }
  }

  // Сортируем ключи для лучшей читаемости
  const sortedRows = {};
  Object.keys(allRows).sort().forEach(key => {
    sortedRows[key] = allRows[key];
  });

  // Записываем результат в JSON файл
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedRows, null, 2));

  console.log(`\n✅ Successfully created ${OUTPUT_FILE}`);
  console.log(`Total entries: ${Object.keys(sortedRows).length}`);
}

if (require.main === module) {
  main();
}

module.exports = { extractRowsFromFile, main };

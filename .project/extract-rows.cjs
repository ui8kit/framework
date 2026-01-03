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

  // Обрабатываем imports для colors если они есть
  let colors = {};
  const colorsImportMatch = content.match(/import colors from "\.\/utils\/colors";/);
  if (colorsImportMatch) {
    try {
      const colorsPath = path.join(path.dirname(filePath), 'utils', 'colors.js');
      if (fs.existsSync(colorsPath)) {
        colors = require(colorsPath);
      }
    } catch (e) {
      console.warn(`Could not load colors from ${filePath}`);
    }
  }

  try {
    // Простая реализация dedent
    function dedent(strings, ...values) {
      const str = strings.reduce((result, string, i) => result + string + (values[i] || ''), '');
      const lines = str.split('\n');
      const minIndent = Math.min(...lines.filter(line => line.trim()).map(line => line.match(/^(\s*)/)[1].length));
      return lines.map(line => line.slice(minIndent)).join('\n').trim();
    }

    // Создаем безопасный контекст для выполнения JS кода
    const sandbox = {
      Object,
      Array,
      colors,
      dedent,
      console: { log: () => {}, warn: () => {}, error: () => {} }
    };

    // Функция для безопасного выполнения кода
    function safeEval(code) {
      try {
        const func = new Function(...Object.keys(sandbox), `return (${code})`);
        return func(...Object.values(sandbox));
      } catch (e) {
        throw new Error(`Safe eval failed: ${e.message}`);
      }
    }

    // Выполняем rows код
    const rows = safeEval(rowsContent);

    if (Array.isArray(rows)) {
      return rows;
    }
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

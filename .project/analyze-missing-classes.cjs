const fs = require('fs');
const path = require('path');

const CLASSES_FILE = path.join(__dirname, 'all-ui8kit-classes.json');
const ROWS_MAP_FILE = path.join(__dirname, 'all-rows-map.json');
const FILTERED_FILE = path.join(__dirname, 'ui8kit-tw-css.json');

// Функция для анализа паттернов классов
function analyzeClassPatterns(classes) {
  const patterns = {};

  for (const cls of classes) {
    // Разбираем класс на части
    const parts = cls.split('-');

    // Группируем по префиксу
    const prefix = parts[0];
    if (!patterns[prefix]) {
      patterns[prefix] = [];
    }
    patterns[prefix].push(cls);
  }

  return patterns;
}

// Функция для поиска похожих шаблонов
function findSimilarTemplates(cls, rowsKeys) {
  const similar = [];

  // Ищем шаблоны с тем же префиксом
  const prefix = cls.split('-')[0];
  const prefixTemplates = rowsKeys.filter(key => key.startsWith(prefix + '-'));

  for (const template of prefixTemplates) {
    // Проверяем, является ли это шаблоном (содержит < > или ( ))
    if (template.includes('<') || template.includes('(')) {
      similar.push(template);
    }
  }

  return similar;
}

// Функция для классификации отсутствующих классов
function classifyMissingClasses(missingClasses, rowsKeys) {
  const categories = {
    noTemplate: [], // Нет соответствующего шаблона вообще
    hasTemplate: [], // Есть шаблон, но не конкретный класс
    dynamicColors: [], // Цветовые классы, генерируемые динамически
    other: []
  };

  const colorPrefixes = ['accent', 'bg', 'text', 'border', 'caret', 'fill', 'stroke', 'outline'];

  for (const cls of missingClasses) {
    const prefix = cls.split('-')[0];

    // Проверяем, является ли это цветовым классом
    if (colorPrefixes.includes(prefix)) {
      categories.dynamicColors.push(cls);
      continue;
    }

    // Ищем похожие шаблоны
    const similar = findSimilarTemplates(cls, rowsKeys);

    if (similar.length > 0) {
      categories.hasTemplate.push({ class: cls, templates: similar });
    } else {
      categories.noTemplate.push(cls);
    }
  }

  return categories;
}

// Основная функция
function main() {
  console.log('Loading data...');
  const classes = JSON.parse(fs.readFileSync(CLASSES_FILE, 'utf8'));
  const rowsMap = JSON.parse(fs.readFileSync(ROWS_MAP_FILE, 'utf8'));
  const filteredMap = JSON.parse(fs.readFileSync(FILTERED_FILE, 'utf8'));

  const rowsKeys = Object.keys(rowsMap);
  const filteredKeys = Object.keys(filteredMap);
  const missingClasses = classes.filter(cls => !filteredKeys.includes(cls));

  console.log(`\n📊 Analysis Results:`);
  console.log(`Total classes in UI8Kit: ${classes.length}`);
  console.log(`Classes found in documentation: ${filteredKeys.length}`);
  console.log(`Missing classes: ${missingClasses.length}`);

  // Анализируем паттерны
  const patterns = analyzeClassPatterns(classes);
  console.log(`\n🔍 Class prefixes analysis:`);
  const topPrefixes = Object.entries(patterns)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 10);
  topPrefixes.forEach(([prefix, classes]) => {
    console.log(`  ${prefix}: ${classes.length} classes`);
  });

  // Классифицируем отсутствующие классы
  const categories = classifyMissingClasses(missingClasses, rowsKeys);

  console.log(`\n📋 Missing classes breakdown:`);
  console.log(`  Dynamic color classes: ${categories.dynamicColors.length}`);
  console.log(`  Classes with templates: ${categories.hasTemplate.length}`);
  console.log(`  Classes without templates: ${categories.noTemplate.length}`);

  // Детальный анализ цветовых классов
  console.log(`\n🎨 Dynamic color classes (first 10):`);
  categories.dynamicColors.slice(0, 10).forEach(cls => {
    console.log(`  ${cls}`);
  });

  // Анализ классов с шаблонами
  console.log(`\n📝 Classes with templates (first 5):`);
  categories.hasTemplate.slice(0, 5).forEach(item => {
    console.log(`  ${item.class} -> ${item.templates.join(', ')}`);
  });

  // Анализ классов без шаблонов
  console.log(`\n❓ Classes without templates (first 10):`);
  categories.noTemplate.slice(0, 10).forEach(cls => {
    console.log(`  ${cls}`);
  });

  // Сохраняем детальный отчет
  const report = {
    summary: {
      totalClasses: classes.length,
      foundClasses: filteredKeys.length,
      missingClasses: missingClasses.length
    },
    categories,
    patterns: Object.fromEntries(
      Object.entries(patterns).map(([k, v]) => [k, v.length])
    )
  };

  fs.writeFileSync(
    path.join(__dirname, 'missing-classes-analysis.json'),
    JSON.stringify(report, null, 2)
  );

  console.log(`\n💾 Detailed report saved to: missing-classes-analysis.json`);
}

if (require.main === module) {
  main();
}

module.exports = { analyzeClassPatterns, findSimilarTemplates, classifyMissingClasses, main };

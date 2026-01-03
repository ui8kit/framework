const fs = require('fs');
const path = require('path');

const CLASSES_FILE = path.join(__dirname, 'all-ui8kit-classes.json');
const ROWS_MAP_FILE = path.join(__dirname, 'all-rows-map.json');
const EXISTING_MAP_FILE = path.join(__dirname, 'ui8kit-tw-css.json');
const ANALYSIS_FILE = path.join(__dirname, 'missing-classes-analysis.json');

// Функция для извлечения значения из имени класса
function extractValueFromClassName(className, template) {
  // Определяем тип шаблона и извлекаем значение
  if (template.includes('<number>')) {
    // Ищем последнее число в классе (целое число)
    const numberMatch = className.match(/(\d+)$/);
    return numberMatch ? numberMatch[1] : null;
  }

  if (template.includes('<fraction>')) {
    // Дроби могут быть как 1/2, 3/4 и т.д.
    const fractionMatch = className.match(/(\d+\/\d+)$/);
    if (fractionMatch) return fractionMatch[1];

    // Или простые дроби как 0.5
    const decimalMatch = className.match(/(\d*\.\d+)$/);
    return decimalMatch ? decimalMatch[1] : null;
  }

  if (template.includes('<custom-property>')) {
    // CSS переменные - все что в скобках
    const varMatch = className.match(/\(([^)]+)\)$/);
    return varMatch ? varMatch[1] : null;
  }

  if (template.includes('[<value>]')) {
    // Произвольные значения в квадратных скобках
    const valueMatch = className.match(/\[([^\]]+)\]$/);
    return valueMatch ? valueMatch[1] : null;
  }

  if (template.includes('<angle>')) {
    // Углы: 45deg, 90deg и т.д.
    const angleMatch = className.match(/(\d+deg)$/);
    return angleMatch ? angleMatch[1] : null;
  }

  if (template.includes('<color>')) {
    // Цвета: все что после последнего дефиса
    const parts = className.split('-');
    return parts[parts.length - 1];
  }

  return null;
}

// Функция для выбора наиболее подходящего шаблона
function selectBestTemplate(className, templates) {
  // Анализируем конец имени класса для определения типа значения
  const lastPart = className.split('-').pop();

  // Приоритеты по специфичности (от конкретного к общему)
  const priorities = [
    // 1. Специфичный префикс (точное совпадение) - самый высокий приоритет
    (t) => {
      const prefix = className.split('-').slice(0, -1).join('-');
      return t.startsWith(prefix + '-<');
    },

    // 2. CSS переменные
    (t) => t.includes('<custom-property>') && className.includes('('),

    // 3. Произвольные значения в скобках
    (t) => t.includes('[<value>]') && className.includes('['),

    // 4. Углы
    (t) => t.includes('<angle>') && /deg$/.test(className),

    // 5. Цвета (если последняя часть не число)
    (t) => t.includes('<color>') && !/\d$/.test(lastPart),

    // 6. Числа (целочисленные)
    (t) => t.includes('<number>') && /^\d+$/.test(lastPart),

    // 7. Дроби (десятичные или с дробной чертой)
    (t) => t.includes('<fraction>') && (/\d*\.\d+$/.test(lastPart) || /\d+\/\d+$/.test(lastPart)),

    // 8. Общий префикс
    (t) => {
      const firstPrefix = className.split('-')[0];
      return t.startsWith(firstPrefix + '-<');
    },

    // 9. Любой шаблон
    (t) => true
  ];

  for (const priorityFn of priorities) {
    const candidates = templates.filter(priorityFn);
    if (candidates.length > 0) {
      // Выбираем наиболее специфичный шаблон из подходящих
      return candidates.sort((a, b) => {
        // Приоритеты по типу шаблона (от специфичного к общему)
        const typePriority = {
          '<custom-property>': 1,
          '[<value>]': 2,
          '<angle>': 3,
          '<number>': 4,
          '<fraction>': 5,
          '<color>': 6
        };

        const getType = (template) => {
          for (const [type, priority] of Object.entries(typePriority)) {
            if (template.includes(type)) return priority;
          }
          return 999;
        };

        const aType = getType(a);
        const bType = getType(b);

        if (aType !== bType) return aType - bType;

        // Если типы одинаковые, выбираем более длинный/специфичный
        return b.length - a.length;
      })[0];
    }
  }

  return templates[0]; // fallback
}

// Функция для генерации CSS из шаблона
function generateCssFromTemplate(template, cssTemplate, value) {
  if (!cssTemplate || !value) return null;

  let result = cssTemplate;

  // Заменяем плейсхолдеры на значение
  if (template.includes('<number>') || template.includes('<fraction>') ||
      template.includes('<angle>') || template.includes('<color>')) {
    result = result.replace(/<[^>]+>/g, value);
  }

  if (template.includes('<custom-property>')) {
    result = result.replace(/<custom-property>/g, `var(${value})`);
  }

  if (template.includes('[<value>]')) {
    result = result.replace(/\[<value>\]/g, value);
  }

  return result;
}

// Основная функция
function main() {
  console.log('Loading data...');
  const classes = JSON.parse(fs.readFileSync(CLASSES_FILE, 'utf8'));
  const rowsMap = JSON.parse(fs.readFileSync(ROWS_MAP_FILE, 'utf8'));
  const existingMap = JSON.parse(fs.readFileSync(EXISTING_MAP_FILE, 'utf8'));
  const analysis = JSON.parse(fs.readFileSync(ANALYSIS_FILE, 'utf8'));

  const existingKeys = new Set(Object.keys(existingMap));
  const generatedClasses = {};

  console.log('Generating missing classes from templates...');

  let generatedCount = 0;
  let failedCount = 0;

  // Проходим по всем классам с шаблонами
  for (const item of analysis.categories.hasTemplate) {
    const { class: className, templates } = item;

    // Пропускаем если класс уже есть
    if (existingKeys.has(className)) continue;

    // Выбираем лучший шаблон
    const bestTemplate = selectBestTemplate(className, templates);

    if (!bestTemplate || !rowsMap[bestTemplate]) {
      console.log(`❌ No template found for ${className}`);
      failedCount++;
      continue;
    }

    // Извлекаем значение
    const value = extractValueFromClassName(className, bestTemplate);

    if (!value) {
      console.log(`❌ Could not extract value from ${className} for template ${bestTemplate}`);
      failedCount++;
      continue;
    }

    // Генерируем CSS
    const cssTemplate = rowsMap[bestTemplate];
    const generatedCss = generateCssFromTemplate(bestTemplate, cssTemplate, value);

    if (!generatedCss) {
      console.log(`❌ Could not generate CSS for ${className}`);
      failedCount++;
      continue;
    }

    generatedClasses[className] = generatedCss;
    generatedCount++;

    if (generatedCount % 50 === 0) {
      console.log(`✅ Generated ${generatedCount} classes...`);
    }
  }

  // Сортируем и сохраняем
  const sortedGenerated = {};
  Object.keys(generatedClasses).sort().forEach(key => {
    sortedGenerated[key] = generatedClasses[key];
  });

  // Объединяем с существующей картой
  const finalMap = { ...existingMap, ...sortedGenerated };

  // Сортируем финальную карту
  const finalSorted = {};
  Object.keys(finalMap).sort().forEach(key => {
    finalSorted[key] = finalMap[key];
  });

  fs.writeFileSync(
    path.join(__dirname, 'ui8kit-tw-css-extended.json'),
    JSON.stringify(finalSorted, null, 2)
  );

  console.log(`\n📊 Generation Results:`);
  console.log(`Generated classes: ${generatedCount}`);
  console.log(`Failed to generate: ${failedCount}`);
  console.log(`Total classes now: ${Object.keys(finalSorted).length}`);
  console.log(`\n💾 Extended map saved to: ui8kit-tw-css-extended.json`);

  // Проверяем сколько классов из оригинального списка теперь покрыто
  const coveredClasses = classes.filter(cls => finalSorted[cls]);
  console.log(`\n✅ Coverage improvement:`);
  console.log(`Originally covered: ${Object.keys(existingMap).length} / ${classes.length} (${Math.round(Object.keys(existingMap).length / classes.length * 100)}%)`);
  console.log(`Now covered: ${coveredClasses.length} / ${classes.length} (${Math.round(coveredClasses.length / classes.length * 100)}%)`);
  console.log(`Added: ${generatedCount} classes`);
}

if (require.main === module) {
  main();
}

module.exports = {
  extractValueFromClassName,
  selectBestTemplate,
  generateCssFromTemplate,
  main
};

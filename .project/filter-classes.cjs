const fs = require('fs');
const path = require('path');

const CLASSES_FILE = path.join(__dirname, 'all-ui8kit-classes.json');
const ROWS_MAP_FILE = path.join(__dirname, 'all-rows-map.json');
const OUTPUT_FILE = path.join(__dirname, 'ui8kit-tw-css.json');

// Функция для чтения массива классов
function loadClasses() {
  const classesData = fs.readFileSync(CLASSES_FILE, 'utf8');
  const classes = JSON.parse(classesData);
  return new Set(classes); // Используем Set для быстрого поиска
}

// Функция для чтения карты rows
function loadRowsMap() {
  const rowsData = fs.readFileSync(ROWS_MAP_FILE, 'utf8');
  return JSON.parse(rowsData);
}

// Функция для фильтрации карты по списку классов
function filterRowsMap(rowsMap, classesSet) {
  const filtered = {};

  for (const [key, value] of Object.entries(rowsMap)) {
    if (classesSet.has(key)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

// Основная функция
function main() {
  console.log('Loading classes list...');
  const classesSet = loadClasses();
  console.log(`Loaded ${classesSet.size} class names`);

  console.log('Loading rows map...');
  const rowsMap = loadRowsMap();
  console.log(`Loaded ${Object.keys(rowsMap).length} entries from rows map`);

  console.log('Filtering rows map...');
  const filteredMap = filterRowsMap(rowsMap, classesSet);

  // Сортируем ключи для лучшей читаемости
  const sortedFilteredMap = {};
  Object.keys(filteredMap).sort().forEach(key => {
    sortedFilteredMap[key] = filteredMap[key];
  });

  console.log('Writing filtered map to file...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedFilteredMap, null, 2));

  console.log(`\n✅ Successfully created ${OUTPUT_FILE}`);
  console.log(`Filtered entries: ${Object.keys(sortedFilteredMap).length}`);
  console.log(`Removed entries: ${Object.keys(rowsMap).length - Object.keys(sortedFilteredMap).length}`);
}

if (require.main === module) {
  main();
}

module.exports = { loadClasses, loadRowsMap, filterRowsMap, main };

// Простой тест браузерной версии UnCSS
const testHTML = `
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <h1 class="title">Hello World</h1>
    <p class="text">This is a test</p>
    <button class="btn btn-primary">Click me</button>
  </div>
</body>
</html>
`;

const testCSS = `
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  color: #333;
  font-size: 2rem;
}

.text {
  color: #666;
}

.btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: blue;
  color: white;
}

/* Неиспользуемые стили */
.unused-class {
  color: red;
}

.another-unused {
  background: yellow;
}
`;

class BrowserUnCSS {
  static async process(html, css) {
    // Парсим HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Извлекаем селекторы из CSS
    const cssSelectors = this.extractSelectorsFromCSS(css);

    // Проверяем какие селекторы используются
    const usedSelectors = new Set();

    cssSelectors.forEach(selector => {
      try {
        const elements = doc.querySelectorAll(selector);
        if (elements.length > 0) {
          usedSelectors.add(selector);
        }
      } catch (e) {
        // Игнорируем невалидные селекторы
      }
    });

    // Генерируем чистый CSS
    return this.generateCleanCSS(css, usedSelectors);
  }

  static extractSelectorsFromCSS(css) {
    const selectors = [];
    const rules = css.split('}');

    rules.forEach(rule => {
      const parts = rule.split('{');
      if (parts.length === 2) {
        const selectorPart = parts[0].trim();
        if (selectorPart) {
          const individualSelectors = selectorPart.split(',').map(s => s.trim());
          selectors.push(...individualSelectors);
        }
      }
    });

    return selectors;
  }

  static generateCleanCSS(originalCSS, usedSelectors) {
    const rules = originalCSS.split('}');
    const cleanRules = [];

    rules.forEach(rule => {
      const parts = rule.split('{');
      if (parts.length === 2) {
        const selectorPart = parts[0].trim();
        const declarationPart = parts[1].trim();

        if (selectorPart && declarationPart) {
          const selectors = selectorPart.split(',').map(s => s.trim());
          const hasUsedSelector = selectors.some(sel => usedSelectors.has(sel));

          if (hasUsedSelector) {
            cleanRules.push(`${selectorPart} {${declarationPart}}`);
          }
        }
      }
    });

    return cleanRules.join('\n\n') + '\n';
  }
}

// Тестируем
BrowserUnCSS.process(testHTML, testCSS).then(result => {
  console.log('Оригинальный CSS:');
  console.log(testCSS);
  console.log('\nРезультат UnCSS:');
  console.log(result);
}).catch(error => {
  console.error('Ошибка:', error);
});
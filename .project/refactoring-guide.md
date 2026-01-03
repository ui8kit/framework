# 🧑‍💻 UI8Kit Props Refactoring Guide
*For Junior Developer - After Props Update Chaos*

## 📋 Что случилось?
Другой разработчик обновил props в UI8Kit компонентах, но не согласовал изменения. Теперь в коде есть неправильное использование props с модификаторами.

## 🚨 Проблемы, которые я нашел:

### 1. Props с модификаторами
```tsx
// ❌ БЫЛО (ломает систему):
<Box col="span-1 lg:span-3" />

// ✅ СТАЛО (правильно):
<Box col="span-1" className="lg:col-span-3" />
```

### 2. Неправильная Grid логика
```tsx
// ❌ БЫЛО (не работает на мобильных):
<Grid cols="1-4" gap="6">
  <Box col="span-3" />  // На мобильных занимает 3 колонки из 1!
</Grid>

// ✅ СТАЛО (работает везде):
<Grid cols="1-4" gap="6">
  <Box col="span-1" className="lg:col-span-3" />
</Grid>
```

## 🔧 Моя инструкция по исправлению:

### Шаг 1: Найти проблемные места
```bash
# Искать в коде:
grep -r 'col=".*lg:' apps/local/src/
grep -r 'col=".*md:' apps/local/src/
```

### Шаг 2: Исправить каждый компонент
1. **Вытащить базовое значение** в prop
2. **Перенести модификаторы** в className
3. **Проверить TypeScript** - ошибок быть не должно

### Шаг 3: Проверить работу
- **Мобильные**: контент занимает всю ширину (`col="span-1"`)
- **Десктоп**: правильное распределение (`lg:col-span-3`)
- **Sidebar**: правильный порядок (`order-1/order-2`)

## 🎯 Правильные паттерны (запомнить!):

```tsx
// Grid layout с sidebar
<Grid cols="1-4" gap="6">
  {/* Main content */}
  <Box
    col="span-1"
    className={sidebar === 'left' ? 'lg:col-span-3 md:order-2 order-1' : 'lg:col-span-3 order-1'}
  >
    <Stack gap="6">{children}</Stack>
  </Box>

  {/* Sidebar */}
  <Box
    col="span-1"
    className={sidebar === 'left' ? 'md:order-1 order-2' : 'order-2'}
  >
    <Aside />
  </Box>
</Grid>

// Кнопки и текст
<Button variant="ghost" size="sm" />
<Text text="base" font="bold" bg="primary" />
```

## ⚡ Быстрые проверки:

1. **TypeScript ошибки?** → Исправить props
2. **Модификаторы в props?** → Перенести в className
3. **Grid на мобильных ломается?** → Проверить col="span-1" + responsive в className
4. **Sidebar не на своем месте?** → Проверить order классы

## 🏆 Успех = Clean TypeScript + Working Responsive Layout

---
*Создано юным разработчиком после изучения переписок и анализа кода*

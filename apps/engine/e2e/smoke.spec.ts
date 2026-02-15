import { expect, test } from '@playwright/test';

async function loginAsAdmin(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/admin');
  const inputs = page.locator('[data-class="admin-login-input"]');
  await inputs.nth(0).fill('admin');
  await inputs.nth(1).fill('admin');
  await page.locator('[data-class="admin-login-submit"]').click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
}

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-class="hero-section"]')).toBeVisible();
});

test('/components renders cards grid', async ({ page }) => {
  await page.goto('/components');
  await expect(page.locator('[data-class="components-grid"]')).toBeVisible();
  await expect(page.locator('[data-class="components-item-card"]')).toHaveCount(3);
});

test('/guides/:slug renders dynamic detail page', async ({ page }) => {
  await page.goto('/guides');
  await page.locator('[data-class="guide-card-link"]').first().click();
  await expect(page).toHaveURL(/\/guides\/.+/);
  await expect(page.locator('[data-class="guide-detail-section"]')).toBeVisible();
  await expect(page.locator('[data-class="guide-detail-title"]')).toBeVisible();
});

test('admin login, export, and import flow', async ({ page }) => {
  await loginAsAdmin(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-class="admin-export-button"]').click(),
  ]);
  expect(download.suggestedFilename()).toBe('ui8kit-data.json');

  const fileInput = page.locator('input[type="file"][accept=".json"]');
  await fileInput.setInputFiles({
    name: 'import.json',
    mimeType: 'application/json',
    buffer: new TextEncoder().encode(JSON.stringify({ components: { title: 'Import check' } })),
  });
  await expect(page.locator('[data-class="admin-import-button"]')).toBeVisible();
});

test('theme toggle persists after navigation and reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-class="theme-toggle"]').click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.goto('/components');
  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('responsive layout renders on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/components');
  await expect(page.locator('[data-class="main-layout-header"]')).toBeVisible();
  await expect(page.locator('[data-class="components-grid"]')).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('[data-class="main-layout-header"]')).toBeVisible();
  await expect(page.locator('[data-class="components-grid"]')).toBeVisible();
});

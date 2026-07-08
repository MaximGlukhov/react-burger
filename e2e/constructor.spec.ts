import { test, expect } from '@playwright/test';

test('', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await expect(page.getByText('Соберите бургер')).toBeVisible();
});

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://new-stellarburgers.education-services.ru/api/';

async function dragIngredientToConstructor(
  page: Page,
  sourceTestId: string
): Promise<void> {
  await page.evaluate(
    ({ sourceId, targetId }) => {
      const source = document.querySelector(`[data-testid="${sourceId}"]`);
      const target = document.querySelector(`[data-testid="${targetId}"]`);
      if (!source || !target) throw new Error('Elements not found');
      const dt = new DataTransfer();
      source.dispatchEvent(
        new DragEvent('dragstart', { bubbles: true, dataTransfer: dt })
      );
      target.dispatchEvent(
        new DragEvent('dragenter', { bubbles: true, dataTransfer: dt })
      );
      target.dispatchEvent(
        new DragEvent('dragover', { bubbles: true, dataTransfer: dt })
      );
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
    },
    { sourceId: sourceTestId, targetId: 'sortable-list' }
  );
}

test('перетаскивание ингредиентов в коструктор', async ({ page }) => {
  await page.goto('/');

  const constructor = page.getByTestId('sortable-list');

  await expect(constructor).toContainText('Выберите булки');
  await expect(constructor).toContainText('Выберите начинку');

  const bunCard = page.locator('[data-testid^="ingredient-"]').first();
  await bunCard.waitFor({ state: 'visible' });

  const bunTestId = await bunCard.getAttribute('data-testid');
  expect(bunTestId).toBeTruthy();

  await dragIngredientToConstructor(page, bunTestId!);

  await expect(constructor).not.toContainText('Выберите булки');
});

test('сбор бургера и оформление заказа', async ({ page, request }) => {
  test.slow();

  const testEmail = `test-${Date.now()}@test.ru`;
  const testPassword = 'test123456';
  const testName = 'E2E Test User';

  const registerRes = await request.post(`${BASE_URL}auth/register`, {
    data: { email: testEmail, password: testPassword, name: testName },
  });
  expect(registerRes.ok(), 'Registration should succeed').toBeTruthy();
  const { accessToken, refreshToken } = (await registerRes.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  await page.addInitScript(
    ({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    { accessToken, refreshToken }
  );

  await page.goto('/');

  const constructor = page.getByTestId('sortable-list');

  const bunCard = page.locator('[data-testid^="ingredient-"]').first();
  await bunCard.waitFor({ state: 'visible' });

  await expect(constructor).toContainText('Выберите булки');
  await expect(constructor).toContainText('Выберите начинку');

  const bunTestId = (await bunCard.getAttribute('data-testid'))!;
  await dragIngredientToConstructor(page, bunTestId);
  await expect(constructor).not.toContainText('Выберите булки');

  const fillingCard = page.locator('[data-testid^="ingredient-"]').nth(2);
  const fillingTestId = (await fillingCard.getAttribute('data-testid'))!;
  await dragIngredientToConstructor(page, fillingTestId);
  await expect(constructor).not.toContainText('Выберите начинку');

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible({
    timeout: 15_000,
  });

  const orderNumber = page.locator('.text_type_digits-large').first();
  await expect(orderNumber).toBeVisible();
  const orderText = await orderNumber.textContent();
  expect(orderText).toMatch(/^\d+$/);

  await page.keyboard.press('Escape');
  await expect(page.getByText('Ваш заказ начали готовить')).not.toBeVisible();
  await expect(constructor).toContainText('Выберите булки');
  await expect(constructor).toContainText('Выберите начинку');
});

test('открытие модалки с деталями ингредиента по клику', async ({ page }) => {
  await page.goto('/');

  const bunCard = page.locator('[data-testid^="ingredient-"]').first();
  await bunCard.waitFor({ state: 'visible' });

  await bunCard.click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  const ingredientName = await bunCard.locator('p.text_type_main-default').textContent();
  const modalName = page
    .locator('section')
    .filter({ hasText: 'Детали ингредиента' })
    .locator('p.text_type_main-medium');
  await expect(modalName).toHaveText(ingredientName!);

  await expect(page.getByText('Калории,ккал')).toBeVisible();
  await expect(page.getByText('Белки, г')).toBeVisible();
  await expect(page.getByText('Жиры, г')).toBeVisible();
  await expect(page.getByText('Углеводы, г')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

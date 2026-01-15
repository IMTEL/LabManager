import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/login');


  await expect(page.getByRole('heading', { name: 'VR Lab Management' })).toBeVisible();
});

 /* test('login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Click the get started link.
  await page.getByPlaceholder("Username").fill("ola");
  await page.getByPlaceholder("Password").fill("1234");

  await page.getByRole('button', { name: 'Login' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible();
}); */


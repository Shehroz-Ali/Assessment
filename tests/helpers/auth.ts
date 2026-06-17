import { Page, expect } from '@playwright/test';

export const BASE_URL = 'https://evo.dev.theysaid.io';

export function getCredentials() {
  const email = process.env.EVO_EMAIL;
  const password = process.env.EVO_PASSWORD;

  if (!email || !password) {
    throw new Error('Set EVO_EMAIL and EVO_PASSWORD in your .env file');
  }

  return { email, password };
}

export async function login(page: Page) {
  const { email, password } = getCredentials();

  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('button', { name: /continue/i }).first().click();
  await page.waitForURL(/password/, { timeout: 20_000 });

  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/evo\.dev\.theysaid\.io/, { timeout: 45_000, waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: /add project/i })).toBeVisible({ timeout: 30_000 });
}

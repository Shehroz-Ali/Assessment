/**
 * Flow 3 of 4 — Upload a document in Teach AI
 *
 * What this tests:
 *   Verifies a logged-in user can upload a file to the Teach AI knowledge base
 *   using the "Add file" feature.
 *
 * What it does:
 *   1. Logs in
 *   2. Navigates to Teach AI from the sidebar
 *   3. Clicks "Add file" and attaches fixtures/test-document.txt
 *   4. Asserts the uploaded filename appears on the page
 *
 * Note: This test runs independently (in parallel with the other 3 flows).
 */
import path from 'path';
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

const TEST_DOCUMENT = path.join(__dirname, '../fixtures/test-document.txt');

test.describe('Teach AI', () => {
  test('user can upload a document via Add file', async ({ page }) => {
    await login(page);

    // Open Teach AI from the main navigation
    await page.getByRole('link', { name: /teach ai/i }).click();
    await expect(page).toHaveURL(/\/home\/teach-ai/);
    await expect(page.getByRole('button', { name: /add file/i })).toBeVisible();

    // Upload a local text file via the hidden file input
    await page.getByRole('button', { name: /add file/i }).click();

    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached({ timeout: 10_000 });
    await fileInput.setInputFiles(TEST_DOCUMENT);

    // Confirm the document was accepted and is listed
    await expect(page.getByText(/test-document\.txt/i)).toBeVisible({ timeout: 30_000 });
  });
});

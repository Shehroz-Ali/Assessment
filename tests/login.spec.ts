/**
 * Flow 1 of 4 — Login
 *
 * What this tests:
 *   Verifies an existing user can sign in with email + password and reach the
 *   authenticated dashboard. Registration is intentionally NOT covered here
 *   because it requires a manual OTP from email.
 *
 * What it does:
 *   1. Opens evo.dev.theysaid.io (redirects to WorkOS AuthKit)
 *   2. Enters email and continues to the password step
 *   3. Enters password and submits
 *   4. Asserts the user lands on /projects with key nav items visible
 *
 * Note: This test runs independently (in parallel with the other 3 flows).
 */
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Login', () => {
  test('user can sign in with email and password', async ({ page }) => {
    // Sign in via WorkOS AuthKit (email → password)
    await login(page);

    // Confirm we are on the projects dashboard as an authenticated user
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByRole('button', { name: /add project/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /teach ai/i })).toBeVisible();
  });
});

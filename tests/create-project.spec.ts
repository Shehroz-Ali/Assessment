/**
 * Flow 2 of 4 — Create a project
 *
 * What this tests:
 *   Verifies a logged-in user can create a new AI Survey project from scratch.
 *
 * What it does:
 *   1. Logs in
 *   2. Clicks "Add project" and selects the "AI Survey" project type
 *   3. Fills in a default rating-scale question in the editor
 *   4. Clicks "Draft project" and waits for the project to be saved
 *   5. Asserts the project editor shows a Publish/Unpublish control
 *
 * Note: This test runs independently (in parallel with the other 3 flows).
 */
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { createAiSurveyProject } from './helpers/project';

test.describe('Create Project', () => {
  test('user can create a new AI Survey project', async ({ page }) => {
    await login(page);

    // Add project → AI Survey → fill question → Draft
    await createAiSurveyProject(page);

    // A drafted project should expose publish controls in the editor
    await expect(page.getByRole('button', { name: /publish|unpublish/i })).toBeVisible();
  });
});

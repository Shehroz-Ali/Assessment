/**
 * Flow 4 of 4 — Publish a project and take its survey
 *
 * What this tests:
 *   Verifies the full publish → respond path: a user creates a survey, publishes
 *   it, opens the public survey link, and submits a response as a respondent.
 *
 * What it does:
 *   1. Logs in
 *   2. Creates and drafts a new AI Survey project
 *   3. Clicks Publish and confirms the "project has been published" dialog
 *   4. Copies the shareable survey URL from the publish dialog
 *   5. Opens the survey in a new tab (respondent view, not logged in)
 *   6. Dismisses the onboarding overlay, sets a rating, and sends the response
 *   7. Asserts a thank-you / completion message appears
 *
 * Note: This test runs independently (in parallel with the other 3 flows).
 */
import { test } from '@playwright/test';
import { login } from './helpers/auth';
import {
  createAiSurveyProject,
  publishProject,
  getSurveyUrl,
  completeSurvey,
} from './helpers/project';

test.describe('Publish & Survey', () => {
  test('user can publish a project and complete its survey', async ({ page, context }) => {
    await login(page);

    // Build and save a new survey project
    await createAiSurveyProject(page);

    // Publish and verify the success/share dialog
    await publishProject(page);

    // Grab the public survey link and open it as a respondent
    const surveyUrl = await getSurveyUrl(page);
    await page.getByRole('button', { name: /close dialog/i }).click().catch(() => {});

    const surveyPage = await context.newPage();
    await surveyPage.goto(surveyUrl);

    // Answer the survey and confirm submission
    await completeSurvey(surveyPage);
  });
});

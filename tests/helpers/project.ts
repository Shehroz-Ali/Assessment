import { Page, expect } from '@playwright/test';

async function dismissGenerateDialog(page: Page) {
  const dialog = page.getByTestId('generate-dialog-content');
  if (await dialog.isVisible({ timeout: 5_000 }).catch(() => false)) {
    const learningGoal = page.getByLabel(/learning goal|purpose/i);
    if (await learningGoal.isVisible()) {
      await learningGoal.fill('Measure customer satisfaction with a simple NPS question.');
    }

    const skipBtn = page.getByRole('button', { name: /^skip$/i });
    const continueBtn = dialog.getByRole('button', { name: /continue|generate|draft/i });

    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    } else if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(dialog).toBeHidden({ timeout: 10_000 });
  }
}

async function fillDefaultQuestion(page: Page) {
  const questionText = page
    .getByTestId('question-text')
    .or(page.locator('textarea[name="questions.0.text"]'))
    .or(page.getByPlaceholder(/rating scale question/i));
  await expect(questionText).toBeVisible({ timeout: 30_000 });
  await questionText.fill('How likely are you to recommend us to a friend or colleague?');
}

export async function createAiSurveyProject(page: Page) {
  await page.getByRole('button', { name: /add project/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByRole('radio', { name: /ai survey/i }).click();
  await page.getByRole('button', { name: /create ai survey/i }).click();

  await expect(page).toHaveURL(/\/projects\/new/);
  await page.waitForTimeout(3000);

  await dismissGenerateDialog(page);
  await fillDefaultQuestion(page);

  const draftBtn = page.getByRole('button', { name: /draft project/i });
  await expect(draftBtn).toBeEnabled({ timeout: 15_000 });
  await draftBtn.click();

  await expect(page).toHaveURL(/\/projects\/[a-f0-9-]+/, { timeout: 90_000 });
}

export async function publishProject(page: Page) {
  const publishBtn = page.getByRole('button', { name: /^publish$/i }).first();
  await expect(publishBtn).toBeVisible({ timeout: 30_000 });
  await publishBtn.click();

  const shareDialog = page.getByRole('dialog');
  await expect(shareDialog.getByText(/your project has been published/i)).toBeVisible({
    timeout: 15_000,
  });
}

export async function getSurveyUrl(page: Page): Promise<string> {
  const dialog = page.getByRole('dialog');
  if (!(await dialog.isVisible({ timeout: 3_000 }).catch(() => false))) {
    const publishBtn = page.getByRole('button', { name: /^publish$/i }).first();
    if (await publishBtn.isVisible().catch(() => false)) {
      await publishBtn.click();
      await expect(dialog.getByText(/your project has been published/i)).toBeVisible({
        timeout: 15_000,
      });
    }
  }

  const linkButton = dialog.getByRole('button', { name: /click to copy shareable link/i });
  if (await linkButton.isVisible()) {
    const url = await linkButton.textContent();
    if (url?.includes('http')) return url.trim();
  }

  const inputs = dialog.locator('input');
  for (let i = 0; i < await inputs.count(); i++) {
    const value = await inputs.nth(i).inputValue();
    if (value.includes('http')) return value;
  }

  const projectId = page.url().match(/projects\/([a-f0-9-]+)/)?.[1];
  expect(projectId).toBeTruthy();
  return `https://evo.dev.theysaid.io/survey/project/${projectId}`;
}

export async function completeSurvey(surveyPage: Page) {
  await expect(
    surveyPage.getByRole('heading', { name: /recommend|satisfied|question/i }).first()
  ).toBeVisible({ timeout: 30_000 });

  const tutorialClose = surveyPage.getByRole('button', { name: /^close$/i });
  if (await tutorialClose.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await tutorialClose.click();
  }

  const sliderThumb = surveyPage.getByRole('slider', { name: /rating/i });
  await expect(sliderThumb).toBeVisible();
  await sliderThumb.focus();
  await surveyPage.keyboard.press('End');

  await surveyPage.getByRole('button', { name: /send response/i }).click();

  await expect(
    surveyPage.getByText(/thank you|thanks|submitted|complete|response recorded|appreciate/i)
  ).toBeVisible({ timeout: 30_000 });
}

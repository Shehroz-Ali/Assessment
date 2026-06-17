# TheySaid Evo — E2E Test Suite

Playwright end-to-end tests for [evo.dev.theysaid.io](https://evo.dev.theysaid.io/), covering login, project creation, Teach AI document upload, and publish + survey response flows.

## Session recording

[Add your Google Drive session recording link here](https://drive.google.com/)

## Prerequisites

- Node.js 18+
- Google Chrome (tests run in **headed** mode via `channel: 'chrome'`)

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Edit `.env` with your credentials:

```env
EVO_EMAIL=your-email@example.com
EVO_PASSWORD="your-password"
```

> **Important:** Quote passwords that contain `#` — in `.env` files, `#` starts a comment unless the value is quoted.

## Run tests

```bash
# All tests (headed Chrome, 4 parallel workers)
npm test

# Individual flows
npm run test:login
npm run test:create
npm run test:teach-ai
npm run test:publish

# HTML report
npm run report
```

## Test coverage

| Test | File | Flow |
|------|------|------|
| Login | `tests/login.spec.ts` | Email → password (WorkOS AuthKit) → projects dashboard |
| Create project | `tests/create-project.spec.ts` | Add project → AI Survey → fill question → Draft |
| Teach AI upload | `tests/teach-ai-upload.spec.ts` | Teach AI → Add file → upload document |
| Publish + survey | `tests/publish-and-survey.spec.ts` | Create → Publish → take survey as respondent |

Registration is intentionally **not** tested (requires manual email OTP).

## Bonus issue — AuthKit locale leaks into password step

**Severity:** Medium (UX / i18n consistency)

**Steps to reproduce:**
1. Set browser language to English (`en-US`).
2. Go to https://evo.dev.theysaid.io and sign in with email + password.
3. Observe the email step title: **"Sign in"** (English).
4. After entering email, the password page title changes to **"Teken in"** (Afrikaans) and the password placeholder reads **"Jou wagwoord"**, while the rest of the Evo app remains English.

**Expected:** Auth UI language should match the user's browser locale or the email-step language consistently.

**Actual:** WorkOS AuthKit appears pinned to `lang="af"` on the password route, creating a jarring language switch mid-login.

**Impact:** Confuses users, breaks accessibility expectations, and makes automated tests brittle (submit button is `Teken in` instead of `Sign in`). We worked around this by targeting `button[type="submit"]` rather than button label text.

**Suggested fix:** Configure AuthKit / WorkOS environment locale from user preference, or inherit `Accept-Language` from the browser on all auth routes.

## Project structure

```
tests/
  helpers/
    auth.ts          # Login helper
    project.ts       # Create, publish, survey helpers
  login.spec.ts
  create-project.spec.ts
  teach-ai-upload.spec.ts
  publish-and-survey.spec.ts
fixtures/
  test-document.txt  # Sample file for Teach AI upload
```

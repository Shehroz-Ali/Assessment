# Bugs Found — TheySaid Evo (evo.dev.theysaid.io)

Issues discovered while building and running the Playwright E2E test suite for this assessment.

---

## 1. Website is not responsive on mobile / small screens

**Severity:** High (UX)

**Description:**  
The Evo web app does not adapt well to small viewports (mobile phones, narrow browser windows). Layouts, navigation, and key actions are difficult or impossible to use on mobile-sized screens.

**Impact:**  
Users on phones cannot reliably manage projects, upload Teach AI documents, or complete surveys through the manager UI. This is a significant gap for a product that shares survey links widely (SMS, social, email).

**Suggested fix:**  
Add responsive breakpoints for the sidebar, project table, editor, and publish/share dialogs; test at 375px and 390px widths.

---

## 2. Auth language switches mid-login (English → Afrikaans)

**Severity:** Medium (UX / i18n) — **Bonus**

**Steps to reproduce:**
1. Use a browser set to English (`en-US`).
2. Go to https://evo.dev.theysaid.io and start sign-in.
3. Email step shows **"Sign in"** (English).
4. After entering email, the password page title becomes **"Teken in"** and the placeholder reads **"Jou wagwoord"** (Afrikaans).

**Expected:** Consistent language across all auth steps.

**Actual:** WorkOS AuthKit password route appears pinned to Afrikaans (`lang="af"`) while the email step and main app remain English.

**Impact:** Confusing for users; brittle for automation (submit button label is not `"Sign in"`).

**Workaround in tests:** Use `button[type="submit"]` instead of matching button text.

---

## 3. Survey respondent onboarding overlay blocks interaction

**Severity:** Low–Medium (UX) — **Bonus**

**Steps to reproduce:**
1. Publish a project and open the public survey link.
2. A **"Choose your own adventure!"** tutorial overlay appears on first visit.
3. Rating slider and submit controls are underneath until the user clicks **Close**.

**Impact:** First-time respondents may not realize they must dismiss the overlay before answering. Automated tests must explicitly close it.

**Suggested fix:** Auto-dismiss after first interaction, or show a less intrusive tooltip.

---

## 4. `.env` passwords with `#` are silently truncated (developer footgun)

**Severity:** Low (documentation) — **Bonus**

**Description:**  
If testers store credentials in a `.env` file without quoting, passwords containing `#` are cut off at the `#` character (treated as a comment).

**Example:**
```env
EVO_PASSWORD=Syed123456789!@#   # broken — only Syed123456789!@ is used
EVO_PASSWORD="Syed123456789!@#" # correct
```

**Impact:** Login failures with no obvious error. Not a site bug, but worth documenting in setup guides.

---

## 5. `Draft project` button stays disabled until a question is filled

**Severity:** Low (UX clarity) — **Bonus**

**Description:**  
On the AI Survey editor (`/projects/new`), **Draft project** is disabled with no inline message explaining why.

**Impact:** New users may click repeatedly without knowing they must enter question text first.

**Suggested fix:** Show helper text or enable the button with a validation message on click.

---

## Summary

| # | Issue | Bonus? |
|---|--------|--------|
| 1 | Not responsive on mobile | — |
| 2 | Auth locale switch (EN → AF) | Yes |
| 3 | Survey tutorial overlay blocks UI | Yes |
| 4 | Unquoted `#` in `.env` passwords | Yes |
| 5 | Disabled Draft button without explanation | Yes |

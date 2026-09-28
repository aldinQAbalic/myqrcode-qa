import { test, expect } from '../../src/fixtures/test';
import { QR_TYPES, type QrType } from '../../src/pages/GeneratorTypePage';

test.describe('Public pages @smoke', () => {
  test('home page loads and hero CTA opens the generator @mobile', async ({ home, page }) => {
    await home.open();
    await expect(page).toHaveTitle(/QR Code Generator/i);
    await expect(home.heading()).toContainText('Create your QR code');
    await home.heroCta.click();
    await expect(page).toHaveURL(/\/generator$/);
  });

  test('generator lists all QR types', async ({ generator }) => {
    await generator.open();
    await expect(generator.heading()).toHaveText('Choose QR code type');
    for (const type of Object.keys(QR_TYPES) as QrType[]) {
      await expect(generator.typeCard(type), `card for ${type}`).toBeVisible();
      await expect(generator.typeCard(type)).toContainText(QR_TYPES[type]);
    }
  });

  test('login page shows email login, social login and recovery link @mobile', async ({ login, page }) => {
    await login.open();
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await expect(login.email).toBeVisible();
    await expect(login.submit).toBeEnabled();
    await expect(login.forgotPasswordLink).toBeVisible();
    await login.signUpLink.click();
    await expect(page).toHaveURL(/\/sign-up/);
  });

  test('sign-up page offers email and social sign-up', async ({ signUp }) => {
    await signUp.open();
    await expect(signUp.email).toBeVisible();
    await expect(signUp.createAccount).toBeVisible();
    await expect(signUp.google).toBeVisible();
    await expect(signUp.facebook).toBeVisible();
    await expect(signUp.apple).toBeVisible();
  });

  test('pricing shows trial and yearly plan with renewal disclosure', async ({ pricing }) => {
    await pricing.open();
    await expect(pricing.trialPlan).toBeVisible();
    await expect(pricing.yearlyPlan).toBeVisible();
    // Auto-renewal terms must be visible next to the trial price (consumer-protection P0).
    await expect(pricing.trialRenewalNote).toBeVisible();
  });

  for (const link of ['Terms of Use', 'Privacy policy', 'Cancel subscription', 'FAQ'] as const) {
    test(`footer link "${link}" resolves`, async ({ home, page }) => {
      await home.open();
      const href = await home.footerLink(link).getAttribute('href');
      const res = await page.request.get(href!);
      expect(res.status(), `${href}`).toBeLessThan(400);
    });
  }
});

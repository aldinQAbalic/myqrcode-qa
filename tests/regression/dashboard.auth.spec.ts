import { test, expect } from '../../src/fixtures/auth';
import { testName } from '../../src/utils/env';

/**
 * Dynamic QR lifecycle for a logged-in user. Routes/selectors are UNVERIFIED –
 * run with a test account and adjust src/pages/AccountPages.ts first.
 */
test.describe('Dynamic QR & analytics @regression @auth', () => {
  test('created QR appears in the dashboard, scan is counted', async ({ createUrlDraft, design, dashboard, page }) => {
    const name = testName('qa-dash');
    await createUrlDraft('https://example.com/dashboard', name);
    const shortLink = await design.decodePreview();
    expect(shortLink).not.toBeNull();

    await dashboard.open();
    await expect(dashboard.row(name)).toBeVisible();
    const before = Number((await dashboard.scanCount(name).innerText()).match(/\d+/)?.[0] ?? 0);

    // Simulate a scan in a fresh context (no cookies → counted as a visitor, not the owner).
    const scanner = await page.context().browser()!.newContext();
    const scanPage = await scanner.newPage();
    await scanPage.goto(shortLink!);
    await expect(scanPage).toHaveURL(/example\.com\/dashboard/);
    await scanner.close();

    // Analytics can be async – poll instead of sleeping.
    await expect
      .poll(
        async () => {
          await page.reload();
          return Number((await dashboard.scanCount(name).innerText()).match(/\d+/)?.[0] ?? 0);
        },
        { timeout: 60_000, intervals: [5_000] },
      )
      .toBeGreaterThan(before);
  });

  test.fixme('editing destination of a dynamic QR changes the redirect without changing the code', async () => {
    // 1. create QR → decode short link   2. edit URL in dashboard   3. short link now → new URL
  });

  test.fixme('paused/expired subscription: short link shows the inactive page', async () => {
    // Needs a dedicated account in the expired state.
  });
});

import type { Download, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/*
 * ⚠️  UNVERIFIED SELECTORS
 * Everything in this file sits behind login and could not be inspected without an account.
 * Selectors are role/text based guesses. When a test account is available:
 *   1. npm run auth:save   (log in manually, session saved to .auth/user.json)
 *   2. npx playwright codegen --load-storage=.auth/user.json https://myqrcode.com
 *   3. Replace the locators below and remove this banner.
 */

export type DownloadFormat = 'PNG' | 'SVG' | 'PDF';

/** Format picker shown after "Download QR" for a logged-in user with an active plan. */
export class DownloadDialog {
  readonly root: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('dialog');
  }

  formatOption(format: DownloadFormat): Locator {
    return this.root
      .getByRole('button', { name: new RegExp(`\\b${format}\\b`, 'i') })
      .or(this.root.getByRole('radio', { name: new RegExp(`\\b${format}\\b`, 'i') }))
      .first();
  }

  /** Picks a format and returns the Playwright Download object. */
  async download(format: DownloadFormat): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.formatOption(format).click();
    const confirm = this.root.getByRole('button', { name: /^download$/i });
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    return downloadPromise;
  }
}

/** List of the user's QR codes ("My QR Codes"). */
export class DashboardPage extends BasePage {
  readonly path = '/dashboard'; // UNVERIFIED route

  readonly createButton: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.getByRole('link', { name: /create qr code/i });
    this.search = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .first();
  }

  row(name: string): Locator {
    return this.page.getByRole('row').or(this.page.locator('li,article')).filter({ hasText: name }).first();
  }

  scanCount(name: string): Locator {
    return this.row(name).getByText(/scans?/i);
  }
}

/** Per-QR analytics (scans over time, devices, locations). */
export class AnalyticsPage extends BasePage {
  readonly path = '/analytics'; // UNVERIFIED route

  readonly totalScans: Locator;
  readonly uniqueScans: Locator;

  constructor(page: Page) {
    super(page);
    this.totalScans = page.getByText(/total scans/i).locator('xpath=..');
    this.uniqueScans = page.getByText(/unique scans/i).locator('xpath=..');
  }
}

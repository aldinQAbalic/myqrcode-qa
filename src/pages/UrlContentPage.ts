import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Step 2 for the "Website URL" type: https://myqrcode.com/generator/url
 * After "Next" the draft gets an id: /generator/url?id=<uuid> → /generator/qr?id=<uuid>
 */
export class UrlContentPage extends BasePage {
  readonly path = '/generator/url';

  readonly websiteUrl: Locator;
  readonly qrName: Locator;
  readonly nameSectionToggle: Locator;
  readonly previewToggle: Locator;
  readonly qrCodeToggle: Locator;
  readonly backLink: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    super(page);
    this.websiteUrl = page.locator('#websiteUrl');
    this.qrName = page.locator('#qrName');
    this.nameSectionToggle = page.getByRole('button', { name: /^QR code name/ });
    this.previewToggle = page.getByRole('radio', { name: 'Preview' });
    this.qrCodeToggle = page.getByRole('radio', { name: 'QR code' });
    this.backLink = page.getByRole('link', { name: 'Back' });
    this.nextButton = page.getByRole('button', { name: 'Next', exact: true });
  }

  /**
   * Inline validation message (p.text-error). Observed texts:
   *  - empty:   "This field is required and cannot be left blank."
   *  - invalid: "You have entered an invalid link."
   */
  urlError(): Locator {
    return this.page.locator('p.text-error');
  }

  async fill(url: string, name?: string): Promise<void> {
    await this.websiteUrl.fill(url);
    if (name) {
      if ((await this.nameSectionToggle.getAttribute('aria-expanded')) !== 'true') {
        await this.nameSectionToggle.click();
      }
      await this.qrName.fill(name);
    }
  }

  async next(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForURL(/\/generator\/qr\?id=/);
  }
}

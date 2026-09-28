import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Slugs of the QR types shown on /generator (verified 2026-09-28). */
export const QR_TYPES = {
  url: 'Website URL',
  vcard: 'vCard',
  pdf: 'PDF',
  images: 'Images',
  'social-media': 'Social Media',
  video: 'Video',
  'plain-text': 'Simple Text',
  'business-page': 'Business Page',
  facebook: 'Facebook',
  wifi: 'Wi-Fi',
  app: 'App',
  menu: 'Menu',
} as const;

export type QrType = keyof typeof QR_TYPES;

/** Step 1 of the wizard: https://myqrcode.com/generator – "Choose QR code type". */
export class GeneratorTypePage extends BasePage {
  readonly path = '/generator';

  constructor(page: Page) {
    super(page);
  }

  typeCard(type: QrType): Locator {
    return this.page.locator(`a[href="/generator/${type}"]`);
  }

  allTypeCards(): Locator {
    return this.page.locator('a[href^="/generator/"]');
  }

  async choose(type: QrType): Promise<void> {
    await this.typeCard(type).click();
    await this.page.waitForURL(new RegExp(`/generator/${type}`));
  }
}

import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** https://myqrcode.com/ – selectors verified against the live UI (2026-09-28). */
export class HomePage extends BasePage {
  readonly path = '/';

  readonly loginLink: Locator;
  readonly headerCreateCta: Locator;
  readonly heroCta: Locator;
  readonly languageButton: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.headerCreateCta = page.getByRole('link', { name: 'Create QR code' }).first();
    this.heroCta = page.locator('#hero-primary-cta');
    this.languageButton = page.getByRole('button', { name: 'EN', exact: true });
    this.footer = page.locator('footer');
  }

  footerLink(
    name: 'Prices' | 'About us' | 'Terms of Use' | 'Privacy policy' | 'Contact us' | 'Cancel subscription' | 'FAQ',
  ): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }
}

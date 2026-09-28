import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  /** Relative path, resolved against baseURL. */
  abstract readonly path: string;

  readonly logo: Locator;
  readonly helpButton: Locator;

  constructor(readonly page: Page) {
    this.logo = page.locator('a[href="/"]').first();
    this.helpButton = page.getByRole('button', { name: 'Help' });
  }

  async open(query = ''): Promise<this> {
    await this.page.goto(this.path + query);
    await this.page.waitForLoadState('domcontentloaded');
    return this;
  }

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }
}

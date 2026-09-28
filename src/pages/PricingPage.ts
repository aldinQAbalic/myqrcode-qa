import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** https://myqrcode.com/prices – "7-Day Full Access" trial and "Yearly Plan". */
export class PricingPage extends BasePage {
  readonly path = '/prices';

  readonly trialPlan: Locator;
  readonly yearlyPlan: Locator;
  readonly trialRenewalNote: Locator;
  readonly currency: Locator;

  constructor(page: Page) {
    super(page);
    this.trialPlan = page.getByText('7-Day Full Access');
    this.yearlyPlan = page.getByText('Yearly Plan');
    this.trialRenewalNote = page.getByText(/After 7 days, renews to/);
    this.currency = page.getByText(/USD \(\$\)/);
  }
}

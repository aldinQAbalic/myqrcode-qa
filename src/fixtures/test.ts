import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { GeneratorTypePage } from '../pages/GeneratorTypePage';
import { UrlContentPage } from '../pages/UrlContentPage';
import { DesignPage } from '../pages/DesignPage';
import { LoginPage, SignUpPage, DownloadSignUpDialog } from '../pages/AuthPages';
import { PricingPage } from '../pages/PricingPage';
import { DashboardPage, DownloadDialog, AnalyticsPage } from '../pages/AccountPages';
import { testName } from '../utils/env';

type Pages = {
  home: HomePage;
  generator: GeneratorTypePage;
  urlContent: UrlContentPage;
  design: DesignPage;
  login: LoginPage;
  signUp: SignUpPage;
  signUpWall: DownloadSignUpDialog;
  pricing: PricingPage;
  dashboard: DashboardPage;
  downloadDialog: DownloadDialog;
  analytics: AnalyticsPage;
};

type Helpers = {
  /** Creates a Website-URL draft and lands on the design step. Returns the draft id. */
  createUrlDraft: (url: string, name?: string) => Promise<string>;
};

export const test = base.extend<Pages & Helpers>({
  home: async ({ page }, use) => use(new HomePage(page)),
  generator: async ({ page }, use) => use(new GeneratorTypePage(page)),
  urlContent: async ({ page }, use) => use(new UrlContentPage(page)),
  design: async ({ page }, use) => use(new DesignPage(page)),
  login: async ({ page }, use) => use(new LoginPage(page)),
  signUp: async ({ page }, use) => use(new SignUpPage(page)),
  signUpWall: async ({ page }, use) => use(new DownloadSignUpDialog(page)),
  pricing: async ({ page }, use) => use(new PricingPage(page)),
  dashboard: async ({ page }, use) => use(new DashboardPage(page)),
  downloadDialog: async ({ page }, use) => use(new DownloadDialog(page)),
  analytics: async ({ page }, use) => use(new AnalyticsPage(page)),

  createUrlDraft: async ({ urlContent, design }, use) => {
    await use(async (url, name = testName()) => {
      await urlContent.open();
      await urlContent.fill(url, name);
      await urlContent.next();
      await expect(design.heading()).toHaveText(/Customize design/);
      const id = design.draftId();
      if (!id) throw new Error('Draft id missing from URL');
      return id;
    });
  },
});

export { expect };

import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * https://myqrcode.com/login – verified: email-first form (#email + "Log in"),
 * social buttons (Google / Facebook / Apple, icon-only), "Forgot your password? Click here".
 *
 * UNVERIFIED: what appears after submitting the email (password step vs. magic link).
 * The login() method supports a password step; if the site uses magic links,
 * save a session manually instead (see README → "Auth without password").
 */
export class LoginPage extends BasePage {
  readonly path = '/login';

  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.locator('#email');
    this.password = page.locator('input[type="password"]');
    this.submit = page.getByRole('button', { name: 'Log in', exact: true });
    this.forgotPasswordLink = page.locator('a[href="/recover-password"]');
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    if (!(await this.password.isVisible())) {
      await this.submit.click();
      await this.password.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {
        throw new Error(
          'No password field appeared after submitting the email. The site may use magic-link login – ' +
            'create .auth/user.json manually (npm run auth:save) and set SKIP_AUTH_SETUP=1.',
        );
      });
    }
    await this.password.fill(password);
    await this.submit.click();
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 20_000 });
  }
}

/** https://myqrcode.com/sign-up – email + "Create Account" + social buttons. */
export class SignUpPage extends BasePage {
  readonly path = '/sign-up';

  readonly email: Locator;
  readonly createAccount: Locator;
  readonly google: Locator;
  readonly facebook: Locator;
  readonly apple: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.locator('#email');
    this.createAccount = page.getByRole('button', { name: 'Create Account' });
    this.google = page.getByRole('button', { name: 'Continue with Google' });
    this.facebook = page.getByRole('button', { name: 'Continue with Facebook' });
    this.apple = page.getByRole('button', { name: 'Continue with Apple' });
    this.loginLink = page.getByRole('link', { name: 'Log In' });
  }
}

/**
 * Sign-up wall shown when an anonymous user clicks "Download QR"
 * (URL becomes /generator/sign-up?id=<uuid>, modal "Download QR Code").
 */
export class DownloadSignUpDialog {
  readonly root: Locator;
  readonly title: Locator;
  readonly email: Locator;
  readonly continueButton: Locator;
  readonly google: Locator;
  readonly closeButton: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('dialog').filter({ hasText: 'Download QR Code' });
    this.title = this.root.getByText('Download QR Code');
    this.email = this.root.locator('#email');
    this.continueButton = this.root.getByRole('button', { name: 'Continue', exact: true });
    this.google = this.root.getByRole('button', { name: 'Continue with Google' });
    this.closeButton = page.getByTestId('dialog-close-button');
  }
}

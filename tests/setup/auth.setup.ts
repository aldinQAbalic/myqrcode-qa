import fs from 'node:fs';
import path from 'node:path';
import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/AuthPages';
import { AUTH_FILE, env, hasCredentials } from '../../src/utils/env';

/**
 * Logs in once and stores cookies + localStorage in .auth/user.json.
 * chromium-auth reuses that storageState, so authenticated tests never log in again.
 *
 * - No credentials in .env      → writes an empty state; *.auth.spec.ts tests skip themselves.
 * - SKIP_AUTH_SETUP=1           → keeps an existing .auth/user.json (e.g. saved manually via npm run auth:save).
 */
setup('authenticate @smoke', async ({ page }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  if (process.env.SKIP_AUTH_SETUP === '1' && fs.existsSync(AUTH_FILE)) {
    setup.info().annotations.push({ type: 'auth', description: 'Reusing existing .auth/user.json' });
    return;
  }

  if (!hasCredentials()) {
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
    setup.info().annotations.push({ type: 'auth', description: 'No TEST_USER_* credentials – auth tests will skip' });
    return;
  }

  const login = new LoginPage(page);
  await login.open();
  await login.login(env.userEmail, env.userPassword);
  await page.context().storageState({ path: AUTH_FILE });
});

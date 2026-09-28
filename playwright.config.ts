import { defineConfig, devices } from '@playwright/test';
import { env, AUTH_FILE } from './src/utils/env';

/**
 * Projects
 *  - unit          : offline tests for helpers (QR decode) – no network, runs everywhere
 *  - setup         : logs in once and saves storageState to .auth/user.json
 *  - chromium      : public (anonymous) E2E tests
 *  - chromium-auth : tests that need a logged-in user (files *.auth.spec.ts)
 *  - mobile        : public smoke on a mobile viewport
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Production site – keep the load low.
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseUrl,
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    acceptDownloads: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'unit',
      testDir: './tests/unit',
    },
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: [/unit\//, /setup\//, /.*\.auth\.spec\.ts/],
      use: { ...devices['Desktop Chrome'], deviceScaleFactor: 2 },
    },
    {
      name: 'chromium-auth',
      testMatch: /.*\.auth\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], deviceScaleFactor: 2, storageState: AUTH_FILE },
    },
    {
      name: 'mobile',
      testDir: './tests/smoke',
      testIgnore: /.*\.auth\.spec\.ts/,
      grep: /@mobile/,
      use: { ...devices['Pixel 7'] },
    },
  ],
});

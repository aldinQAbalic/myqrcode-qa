import fs from 'node:fs';
import { test as base } from './test';
import { AUTH_FILE } from '../utils/env';

/** True when .auth/user.json holds at least one cookie (i.e. setup really logged in). */
export const hasSession = (): boolean => {
  try {
    const state = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
    return Array.isArray(state.cookies) && state.cookies.length > 0;
  } catch {
    return false;
  }
};

/** Use in *.auth.spec.ts – skips every test when there is no logged-in session. */
export const test = base.extend<{ requireSession: void }>({
  requireSession: [
    async ({}, use, testInfo) => {
      testInfo.skip(!hasSession(), 'No authenticated session (.auth/user.json) – add TEST_USER_* to .env');
      await use();
    },
    { auto: true },
  ],
});

export { expect } from './test';

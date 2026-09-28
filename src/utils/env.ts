import 'dotenv/config';
import path from 'node:path';

export const AUTH_FILE = path.join(__dirname, '../../.auth/user.json');

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://myqrcode.com',
  /** Domain used by dynamic QR short links, e.g. https://myqrcode.mobi/3f8a43dc */
  shortLinkHost: process.env.SHORT_LINK_HOST ?? 'myqrcode.mobi',
  userEmail: process.env.TEST_USER_EMAIL ?? '',
  userPassword: process.env.TEST_USER_PASSWORD ?? '',
};

export const hasCredentials = (): boolean => Boolean(env.userEmail && env.userPassword);

/** Unique, recognisable name for anything the tests create on the site. */
export const testName = (prefix = 'qa-auto'): string =>
  `${prefix}-${new Date().toISOString().replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 6)}`;

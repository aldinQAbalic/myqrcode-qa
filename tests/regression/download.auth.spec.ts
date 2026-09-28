import fs from 'node:fs/promises';
import { test, expect } from '../../src/fixtures/auth';
import { decodeQrFromPng, isPdf, isPng, isSvg } from '../../src/utils/qr';
import { decodeQrFromSvg } from '../../src/utils/svg';
import { env } from '../../src/utils/env';

/**
 * Logged-in download tests. Require an account with an active plan/trial.
 * Selectors for the format picker are UNVERIFIED (see src/pages/AccountPages.ts).
 */
const TARGET = 'https://example.com/download';
const SHORT_LINK = new RegExp(`^https://${env.shortLinkHost.replace(/\./g, '\\.')}/[A-Za-z0-9]+$`);

test.describe('Download @regression @auth', () => {
  test('PNG download decodes to the same short link as the preview @smoke', async ({
    createUrlDraft,
    design,
    downloadDialog,
  }) => {
    await createUrlDraft(TARGET);
    const preview = await design.decodePreview();

    await design.clickDownload();
    const download = await downloadDialog.download('PNG');
    expect(download.suggestedFilename()).toMatch(/\.png$/i);

    const buf = await fs.readFile(await download.path());
    expect(isPng(buf)).toBe(true);
    const decoded = decodeQrFromPng(buf);
    expect(decoded).toMatch(SHORT_LINK);
    expect(decoded).toBe(preview);
  });

  test('SVG download is valid SVG and scans', async ({ createUrlDraft, design, downloadDialog, browser }) => {
    await createUrlDraft(TARGET);
    const preview = await design.decodePreview();

    await design.clickDownload();
    const download = await downloadDialog.download('SVG');
    const buf = await fs.readFile(await download.path());
    expect(isSvg(buf)).toBe(true);
    expect(await decodeQrFromSvg(browser, buf.toString('utf8'))).toBe(preview);
  });

  test('PDF download is a non-empty PDF', async ({ createUrlDraft, design, downloadDialog }) => {
    await createUrlDraft(TARGET);
    await design.clickDownload();
    const download = await downloadDialog.download('PDF');
    const buf = await fs.readFile(await download.path());
    expect(isPdf(buf)).toBe(true);
    expect(buf.length).toBeGreaterThan(1_000);
  });
});

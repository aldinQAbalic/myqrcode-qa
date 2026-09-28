import path from 'node:path';
import fs from 'node:fs';
import QRCode from 'qrcode';
import { test, expect } from '../../src/fixtures/test';
import type { Pattern } from '../../src/pages/DesignPage';

const TARGET = 'https://example.com/design';

test.describe('Design step @regression', () => {
  let payload: string | null;

  test.beforeEach(async ({ createUrlDraft, design }) => {
    await createUrlDraft(TARGET);
    payload = await design.decodePreview();
    expect(payload).not.toBeNull();
  });

  const patterns: Pattern[] = ['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded'];
  for (const pattern of patterns) {
    test(`pattern "${pattern}" stays scannable`, async ({ design }) => {
      await design.selectPattern(pattern);
      expect(await design.decodePreview()).toBe(payload);
    });
  }

  test('frame "Scan me!" keeps the code scannable', async ({ design }) => {
    await design.selectFrame('1');
    expect(await design.decodePreview()).toBe(payload);
  });

  test('custom colours are applied and still scan', async ({ design }) => {
    await design.setColor('Dot color', '#0D47A1');
    await design.setColor('Background color', '#FFF8E1');
    await expect(design.colorInput('Dot color')).toHaveValue(/#0D47A1/i);
    expect(await design.decodePreview()).toBe(payload);
  });

  test('low-contrast colours – documents current behaviour (no warning expected yet)', async ({ design }) => {
    test
      .info()
      .annotations.push({ type: 'exploratory', description: 'Light-on-light QR may not scan; check if UI warns.' });
    await design.setColor('Dot color', '#EEEEEE');
    const decoded = await design.decodePreview();
    test.info().annotations.push({ type: 'result', description: `decoded=${decoded}` });
  });

  test('preset logo keeps the code scannable', async ({ design }) => {
    await design.selectPresetLogo(1);
    expect(await design.decodePreview()).toBe(payload);
  });

  test('uploaded logo (PNG) keeps the code scannable', async ({ design }, testInfo) => {
    const logo = path.join(testInfo.outputDir, 'logo.png');
    fs.mkdirSync(testInfo.outputDir, { recursive: true });
    fs.writeFileSync(
      logo,
      await QRCode.toBuffer('logo', { width: 120, color: { dark: '#E53935FF', light: '#FFFFFFFF' } }),
    );
    await design.uploadLogo(logo);
    expect(await design.decodePreview()).toBe(payload);
  });

  test('Back returns to content step with the URL preserved', async ({ design, urlContent, page }) => {
    await design.backLink.click();
    await expect(page).toHaveURL(/\/generator\/url\?id=/);
    await expect(urlContent.websiteUrl).toHaveValue(/example\.com\/design/);
  });
});

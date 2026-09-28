import { test, expect } from '@playwright/test';
import QRCode from 'qrcode';
import { PNG } from 'pngjs';
import { decodeQrFromLocator, decodeQrFromPng, isPng } from '../../src/utils/qr';
import { decodeQrFromSvg } from '../../src/utils/svg';

/**
 * Offline tests for the decode helper. They guard the tool we rely on in E2E:
 * if these fail, a red E2E download test is a helper bug, not a site bug.
 */
const PAYLOAD = 'https://myqrcode.mobi/3f8a43dc';

test.describe('QR decode helper @unit @smoke', () => {
  test('decodes a standard black-on-white PNG', async () => {
    const buf = await QRCode.toBuffer(PAYLOAD, { type: 'png', width: 400, margin: 4 });
    expect(isPng(buf)).toBe(true);
    expect(decodeQrFromPng(buf)).toBe(PAYLOAD);
  });

  test('decodes a tightly cropped PNG (no quiet zone) thanks to padding', async () => {
    const buf = await QRCode.toBuffer(PAYLOAD, { type: 'png', width: 300, margin: 0 });
    expect(decodeQrFromPng(buf)).toBe(PAYLOAD);
  });

  test('decodes custom colours (dark blue dots on light yellow)', async () => {
    const buf = await QRCode.toBuffer(PAYLOAD, {
      type: 'png',
      width: 400,
      color: { dark: '#1A237EFF', light: '#FFF59DFF' },
    });
    expect(decodeQrFromPng(buf)).toBe(PAYLOAD);
  });

  test('decodes a transparent background', async () => {
    const buf = await QRCode.toBuffer(PAYLOAD, {
      type: 'png',
      width: 400,
      color: { dark: '#000000FF', light: '#00000000' },
    });
    expect(decodeQrFromPng(buf)).toBe(PAYLOAD);
  });

  test('decodes a small preview-sized image (154px, like the on-page SVG)', async () => {
    const buf = await QRCode.toBuffer(PAYLOAD, { type: 'png', width: 154, margin: 1 });
    expect(decodeQrFromPng(buf)).toBe(PAYLOAD);
  });

  test('returns null for an image without a QR code', async () => {
    const png = new PNG({ width: 200, height: 200 });
    for (let i = 0; i < png.data.length; i += 4) {
      const v = (i / 4) % 7 === 0 ? 0 : 255;
      png.data[i] = png.data[i + 1] = png.data[i + 2] = v;
      png.data[i + 3] = 255;
    }
    expect(decodeQrFromPng(PNG.sync.write(png))).toBeNull();
  });
});

test.describe('Browser-based decode helpers @unit @smoke', () => {
  test('decodeQrFromLocator reads a 154px inline SVG (same shape as the live preview)', async ({ page }) => {
    const svg = await QRCode.toString(PAYLOAD, { type: 'svg', margin: 0 });
    await page.setContent(`<div id="wrap" style="padding:8px;background:#fff;display:inline-block">
      <div style="width:154px;height:154px">${svg}</div></div>`);
    expect(await decodeQrFromLocator(page.locator('#wrap'))).toBe(PAYLOAD);
  });

  test('decodeQrFromSvg renders and decodes a downloaded SVG', async ({ browser }) => {
    const svg = await QRCode.toString(PAYLOAD, { type: 'svg' });
    expect(await decodeQrFromSvg(browser, svg)).toBe(PAYLOAD);
  });
});

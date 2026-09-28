import type { Browser } from '@playwright/test';
import { decodeQrFromPng } from './qr';

/**
 * Renders an SVG string in an isolated page and decodes the QR from a screenshot.
 * Used for the SVG download: we check that the vector file actually scans, not only that it exists.
 */
export async function decodeQrFromSvg(browser: Browser, svg: string, size = 600): Promise<string | null> {
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.setContent(
      `<html><body style="margin:0;background:#fff">
         <div id="qr" style="width:${size}px;height:${size}px;padding:40px;background:#fff">${svg}</div>
       </body></html>`,
    );
    await page.locator('#qr svg').evaluate((el, s) => {
      el.setAttribute('width', String(s));
      el.setAttribute('height', String(s));
    }, size);
    const shot = await page.locator('#qr').screenshot();
    return decodeQrFromPng(shot);
  } finally {
    await context.close();
  }
}

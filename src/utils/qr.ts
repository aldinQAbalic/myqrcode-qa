import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import fs from 'node:fs/promises';
import type { Locator } from '@playwright/test';

/**
 * Adds a white border (quiet zone) around a PNG. Screenshots of a QR preview are often
 * cropped tightly, and jsQR needs a few modules of empty space to find the finder patterns.
 */
export function padPng(src: PNG, pad: number): PNG {
  const out = new PNG({ width: src.width + pad * 2, height: src.height + pad * 2 });
  out.data.fill(255);
  PNG.bitblt(src, out, 0, 0, src.width, src.height, pad, pad);
  return out;
}

/**
 * Flattens transparency onto white. A QR downloaded with "Transparent background"
 * has alpha=0 background pixels, which jsQR would read as black.
 */
function flattenOnWhite(png: PNG): PNG {
  const d = png.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3] / 255;
    d[i] = Math.round(d[i] * a + 255 * (1 - a));
    d[i + 1] = Math.round(d[i + 1] * a + 255 * (1 - a));
    d[i + 2] = Math.round(d[i + 2] * a + 255 * (1 - a));
    d[i + 3] = 255;
  }
  return png;
}

/** Decodes a PNG buffer and returns the QR payload, or null if nothing was found. */
export function decodeQrFromPng(buffer: Buffer, opts: { pad?: number } = {}): string | null {
  let png = flattenOnWhite(PNG.sync.read(buffer));
  const pad = opts.pad ?? Math.round(Math.min(png.width, png.height) * 0.1);
  if (pad > 0) png = padPng(png, pad);
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height, {
    inversionAttempts: 'attemptBoth',
  });
  return result?.data ?? null;
}

export async function decodeQrFromFile(filePath: string): Promise<string | null> {
  return decodeQrFromPng(await fs.readFile(filePath));
}

/** Screenshots an on-page QR element (SVG/canvas/img) and decodes it. */
export async function decodeQrFromLocator(locator: Locator): Promise<string | null> {
  await locator.waitFor({ state: 'visible' });
  const shot = await locator.screenshot({ animations: 'disabled', scale: 'device' });
  return decodeQrFromPng(shot);
}

/** Checks the PNG magic number – cheap guard before decoding a downloaded file. */
export const isPng = (buf: Buffer): boolean =>
  buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
export const isPdf = (buf: Buffer): boolean => buf.subarray(0, 5).toString('latin1') === '%PDF-';
export const isSvg = (buf: Buffer): boolean => /<svg[\s>]/i.test(buf.subarray(0, 2048).toString('utf8'));

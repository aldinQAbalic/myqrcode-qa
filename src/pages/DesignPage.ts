import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { decodeQrFromLocator } from '../utils/qr';

export type Section = 'QR code frame' | 'QR code pattern' | 'QR code corners' | 'Add logo';
export type Pattern = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type ColorField = 'Dot color' | 'Background color' | 'Corner frames color' | 'Corner dots color';

/**
 * Step 3: https://myqrcode.com/generator/qr?id=<uuid> – "Customize design for the … QR code".
 * Radix accordion sections, radio buttons identified by their `value` attribute,
 * Ark UI color pickers ([data-scope=color-picker]).
 */
export class DesignPage extends BasePage {
  readonly path = '/generator/qr';

  readonly qrPreview: Locator;
  readonly previewToggle: Locator;
  readonly qrCodeToggle: Locator;
  readonly transparentBackground: Locator;
  readonly logoFileInput: Locator;
  readonly backLink: Locator;
  readonly downloadButton: Locator;

  constructor(page: Page) {
    super(page);
    // The live preview is an inline SVG (viewBox 320x320). Ask dev for a data-testid="qr-preview".
    this.qrPreview = page.locator('svg[viewBox="0 0 320 320"][shape-rendering="crispEdges"]').first();
    this.previewToggle = page.getByRole('radio', { name: 'Preview' });
    this.qrCodeToggle = page.getByRole('radio', { name: 'QR code' });
    this.transparentBackground = page.locator('#qr-transparency');
    this.logoFileInput = page.locator('[data-scope="file-upload"] input[type="file"]');
    this.backLink = page.getByRole('link', { name: 'Back' });
    this.downloadButton = page.getByRole('button', { name: 'Download QR' });
  }

  /** Current draft id from the URL (?id=<uuid>). */
  draftId(): string | null {
    return new URL(this.page.url()).searchParams.get('id');
  }

  sectionTrigger(section: Section): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${section}`) });
  }

  async openSection(section: Section): Promise<Locator> {
    const trigger = this.sectionTrigger(section);
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
    const regionId = await trigger.getAttribute('aria-controls');
    return this.page.locator(`[id="${regionId}"]`);
  }

  /** value "default" = No frame, "1".."31" = frame styles. */
  async selectFrame(value: 'default' | `${number}`): Promise<void> {
    const region = await this.openSection('QR code frame');
    await region.locator(`button[role="radio"][value="${value}"]`).click();
  }

  async selectPattern(pattern: Pattern): Promise<void> {
    const region = await this.openSection('QR code pattern');
    const radio = region.locator(`button[role="radio"][value="${pattern}"]`).first();
    await radio.click();
    await expect(radio).toHaveAttribute('data-state', 'checked');
  }

  colorInput(field: ColorField): Locator {
    return this.page
      .locator('[data-scope="color-picker"][data-part="root"]')
      .filter({ hasText: field })
      .locator('input[data-channel="hex"]');
  }

  async setColor(field: ColorField, hex: string): Promise<void> {
    const section: Section = field.startsWith('Corner') ? 'QR code corners' : 'QR code pattern';
    await this.openSection(section);
    const input = this.colorInput(field);
    await input.fill(hex);
    await input.press('Enter');
  }

  async selectPresetLogo(index: number): Promise<void> {
    const region = await this.openSection('Add logo');
    await region.locator('button.size-12').nth(index).click();
  }

  async uploadLogo(filePath: string): Promise<void> {
    await this.openSection('Add logo');
    await this.logoFileInput.setInputFiles(filePath);
  }

  async showQrCode(): Promise<void> {
    if ((await this.qrCodeToggle.getAttribute('data-state')) !== 'on') await this.qrCodeToggle.click();
  }

  /** Decodes what the live preview currently encodes (for dynamic QR: a short link). */
  async decodePreview(): Promise<string | null> {
    await this.showQrCode();
    // SVG preview re-renders after each change – give it a moment to settle.
    await this.page.waitForTimeout(300);
    return decodeQrFromLocator(this.qrPreview.locator('xpath=..'));
  }

  async clickDownload(): Promise<void> {
    await this.downloadButton.click();
  }
}

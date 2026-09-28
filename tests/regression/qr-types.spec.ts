import { test, expect } from '../../src/fixtures/test';
import { QR_TYPES, type QrType } from '../../src/pages/GeneratorTypePage';

test.describe('QR types – content step @regression', () => {
  for (const type of Object.keys(QR_TYPES) as QrType[]) {
    test(`${type}: card opens the content step`, async ({ generator, page }) => {
      await generator.open();
      await generator.choose(type);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        new RegExp(`Add content to the .*QR code`, 'i'),
      );
      await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/generator');
    });
  }
});

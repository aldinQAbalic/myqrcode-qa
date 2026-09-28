import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/utils/env';

const TARGET = 'https://example.com/';
const SHORT_LINK = new RegExp(`^https://${env.shortLinkHost.replace(/\./g, '\\.')}/[A-Za-z0-9]+$`);

test.describe('Anonymous generator flow – Website URL @smoke', () => {
  test('URL field validation: empty and invalid value', async ({ urlContent, page }) => {
    await urlContent.open();
    await urlContent.nextButton.click();
    await expect(urlContent.urlError()).toHaveText('This field is required and cannot be left blank.');

    await urlContent.websiteUrl.fill('not a url');
    await urlContent.nextButton.click();
    await expect(urlContent.urlError()).toHaveText('You have entered an invalid link.');
    await expect(page).toHaveURL(/\/generator\/url$/);
  });

  test('preview QR decodes to a dynamic short link that redirects to the target', async ({
    createUrlDraft,
    design,
    page,
  }) => {
    await createUrlDraft(TARGET);

    const payload = await design.decodePreview();
    expect(payload, 'preview must be a scannable QR').not.toBeNull();
    expect(payload).toMatch(SHORT_LINK);

    // "Scan" = open the encoded URL. Dynamic QR must forward to the destination.
    await page.goto(payload!);
    await expect(page).toHaveURL(/example\.com/);
  });

  test('changing the design keeps the QR scannable and the payload unchanged', async ({ createUrlDraft, design }) => {
    await createUrlDraft(TARGET);
    const before = await design.decodePreview();

    await design.selectPattern('rounded');
    await design.setColor('Dot color', '#1A237E');

    expect(await design.decodePreview()).toBe(before);
  });

  test('download as anonymous user shows the sign-up wall', async ({ createUrlDraft, design, signUpWall, page }) => {
    const id = await createUrlDraft(TARGET);
    await design.clickDownload();

    await expect(page).toHaveURL(new RegExp(`/generator/sign-up\\?id=${id}`));
    await expect(signUpWall.title).toBeVisible();
    await expect(signUpWall.email).toBeVisible();
    await expect(signUpWall.continueButton).toBeVisible();
    await expect(signUpWall.google).toBeVisible();
  });
});

import { expect, test} from '@playwright/test';

test.describe('Exploration seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    expect(page.title()).toBe('AFEX+')
  });
});

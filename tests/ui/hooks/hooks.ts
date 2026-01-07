// tests/ui/hooks/hooks.ts
import { Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

Before(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});

After(async () => {
  await browser.close();
});

export { page };
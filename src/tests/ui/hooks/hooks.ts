import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext} from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

let browser: Browser;
let context: BrowserContext;

setDefaultTimeout(30 * 1000);

Before(async function () {
  browser = await chromium.launch({
    headless: false, // cámbialo a true en CI
  });

  context = await browser.newContext();
  this.page = await context.newPage();

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL no está definido en el archivo .env');
  }

  await this.page.goto(baseUrl);
});

After(async function () {
  await this.page.close();
  await context.close();
  await browser.close();
});

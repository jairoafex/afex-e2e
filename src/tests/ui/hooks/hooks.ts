import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext} from '@playwright/test';
import * as dotenv from 'dotenv';
import { TEST_TIMEOUTS } from '../../../utils/constants/timeouts.js';

dotenv.config();

let browser: Browser;
let context: BrowserContext;

setDefaultTimeout(TEST_TIMEOUTS.CUCUMBER_STEP);

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
  try {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }
    if (context) {
      await context.close();
    }
    if (browser) {
      await browser.close();
    }
  } catch (error) {
    console.error('Error closing browser:', error);
  }
});

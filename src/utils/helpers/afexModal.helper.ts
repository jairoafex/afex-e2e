import { Page, Locator } from '@playwright/test';

export class AfexModalHelper {
  private readonly page: Page;
  private readonly modal: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#afex-modal');
    this.closeButton = this.modal.locator('button.close');
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible().catch(() => false);
  }

  async closeIfVisible(): Promise<void> {
    if (await this.isVisible()) {
      await this.closeButton.click();
    }
  }

  async expectVisible(): Promise<void> {
    await this.modal.waitFor({ state: 'visible', timeout: 5_000 });
  }
}
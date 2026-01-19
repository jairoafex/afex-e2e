import { Page } from "@playwright/test";

export class AntSelectHelpers {
  constructor(private page: Page) {}

  async selectByText(text: string) {
    await this.page
      .locator(".ant-select-item-option-content", { hasText: text })
      .click();
  }
}

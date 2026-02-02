import { Page } from "@playwright/test";
import { TEST_TIMEOUTS } from "../constants/timeouts.js";

export class AntSelectHelpers {
  constructor(private page: Page) {}

  async selectByText(text: string): Promise<void> {
    const option = this.page.locator(".ant-select-item-option-content", { hasText: text });
    await option.waitFor({ state: 'visible', timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE });
    await option.click();
    try {
      await option.waitFor({ state: 'hidden', timeout: TEST_TIMEOUTS.NORMAL_OPERATION });
    } catch {
      // A veces desaparece muy rápido, no hay problema
    }
  }
}

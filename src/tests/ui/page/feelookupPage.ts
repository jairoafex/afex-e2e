import { expect, Locator, Page } from "@playwright/test";
import { AntSelectHelpers } from "../../../utils/helpers/antSelect.helper.js";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper.js";
import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts.js";
import {
  AmountType,
  MethodPayment,
  Currency,
  CurrencySelect,
} from "../../types/feelookup.types.js";

export class FeelookupPage {

  private readonly afexModal: AfexModalHelper;
  private readonly antSelect: AntSelectHelpers;
  private readonly page: Page;
  private readonly feelookupForm: Locator;
  private readonly countryInput: Locator;
  private readonly cityInput: Locator;
  private readonly methoPaymentAll: Locator;
  private readonly methodPaymentPickup: Locator;
  private readonly methodPaymentDeposit: Locator;
  private readonly amountToSend: Locator;
  private readonly amounttoReceive: Locator;
  private readonly inputAmountToSend: Locator;
  private readonly inputAmountToReceive: Locator;
  private readonly optionCurrencyClp: Locator;
  private readonly optionCurrencyUsd: Locator;
  private readonly inputSearchClient: Locator;
  private readonly textClientFound: Locator;
  private readonly btnClientNotPresent: Locator;
  private readonly btnClientRefuse: Locator;
  private readonly btnSearchQuotations: Locator;
  private readonly tableAgents: Locator;
  private readonly tableAgentsRows:Locator;
  private readonly btnNext:Locator;

  constructor(page: Page) {
    this.page = page;
    this.antSelect = new AntSelectHelpers(page);
    this.afexModal = new AfexModalHelper(page);
    this.feelookupForm = page.getByRole("link", { name: "Cotizar un envío" });
    this.countryInput = page.getByRole("combobox", {name: "* País de destino",});
    this.cityInput = page.getByRole("combobox", { name: "* Ciudad" });
    this.methoPaymentAll = page.locator("label").filter({ hasText: "Todos" });
    this.methodPaymentDeposit = page.locator("label").filter({ hasText: "Depósito" });
    this.methodPaymentPickup = page.locator("label").filter({ hasText: "Efectivo" });
    this.amountToSend = page.getByText("Monto a enviar");
    this.amounttoReceive = page.getByText("Monto a recibir");
    this.inputAmountToSend = page.locator("//input[contains(@id,'form_item_amount')]");
    this.inputAmountToReceive = page.locator("//input[@id='form_item_receiveAmount']");
    this.optionCurrencyClp = page.locator("//span[contains(.,'CLP')]");
    this.optionCurrencyUsd = page.locator("(//span[contains(.,'USD')])[2]");
    this.inputSearchClient = page.locator("//input[contains(@placeholder,'Buscar..')]");
    this.textClientFound = page.locator("//span[contains(@class,'client-name')]");
    this.btnClientNotPresent = page.getByTestId("noPresentialClientButton");
    this.btnClientRefuse = page.getByTestId("rejectFingerprintClientButton");
    this.btnSearchQuotations = page.locator("//span[contains(.,'Buscar')]");
    this.tableAgents = page.locator("div.ant-table-content tbody.ant-table-tbody");
    this.tableAgentsRows= page.locator("tbody.ant-table-tbody tr")
    this.btnNext= page.getByTestId('vnavigator-next')
  }

  async expectFeelookupFormVisible() {
    await expect(this.feelookupForm).toBeVisible();
  }

  async typeCountry(country: string) {
    await this.countryInput.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.countryInput.click();
    await this.countryInput.fill(country);
    await this.antSelect.selectByText(country);
  }

  async typeCity(city: string) {
    await this.cityInput.fill(city);
    await this.antSelect.selectByText(city);
  }

  async clickOnMethodPickup() {
    await this.methodPaymentPickup.click();
  }
  async clickOnMethodDeposit() {
    await this.methodPaymentDeposit.click();
  }

  async clickOnMethodAll() {
    await this.methoPaymentAll.click();
  }
  async selectMethodPayment(method: MethodPayment) {
    switch (method) {
      case "Efectivo":
        await this.clickOnMethodPickup();
        return;
      case "Depósito":
        await this.clickOnMethodDeposit();
        return;
      case "Todos":
        await this.clickOnMethodAll();
        return;
      default:
        throw new Error(`Method payment invalid: ${method}`);
    }
  }
  async clickOnAmountType(type: AmountType) {
    switch (type) {
      case "Enviar":
        await this.amountToSend.click();
        break;

      case "Recibir":
        await this.amounttoReceive.click();
        break;

      default:
        throw new Error(`Amount type invalid: ${type}`);
    }
  }

  async typeAmountToSend(amount: string) {
    await this.inputAmountToSend.fill(amount);
  }
  async typeAmountToReceive(amount: string) {
    await this.inputAmountToReceive.fill(amount);
  }

  async typeRandomAmount(currency: Currency): Promise<void> {
    const currencyRanges: Record<Currency, [number, number]> = {
      USD: [20, 80],
      COP: [250000, 350000],
      BOB: [120, 200],
      HTG: [3000, 4000],
      ARP: [2600, 4000],
      PEN: [10, 40],
      BRL: [600, 900],
      CAD: [15, 100],
      EUR: [80, 120],
      GBP: [250, 400],
      CLP: [12000, 30000],
    };
    const [min, max] = currencyRanges[currency];
    const amount = String(Math.floor(Math.random() * (max - min + 1)) + min);
    if (currency === "USD" || currency === "CLP") {
      await this.typeAmountToSend(amount);
    } else {
      await this.typeAmountToReceive(amount);
    }
  }

  async selectCurrency(currency: CurrencySelect): Promise<void> {
    const actions: Record<CurrencySelect, Locator> = {
      USD: this.optionCurrencyUsd,
      CLP: this.optionCurrencyClp,
    };

    await actions[currency].fill(currency);
  }

  async typeClient(client: string) {
    await this.inputSearchClient.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.inputSearchClient.click();
    await this.inputSearchClient.fill(client);
    await this.inputSearchClient.press("Enter");
  }

  async clickOnClientFound() {
    await this.textClientFound.click();
  }
  async clickOnClientNotPresent() {
    await this.btnClientNotPresent.click();
  }
  async clickOnClientRefuse() {
    await this.btnClientRefuse.click();
  }
  async clickOnSearchQuotations() {
    await this.btnSearchQuotations.click();
  }
  async checkAgentQuotes() {
    try {
      await expect(this.tableAgents).toBeVisible({ timeout: TEST_TIMEOUTS.NORMAL_OPERATION });
    } catch {
      throw new Error("No se encontraron cotizaciones disponibles");
    }
  }
   async selectAgentQuote(
    agent: string,
    transaction: MethodPayment
  ): Promise<void> {
    // Espera a que la tabla tenga filas
    await expect(this.tableAgentsRows.first()).toBeVisible({ timeout: TEST_TIMEOUTS.NORMAL_OPERATION });
    const rowCount = await this.tableAgentsRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = this.tableAgentsRows.nth(i);
      const rowText = await row.innerText();

      if (rowText.includes(agent) && rowText.includes(transaction)) {
        const radio = row.locator('input.ant-radio-input');
        const radioWrapper = row.locator('label.ant-radio-wrapper');
        await radioWrapper.click();
        await expect(radio).toBeChecked();
        if (await this.afexModal.isVisible()) {
          await this.afexModal.closeIfVisible();
        }
        return;
      }
    }

    throw new Error(
      `Cotización no disponible para agente: ${agent} y transacción: ${transaction}`
    );
  }
  async clickOnBtnNext(){
   await this.btnNext.click()
  }
}

import { expect, Locator, Page } from "@playwright/test";
import { AntSelectHelpers } from "../../../utils/helpers/antSelect.helper.js";
import {
  AmountType,
  MethodPayment,
  Currency,
  CurrencySelect,
} from "../../types/feelookup.types.js";

export class FeelookupPage {
  private readonly page: Page;
  private readonly feelookupForm: Locator;
  private readonly countryInput: Locator;
  private readonly cityInput: Locator;
  private antSelect: AntSelectHelpers;
  private readonly methoPaymentAll: Locator;
  private readonly methodPaymentPickup: Locator;
  private readonly methodPaymentDeposit: Locator;
  private readonly amountToSend: Locator;
  private readonly amounttoReceive: Locator;
  private readonly inputAmountToSend: Locator;
  private readonly inputAmountToReceive: Locator;
  private readonly optionCurrencyClp: Locator;
  private readonly optionCurrencyUsd: Locator;

  constructor(page: Page) {
    this.page = page;
    this.feelookupForm = page.getByRole("link", { name: "Cotizar un envío" });
    this.countryInput = page.getByRole("combobox", {name: "* País de destino",});
    this.cityInput = page.getByRole("combobox", { name: "* Ciudad" });
    this.antSelect = new AntSelectHelpers(page);
    this.methoPaymentAll = page.locator('label').filter({hasText:'Todos'})
    this.methodPaymentDeposit = page.locator('label').filter({hasText:'Depósito'})
    this.methodPaymentPickup = page.locator('label').filter({hasText:'Efectivo'})
    this.amountToSend = page.getByText("Monto a enviar");
    this.amounttoReceive = page.getByText("Monto a recibir");
    this.inputAmountToSend = page.locator("//input[contains(@id,'form_item_amount')]");
    this.inputAmountToReceive = page.locator("//input[@id='form_item_receiveAmount']");
    this.optionCurrencyClp = page.locator("//span[contains(.,'CLP')]");
    this.optionCurrencyUsd = page.locator("(//span[contains(.,'USD')])[2]");
  }

  async expectFeelookupFormVisible() {
    await expect(this.feelookupForm).toBeVisible();
  }

  async typeCountry(country: string) {
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
}

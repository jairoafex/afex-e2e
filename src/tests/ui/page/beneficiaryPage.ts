import { expect, Locator, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts.js";
import {
  AccountType,
  IdentificationType,
} from "../../types/beneficiary.types.js";
import { AntSelectHelpers } from "../../../utils/helpers/antSelect.helper.js";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper.js";

export class BeneficiaryPage {
  private readonly antSelect: AntSelectHelpers;
  private readonly afexmodalHelper:AfexModalHelper;

  private readonly page: Page;
  private readonly beneficiaryListContainer: Locator;
  private readonly btnNewBeneficiary: Locator;
  private readonly radiobtnSelectBeneficiay: Locator;
  private readonly inputBeneficiaryName: Locator;
  private readonly inputBeneficiarySurname: Locator;
  private readonly dropdownIdentificationType: Locator;
  private readonly inputBenficiaryId: Locator;
  private readonly inputBeneficiaryPhone: Locator;
  private readonly inputAccountNumber: Locator;
  private readonly dropdownAccountType: Locator;
  private readonly inputBankName: Locator;
  private readonly btnContinue: Locator;
  private readonly summaryTransferContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.antSelect = new AntSelectHelpers(page);
    this.afexmodalHelper= new AfexModalHelper(page);
    this.beneficiaryListContainer = page.locator("div .ant-spin-container");
    this.btnNewBeneficiary = page.locator("//button[.//span[normalize-space()='Nuevo Beneficiario']]");
    this.radiobtnSelectBeneficiay = page.locator("(//span[@class='ant-radio'][1])").first();
    this.inputBeneficiaryName = page.getByRole("textbox", { name: "* Nombre" });
    this.inputBeneficiarySurname = page.getByRole("textbox", {name: "* Apellidos"});
    this.dropdownIdentificationType = page.getByRole("combobox", {name: "* Tipo de identificación"});
    this.inputBenficiaryId = page.getByRole("textbox", {name: "* Número de identificación"});
    this.inputBeneficiaryPhone = page.locator("//input[contains(@id,'form_item_recipientPhone')]");
    this.inputAccountNumber = page.locator("//input[contains(@id,'form_item_receiverAccountNumber')]");
    this.dropdownAccountType = page.locator("//input[@id='form_item_accountType' or @id='form_item_receiverAccountType']");
    this.inputBankName = page.getByRole("combobox", { name: "* Banco" });
    this.btnContinue = page.locator("(//span[contains(.,'Continuar')])[1]");
    this.summaryTransferContainer = page.locator(".summary-container");
  }
  async checkBeneficiaryForm(): Promise<void> {
    await expect(this.beneficiaryListContainer).toHaveCount(1);
    await this.afexmodalHelper.waitForSpinnerToDisappear();
  }

  async clickOnRegisterNewBeneficiary(): Promise<void> {
    await this.btnNewBeneficiary.click();
  }

  async typeBeneficiaryName(): Promise<void> {
    await this.inputBeneficiaryName.fill(faker.person.firstName());
  }

  async typeBeneficiarySurname(): Promise<void> {
    await this.inputBeneficiarySurname.fill(faker.person.lastName());
  }

  async typeBeneficiaryIdentification(identification: string): Promise<void> {
    await this.inputBenficiaryId.fill(identification);
  }

  async selectIdentificationType(type: IdentificationType): Promise<void> {
    await this.dropdownIdentificationType.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownIdentificationType.click();
    await this.antSelect.selectByText(type);
  }

  async typeAccountType(accountType: AccountType): Promise<void> {
    await this.dropdownAccountType.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownAccountType.click();
    await this.antSelect.selectByText(accountType);
  }

  async typeAccountNumber(accountNumber: string): Promise<void> {
    await this.inputAccountNumber.fill(accountNumber);
  }

  async clickOnContinue(): Promise<void> {
    await this.btnContinue.click();
  }

  async expectSummaryTransferVisible(): Promise<void> {
    await expect(this.summaryTransferContainer).toBeVisible();
  }
}

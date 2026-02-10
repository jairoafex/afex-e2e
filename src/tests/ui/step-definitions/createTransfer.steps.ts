import { Given, When, Then } from "@cucumber/cucumber";
import { FeelookupPage } from "../page/feelookupPage.js";
import { BeneficiaryPage } from "../page/beneficiaryPage.js";
import { TransferCollectionPage } from "../page/transferCollectionPage.js";
import { AmountType, Currency, MethodPayment  } from "../../types/feelookup.types.js";
import { AccountType } from "../../types/beneficiary.types.js";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper.js";
import { TransferDetailsPage } from "../page/transferDetailsPage.js";
import { expect } from "@playwright/test";

let feelookupPage: FeelookupPage
let beneficaryPage:BeneficiaryPage;
let transferCollectionPage:TransferCollectionPage;
let afexModalHelper:AfexModalHelper;
let transferDetails:TransferDetailsPage;
Given("Usuario inicia el navegador y valida cargue de AFEX+",
  async function() {
    feelookupPage = new FeelookupPage(this.page)
    beneficaryPage = new BeneficiaryPage(this.page)
    transferCollectionPage = new TransferCollectionPage(this.page)
    transferDetails = new TransferDetailsPage(this.page)
    afexModalHelper= new AfexModalHelper(this.page)
    await feelookupPage.expectFeelookupFormVisible()
   
})

When("Usuario ingresa el cliente {string}",
  async function (client:string) {
    await feelookupPage.typeClient(client)
  }
);

Then(
  'Usuario visualiza al cliente correctamente',
  async function () {
    await feelookupPage.clickOnClientFound()
  }
);

Then('Usuario ingresa el pais {string}',
  async function(country:string) {
     await feelookupPage.typeCountry(country)
})

Then('Usuario selecciona el metodo de pago {string}',
  async function (method:MethodPayment) {
    await feelookupPage.selectMethodPayment(method)
  }
);

Then('Usuario ingresa el monto a {string}',
  async function (amountType: AmountType) {
    await feelookupPage.clickOnAmountType(amountType)
  }
);

Then(
  'Usuario ingresa el monto aleatorio en moneda {string}',
  async function (currency: Currency) {
    await feelookupPage.typeRandomAmount(currency)
  }
);

Then(
  'Usuario indica que cliente no presencial',
  async function () {
    await feelookupPage.clickOnClientNotPresent()
  }
);

When(
  'Usuario da click en Buscar Agentes',
  async function () {
    await feelookupPage.clickOnSearchQuotations()
  }
);

Then(
  'Usuario visualiza el agente {string} el tipo transaccion {string} y selecciona la cotizacion',
  async function (agent:string,method:MethodPayment) {
    await feelookupPage.checkAgentQuotes()
    await feelookupPage.selectAgentQuote(agent,method)
  }
);

When(
  'Usuario da click en boton siguiente',
  async function () {
    await feelookupPage.clickOnBtnNext()
  }
);

Then('Usuario visualiza el formulario para seleccion de beneficiario',
  async function () {
    await beneficaryPage.checkBeneficiaryForm()
  }
);

When(
  'Usuario da click en la opcion Nuevo Beneficiario',
  async function () {
    await beneficaryPage.clickOnRegisterNewBeneficiary()
  }
);

Then(
  'Usuario ingresa el nombre del beneficiario',
  async function () {
    await beneficaryPage.typeBeneficiaryName()
  }
);

Then(
  'Usuario ingresa el nombre del beneficiario {string}',
  async function (name:string) {
    await beneficaryPage.typeRealBeneficiaryName(name)
  }
);

Then(
  'Usuario ingresa el apellido del beneficiario',
  async function () {
    await beneficaryPage.typeBeneficiarySurname()
  }
);

Then(
  'Usuario ingresa el apellido del beneficiario {string}',
  async function (surname:string) {
    await beneficaryPage.typeRealBeneficiarySurname(surname)
  }
);

Then(
  'Usuario selecciona el tipo de cuenta {string}',
  async function (accountType:AccountType) {
    await beneficaryPage.typeAccountType(accountType)
  }
);

Then(
  'Usuario ingresa el numero cuenta o wallet {string}',
  async function (accountNumber:string) {
    await beneficaryPage.typeAccountNumber(accountNumber)
    
  }
);

Then(
  'Usuario ingresa el nombre del proposito {string}',
  async function (purpose:string){
    await beneficaryPage.typePurpose(purpose)
  }
)

Then(
  'Usuario ingresa el telefono del beneficiario {string}',
  async function (phoneNumber:string) {
    await beneficaryPage.typeBeneficiaryPhone(phoneNumber)
  }
);

When(
  'Usuario da click en continuar',
  async function () {
    await beneficaryPage.clickOnContinue()
  }
);

Then(
  'Usuario visualiza la pantalla de resumen de giro',
  async function () {
    await beneficaryPage.expectSummaryTransferVisible()
    
  }
);
When(
  'Usuario da click en crear transferencia',
  async function () {
   await beneficaryPage.clickOnContinue()
  }
);

Then(
  'Usuario da click en la opcion de recaudacion en efectivo',
  async function () {
    await transferCollectionPage.clickOnCashCollectOption()
  }
);

Then(
  'Usuario da click en la opcion vender y registrar',
  async function () {
    await transferCollectionPage.clickOnSellTransfer()
  }
);

When(
  'Usuario da click en la opcion de recaudar',
  async function () {
    await transferCollectionPage.clickOnCollectTransfer()
  }
);

Then(
  'Usuario visualiza modal recaudacion',
  async function () {
    await transferCollectionPage.expectCollectingModalVisisble()
  }
);

When(
  'Usuario finaliza sincronizacion del giro ve mensaje exitoso',
  async function () {
    await transferCollectionPage.expectSummaryModalVisible()
    await transferCollectionPage.clickOnBtnConfirmInModal()
  }
);

Then(
  'Usuario visualiza pantalla de detalle del giro del agente {string}',
  async function (agentName: string) {
    await afexModalHelper.clickOnBtnConfirmInErrorModal();
    await afexModalHelper.expectModalDefaultNotVisible();
    await afexModalHelper.clickOnBtnConfirmInErrorModal();
    const transferCode = await transferDetails.getTransferCode();
    expect(transferCode).toContain('ZB');
    console.log(`Transfer Code: ${transferCode}`);
    const payingAgent = await transferDetails.getPayingAgent();
    console.log(`Paying Agent: ${payingAgent}`);
    expect(payingAgent.toLowerCase()).toContain(agentName.toLowerCase());
  }
);
Then('Usuario ingresa el codigo de promocode {string}',
  async function(promocode:string){
    await feelookupPage.typePromocode(promocode)
  })


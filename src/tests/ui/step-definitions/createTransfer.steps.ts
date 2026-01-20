import { Given, When, Then } from "@cucumber/cucumber";
import { FeelookupPage } from "../page/feelookupPage.js";
import { AmountType, Currency, MethodPayment  } from "../../types/feelookup.types.js";

let feelookupPage: FeelookupPage
Given("Usuario inicia el navegador y valida cargue de AFEX+",
  async function() {
    feelookupPage = new FeelookupPage(this.page)
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
    // implementación pendiente
  }
);

When(
  'Usuario da click en la opcion Nuevo Beneficiario',
  async function () {
    // implementación pendiente
  }
);

When(
  'Usuario da click en continuar',
  async function () {
    // implementación pendiente
  }
);

When(
  'Usuario da click en crear transferencia',
  async function () {
    // implementación pendiente
  }
);

When(
  'Usuario da click en la opcion de recaudar',
  async function () {
    // implementación pendiente
  }
);

When(
  'Usuario finaliza sincronizacion del giro ve mensaje exitoso',
  async function () {
    // implementación pendiente
  }
);

/* =======================
   THEN
   ======================= */






Then(
  'Usuario visualiza el formulario para seleccion de beneficiario',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario ingresa el nombre del beneficiario {string}',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario ingresa el apellido del beneficiario {string}',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario selecciona el tipo de cuenta {string}',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario ingresa el numero cuenta o wallet {string}',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario visualiza la pantalla de resumen de giro',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario visualiza opcion para recaudacion en USD y CLP',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario da click en la opcion de recaudacion en efectivo',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario da click en la opcion vender y registrar',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario visualiza modal recaudacion',
  async function () {
    // implementación pendiente
  }
);

Then(
  'Usuario visualiza pantalla de detalle del giro del agente {string}',
  async function () {
    // implementación pendiente
  }
);

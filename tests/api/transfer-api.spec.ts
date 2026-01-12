import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

// ---------------------------
// Función para validar variables de entorno
// ---------------------------
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variable de entorno ${key} no definida`);
  return value;
}

// ---------------------------
// Variables de entorno seguras
// ---------------------------
const branchCode = getEnv("BRANCH_CODE");
const startDate = getEnv("START_DATE");
const endDate = getEnv("END_DATE");
const corporateCode = getEnv("CLIENT_CORPORATE_CODE");
const userId = getEnv("USER_ID");
const apiToken = getEnv("API_AUTH_TOKEN");
const urlTransferApi = getEnv("URL_TRANSFER_API");

// ---------------------------
// Bloque serial para tests dependientes
// ---------------------------
test.describe.serial("Transfer API", () => {
  // variable global para el transfer creado
  let createdTransferCode: string;

  test("Transfer API - Obtener tasa de cambio", async ({ request }) => {
    console.log("URL:", urlTransferApi);
    console.log("Token:", apiToken);

    const response = await request.get(
      `${urlTransferApi}/v1/transfers/exchangeRate/zb`,
      {
        headers: {
          Authorization: apiToken,
        },
      }
    );

    const body = await response.json();

    expect(body.status).toEqual("success");
    expect(response.status()).toBe(200);
  });

  test("Transfer API - Cotizar y crear giro", async ({ request }) => {
    console.log("Generando transfer...");

    const feelookupResponse = await request.post(
      `${urlTransferApi}/v1/transfers/feelookup`,
      {
        headers: {
          Authorization: apiToken,
        },
        data: {
          amount: faker.number.int({ min: 25, max: 35 }),
          branchId: "31",
          branchCode: branchCode,
          receiverCountry: "PE",
          receiverCity: "LIM",
          methodPayment: "ALL",
          originCurrency: "USD",
          includeFee: false,
        },
      }
    );

    const feelookupBody = await feelookupResponse.json();
    const feelookupId = feelookupBody.data.id;

    expect(feelookupResponse.status()).toBe(206);
    expect(Array.isArray(feelookupBody.data.quotes)).toBe(true);

    const feelookupFieldsResponse = await request.post(
      `${urlTransferApi}/v1/transfers/feelookup/fields`,
      {
        headers: { Authorization: apiToken },
        data: {
          feelookupId,
          quoteId: 7,
        },
      }
    );

    const fieldsBody = await feelookupFieldsResponse.json();
    expect(feelookupFieldsResponse.status()).toBe(200);
    expect(fieldsBody.status).toBe("success");

    const createTransferResponse = await request.post(
      `${urlTransferApi}/v1/transfers/create`,
      {
        headers: {
          Authorization: apiToken,
          "x-afex-user-id": userId,
          "x-afex-branch-code": branchCode,
        },
        data: {
          id: feelookupId,
          quoteId: 7,
          agentFields: {
            recipientPhone: "987654321",
            recipientCityCode: "LIM",
            recipientCityDdi: 1,
            recipientCountryAlpha2Code: "PE",
            recipientCountryDdi: 51,
            recipientNames: faker.person.fullName(),
            recipientSurnames: faker.person.lastName(),
          },
          sender: {
            corporateCode: corporateCode,
            identification: "222311233",
            identificationType: "RUT",
          },
          userFullName: "Jairo Bermudez",
        },
      }
    );

    const transferDetails = await createTransferResponse.json();

    expect(createTransferResponse.status()).toBe(200);
    expect(transferDetails.status).toBe("success");

    createdTransferCode = transferDetails.data.transferCode;
    console.log("Transfer code created:", createdTransferCode);
  });

  test("Transfer API - Obtener detalle del giro", async ({ request }) => {
    console.log("Obteniendo detalle del giro:", createdTransferCode);

    const response = await request.get(
      `${urlTransferApi}/v1/transfers/${createdTransferCode}`,
      {
        headers: {
          Authorization: apiToken,
          "x-afex-branch-code": branchCode,
        },
      }
    );

    const body = await response.json();

    expect(body.status).toBe("success");
    expect(body.data.transferCode).toBe(createdTransferCode);
    expect(response.status()).toBe(200);
  });

  test("Transfer API - Obtener envios por sucursal", async ({ request }) => {
    console.log("Obteniendo envios por sucursal:", branchCode);

    const response = await request.get(
      `${urlTransferApi}/v1/transfers/branches/${branchCode}/sent?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: apiToken,
        },
      }
    );

    const body = await response.json();

    for (const transfer of body.data) {
      expect(transfer).toHaveProperty("transferCode");
      expect(transfer).toHaveProperty("state");
      expect(transfer.collectingAgentCode).toBe(branchCode);
    }

    expect(response.status()).toBe(200);
  });

  test("Transfer API - Obtener envios por cliente", async ({ request }) => {
    console.log("Obteniendo envios por cliente:", corporateCode);

    const response = await request.get(
      `${urlTransferApi}/v1/transfers/customers/${corporateCode}/sent?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: apiToken,
        },
      }
    );

    const body = await response.json();

    for (const transfer of body.data) {
      expect(transfer).toHaveProperty("transferCode");
      expect(transfer).toHaveProperty("state");
      expect(transfer.sender).toBe("DIANA  PAEZ"); // ajustar si es dinámico
    }

    expect(response.status()).toBe(200);
  });
});

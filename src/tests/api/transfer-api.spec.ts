import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { allure } from 'allure-playwright';

const startDate = '2026-01-10';
const endDate = '2026-01-12';

test.describe('Epic: Transfer API', () => {

    test.beforeEach(() => {
    void allure.epic('Transfer API');
    void allure.tag('API');
  });

  test.describe('Feature: Transfer Queries', () => {

    test('API | Obtener tasa de cambio', async ({ request }) => {

      void allure.feature('Exchange Rate');
      void allure.story('Obtener tasa de cambio');
      void allure.severity('critical');

      const response = await test.step('GET exchange rate ZB', async () => {
        return request.get(
          `${process.env.URL_TRANSFER_API}/v1/transfers/exchangeRate/zb`,
          {
            headers: {
              Authorization: `${process.env.API_AUTH_TOKEN}`,
            },
          }
        );
      });

      const body = await response.json();

      

      await test.step('Validar respuesta', async () => {
        expect(response.status()).toBe(200);
        expect(body.status).toBe('success');
      });

      await test.info().attach('Exchange rate response', {
        body: Buffer.from(JSON.stringify(body, null, 2)),
        contentType: 'application/json',
      });
    });
  });

  test.describe('Feature: Transfer Request', () => {

    test('API | Cotizar y crear giro', async ({ request }) => {
      void allure.feature('endpoint feelookup, fields y create transfer');
      void allure.story('Cotizar y crear giro');
      void allure.severity('critical');

      const feelookupResponse = await test.step('POST fee lookup', async () => {
        return request.post(
          `${process.env.URL_TRANSFER_API}/v1/transfers/feelookup`,
          {
            headers: {
              Authorization: `${process.env.API_AUTH_TOKEN}`,
            },
            data: {
              amount: faker.number.int({ min: 25, max: 35 }),
              branchId: '31',
              branchCode: 'ZB',
              receiverCountry: 'PE',
              receiverCity: 'LIM',
              methodPayment: 'ALL',
              originCurrency: 'USD',
              includeFee: false,
            },
          }
        );
      });

      const feelookupBody = await feelookupResponse.json();
      const feelookupId = feelookupBody.data.id;

      expect(feelookupResponse.status()).toBe(206);
      expect(Array.isArray(feelookupBody.data.quotes)).toBe(true);

      const fieldsResponse = await test.step('POST fee lookup fields', async () => {
        return request.post(
          `${process.env.URL_TRANSFER_API}/v1/transfers/feelookup/fields`,
          {
            headers: {
              Authorization: `${process.env.API_AUTH_TOKEN}`,
            },
            data: {
              feelookupId,
              quoteId: 7,
            },
          }
        );
      });

      const fieldsBody = await fieldsResponse.json();

      expect(fieldsResponse.status()).toBe(200);
      expect(fieldsBody.status).toBe('success');

      const createTransferResponse = await test.step('POST create transfer', async () => {
        return request.post(
          `${process.env.URL_TRANSFER_API}/v1/transfers/create`,
          {
            headers: {
              Authorization: `${process.env.API_AUTH_TOKEN}`,
              'x-afex-user-id': '109873128',
              'x-afex-branch-code': 'ZB',
            },
            data: {
              id: feelookupId,
              quoteId: 7,
              agentFields: {
                recipientPhone: '987654321',
                recipientCityCode: 'LIM',
                recipientCityDdi: 1,
                recipientCountryAlpha2Code: 'PE',
                recipientCountryDdi: 51,
                recipientNames: faker.person.fullName(),
                recipientSurnames: faker.person.lastName(),
              },
              sender: {
                corporateCode: '1481947',
                identification: '222311233',
                identificationType: 'RUT',
              },
              userFullName: 'Jairo Bermudez',
            },
          }
        );
      });

      const transferDetails = await createTransferResponse.json();

      expect(createTransferResponse.status()).toBe(200);
      expect(transferDetails.status).toBe('success');
      expect(transferDetails.data.transferCode).toContain('ZB');

      await test.info().attach('Create transfer response', {
        body: Buffer.from(JSON.stringify(transferDetails, null, 2)),
        contentType: 'application/json',
      });
    });
  });

  test.describe('Feature: Transfer Queries', () => {

    test('API | Obtener detalle del giro', async ({ request }) => {
      void allure.feature('endpoint getTransferDetails');
      void allure.story('Obtener detalle del giro por codigo');
      void allure.severity('critical');

      const response = await request.get(
        `${process.env.URL_TRANSFER_API}/v1/transfers/ZB60079316`,
        {
          headers: {
            Authorization: `${process.env.API_AUTH_TOKEN}`,
            'x-afex-branch-code': 'ZB',
          },
        }
      );

      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.status).toBe('success');
      expect(body.data.transferCode).toBe('ZB60079316');
    });

    test('API | Obtener envíos por sucursal', async ({ request }) => {
      void allure.feature('endpoint sentByBranch');
      void allure.story('Obtener envios por sucursal ZB');
      void allure.severity('normal');

      const response = await request.get(
        `${process.env.URL_TRANSFER_API}/v1/transfers/branches/ZB/sent?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `${process.env.API_AUTH_TOKEN}`,
          },
        }
      );

      const body = await response.json();

      for (const transfer of body.data) {
        expect(transfer).toHaveProperty('transferCode');
        expect(transfer).toHaveProperty('state');
        expect(transfer.collectingAgentCode).toBe('ZB');
      }

      expect(response.status()).toBe(200);

        await test.info().attach('Sent by branch response', {
        body: Buffer.from(JSON.stringify(body, null, 2)),
        contentType: 'application/json',
      });
    });

    test('API | Obtener envíos por cliente', async ({ request }) => {

      void allure.feature('endpoint sentByCustomer');
      void allure.story('Obtener envios por cliente 1481947');
      void allure.severity('normal');

      const response = await request.get(
        `${process.env.URL_TRANSFER_API}/v1/transfers/customers/1481947/sent?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `${process.env.API_AUTH_TOKEN}`,
          },
        }
      );

      const body = await response.json();

      for (const transfer of body.data) {
        expect(transfer).toHaveProperty('transferCode');
        expect(transfer).toHaveProperty('state');
        expect(transfer.sender).toBe('DIANA  PAEZ');
      }

      expect(response.status()).toBe(200);

      await test.info().attach('Sent by customer response', {
        body: Buffer.from(JSON.stringify(body, null, 2)),
        contentType: 'application/json',
      });
    });
  });
});

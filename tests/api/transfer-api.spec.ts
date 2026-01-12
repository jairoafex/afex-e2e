import { expect, test } from "@playwright/test";
import {faker} from '@faker-js/faker'

  const branchCode = process.env.BRANCH_CODE as string
  const startDate = process.env.START_DATE as string
  const endDate = process.env.END_DATE as string
  const transferCode = process.env.TRANSFER_CODE as string
  const corporateCode =process.env.CLIENT_CORPORATE_CODE as string

test("Transfer API - Obtener tasa de cambio", async ({ request }) => {
  const response = await request.get(
    `${process.env.URL_TRANSFER_API}/v1/transfers/exchangeRate/zb`,
    {
      headers: {
        Authorization: `${process.env.API_AUTH_TOKEN}`,
      },
    }
  );
  const body = await response.json();
  expect(body.status).toEqual("success");
  expect(response.status()).toBe(200);
});

test("Transfer API - Cotizar y crear giro", async ({ request }) => {

  const feelookupResponse = await request.post(
    `${process.env.URL_TRANSFER_API}/v1/transfers/feelookup`,
    {
      headers: { 
        Authorization: `${process.env.API_AUTH_TOKEN}`,
      },
      data: {
        amount: faker.number.int({ min: 25, max: 35 }),
        branchId: "31",
        branchCode: "ZB",
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
    `${process.env.URL_TRANSFER_API}/v1/transfers/feelookup/fields`,
    {
      headers: { Authorization: `${process.env.API_AUTH_TOKEN}` },
      data: {
        feelookupId,
        quoteId: 7,
      },
    }
  );

  const fieldsBody = await feelookupFieldsResponse.json();

  expect(feelookupFieldsResponse.status()).toBe(200);
  expect(fieldsBody.status).toBe("success");

  const createTransferResponse = await request.post(`${process.env.URL_TRANSFER_API}/v1/transfers/create`,{
    headers:{
       Authorization: `${process.env.API_AUTH_TOKEN}`,
       'x-afex-user-id':`${process.env.USER_ID}`,
       'x-afex-branch-code': `${process.env.BRANCH_CODE}`
    },
    data:{
      id: feelookupId,
      quoteId: 7,
        agentFields: {
          recipientPhone:"987654321",
          recipientCityCode: "LIM",
          recipientCityDdi: 1,
          recipientCountryAlpha2Code: "PE",
          recipientCountryDdi: 51,
          recipientNames: faker.person.fullName(),
          recipientSurnames: faker.person.lastName()
        
    },
      sender: {
       corporateCode: `${corporateCode}`,
        identification: "222311233",
        identificationType: "RUT"
    },
      userFullName: "Jairo Bermudez"
    }
  })

  const transferDetails = await createTransferResponse.json()
  expect(createTransferResponse.status()).toBe(200)
  expect(transferDetails.status).toBe("success");
  const transferCode=transferDetails.data.transferCode
  expect(transferCode).toContain('ZB')
  console.log('Transfer code created',transferCode)
  


});

test('Transfer API - Obtener detalle del giro',async({request})=>{

  const response = await request.get(`${process.env.URL_TRANSFER_API}/v1/transfers/${transferCode}`,
    {
      headers:{
        Authorization: `${process.env.API_AUTH_TOKEN}`,
        'x-afex-branch-code': `${process.env.BRANCH_CODE}`,
      }
    }
  )
  const body = await response.json()

  expect(body.status).toBe('success')
  expect(body.data.transferCode).toBe(transferCode)
  expect(response.status()).toBe(200)

})

test('Transfer API - Obtener envios por sucursal',async({request})=>{


  const response = await request.get(`${process.env.URL_TRANSFER_API}/v1/transfers/branches/${branchCode}/sent?startDate=${startDate}&endDate=${endDate}`,
    {
      headers:{
        Authorization: `${process.env.API_AUTH_TOKEN}`,
      }
    }
  )
  const body = await response.json()

  for(const transfer of body.data){
    expect(transfer).toHaveProperty('transferCode')
    expect(transfer).toHaveProperty('state')
    expect(transfer.collectingAgentCode).toBe(branchCode)
  }
  expect(response.status()).toBe(200)

})

test('Transfer API - Obtener envios por cliente',async({request})=>{

  const response = await request.get(`${process.env.URL_TRANSFER_API}/v1/transfers/customers/${corporateCode}/sent?startDate=${startDate}&endDate=${endDate}`,{
    headers:{
      Authorization: `${process.env.API_AUTH_TOKEN}`
    }
  })
  const body = await response.json()

  for(const transfer of body.data){
    expect(transfer).toHaveProperty('transferCode')
    expect(transfer).toHaveProperty('state')
    expect(transfer.sender).toBe('DIANA  PAEZ')
  }
  expect(response.status()).toBe(200)
})
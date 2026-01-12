import { request } from "@playwright/test";

export async function createApiContext(baseURL: string, token?:string) {
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token ?? process.env.API_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
}

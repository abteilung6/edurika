import axios from 'axios'
import { ShopifyProductListResponse, StoreFrontConfiguration } from './types'

export class StoreFrontAPI {
  protected configuration: StoreFrontConfiguration

  constructor(configuration: StoreFrontConfiguration) {
    this.configuration = configuration
  }

  public get headers(): Record<string, string> {
    return this.configuration?.publicTokenHeaders
  }

  public get storefrontApiUrl(): string {
    return this.configuration?.storefrontApiUrl
  }

  public async productsList(): Promise<ShopifyProductListResponse> {
    const { data } = await axios.post(
      this.storefrontApiUrl,
      JSON.stringify({
        query: this.formatProductListQuery(10)
      }),
      { headers: this.headers }
    )
    return data
  }

  private formatProductListQuery(first: number): string {
    return `
      query products {
        products(first: ${first}) {
          edges {
            node {
              id
              title,
              vendor
            }
          }
        }
      }
    `
  }
}

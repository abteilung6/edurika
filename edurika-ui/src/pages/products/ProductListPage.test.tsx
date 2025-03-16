import { screen, waitFor } from '@testing-library/react'
import api from 'api/base'

import { createTestUtils } from 'utils/testUtils'
import { mockAxiosResponse } from 'utils/mocks/axios'
import { createMockShopifyProduct } from 'utils/mocks/api'
import ProductListPage from './ProductListPage'
import { ShopifyProduct, ShopifyProductListResponse } from 'utils/shopify/types'

const defaultedShopifyProduct = createMockShopifyProduct({})

describe(ProductListPage.name, async () => {
  const { render } = createTestUtils()

  const customRender = async ({
    shopifyProducts = [defaultedShopifyProduct]
  }: {
    shopifyProducts: ShopifyProduct[]
  }) => {
    vi.resetAllMocks()
    const response: ShopifyProductListResponse = {
      data: { products: { edges: shopifyProducts.map((node) => ({ node })) } }
    }
    vi.spyOn(api.shopifyApi, 'productsList').mockResolvedValue(
      mockAxiosResponse(response)
    )

    render(<ProductListPage />)
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull()
    })
  }

  it('should render product title and vendor', async () => {
    await customRender({ shopifyProducts: [defaultedShopifyProduct] })
    screen.getByText(defaultedShopifyProduct.title)
    screen.getByText(defaultedShopifyProduct.vendor)
  })
})

import { screen, waitFor, within } from '@testing-library/react'
import api from 'api/base'

import AdminProductPage from './AdminProductPage'
import { createTestUtils } from 'utils/testUtils'
import { mockAxiosResponse } from 'utils/mocks/axios'
import { createMockProduct } from 'utils/mocks/api'
import { Product, ProductType } from 'generated-api'

const defaultedProduct = createMockProduct({
  gid: 'gid://shopify/Product/1',
  title: 'Product 1',
  product_type: ProductType.Quiz
})

describe(AdminProductPage.name, () => {
  const { render } = createTestUtils()

  const customRender = async ({
    products = [defaultedProduct]
  }: {
    products?: Product[]
  }) => {
    vi.resetAllMocks()
    vi.spyOn(api.productsApi, 'productsListProductsGet').mockResolvedValue(
      mockAxiosResponse({ data: products })
    )

    render(<AdminProductPage />)
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull()
    })
  }

  it('should render products', async () => {
    await customRender({})

    const table = screen.getByRole('table')
    const rows = await within(table).findAllByRole('row')
    expect(rows).toHaveLength(2)

    const row = within(rows[1])
    expect(row.getByText('Product 1')).toBeInTheDocument()
    expect(row.getByText('Quiz')).toBeInTheDocument()
    expect(row.getByText('0,00 €')).toBeInTheDocument()
  })
})

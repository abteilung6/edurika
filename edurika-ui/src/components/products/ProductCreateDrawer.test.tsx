import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from 'api/base'

import { createTestUtils } from 'utils/testUtils'
import { mockAxiosErrorResponse, mockAxiosResponse } from 'utils/mocks/axios'
import { ProductCreateDrawer } from './ProductCreateDrawer'
import { Product } from 'generated-api'
import { mockAnimationsApi } from 'jsdom-testing-mocks'
import { createMockProduct } from 'utils/mocks/api'

const defaultedProduct: Product = createMockProduct({})

describe(ProductCreateDrawer.name, () => {
  const { render } = createTestUtils()
  const user = userEvent.setup()

  const customRender = () => {
    mockAnimationsApi()
    vi.resetAllMocks()
    const spySetOpen = vi.fn()
    const spyCreateProduct = vi
      .spyOn(api.productsApi, 'productsCreateProductsPost')
      .mockResolvedValue(mockAxiosResponse({ data: defaultedProduct }))

    render(<ProductCreateDrawer open={true} setOpen={spySetOpen} />)
    return {
      spySetOpen,
      spyCreateProduct
    }
  }

  const setFormFields = async () => {
    await user.type(screen.getByLabelText('Titel'), 'Mein title')
    await user.type(screen.getByLabelText('Beschreibung'), 'My description')
  }

  it('should submit form', async () => {
    const { spyCreateProduct, spySetOpen } = customRender()
    const submitButton = screen.getByRole('button', {
      name: 'Material erstellen'
    })
    expect(submitButton).toBeDisabled()
    await setFormFields()
    expect(submitButton).toBeEnabled()
    await user.click(submitButton)
    expect(spyCreateProduct).toBeCalledWith({
      title: 'Mein title',
      description_html: 'My description',
      product_type: 'product_type',
      tags: ['tag'],
      vendor: 'vendor'
    })
    expect(spySetOpen).toBeCalledWith(false)
  })

  it('should render alert when submit fails', async () => {
    const { spySetOpen } = customRender()
    vi.spyOn(api.productsApi, 'productsCreateProductsPost').mockRejectedValue(
      mockAxiosErrorResponse({
        response: { data: {}, status: 500 },
        message: 'Something went wrong'
      })
    )
    await setFormFields()
    await user.click(screen.getByRole('button', { name: 'Material erstellen' }))
    within(screen.getByRole('alert')).getByText(/Something went wrong/)
    expect(spySetOpen).not.toBeCalled()
  })
})

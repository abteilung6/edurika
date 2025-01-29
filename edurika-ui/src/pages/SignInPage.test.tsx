import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from 'api/base'

import SignInPage from './SignInPage'
import { createTestUtils } from 'utils/testUtils'
import { mockAxiosErrorResponse, mockAxiosResponse } from 'utils/mocks/axios'

describe(SignInPage.name, () => {
  const { render } = createTestUtils({ layout: 'authLayout' })
  const user = userEvent.setup()

  beforeEach(() => {
    vi.resetAllMocks()
    render(<SignInPage />)
  })

  const setFormFields = async ({
    username = 'fake-username',
    password = 'fake-password'
  }: {
    username?: string
    password?: string
  }) => {
    await user.type(screen.getByLabelText('Username'), username)
    await user.type(screen.getByLabelText('Password'), password)
  }

  it('should render heading', () => {
    expect(
      screen.getByRole('heading', {
        name: /Sign in to your account/,
        level: 2
      })
    ).toBeInTheDocument()
  })

  it('should disable submit button when form is dirty', () => {
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  })

  test('should submit form', async () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem')
    const spyUserLogin = vi
      .spyOn(api.usersApi, 'usersLoginUsersLoginPost')
      .mockResolvedValue(
        mockAxiosResponse({
          data: {
            access_token: 'eyfake',
            token_type: 'bearer'
          }
        })
      )
    await setFormFields({})
    const button = screen.getByRole('button', { name: 'Sign in' })
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
    await user.click(button)
    expect(spyUserLogin).toHaveBeenCalledWith('fake-username', 'fake-password')
    expect(setItemSpy).toHaveBeenCalledWith('accessToken', expect.any(String))
  })

  it('should render alert when submit fails', async () => {
    const setRemoveSpy = vi.spyOn(localStorage, 'removeItem')
    const spyUserLogin = vi
      .spyOn(api.usersApi, 'usersLoginUsersLoginPost')
      .mockRejectedValue(
        mockAxiosErrorResponse({
          response: { data: {}, status: 401 },
          message: 'Something went wrong'
        })
      )
    await setFormFields({})
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    within(screen.getByRole('alert')).getByText(/Something went wrong/)
    expect(spyUserLogin).toHaveBeenCalledOnce()
    expect(setRemoveSpy).toHaveBeenCalledOnce()
  })
})

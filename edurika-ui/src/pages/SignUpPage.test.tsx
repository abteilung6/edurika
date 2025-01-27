import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from 'api/base'

import SignUpPage from './SignUpPage'
import { createTestUtils } from 'utils/testUtils'
import { mockAxiosErrorResponse, mockAxiosResponse } from 'utils/mocks/axios'
import { createMockUser } from 'utils/mocks/api'

describe(SignUpPage.name, () => {
  const { render } = createTestUtils()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.resetAllMocks()
    render(<SignUpPage />)
  })

  const setFormFields = async ({
    email = 'fake@email.com',
    password = 'fake-password',
    username = 'fake-username',
    public_name = 'fake-public-name'
  }: {
    email?: string
    password?: string
    username?: string
    public_name?: string
  }) => {
    await user.type(screen.getByLabelText('Email address'), email)
    await user.type(screen.getByLabelText('Password'), password)
    await user.type(screen.getByLabelText('Username'), username)
    await user.type(screen.getByLabelText('Public name'), public_name)
  }

  it('should render heading', () => {
    expect(
      screen.getByRole('heading', {
        name: /Sign up your account/,
        level: 2
      })
    ).toBeInTheDocument()
  })

  it('should disable submit button when form is dirty', () => {
    expect(screen.getByRole('button', { name: 'Sign up now' })).toBeDisabled()
  })

  it('should disable submit button when form is invalid', async () => {
    await setFormFields({
      email: 'invalid-email'
    })
    expect(screen.getByRole('button', { name: 'Sign up now' })).toBeDisabled()
  })

  test('should submit form', async () => {
    const spyUserRegister = vi
      .spyOn(api.usersApi, 'usersRegisterUsersRegisterPost')
      .mockResolvedValue(
        mockAxiosResponse({
          data: {
            access_token: 'eyfake',
            token_type: 'bearer',
            user: createMockUser({})
          }
        })
      )
    await setFormFields({})
    const button = screen.getByRole('button', { name: 'Sign up now' })
    expect(screen.getByRole('button', { name: 'Sign up now' })).toBeEnabled()
    await user.click(button)
    expect(spyUserRegister).toHaveBeenCalledWith({
      email: 'fake@email.com',
      password: 'fake-password',
      public_name: 'fake-public-name',
      username: 'fake-username'
    })
  })

  it('should render alert when submit fails', async () => {
    const spyUserRegister = vi
      .spyOn(api.usersApi, 'usersRegisterUsersRegisterPost')
      .mockRejectedValue(
        mockAxiosErrorResponse({
          response: { data: { message: 'Something went wrong' }, status: 401 },
          message: 'foo'
        })
      )
    await setFormFields({})
    await user.click(screen.getByRole('button', { name: 'Sign up now' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(spyUserRegister).toHaveBeenCalledOnce()
  })
})

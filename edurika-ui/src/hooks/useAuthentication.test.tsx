import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { AuthenticationProvider, useAuthentication } from './useAuthentication'
import { MemoryRouter, Route, Routes } from 'react-router'
import { mockAxiosResponse } from 'utils/mocks/axios'

import api from 'api/base'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

describe(useAuthentication.name, () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const customRender = ({
    getItemReturnValue = null,
    jwtDecodeExpReturnValue = Date.now() * 2
  }: {
    getItemReturnValue?: string | null
    jwtDecodeExpReturnValue?: number
  }) => {
    vi.mock('jwt-decode', () => ({
      jwtDecode: vi.fn()
    }))
    const spyUsersLogin = vi
      .spyOn(api.usersApi, 'usersLoginUsersLoginPost')
      .mockResolvedValue(
        mockAxiosResponse({
          data: {
            access_token: 'eyfake',
            token_type: 'bearer'
          }
        })
      )
    const spyJwtDecode = vi.mocked(jwtDecode).mockReturnValue({
      exp: jwtDecodeExpReturnValue
    } as JwtPayload)

    const spySetItem = vi.spyOn(localStorage, 'setItem')
    const spyRemoveItem = vi.spyOn(localStorage, 'removeItem')
    const spyGetItem = vi
      .spyOn(localStorage, 'getItem')
      .mockReturnValue(getItemReturnValue)

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: ({ children }) => (
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false
                }
              }
            })
          }
        >
          <MemoryRouter>
            <Routes>
              <Route element={<AuthenticationProvider />}>
                <Route index element={children} />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      )
    })
    return {
      result,
      spyUsersLogin,
      spyGetItem,
      spyRemoveItem,
      spySetItem,
      spyJwtDecode
    }
  }

  it('should initialize as logged out', () => {
    const { result, spyGetItem } = customRender({
      getItemReturnValue: null
    })
    expect(result.current.isLoggedIn).toBe(false)
    expect(spyGetItem).toHaveBeenCalledWith('accessToken')
  })

  it('should log in and store token in localStorage', async () => {
    const { result, spyUsersLogin, spySetItem } = customRender({})
    await act(async () => {
      await result.current.login({ username: 'test', password: 'password' })
    })
    expect(spyUsersLogin).toHaveBeenCalledWith('test', 'password')
    expect(spySetItem).toHaveBeenCalledWith('accessToken', 'eyfake')
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should log out and remove token from localStorage', async () => {
    const { result, spyRemoveItem } = customRender({})
    act(() => {
      result.current.logout()
    })
    expect(spyRemoveItem).toHaveBeenCalledWith('accessToken')
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('should initialize as logged in if token is valid', async () => {
    const { result, spyGetItem, spyJwtDecode } = customRender({
      getItemReturnValue: 'valid.jwt.token',
      jwtDecodeExpReturnValue: Date.now() * 42
    })
    expect(result.current.isLoggedIn).toBe(true)
    expect(spyGetItem).toHaveBeenCalledWith('accessToken')
    expect(spyJwtDecode).toBeCalled()
  })

  it('should initialize as logged out if token is expired', () => {
    const { result, spyGetItem, spyJwtDecode } = customRender({
      getItemReturnValue: 'valid.jwt.token',
      jwtDecodeExpReturnValue: -1
    })
    expect(result.current.isLoggedIn).toBe(false)
    expect(spyGetItem).toHaveBeenCalledWith('accessToken')
    expect(spyJwtDecode).toBeCalled()
  })
})

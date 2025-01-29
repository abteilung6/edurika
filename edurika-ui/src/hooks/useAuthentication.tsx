import { SignInRequest, useSignInMutation } from 'api/users'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { Outlet, useNavigate } from 'react-router'

interface AuthenticationContextProps {
  isLoggedIn: boolean | undefined
  login: (signInRequest: SignInRequest, navigateTo?: string) => Promise<void>
  logout: () => void
  loading: boolean | undefined
  error: Error | null
}

const AuthenticationContext = createContext<AuthenticationContextProps>({
  isLoggedIn: undefined,
  login: () => Promise.resolve(),
  logout: () => undefined,
  loading: undefined,
  error: null
})

export const AuthenticationProvider: React.FC = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>()
  const signInMutation = useSignInMutation()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const initiallyLoggedIn = accessToken !== null && isTokenValid(accessToken)
    setIsLoggedIn(initiallyLoggedIn)
    if (!initiallyLoggedIn) {
      localStorage.removeItem('accessToken')
    }
  }, [])

  const login = useCallback(
    (signInReqest: SignInRequest, navigateTo?: string) => {
      return signInMutation.mutateAsync(signInReqest).then(
        ({ access_token }) => {
          localStorage.setItem('accessToken', access_token)
          setIsLoggedIn(true)
          if (navigateTo !== undefined) {
            navigate(navigateTo)
          }
        },
        () => {
          localStorage.removeItem('accessToken')
        }
      )
    },
    [navigate, signInMutation]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    setIsLoggedIn(false)
  }, [])

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        loading: signInMutation.isPending,
        error: signInMutation.error
      }}
    >
      <Outlet />
    </AuthenticationContext.Provider>
  )
}

export type useAuthenticationResult = AuthenticationContextProps

export const useAuthentication = (): useAuthenticationResult => {
  return useContext(AuthenticationContext)
}

export const isTokenValid = (token: string): boolean => {
  try {
    const payload = jwtDecode<JwtPayload>(token)
    const expirationDateTime = payload.exp
    if (expirationDateTime === undefined) {
      return false
    }
    return Date.now() <= expirationDateTime * 1000
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return false
  }
}

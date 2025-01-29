import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'
import api from 'api/base'
import {
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  User
} from 'generated-api'

export const useSignUpMutation = (
  options?: Omit<
    UseMutationOptions<SignUpResponse, Error, SignUpRequest>,
    'mutationFn'
  >
) => {
  return useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: async (signInRequest) => {
      const { data } =
        await api.usersApi.usersRegisterUsersRegisterPost(signInRequest)
      return data
    },
    ...options
  })
}

export type SignInRequest = {
  username: string
  password: string
}

export const useSignInMutation = (
  options?: Omit<
    UseMutationOptions<SignInResponse, Error, SignInRequest>,
    'mutationFn'
  >
) => {
  return useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: async (signInRequest) => {
      const { data } = await api.usersApi.usersLoginUsersLoginPost(
        signInRequest.username,
        signInRequest.password
      )
      return data
    },
    ...options
  })
}

export function useCurrentUser(
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
) {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.usersApi.usersMeUsersMeGet()
      return data
    },
    ...options
  })
}

import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import api from 'api/base'
import { SignUpRequest, SignUpResponse } from 'generated-api'

export const useSignInMutation = (
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

import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import api from 'api/base'
import { Product, ProductCreateRequest } from 'generated-api'

export const useProductCreate = (
  options?: Omit<
    UseMutationOptions<Product, Error, ProductCreateRequest>,
    'mutationFn'
  >
) => {
  return useMutation<Product, Error, ProductCreateRequest>({
    mutationFn: async (productCreateRequest) => {
      const { data } =
        await api.productsApi.productsCreateProductsPost(productCreateRequest)
      return data
    },
    ...options
  })
}

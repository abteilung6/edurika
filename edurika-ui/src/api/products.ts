import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'
import api from 'api/base'
import { ShopifyProduct } from 'utils/shopify/types'
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

export const useShopifyProductListQuery = (
  options?: Omit<UseQueryOptions<ShopifyProduct[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ShopifyProduct[], Error>({
    ...options,
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.shopifyApi.productsList()
      return data.products.edges.map((edge) => edge.node)
    }
  })
}

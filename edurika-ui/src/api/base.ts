import axios, { AxiosError } from 'axios'
import {
  Configuration,
  ProductsApi,
  UsersApi,
  ValidationError
} from 'generated-api'
import { isTokenValid } from 'hooks/useAuthentication'
import { StoreFrontAPI } from 'utils/shopify/client'
import { createStorefrontClient } from '@shopify/hydrogen-react'
import { loadEnv } from 'utils/environment'

const buildAxiosInstance = () => {
  const { EDURIKA_API_BASE_URL } = loadEnv()
  const axiosInstance = axios.create({
    baseURL: EDURIKA_API_BASE_URL
  })
  axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && isTokenValid(accessToken)) {
      config.headers?.set?.('Authorization', `Bearer ${accessToken}`, true)
    } else {
      config.headers?.delete?.('Authorization')
    }

    return config
  })
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        const axiosError = error as AxiosError
        const errorMessage = parseErrorMessage(axiosError)
        return Promise.reject(new Error(errorMessage))
      } else if (error.code === 'ERR_NETWORK') {
        return Promise.reject(new Error('Service Unavailable'))
      } else {
        return Promise.reject(error)
      }
    }
  )

  return axiosInstance
}

const configuration = new Configuration({})
const axiosInstance = buildAxiosInstance()

const parseErrorMessage = (error: AxiosError) => {
  const errorResponse = error.response
  if (errorResponse) {
    const data = errorResponse.data
    if (typeof data === 'object' && data != null && 'detail' in data) {
      const details = data.detail
      if (typeof details === 'string') {
        return details
      }
      if (Array.isArray(details)) {
        for (const detail of details as ValidationError[]) {
          return detail.msg
        }
      }
    }
  }
  return error.message
}

export const buildStorefrontClient = () => {
  const {
    SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_API_VERSION,
    SHOPIFY_PUBLIC_STOREFRONT_TOKEN
  } = loadEnv()
  return createStorefrontClient({
    storeDomain: SHOPIFY_STORE_DOMAIN,
    storefrontApiVersion: SHOPIFY_STOREFRONT_API_VERSION,
    publicStorefrontToken: SHOPIFY_PUBLIC_STOREFRONT_TOKEN
  })
}

const getShopifyApi = () => {
  const storeFrontClient = buildStorefrontClient()
  return new StoreFrontAPI({
    storefrontApiUrl: storeFrontClient.getStorefrontApiUrl(),
    publicTokenHeaders: storeFrontClient.getPublicTokenHeaders()
  })
}

export default {
  usersApi: new UsersApi(configuration, '', axiosInstance),
  productsApi: new ProductsApi(configuration, '', axiosInstance),
  shopifyApi: getShopifyApi()
}

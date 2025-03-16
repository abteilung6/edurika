type EnvConfig = {
  NODE_ENV: string
  EDURIKA_API_BASE_URL: string
  SHOPIFY_STORE_DOMAIN: string
  SHOPIFY_STOREFRONT_API_VERSION: string
  SHOPIFY_PUBLIC_STOREFRONT_TOKEN: string
}

export const loadEnv = (): EnvConfig => {
  // TODO: handle unset variables
  return {
    NODE_ENV: import.meta.env.MODE || 'development',
    EDURIKA_API_BASE_URL: import.meta.env.VITE_EDURIKA_API_BASE_URL || '',
    SHOPIFY_STORE_DOMAIN: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '',
    SHOPIFY_STOREFRONT_API_VERSION:
      import.meta.env.VITE_SHOPIFY_STOREFRONT_API_VERSION || '',
    SHOPIFY_PUBLIC_STOREFRONT_TOKEN:
      import.meta.env.VITE_SHOPIFY_PUBLIC_STOREFRONT_TOKEN || ''
  }
}

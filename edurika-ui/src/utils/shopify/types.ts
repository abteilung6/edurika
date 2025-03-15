export type StoreFrontConfiguration = {
  storefrontApiUrl: string
  publicTokenHeaders: Record<string, string>
}

type ProductEdge<T> = {
  node: T
}

type ProductConnection<T> = {
  edges: ProductEdge<T>[]
}

export type ShopifyProduct = {
  id: string
  title: string
  vendor: string
}

export type ShopifyProductListResponse = {
  data: { products: ProductConnection<ShopifyProduct> }
}

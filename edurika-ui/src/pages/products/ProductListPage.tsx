import { useShopifyProductListQuery } from 'api/products'
import { Alert } from 'components/Alert'
import { ProductList } from 'components/products/ProductList'

const ProductListPage: React.FC = () => {
  const shopifyProductListQuery = useShopifyProductListQuery()
  const products = shopifyProductListQuery.data || []

  return (
    <div>
      <div>
        {shopifyProductListQuery.isLoading && <div>Loading...</div>}
        {shopifyProductListQuery.isError && (
          <div className="mb-4">
            <Alert
              title="Error"
              description={shopifyProductListQuery.error.message}
            />
          </div>
        )}
        {shopifyProductListQuery.isSuccess && (
          <ProductList
            title="Materialen"
            products={products.map((product) => ({
              id: product.id,
              title: product.title,
              price: '9,22€',
              vendor: product.vendor
            }))}
          />
        )}
      </div>
    </div>
  )
}

export default ProductListPage

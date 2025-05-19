import { useState } from 'react'
import { ProductCreateDrawer } from 'components/products/ProductCreateDrawer'
import { Button } from 'components/Button'
import { useShopifyAdminProductListQuery } from 'api/products'
import { Product } from 'generated-api'
import { formatProductTypeLabel } from 'utils/products'
import { Alert } from 'components/Alert'

// TODO: empty state
const AdminProductPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const adminShopifyProductListQuery = useShopifyAdminProductListQuery()
  const products = adminShopifyProductListQuery.data
  return (
    <div>
      <ProductCreateDrawer open={open} setOpen={setOpen} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">
              Produktmaterialen
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Eine Liste von alle Produktmaterialen in deinem Account mit Titel,
              Materialtyp und Preis.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button onClick={() => setOpen(true)}>Material erstellen</Button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            {adminShopifyProductListQuery.isLoading && <p>Loading...</p>}
            {adminShopifyProductListQuery.isError && (
              <div className="mb-4">
                <Alert
                  title="Error"
                  description={adminShopifyProductListQuery.error.message}
                />
              </div>
            )}
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {products !== undefined && (
                <AdminProductTable products={products} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// TODO: extract table component
const AdminProductTable: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Title
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Materialtyp
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Verkaufspreis
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product.gid}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
              {product.title}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {formatProductTypeLabel(product.product_type)}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              0,00 €
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
              <a href="#" className="text-indigo-600 hover:text-indigo-900">
                Edit
                <span className="sr-only">, {product.product_type}</span>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AdminProductPage

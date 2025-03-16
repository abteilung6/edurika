import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import AuthLayout from 'components/AuthLayout'
import MainLayout from 'components/MainLayout'
import { AuthenticationProvider } from 'hooks/useAuthentication'
import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router'

const getTestRoute = ({
  component,
  layout
}: {
  component: React.ReactNode
  layout: 'mainLayout' | 'authLayout'
}): RouteObject => {
  return {
    path: '/',
    element: <AuthenticationProvider />,
    children: [
      {
        element: layout === 'mainLayout' ? <MainLayout /> : <AuthLayout />,
        children: [
          {
            path: '/',
            element: component
          }
        ]
      }
    ]
  }
}

type CreateTestUtilsOptions = {
  layout?: 'mainLayout' | 'authLayout'
}

const mockEnvironentVariables = () => {
  import.meta.env.VITE_EDURIKA_API_BASE_URL = ''
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN = ''
  import.meta.env.VITE_SHOPIFY_STOREFRONT_API_VERSION = ''
  import.meta.env.VITE_SHOPIFY_PUBLIC_STOREFRONT_TOKEN = ''
}

export const createTestUtils = ({
  layout = 'mainLayout'
}: CreateTestUtilsOptions = {}) => {
  const _render = (component: JSX.Element) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    })
    const testRoute = getTestRoute({ component, layout })
    const testBrowserRouter = createMemoryRouter([testRoute])
    mockEnvironentVariables()
    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={testBrowserRouter} />
      </QueryClientProvider>
    )
  }
  return {
    render: _render
  }
}

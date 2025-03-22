import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminLayout from 'components/AdminLayout'
import AuthLayout from 'components/AuthLayout'
import MainLayout from 'components/MainLayout'
import { AuthenticationProvider } from 'hooks/useAuthentication'
import MarketingPage from 'pages/marketing/MarketingPage'
import ProductCreatePage from 'pages/products/ProductCreatePage'
import ProductListPage from 'pages/products/ProductListPage'
import SignInPage from 'pages/SignInPage'
import SignUpPage from 'pages/SignUpPage'
import StartPage from 'pages/StartPage'
import { PropsWithChildren } from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter, RouteObject } from 'react-router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

const route: RouteObject = {
  path: '/',
  element: <AuthenticationProvider />,
  children: [
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/signin',
          element: <SignInPage />
        },
        {
          path: '/signup',
          element: <SignUpPage />
        }
      ]
    },
    {
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <MarketingPage />
        },
        {
          path: '/start',
          element: <StartPage />
        },
        {
          path: '/products',
          element: <ProductListPage />
        }
      ]
    },
    {
      element: <AdminLayout />,
      path: 'admin',
      children: [
        {
          path: 'products',
          element: <ProductCreatePage />
        }
      ]
    }
  ]
}

const browserRouter = createBrowserRouter([route])

const Providers: React.FC<PropsWithChildren> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={browserRouter} />
    </QueryClientProvider>
  )
}

export default Providers

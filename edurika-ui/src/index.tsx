import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import SignUpPage from 'pages/SignUpPage'
import Providers from 'Providers'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <Providers>
    <SignUpPage />
  </Providers>
)

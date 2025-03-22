import { useAuthentication } from 'hooks/useAuthentication'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthentication()

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate('/signin')
    }
  }, [isLoggedIn, navigate])

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AdminLayout

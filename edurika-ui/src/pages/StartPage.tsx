import { useCurrentUser } from 'api/users'
import { Button } from 'components/Button'
import { useAuthentication } from 'hooks/useAuthentication'
import { useNavigate } from 'react-router'

const StartPage: React.FC = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuthentication()
  return (
    <div>
      StartPage
      {isLoggedIn ? 'logged in' : 'logged out'}
      {!isLoggedIn ? (
        <div>
          <Button onClick={() => navigate('/signin')}>singin</Button>
          <Button onClick={() => navigate('/signup')}>signup</Button>
        </div>
      ) : (
        <div>
          <ProfileTest />
          <Button onClick={() => logout()}>logout</Button>
        </div>
      )}
    </div>
  )
}

const ProfileTest: React.FC = () => {
  const { data: user } = useCurrentUser()
  if (user === undefined) {
    return null
  }
  return <div>hello {user.public_name}</div>
}

export default StartPage

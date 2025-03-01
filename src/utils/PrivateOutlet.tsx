import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useLoggedInUser from '../hooks/useLoggedInUser'

export function PrivateOutlet() {
  const location = useLocation()
  const loggedInUser = useLoggedInUser()

  return loggedInUser ? (
    <Outlet />
  ) : (
    <Navigate
      to='/auth'
      state={{ from: location }}
    />
  )
}

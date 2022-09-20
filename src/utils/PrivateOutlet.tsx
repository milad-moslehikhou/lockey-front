import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'


export function PrivateOutlet() {
  const location = useLocation()
  const user = useSelector(selectCurrentUser)

  return user ? (<Outlet />) : (<Navigate to="/login" state={{ from: location }} />)
}

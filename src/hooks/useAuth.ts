import { useContext } from 'react'
import { AuthContext } from '../context/Auth'

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext)
  return [auth, setAuth] as const
}

export default useAuth

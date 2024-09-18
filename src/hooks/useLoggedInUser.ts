import { useContext } from 'react'
import { AuthContext } from '../context/Auth'

const useLoggedInUser = () => {
  const { auth } = useContext(AuthContext)
  return auth.user
}

export default useLoggedInUser

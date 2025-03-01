import { useContext } from 'react'
import { AuthContext } from '../context/Auth'

const useLoggedInUser = () => {
  const { auth } = useContext(AuthContext)
  if (auth.token)
    return auth.user
  return null
}

export default useLoggedInUser

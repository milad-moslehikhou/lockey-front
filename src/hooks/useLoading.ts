import { useContext } from 'react'
import { LoadingContext } from '../context/Loading'

const useLoading = () => {
  const { showLoading } = useContext(LoadingContext)
  return showLoading
}

export default useLoading

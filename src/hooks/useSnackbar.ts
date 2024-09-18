import { useContext } from 'react'
import { SnackbarContext } from '../context/Snackbar'

const useSnackbar = () => {
  const { openSnackbar } = useContext(SnackbarContext)
  return openSnackbar
}

export default useSnackbar

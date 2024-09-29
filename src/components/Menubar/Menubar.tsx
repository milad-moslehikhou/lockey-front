import * as React from 'react'
import { Box, Link } from '@mui/material'
import { useLogoutMutation } from '../../features/apiSlice'
import { useNavigate } from 'react-router-dom'
import useSnackbar from '../../hooks/useSnackbar'
import useAuth from '../../hooks/useAuth'

const Menubar = () => {
  const [logout] = useLogoutMutation()
  const [, setAuth] = useAuth()
  const navigate = useNavigate()
  const openSnackbar = useSnackbar()
  const [logoutIsPending, setLogoutIsPending] = React.useState(false)

  const handleClick = async () => {
    if(logoutIsPending)
      return
    setLogoutIsPending(true)
    try {
      await logout().unwrap()
      setAuth({ user: null, token: null, expiry: null })
      navigate('/login')
    } catch {
      openSnackbar({
        severity: 'error',
        message: 'Somthing has wrong!',
      })
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '3rem',
        padding: '0 1rem',
        backgroundColor: 'grey.900',
      }}
    >
      <Box>
        <Link
          href='/app/passwords'
          sx={{
            marginRight: '1rem',
            color: 'grey.50',
            '&:hover': {
              cursor: 'pointer',
              color: 'grey.300',
            },
          }}
          underline='none'
        >
          passwords
        </Link>
        <Link
          href='#'
          sx={{
            marginRight: '1rem',
            color: 'grey.50',
            '&:hover': {
              cursor: 'pointer',
              color: 'grey.300',
            },
          }}
          underline='none'
        >
          administration
        </Link>
      </Box>
      <Box>
        <Link
          sx={{
            color: 'grey.50',
            '&:hover': {
              cursor: 'pointer',
              color: 'grey.300',
            },
          }}
          underline='none'
          onClick={handleClick}
        >
          logout
        </Link>
      </Box>
    </Box>
  )
}

export default Menubar

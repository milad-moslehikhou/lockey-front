import * as React from 'react'
import Routes from '../../Routes'
import { useLogoutMutation } from '../../features/apiSlice'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { Alert, Slide, Snackbar, SnackbarCloseReason } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions, selectIsLastChanceTobeActive, selectUserInactivityTime } from '../../features/commonSlice'
import { folderActions } from '../../features/folderSlice'

const MainPage = () => {
  const [logout] = useLogoutMutation()
  const [, setAuth] = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loggedInUser = useLoggedInUser()
  const userInactivity = useSelector(selectUserInactivityTime)
  const isLastChanceTobeActive = useSelector(selectIsLastChanceTobeActive)
  const [countdownTimer, setCountdownTimer] = React.useState<number>(30)

  const handleLogout = React.useCallback(async () => {
    await logout().then(() => {
      setAuth({ user: null, token: null, expiry: null })
      navigate('/login')
    })
  }, [logout, navigate, setAuth])

  const handleOnCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway' || countdownTimer <= 1) {
      return
    }
    dispatch(folderActions.setSelected(''))
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (loggedInUser && Date.now() > userInactivity) {
        dispatch(commonActions.setIsLastChanceTobeActive(true))
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [userInactivity, loggedInUser, dispatch])

  React.useEffect(() => {
    let logoutTimer: NodeJS.Timer
    if (isLastChanceTobeActive) {
      logoutTimer = setInterval(() => {
        setCountdownTimer(prev => {
          if (prev <= 1) {
            clearInterval(logoutTimer)
            dispatch(commonActions.setIsLastChanceTobeActive(false))
            handleLogout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearTimeout(logoutTimer)
  }, [isLastChanceTobeActive, handleLogout, dispatch])

  React.useEffect(() => {
    if (!isLastChanceTobeActive) setCountdownTimer(30)
  }, [isLastChanceTobeActive])

  return (
    <>
      <Routes />
      <Snackbar
        open={isLastChanceTobeActive}
        autoHideDuration={30000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
        onClose={handleOnCloseSnackbar}
      >
        <Alert
          severity='warning'
          variant='filled'
          sx={{ width: '100%' }}
          onClose={handleOnCloseSnackbar}
        >
          {`You dont have any interaction with this page, you will logout automatically after ${countdownTimer}s.`}
        </Alert>
      </Snackbar>
    </>
  )
}

export default MainPage

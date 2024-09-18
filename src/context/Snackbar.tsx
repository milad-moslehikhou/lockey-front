import * as React from 'react'
import { Snackbar, Alert } from '@mui/material'
import Slide from '@mui/material/Slide'
import type { SnackbarContextType, AlertStateType } from '../types/component'

const SnackbarContext = React.createContext<SnackbarContextType>({
  openSnackbar: () => {},
})

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertState, setAlertState] = React.useState<AlertStateType>({
    open: false,
    severity: 'success',
    message: 'no message!',
  })

  const openSnackbar = ({ severity, message }: AlertStateType) => {
    setAlertState({
      open: true,
      severity: severity,
      message: message,
    })
  }

  const handleClose = () => {
    const newState = { ...(alertState as AlertStateType), open: false }
    setAlertState(newState)
  }
  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        open={alertState.open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
        onClose={handleClose}
      >
        <Alert
          severity={alertState.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export { SnackbarContext, SnackbarProvider }

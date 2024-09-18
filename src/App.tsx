import * as React from 'react'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/Auth'
import { LoadingProvider } from './context/Loading'
import { store } from './app/store'
import { SnackbarProvider } from './context/Snackbar'
import Routes from './Routes'

import './App.css'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <LoadingProvider>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </LoadingProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  )
}

export default App

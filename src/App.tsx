import * as React from 'react'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { BrowserRouter } from 'react-router-dom'
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
    [prefersDarkMode],
  )
  
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
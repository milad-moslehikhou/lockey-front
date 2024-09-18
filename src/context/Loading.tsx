import * as React from 'react'
import { Backdrop, CircularProgress } from '@mui/material'
import type { LoadingContextType } from '../types/component'

const LoadingContext = React.createContext<LoadingContextType>({
  showLoading: () => {},
})

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingState, setLoadingState] = React.useState(false)

  const showLoading = (show: boolean) => {
    setLoadingState(show)
  }

  const handleClick = () => {
    setLoadingState(false)
  }

  return (
    <LoadingContext.Provider value={{ showLoading }}>
      {children}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
        open={loadingState}
        onClick={handleClick}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </LoadingContext.Provider>
  )
}

export { LoadingContext, LoadingProvider }

import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../features/api/apiSlice'
import authSliceReducer from '../features/auth/authSlice'
import { AuthStateType } from '../types/auth'


const getAuthStateFromSession = () => {
  const authString = sessionStorage.getItem('auth') as string
  const auth = JSON.parse(authString) as AuthStateType
  if (auth == undefined) {
    return { user: null, token: null } as AuthStateType
  } else {
    const now = new Date()
    if (auth.token && auth.token.expiry < now) {
      sessionStorage.removeItem('auth')
      return { user: null, token: null } as AuthStateType
    }
  }
  return auth
}

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: { auth: getAuthStateFromSession() },
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

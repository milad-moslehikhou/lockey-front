import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../features/api/apiSlice'
import authSliceReducer from '../features/auth/authSlice'
import folderSliceReducer from '../features/folder/folderSlice'
import credentialReducer from '../features/credential/credentialSlice'
import breadcrumbsReducer from '../features/breadcrumbs/breadcrumbsSlice'
import type { AuthStateType } from '../types/auth'


const getAuthStateFromSession = () => {
  const authString = sessionStorage.getItem('auth') as string
  const auth = JSON.parse(authString) as AuthStateType
  if (auth == undefined) {
    return { user: null, token: null } as AuthStateType
  } else {
    const now = new Date()
    const exp = new Date(auth.token?.expiry || '')
    if ( exp < now) {
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
    folder: folderSliceReducer,
    credential: credentialReducer,
    breadcrumbs: breadcrumbsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: { auth: getAuthStateFromSession() },
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

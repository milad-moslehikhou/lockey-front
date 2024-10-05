import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../features/apiSlice'
import folderReducer from '../features/folderSlice'
import credentialReducer from '../features/credentialSlice'
import breadcrumbsReducer from '../features/breadcrumbsSlice'
import userReducer from '../features/userSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    folder: folderReducer,
    credential: credentialReducer,
    user: userReducer,
    breadcrumbs: breadcrumbsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {},
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

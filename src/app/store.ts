import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../features/apiSlice'
import folderSliceReducer from '../features/folderSlice'
import credentialReducer from '../features/credentialSlice'
import breadcrumbsReducer from '../features/breadcrumbsSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    folder: folderSliceReducer,
    credential: credentialReducer,
    breadcrumbs: breadcrumbsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {},
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch

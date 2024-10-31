import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { apiSlice } from '../features/apiSlice'
import userInactivityMiddleware from '../middleware/userInactivityMiddleware'


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware).prepend(userInactivityMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {},
})

export type AppDispatchType = typeof store.dispatch

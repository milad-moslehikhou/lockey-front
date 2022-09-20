import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootStateType } from '../../app/store'
import type { AuthStateType, LoginResponseType } from '../../types/auth'


const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as AuthStateType,
  reducers: {
    setAuthState: (state, action: PayloadAction<LoginResponseType>) => {
      state.user = action.payload.user
      state.token = { 'token': action.payload.token, 'expiry': action.payload.expiry }
      sessionStorage.setItem('auth', JSON.stringify(state))
    },
  },
})

export default authSlice.reducer
export const { setAuthState } = authSlice.actions
export const selectCurrentUser = (state: RootStateType) => state.auth.user
export const selectToken = (state: RootStateType) => state.auth.token


import { createSlice, PayloadAction } from '@reduxjs/toolkit'


import type { RootState } from '../../app/store'
import type { AuthState } from '../../types/auth'
import type { User } from '../../types/user'


const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = user
      state.token = token
    },
  },
})

export default slice.reducer
export const { setCredentials } = slice.actions
export const selectCurrentUser = (state: RootState) => state.auth.user

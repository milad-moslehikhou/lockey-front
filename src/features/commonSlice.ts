import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/reducers'
import type { CommonStateType } from '../types/component'

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    userInactivityTime: Date.now() + (1 * 60 * 1000),
    isLastChanceTobeActive: false,
  } as CommonStateType,
  reducers: {
    setUserInactivityTime: (state, action: PayloadAction<number>) => {
      state.userInactivityTime = action.payload
    },
    setIsLastChanceTobeActive: (state, action: PayloadAction<boolean>) => {
      state.isLastChanceTobeActive = action.payload
    },
  },
})

export default commonSlice.reducer
export const commonActions = commonSlice.actions
export const selectUserInactivityTime = (state: RootStateType) => state.common.userInactivityTime
export const selectIsLastChanceTobeActive = (state: RootStateType) => state.common.isLastChanceTobeActive
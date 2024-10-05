import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/store'
import { FormsStateType } from '../types/component'
import { UserStateType } from '../types/user'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    selected: [],
    forms: { detail: true },
    search: '',
    filter: 'list:all_items',
  } as UserStateType,
  reducers: {
    setSelected: (state, action: PayloadAction<string[]>) => {
      state.selected = action.payload
    },
    setShowForms: (state, action: PayloadAction<FormsStateType>) => {
      state.forms = {
        ...action.payload,
        detail: state.forms.detail,
      }
    },
    setShowDetail: (state, action: PayloadAction<boolean>) => {
      state.forms = {
        ...state.forms,
        detail: action.payload,
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    },
  },
})

export default userSlice.reducer
export const userActions = userSlice.actions
export const selectUserSelected = (state: RootStateType) => state.user.selected
export const selectUserShowForms = (state: RootStateType) => state.user.forms
export const selectUserSearch = (state: RootStateType) => state.user.search
export const selectUserFilter = (state: RootStateType) => state.user.filter

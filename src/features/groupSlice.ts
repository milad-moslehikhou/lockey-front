import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/store'
import { FormsStateType } from '../types/component'
import { GroupStateType } from '../types/group'

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    selected: [],
    forms: { detail: true },
    search: '',
    filter: 'list:all_items',
  } as GroupStateType,
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

export default groupSlice.reducer
export const groupActions = groupSlice.actions
export const selectGroupSelected = (state: RootStateType) => state.group.selected
export const selectGroupShowForms = (state: RootStateType) => state.group.forms
export const selectGroupSearch = (state: RootStateType) => state.group.search
export const selectGroupFilter = (state: RootStateType) => state.group.filter

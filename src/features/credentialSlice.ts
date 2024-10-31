import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/reducers'
import { FormsStateType } from '../types/component'
import { CredentialSecretType, CredentialStateType } from '../types/credential'

const credentialSlice = createSlice({
  name: 'credential',
  initialState: {
    selected: [],
    forms: { detail: true },
    search: '',
    filter: 'list:all_items',
    secret: [],
  } as CredentialStateType,
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
    setSecret: (state, action: PayloadAction<CredentialSecretType[]>) => {
      state.secret = action.payload
    },
  },
})

export default credentialSlice.reducer
export const credentialActions = credentialSlice.actions
export const selectCredentialSelected = (state: RootStateType) => state.credential.selected
export const selectCredentialShowForms = (state: RootStateType) => state.credential.forms
export const selectCredentialSearch = (state: RootStateType) => state.credential.search
export const selectCredentialFilter = (state: RootStateType) => state.credential.filter
export const selectCredentialSecret = (state: RootStateType) => state.credential.secret

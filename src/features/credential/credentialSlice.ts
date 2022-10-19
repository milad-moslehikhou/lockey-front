import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../../app/store'
import { FormsStateType } from '../../types/component'
import { CredentialStateType, CredentialType } from '../../types/credential'


const credentialSlice = createSlice({
  name: 'credential',
  initialState: {
    credentials: [],
    selected: [],
    formsState: {
      add: false,
      edit: false,
      delete: false,
      detail: true
    }
  } as CredentialStateType,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialType[] | undefined>) => {
      state.credentials = action.payload || []
    },
    setCredentialFormsState: (state, action: PayloadAction<FormsStateType>) => {
      state.formsState = action.payload
    },
    setSelectedCredentials: (state, action: PayloadAction<string[]>) => {
      state.selected = action.payload
    },
  },
})

export default credentialSlice.reducer
export const {
  setCredentials,
  setSelectedCredentials,
  setCredentialFormsState
} = credentialSlice.actions
export const selectCredentials = (state: RootStateType) => state.credential.credentials
export const selectSelectedCredentials = (state: RootStateType) => state.credential.selected
export const selectCredentialFormsState = (state: RootStateType) => state.credential.formsState

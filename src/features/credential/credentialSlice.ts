import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../../app/store'
import { FormsStateType } from '../../types/component'
import { CredentialStateType, CredentialType } from '../../types/credential'


const credentialSlice = createSlice({
  name: 'credential',
  initialState: {
    credentials: [],
    formsState: {
      add: false,
      edit: false,
      delete: false
    }
  } as CredentialStateType,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialType[] | undefined>) => {
      state.credentials = action.payload || []
    },
    setFormsState: (state, action: PayloadAction<FormsStateType>) => {
      state.formsState = action.payload
    },
  },
})

export default credentialSlice.reducer
export const {
  setCredentials,
  setFormsState
} = credentialSlice.actions
export const selectCredentials = (state: RootStateType) => state.credential.credentials
export const selectFormsState = (state: RootStateType) => state.credential.formsState

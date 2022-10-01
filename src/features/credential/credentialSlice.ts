import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../../app/store'
import { CredentialStateType, CredentialType } from '../../types/credential'


const credentialSlice = createSlice({
  name: 'credential',
  initialState: { credentials: [] } as CredentialStateType,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialType[] | undefined>) => {
      state.credentials = action.payload || []
    },
  },
})

export default credentialSlice.reducer
export const {
  setCredentials,
} = credentialSlice.actions
export const selectCredentials = (state: RootStateType) => state.credential.credentials

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/store'
import type { FormsStateType } from '../types/component'
import type { FolderStateType } from '../types/folder'

const folderSlice = createSlice({
  name: 'folder',
  initialState: {
    selected: '',
    forms: {},
  } as FolderStateType,
  reducers: {
    setSelected: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
    setShowForm: (state, action: PayloadAction<FormsStateType>) => {
      state.forms = action.payload
    },
  },
})

export default folderSlice.reducer
export const folderActions = folderSlice.actions
export const selectSelectedFolder = (state: RootStateType) => state.folder.selected
export const selectFolderShowForms = (state: RootStateType) => state.folder.forms

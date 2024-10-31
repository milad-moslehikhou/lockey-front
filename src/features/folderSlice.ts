import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/reducers'
import type { FormsStateType } from '../types/component'
import type { FolderStateType } from '../types/folder'

const folderSlice = createSlice({
  name: 'folder',
  initialState: {
    selected: '',
    hovered: -1,
    forms: {},
  } as FolderStateType,
  reducers: {
    setSelected: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
    setHovered: (state, action: PayloadAction<number>) => {
      state.hovered = action.payload
    },
    setShowForms: (state, action: PayloadAction<FormsStateType>) => {
      state.forms = action.payload
    },
  },
})

export default folderSlice.reducer
export const folderActions = folderSlice.actions
export const selectFolderSelected = (state: RootStateType) => state.folder.selected
export const selectFolderHovered = (state: RootStateType) => state.folder.hovered
export const selectFolderShowForms = (state: RootStateType) => state.folder.forms

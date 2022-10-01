import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../../app/store'
import { FolderStateType, FolderType } from '../../types/folder'


const folderSlice = createSlice({
  name: 'folder',
  initialState: { folders: [] } as FolderStateType,
  reducers: {
    setFolders: (state, action: PayloadAction<FolderType[] | undefined>) => {
      state.folders = action.payload || []
    },
  },
})

export default folderSlice.reducer
export const {
  setFolders,
} = folderSlice.actions
export const selectFolders = (state: RootStateType) => state.folder.folders


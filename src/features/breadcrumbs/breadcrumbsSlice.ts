import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../../app/store'
import { BREADCRUMBS_BASE_PATH } from '../../constant'
import { BreadcrumbsType, BreadcrumbsStateType } from '../../types/component'


const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState: { path: [BREADCRUMBS_BASE_PATH] } as BreadcrumbsStateType,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<BreadcrumbsType[]>) => {
      state.path = action.payload
    },
  },
})

export default breadcrumbsSlice.reducer
export const {
  setSelectedItem,
} = breadcrumbsSlice.actions
export const selectBreadcrumbs = (state: RootStateType) => state.breadcrumbs


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootStateType } from '../app/store'
import { BreadcrumbsItemType } from '../types/component'

const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState: {
    items: [{ id: 'list:all_items', name: 'All Items' }] as BreadcrumbsItemType[],
  },
  reducers: {
    setItems: (state, action: PayloadAction<BreadcrumbsItemType[]>) => {
      state.items =
        action.payload.length === 0 || action.payload[0].id === state.items[0].id
          ? [{ id: 'list:all_items', name: 'All Items' }]
          : [{ id: 'list:all_items', name: 'All Items' }, ...action.payload]
    },
    setItem: (state, action: PayloadAction<string>) => {
      const indexOf = state.items.findIndex(item => item.id === action.payload)
      state.items.length = indexOf + 1
    },
  },
})

export default breadcrumbsSlice.reducer
export const breadcrumbsActions = breadcrumbsSlice.actions
export const selectBreadcrumbsItems = (state: RootStateType) => state.breadcrumbs.items

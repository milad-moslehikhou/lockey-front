import { combineReducers } from 'redux';
import { apiSlice } from '../features/apiSlice'
import folderReducer from '../features/folderSlice'
import credentialReducer from '../features/credentialSlice'
import breadcrumbsReducer from '../features/breadcrumbsSlice'
import userReducer from '../features/userSlice'
import groupReducer from '../features/groupSlice'
import commonReducer from '../features/commonSlice'

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  folder: folderReducer,
  credential: credentialReducer,
  user: userReducer,
  group: groupReducer,
  breadcrumbs: breadcrumbsReducer,
  common: commonReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;
export default rootReducer;
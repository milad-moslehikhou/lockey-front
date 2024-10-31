import { Middleware } from 'redux'
import { RootStateType } from '../app/reducers'
import { commonActions } from '../features/commonSlice'
import { PayloadAction } from '@reduxjs/toolkit'

const MAX_USER_INACTIVITY_TIME = window.MAX_USER_INACTIVITY_TIME || 1

const userInactivityMiddleware: Middleware<{}, RootStateType> = storeApi => next => action => {
  const payloadAction = action as PayloadAction
  if(payloadAction.type && !payloadAction.type.startsWith('folder/setHover') &&
    (
      payloadAction.type.startsWith('api/executeQuery') ||
      payloadAction.type.startsWith('folder') ||
      payloadAction.type.startsWith('credential') ||
      payloadAction.type.startsWith('group') ||
      payloadAction.type.startsWith('user')
    )
  ) {
    storeApi.dispatch(commonActions.setUserInactivityTime(Date.now() + MAX_USER_INACTIVITY_TIME * 60 * 1000))
    storeApi.dispatch(commonActions.setIsLastChanceTobeActive(false))
  } 
  return next(action)
}

export default userInactivityMiddleware

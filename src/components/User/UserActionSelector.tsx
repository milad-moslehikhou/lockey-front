import * as React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { selectUserSelected, selectUserShowForms } from '../../features/userSlice'
import { useGetUserByIdQuery } from '../../features/apiSlice'
import UserDeleteForm from './UserDeleteForm'
import UserAddForm from './UserAddForm'
import UserEditForm from './UserEditForm'
import UserDetail from './UserDetail'
import UserResetPassForm from './UserResetPassForm'

const UserActionSelector = () => {
  const userSelected = useSelector(selectUserSelected)
  const userShowForms = useSelector(selectUserShowForms)
  const {
    data: user,
    isUninitialized,
    isFetching,
  } = useGetUserByIdQuery(_.toInteger(userSelected[0]), {
    skip: userSelected.length === 1 ? false : true,
  })

  const userIsValid = user && !isUninitialized && !isFetching

  return (
    <>
      {userShowForms.detail && userIsValid ? <UserDetail user={user} /> : ''}
      {userShowForms.edit && userIsValid ? <UserEditForm user={user} /> : ''}
      {userShowForms.delete && userIsValid ? <UserDeleteForm user={user} /> : ''}
      {userShowForms.resetPass && userIsValid ? <UserResetPassForm user={user} /> : ''}
      {userShowForms.add ? <UserAddForm /> : ''}
    </>
  )
}

export default UserActionSelector

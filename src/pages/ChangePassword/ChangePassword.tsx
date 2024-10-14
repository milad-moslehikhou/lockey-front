import React from 'react'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import UserChangePassOnLoginForm from '../../components/User/UserChangePassOnLoginForm'

export default function ChangePassword() {
  const loggedInUser = useLoggedInUser()
  return <>{loggedInUser ? <UserChangePassOnLoginForm user={loggedInUser} /> : ''}</>
}

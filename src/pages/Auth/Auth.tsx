import './Auth.css'
import * as React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import Verify2fa from '../Verify2fa/Verify2fa'
import Enable2fa from '../Enable2fa/Enable2fa'
import Login from '../Login/Login'

const Auth = () => {
  const [auth,] = useAuth()
  const loggedInUser = useLoggedInUser()
  const location = useLocation()


  let page = <></>
  if (loggedInUser)
    if (loggedInUser.force_change_pass)
      page = (
        <Navigate
          to='/change-password'
          state={{ from: location }}
        />
      )
    else
      page = (
        <Navigate
          to='/app/credentials'
          state={{ from: location }}
        />
      )
  else
    page = (
      <div className='login-wraper'>
        <div className='logo-wraper'>
          <img
            src={window.location.origin + '/logo-sm.svg'}
            alt='logo'
          />
          <p className='logo-header'>Lockey secure secret store</p>
          <p className='logo-desc'>safely store important secrets in a safe place.</p>
        </div>
        <div className='form-wraper'>
          <div className='form-container'>
            {auth.state === null ? <Login /> : <></>}
            {auth.state === 'verify2fa' ? <Verify2fa /> : <></>}
            {auth.state === 'enable2fa' ? <Enable2fa /> : <></>}
          </div>
          <div className='form-footer'>v1.0</div>
        </div>
      </div>
    )
  return page
}

export default Auth

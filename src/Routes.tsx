import React from 'react'
import { useRoutes } from 'react-router-dom'
import { PrivateOutlet } from './utils/PrivateOutlet'

const Login = React.lazy(() => import('./pages/Login/Login'))
const Passwords = React.lazy(() => import('./pages/Passwords/Passwords'))
const Preferences = React.lazy(() => import('./pages/Preferences/Preferences'))
const NotFound = React.lazy(() => import('./pages/NotFound/NoutFound'))

const Routes = () => useRoutes([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <PrivateOutlet />,
    children: [
      {
        path: 'app/passwords',
        element: <Passwords />,
        index: true
      },
      {
        path: 'app/preferences',
        element: <Preferences />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  },
])

export default Routes
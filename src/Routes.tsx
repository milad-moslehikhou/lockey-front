import React from 'react'
import { useRoutes } from 'react-router-dom'
import { PrivateOutlet } from './utils/PrivateOutlet'
import useLoggedInUser from './hooks/useLoggedInUser'
import ChangePassword from './pages/ChangePassword/ChangePassword'

const Login = React.lazy(() => import('./pages/Login/Login'))
const Credentials = React.lazy(() => import('./pages/Credentials/Credentials'))
const Administration = React.lazy(() => import('./pages/Administration/Administration'))
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'))

const Routes = () => {
  const loggedInUser = useLoggedInUser()

  return useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <PrivateOutlet />,
      children: [
        {
          path: 'app/credentials',
          element: <Credentials />,
          index: true,
        },
        {
          path: loggedInUser?.is_superuser ? 'app/administration' : '',
          element: loggedInUser?.is_superuser ? <Administration /> : <></>,
        },
        {
          path: '/change-password',
          element: <ChangePassword />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ])
}

export default Routes

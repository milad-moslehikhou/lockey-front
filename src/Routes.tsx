import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { PrivateOutlet } from './utils/PrivateOutlet'
import useLoggedInUser from './hooks/useLoggedInUser'
import ChangePassword from './pages/ChangePassword/ChangePassword'

const Auth = React.lazy(() => import('./pages/Auth/Auth'))
const Credentials = React.lazy(() => import('./pages/Credentials/Credentials'))
const Administration = React.lazy(() => import('./pages/Administration/Administration'))
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'))

const Routes = () => {
  const loggedInUser = useLoggedInUser()

  return useRoutes([
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/',
      element: <PrivateOutlet />,
      children: [
        {
          path: '',
          element: <Navigate to="app/credentials" replace />,
        },
        {
          path: 'app/credentials',
          element: <Credentials />,
          index: true,
        },
        {
          path: 'app/administration',
          element: loggedInUser?.is_superuser ? <Administration /> : <Navigate to="/app/credentials" replace />,
        },
        {
          path: 'change-password',
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

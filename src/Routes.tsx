import React from 'react'
import { useRoutes } from 'react-router-dom'
import { PrivateOutlet } from './utils/PrivateOutlet';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const Preferences = React.lazy(() => import('./pages/Preferences/Preferences'));

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
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'preferences',
        element: <Preferences />
      }
    ]
  },
])

export default Routes;
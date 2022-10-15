import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
} from '@mui/material'

import './Dashboard.css'
import Menubar from '../../components/Menubar/Menubar'
import Appbar from '../../components/Appbar/Appbar'
import Toolbar from '../../components/Toolbar/Toolbar'
import Footer from '../../components/Footer/Footer'
import Sidebar from '../../components/Sidebar/Sidebar'
import FolderBreadcrumbs from '../../components/FolderBreadcrumbs/FolderBreadcrumbs'
import CredentialsDataTable from '../../components/CredentialDataTable/CredentialDataTable'
import CredentialAddForm from '../../components/Forms/Credential/CredentialAddForm'
import { selectFormsState } from '../../features/credential/credentialSlice'


export default function Dashboard() {
  const credentialFormsState = useSelector(selectFormsState)

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <Menubar />
      <Appbar />
      <Toolbar />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%'
      }}>
        <Sidebar />
        <Box sx={{ width: '100%' }}>
          <FolderBreadcrumbs />
          <Box sx={{
            height: 'calc(100% - 48px)',
            margin: '0 6px',
          }}>
            <CredentialsDataTable />
            {credentialFormsState.add ? <CredentialAddForm/> : ''}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box >
  )
}


















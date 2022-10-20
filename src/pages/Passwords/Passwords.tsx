import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
} from '@mui/material'

import './Passwords.css'
import Menubar from '../../components/Menubar/Menubar'
import Appbar from '../../components/Appbar/Appbar'
import Toolbar from '../../components/Toolbar/Toolbar'
import Footer from '../../components/Footer/Footer'
import Sidebar from '../../components/Sidebar/Sidebar'
import FolderBreadcrumbs from '../../components/FolderBreadcrumbs/FolderBreadcrumbs'
import CredentialsDataTable from '../../components/CredentialDataTable/CredentialDataTable'
import CredentialAddForm from '../../components/Credential/CredentialAddForm'
import { selectCredentialFormsState, selectSelectedCredentials } from '../../features/credential/credentialSlice'
import CredentialDeleteForm from '../../components/Credential/CredentialDeleteForm'
import CredentialEditForm from '../../components/Credential/CredentialEditForm'
import CredentialMoveForm from '../../components/Credential/CredentialMoveForm'
import CredentialDetail from '../../components/Credential/CredentialDetail'


export default function Passwords() {
  const credentialFormsState = useSelector(selectCredentialFormsState)
  const selectedCredentials = useSelector(selectSelectedCredentials)

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
        <Box sx={{
          position: 'relative',
          width: '100%',
          padding: '0 1rem',
        }}
        >
          <FolderBreadcrumbs />
          <Box sx={{
            height: 'calc(100% - 48px)',
          }}>
            <CredentialsDataTable />
            {credentialFormsState.add ? <CredentialAddForm /> : ''}
            {credentialFormsState.delete ? <CredentialDeleteForm /> : ''}
            {credentialFormsState.edit ? <CredentialEditForm /> : ''}
            {credentialFormsState.move ? <CredentialMoveForm /> : ''}
          </Box>
          {credentialFormsState.detail && selectedCredentials.length === 1 ? <CredentialDetail /> : ''}
        </Box>
      </Box>
      <Footer />
    </Box >
  )
}


















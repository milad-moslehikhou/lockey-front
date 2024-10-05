import './Passwords.css'
import * as React from 'react'
import { Box } from '@mui/material'
import Menubar from '../../components/Menubar/Menubar'
import Appbar from '../../components/Appbar/Appbar'
import CredentialToolbar from '../../components/CredentialToolbar/CredentialToolbar'
import Footer from '../../components/Footer/Footer'
import Sidebar from '../../components/Sidebar/Sidebar'
import FolderBreadcrumbs from '../../components/LocationBreadcrumbs/LocationBreadcrumbs'
import CredentialsDataTable from '../../components/Credential/CredentialDataTable'
import CredentialActionSelector from '../../components/Credential/CredentialActionSelector'
import FolderActionSelector from '../../components/Folder/FolderActionSelector'

const Passwords = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Menubar />
      <Appbar />
      <CredentialToolbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}
      >
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            padding: '0 1rem',
          }}
        >
          <FolderBreadcrumbs />
          <Box
            sx={{
              height: 'calc(100% - 48px)',
            }}
          >
            <CredentialsDataTable />
          </Box>
          <CredentialActionSelector />
          <FolderActionSelector />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Passwords

import './Credentials.css'
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
import { credentialActions } from '../../features/credentialSlice'
import { breadcrumbsActions } from '../../features/breadcrumbsSlice'
import { useDispatch } from 'react-redux'

const Passwords = () => {
  const dispatch = useDispatch()
  const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase()
    dispatch(credentialActions.setSearch(search))
    if (search === '' || search === undefined) dispatch(breadcrumbsActions.setItems([]))
    else dispatch(breadcrumbsActions.setItems([{ id: 'search', name: `Search: ${search}` }]))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Menubar />
      <Appbar onSearchInputChange={handleOnSearchInputChange} />
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
          <CredentialsDataTable />
          <CredentialActionSelector />
          <FolderActionSelector />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Passwords

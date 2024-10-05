import './Administration.css'
import * as React from 'react'
import { Box, List, ListItemButton, ListItemText } from '@mui/material'
import Menubar from '../../components/Menubar/Menubar'
import Appbar from '../../components/Appbar/Appbar'
import Footer from '../../components/Footer/Footer'
import UserActionSelector from '../../components/User/UserActionSelector'
import UsersDataTable from '../../components/User/UserDataTable'
import UserAdminToolbar from '../../components/UserAdminToolbar/UserAdminToolbar'

const Administration = () => {
  const [showUserTab, setShowUserTab] = React.useState<boolean>(true)

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
      {showUserTab ? <UserAdminToolbar /> : <></>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            minWidth: '300px',
            position: 'relative',
            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <List
            component='nav'
            style={{ width: '100%' }}
          >
            <ListItemButton
              sx={{
                padding: '0 1rem',
                fontSize: '14px',
                '&.Mui-selected': {
                  fontWeight: 'bold',
                },
              }}
              selected={showUserTab}
              onClick={event => setShowUserTab(true)}
            >
              <ListItemText
                primary='User'
                primaryTypographyProps={{ fontWeight: 'inherit' }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                padding: '0 1rem',
                fontSize: '14px',
                '&.Mui-selected': {
                  fontWeight: 'bold',
                },
              }}
              selected={!showUserTab}
              onClick={event => setShowUserTab(false)}
            >
              <ListItemText
                primary='Group'
                primaryTypographyProps={{ fontWeight: 'inherit' }}
              />
            </ListItemButton>
          </List>
        </Box>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            padding: '0 1rem',
          }}
        >
          <Box
            sx={{
              height: 'calc(100% - 48px)',
            }}
          >
            {showUserTab ? <UsersDataTable /> : <></>}
          </Box>
          {showUserTab ? <UserActionSelector /> : <></>}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Administration

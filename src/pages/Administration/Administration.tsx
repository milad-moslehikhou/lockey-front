import './Administration.css'
import * as React from 'react'
import { Box, List, ListItemButton, ListItemText } from '@mui/material'
import Menubar from '../../components/Menubar/Menubar'
import Appbar from '../../components/Appbar/Appbar'
import Footer from '../../components/Footer/Footer'
import UserActionSelector from '../../components/User/UserActionSelector'
import UsersDataTable from '../../components/User/UserDataTable'
import UserAdminToolbar from '../../components/UserAdminToolbar/UserAdminToolbar'
import GroupsDataTable from '../../components/Group/GroupDataTable'
import GroupActionSelector from '../../components/Group/GroupActionSelector'
import GroupAdminToolbar from '../../components/GroupAdminToolbar/GroupAdminToolbar'
import { useDispatch } from 'react-redux'
import { groupActions } from '../../features/groupSlice'
import { userActions } from '../../features/userSlice'
import { CaseReducerActions } from '@reduxjs/toolkit'

interface AdminListItemType {
  name: 'user' | 'group'
}

const Administration = () => {
  const dispatch = useDispatch()
  const [actions, setActions] = React.useState<any>()
  const [selectedItem, setSelectedItem] = React.useState<AdminListItemType>({ name: 'user' })
  const [toolbar, setToolbar] = React.useState<React.JSX.Element>()
  const [dataTable, setDataTable] = React.useState<React.JSX.Element>()
  const [actionSelector, setActionSelector] = React.useState<React.JSX.Element>()

  const handleOnListItemChange = (event: React.MouseEvent<HTMLDivElement>, item: AdminListItemType) => {
    setSelectedItem(item)
    dispatch(groupActions.setSelected([]))
    dispatch(userActions.setSelected([]))
  }

  const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase()
    dispatch(actions.setSearch(search))
  }

  React.useEffect(() => {
    switch (selectedItem.name) {
      case 'user':
        setActions(userActions)
        setToolbar(<UserAdminToolbar />)
        setActionSelector(<UserActionSelector />)
        setDataTable(<UsersDataTable />)
        break
      case 'group':
        setActions(groupActions)
        setToolbar(<GroupAdminToolbar />)
        setActionSelector(<GroupActionSelector />)
        setDataTable(<GroupsDataTable />)
        break
    }
  }, [selectedItem])

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
      {toolbar}
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
              selected={selectedItem.name === 'user'}
              onClick={event => handleOnListItemChange(event, { name: 'user' })}
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
              selected={selectedItem.name === 'group'}
              onClick={event => handleOnListItemChange(event, { name: 'group' })}
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
            {dataTable}
          </Box>
          {actionSelector}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default Administration

import * as React from 'react'
import {
  Box,
  List,
  Divider,
} from '@mui/material'
import SidebarListItem from '../../components/SidebarListItem/SidebarListItem'
import FolderTreeView from '../FolderTreeView/FolderTreeView'


const Sidebar = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '320px',
      minWidth: '320px',
      position: 'relative',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    }}>
      <List component='nav' style={{ 'width': '100%' }}>
        <SidebarListItem
          id='list:all'
          text='All Items'
        />
        <SidebarListItem
          id='list:favorites'
          text='Favorites'
        />
        <SidebarListItem
          id='list:owned_by_me'
          text='Owned by me'
        />
        <SidebarListItem
          id='list:shared_by_me'
          text='Shared by me'
        />
        <SidebarListItem
          id='list:shared_with_me'
          text='Shared with me'
        />
      </List>
      <Divider />
      <FolderTreeView />
    </Box>
  )
}

export default Sidebar
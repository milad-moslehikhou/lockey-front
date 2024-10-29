import * as React from 'react'
import _ from 'lodash'
import { Box, List, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import SidebarListItem from '../../components/SidebarListItem/SidebarListItem'
import FolderTreeView from '../FolderTreeView/FolderTreeView'
import { useDispatch, useSelector } from 'react-redux'
import { breadcrumbsActions, selectBreadcrumbsItems } from '../../features/breadcrumbsSlice'
import useLoading from '../../hooks/useLoading'
import { useGetFoldersQuery } from '../../features/apiSlice'
import type { BreadcrumbsItemType } from '../../types/component'
import { credentialActions } from '../../features/credentialSlice'
import { folderActions } from '../../features/folderSlice'
import { VpnKey } from '@mui/icons-material'

const Sidebar = () => {
  const dispatch = useDispatch()
  const loading = useLoading()
  const { data: folders, isLoading: getFoldersIsLoading } = useGetFoldersQuery()

  const breadcrumbsItems = useSelector(selectBreadcrumbsItems)

  const getLocation = (id: number, location: BreadcrumbsItemType[] = []) => {
    let tempLocation = [...location]
    const parent = folders && folders.filter(f => f.id === id)[0]
    if (parent) {
      tempLocation = [...tempLocation, { id: `${parent.id}`, name: parent.name }]
      if (parent.parent) tempLocation = [...getLocation(parent.parent, tempLocation)]
    }
    return tempLocation
  }

  const handleOnSelectedItemsChange = (e: React.SyntheticEvent, itemId: string | null) => {
    dispatch(credentialActions.setSearch(''))
    itemId && dispatch(breadcrumbsActions.setItems(getLocation(_.toInteger(itemId)).reverse()))
    itemId && dispatch(credentialActions.setFilter(itemId))
  }

  const selected = breadcrumbsItems[breadcrumbsItems.length - 1] && breadcrumbsItems[breadcrumbsItems.length - 1].id

  const menuItems = [
    <MenuItem
      onClick={() => {
        dispatch(folderActions.setShowForms({ add: true }))
      }}
      key='create-folder'
    >
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText>Create</ListItemText>
    </MenuItem>,
    <Divider
      sx={{ margin: '0 !important' }}
      key='divider1'
    />,
    <MenuItem
      onClick={() => {
        dispatch(folderActions.setShowForms({ edit: true }))
      }}
      key='edit'
    >
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      <ListItemText>Edit</ListItemText>
    </MenuItem>,
    <MenuItem
      onClick={() => {
        dispatch(folderActions.setShowForms({ move: true }))
      }}
      key='move'
    >
      <ListItemIcon>
        <DriveFileMoveIcon />
      </ListItemIcon>
      <ListItemText>Move</ListItemText>
    </MenuItem>,
    <MenuItem
      onClick={() => {
        dispatch(folderActions.setShowForms({ delete: true }))
      }}
      key='delete'
    >
      <ListItemIcon>
        <DeleteIcon color='error' />
      </ListItemIcon>
      <ListItemText>Delete</ListItemText>
    </MenuItem>,
    <Divider
      sx={{ margin: '0 !important' }}
      key='divider2'
    />,
    <MenuItem
      onClick={() => {
        dispatch(credentialActions.setShowForms({ add: true }))
      }}
      key='create-credential'
    >
      <ListItemIcon>
        <VpnKey />
      </ListItemIcon>
      <ListItemText>Create Credential</ListItemText>
    </MenuItem>,
  ]

  React.useEffect(() => {
    loading(getFoldersIsLoading)
  }, [loading, getFoldersIsLoading])

  return (
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
        <SidebarListItem
          id='list:all_items'
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
      {folders && (
        <FolderTreeView
          folders={folders}
          selected={selected}
          menuItems={menuItems}
          onSelectedItemsChange={handleOnSelectedItemsChange}
        />
      )}
    </Box>
  )
}

export default Sidebar

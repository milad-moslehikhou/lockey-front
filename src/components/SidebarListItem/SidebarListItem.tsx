import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ListItemText, ListItemButton } from '@mui/material'
import { breadcrumbsActions, selectBreadcrumbsItems } from '../../features/breadcrumbsSlice'
import { credentialActions } from '../../features/credentialSlice'

interface ISidebarListItemPorps {
  id: string
  text: string
}

const SidebarListItem = ({ id, text }: ISidebarListItemPorps) => {
  const dispatch = useDispatch()
  const breadcrumbsItems = useSelector(selectBreadcrumbsItems)

  const handleClick = () => {
    dispatch(breadcrumbsActions.setItems([{ id, name: text }]))
    dispatch(credentialActions.setFilter(id))
    dispatch(credentialActions.setSelected([]))
  }

  const selected =
    breadcrumbsItems[breadcrumbsItems.length - 1] && breadcrumbsItems[breadcrumbsItems.length - 1].id === id
  return (
    <ListItemButton
      sx={{
        padding: '0 1rem',
        fontSize: '14px',
        '&.Mui-selected': {
          fontWeight: 'bold',
        },
      }}
      selected={selected}
      onClick={handleClick}
    >
      <ListItemText
        primary={text}
        primaryTypographyProps={{ fontWeight: 'inherit' }}
      />
    </ListItemButton>
  )
}

export default SidebarListItem

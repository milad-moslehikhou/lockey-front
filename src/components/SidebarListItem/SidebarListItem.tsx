import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ListItemText,
  ListItemButton,
} from '@mui/material'
import { selectBreadcrumbs, setSelectedItem } from '../../features/breadcrumbs/breadcrumbsSlice'
import { BREADCRUMBS_BASE_PATH } from '../../constant'


interface IPorps {
  id: string,
  text: string,
}

const SidebarListItem = ({ id, text }: IPorps) => {
  const dispatch = useDispatch()
  const breadcrumbs = useSelector(selectBreadcrumbs)

  const handleClick = () => {
    if (id === BREADCRUMBS_BASE_PATH.id) {
      dispatch(setSelectedItem([{ id, text }]))
    } else {
      dispatch(setSelectedItem([BREADCRUMBS_BASE_PATH, { id, text }]))
    }
  }

  return (
    <ListItemButton
      sx={{
        padding: '0 16px',
        fontSize: '14px',
        '&.Mui-selected': {
          fontWeight: 'bold'
        }
      }}
      selected={breadcrumbs.path[breadcrumbs.path.length - 1].id === id}
      onClick={handleClick} >
      <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 'inherit' }} />
    </ListItemButton>
  )
}

export default SidebarListItem
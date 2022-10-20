import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  Breadcrumbs,
  Link,
  Typography
} from '@mui/material'
import { selectBreadcrumbs, setSelectedItem } from '../../features/breadcrumbs/breadcrumbsSlice'
import { setCredentials } from '../../features/credential/credentialSlice'
import { useGetCredentialsQuery } from '../../features/api/apiSlice'
import { selectCurrentUser } from '../../features/auth/authSlice'


const FolderBreadcrumbs = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const breadcrumbs = useSelector(selectBreadcrumbs)
  const { data: credentials } = useGetCredentialsQuery()

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault()
    const id = event.currentTarget.attributes.getNamedItem('data-id')?.value
    const findIndex = breadcrumbs.path.findIndex(item => _.toString(item.id) === id)
    const copy = [...(breadcrumbs.path)]
    copy.length = findIndex + 1
    dispatch(setSelectedItem(copy))
  }

  const selectedNodeId = breadcrumbs.path[breadcrumbs.path.length - 1].id
  switch (selectedNodeId) {
    case 'list:all':
      dispatch(setCredentials(credentials))
      break
    case 'list:favorites':
      dispatch(setCredentials(credentials?.filter(c => c.is_favorite)))
      break
    case 'list:owned_by_me':
      dispatch(setCredentials(credentials?.filter(c => c.created_by === currentUser?.id)))
      break
    case 'list:shared_by_me':
      dispatch(setCredentials(credentials?.filter(c => c.is_favorite)))
      break
    case 'list:shared_with_me':
      dispatch(setCredentials(credentials?.filter(c => c.is_favorite)))
      break
    default:
      if(selectedNodeId.split(':')[0] === 'folder')
        dispatch(setCredentials(credentials?.filter(c => c.folder === _.toNumber(selectedNodeId.split(':')[1]))))
      break
  }

  return (
    <Breadcrumbs
      sx={{
        margin: '12px 0',
      }}>
      {breadcrumbs.path.map((item, index) => {
        if (index === breadcrumbs.path.length - 1) {
          return <Typography
            key={item.id}
            color="text.primary"
          >
            {item.text}
          </Typography>
        } else {
          return (
            <Link
              key={item.id}
              underline="hover"
              color="inherit"
              href="#"
              onClick={handleClick}
              data-id={item.id}
            >
              {item.text}
            </Link>
          )
        }
      })}
    </Breadcrumbs>
  )
}

export default FolderBreadcrumbs
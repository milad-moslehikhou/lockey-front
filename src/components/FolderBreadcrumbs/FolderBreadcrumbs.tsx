import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  Breadcrumbs,
  Link,
  Typography
} from '@mui/material'
import { selectBreadcrumbs, setSelectedItem } from '../../features/breadcrumbs/breadcrumbsSlice'


const FolderBreadcrumbs = () => {
  const dispatch = useDispatch()
  const breadcrumbs = useSelector(selectBreadcrumbs)

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault()
    const id = event.currentTarget.attributes.getNamedItem('data-id')?.value
    const findIndex = breadcrumbs.path.findIndex(item => _.toString(item.id) === id)
    const copy = [...(breadcrumbs.path)]
    copy.length = findIndex + 1
    dispatch(setSelectedItem(copy))
  }

  return (
    <Breadcrumbs
      sx={{
        padding: '4px 16px',
        marginTop: '8px',
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
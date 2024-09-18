import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { breadcrumbsActions, selectBreadcrumbsItems } from '../../features/breadcrumbsSlice'
import { credentialActions } from '../../features/credentialSlice'

const FolderBreadcrumbs = () => {
  const dispatch = useDispatch()
  const breadcrumbsItems = useSelector(selectBreadcrumbsItems)

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    const id = e.currentTarget.id
    if (id) {
      dispatch(breadcrumbsActions.setItem(id))
      dispatch(credentialActions.setFilter(id))
    }
  }

  return (
    <Breadcrumbs
      sx={{
        margin: '12px 0',
      }}
    >
      {breadcrumbsItems.map((item, index) => {
        if (index === breadcrumbsItems.length - 1) {
          return (
            <Typography
              key={item.id}
              color='text.primary'
            >
              {item.name}
            </Typography>
          )
        } else {
          return (
            <Link
              key={item.id}
              id={item.id}
              underline='hover'
              color='inherit'
              href='#'
              onClick={handleClick}
            >
              {item.name}
            </Link>
          )
        }
      })}
    </Breadcrumbs>
  )
}

export default FolderBreadcrumbs

import * as React from 'react'
import { useDispatch } from 'react-redux'
import { Box, Link } from '@mui/material'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import SearchInput from '../SearchInput/SearchInput'
import { credentialActions } from '../../features/credentialSlice'
import { breadcrumbsActions } from '../../features/breadcrumbsSlice'

const Appbar = () => {
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase()
    dispatch(credentialActions.setSearch(search))
    if (search === '' || search === undefined) dispatch(breadcrumbsActions.setItems([]))
    else dispatch(breadcrumbsActions.setItems([{ id: 'search', name: `Search: ${search}` }]))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '6rem',
        padding: '1rem',
        backgroundColor: 'grey.200',
      }}
    >
      <Box
        sx={{
          width: 'calc(300px - 24px - 16px)',
          marginRight: '16px',
        }}
      >
        <Link
          href='/'
          sx={{ display: 'flex' }}
        >
          <img
            src={window.location.origin + '/logo-lg-512.png'}
            alt='logo'
            height={32}
          />
        </Link>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          left: '300px',
        }}
      >
        <SearchInput onChange={handleChange} />
      </Box>
      <Box>
        <AvatarMenu />
      </Box>
    </Box>
  )
}

export default Appbar

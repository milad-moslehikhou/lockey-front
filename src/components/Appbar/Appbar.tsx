import * as React from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  Link,
} from '@mui/material'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import SearchInput from '../SearchInput/SearchInput'
import { setCredentials } from '../../features/credential/credentialSlice'
import { setSelectedItem } from '../../features/breadcrumbs/breadcrumbsSlice'
import { BREADCRUMBS_BASE_PATH } from '../../constant'
import { useGetCredentialsQuery } from '../../features/api/apiSlice'


const Appbar = () => {
  const dispatch = useDispatch()
  const { data: credentials } = useGetCredentialsQuery()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase()
    if (search === '' || search === undefined) {
      dispatch(setCredentials(credentials))
      dispatch(setSelectedItem([BREADCRUMBS_BASE_PATH]))
    } else {
      const findedCredentials = credentials?.filter(c =>
        (c.name && c.name.toLowerCase().includes(search)) ||
        (c.username && c.username.toLowerCase().includes(search)) ||
        (c.tags && c.tags.toLowerCase().includes(search))
      )
      dispatch(setCredentials(findedCredentials))
      dispatch(setSelectedItem([BREADCRUMBS_BASE_PATH, { id: 'search', text: 'Search: ' + search }]))
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '6rem',
      padding: '1rem',
      backgroundColor: 'grey.200',
    }}
    >
      <Box sx={{
        width: 'calc(320px - 24px - 16px)',
        marginRight: '16px',
      }}
      >
        <Link href='/'>
          <img src={window.location.origin + '/logo-lg-512.png'} alt='logo' height={64} />
        </Link>
      </Box>
      <Box sx={{
        position: 'absolute',
        left: '320px'
      }}
      >
        <SearchInput onChange={handleChange}/>
      </Box>
      <Box>
        <AvatarMenu />
      </Box>
    </Box>
  )
}

export default Appbar
import * as React from 'react'
import {
  Box,
  Link,
} from '@mui/material'
import AvatarMenu from '../AvatarMenu/AvatarMenu'
import SearchInput from '../SearchInput/SearchInput'


const Appbar = () => {
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
        <SearchInput />
      </Box>
      <Box>
        <AvatarMenu />
      </Box>
    </Box>
  )
}

export default Appbar
import * as React from 'react'
import {
  Box,
  Link,
} from '@mui/material'
import AvatarMenu from '../AvatarMenu/AvatarMenu'


const Appbar = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '6rem',
      padding: '1rem 1.5rem',
      backgroundColor: 'grey.200',
    }}>
      <Box sx={{
        width: 'calc(240px - 24px - 16px)',
        marginRight: '16px',
      }}>
        <Link href='/'>
          <img src={window.location.origin + '/logo-lg.png'} alt='logo' height={32} />
        </Link>
      </Box>
      <Box>
        <AvatarMenu />
      </Box>
    </Box>
  )
}

export default Appbar
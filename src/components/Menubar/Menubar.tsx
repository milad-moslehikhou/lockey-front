import * as React from 'react'
import {
  Box,
  Link
} from '@mui/material'


const Menubar = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '3rem',
      padding: '0 1.5rem',
      backgroundColor: 'grey.900',
    }}>
      <Box>
        <Link
          href="#"
          sx={{ color: 'grey.50', marginRight: '1rem' }}
          underline='none'>
          passwords
        </Link>
        <Link
          href="#"
          sx={{ color: 'grey.50', marginRight: '1rem' }}
          underline='none'>
          administration
        </Link>
      </Box>
      <Box>
        <Link
          href="#"
          sx={{ color: 'grey.50' }}
          underline='none'>
          logout
        </Link>
      </Box>
    </Box>
  )
}

export default Menubar
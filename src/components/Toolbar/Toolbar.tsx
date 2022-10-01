import * as React from 'react'
import {
  Box, Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchInput from '../SearchInput/SearchInput'


const Toolbar = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      minHeight: '4rem',
      padding: '0 24px',
      backgroundColor: 'grey.200',
      borderBottomColor: 'grey.300',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: 'calc(100% - 240px - 24px)',
        alignItems: 'center',
        position: 'absolute',
        left: '240px'
      }}>
        <Box>
          <Button variant="contained" startIcon={<DeleteIcon />}>Delete</Button>
        </Box>
        <Box>
          <SearchInput />
        </Box>

      </Box>
    </Box>
  )
}

export default Toolbar
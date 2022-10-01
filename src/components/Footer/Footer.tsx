import * as React from 'react'
import {
  Box,
} from '@mui/material'


const Footer = () => {
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '2rem',
      backgroundColor: 'grey.200',
      borderTopColor: 'grey.300',
      borderTopStyle: 'solid',
      borderTopWidth: 1,
    }}></Box>
  )
}

export default Footer
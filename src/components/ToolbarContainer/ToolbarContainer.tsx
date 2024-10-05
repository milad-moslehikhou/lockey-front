import * as React from 'react'
import { Box } from '@mui/material'

interface ToolbarContainerProps {
  children: React.ReactNode
}
const ToolbarContainer = ({ children }: ToolbarContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '80px',
        padding: '1rem',
        backgroundColor: 'grey.100',
        borderBottomColor: 'grey.300',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        zIndex: 1000,
      }}
    >
      {children}
    </Box>
  )
}

export default ToolbarContainer

import * as React from 'react'
import _ from 'lodash'
import { Box, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const DetailRow = ({ title, value }: { title: string; value: any }) => {
  const ValueElement = () => {
    if (typeof value === 'boolean') {
      if (value)
        return (
          <CheckCircleIcon
            fontSize='small'
            color='primary'
          />
        )
      else
        return (
          <CancelIcon
            fontSize='small'
            color='disabled'
          />
        )
    } else {
      return (
        <Typography sx={{ width: '10vw', textWrap: 'wrap', whiteSpace: 'pre-wrap' }}>{_.toString(value)}</Typography>
      )
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        margin: '.1rem 0',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          width: '7rem',
          marginRight: '3rem',
        }}
      >
        {title}
      </Typography>
      <ValueElement />
    </Box>
  )
}

export default DetailRow

import * as React from 'react'
import { ChromePicker, ColorChangeHandler } from 'react-color'
import { Button, Box } from '@mui/material'

interface ColorPickerDialogProps {
  value: string
  onChange: ColorChangeHandler
  onSubmit: () => void
}

const ColorPickerDialog = (props: ColorPickerDialogProps) => {
  const { value, onChange, onSubmit } = props

  const styles = {
    default: {
      picker: {
        boxShadow: 'unset',
      },
    },
  }

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Box
        tabIndex={0}
        sx={{
          position: 'fixed',
          zIndex: '2',
          background: '#fff',
          boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
          borderRadius: '2px',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            onSubmit()
          }
        }}
      >
        <ChromePicker
          styles={styles}
          color={value}
          disableAlpha={true}
          onChange={onChange}
        />
        <Button
          sx={{
            margin: '.5rem',
            float: 'right',
          }}
          variant='contained'
          size='small'
          onClick={onSubmit}
        >
          Pick
        </Button>
      </Box>
    </Box>
  )
}

export default ColorPickerDialog

import * as React from 'react'
import { Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface InfoDialogProps {
  title: string
  children: React.JSX.Element
  handleCloseForm: () => void
}

const InfoDialog = ({ title, children, handleCloseForm }: InfoDialogProps) => {
  const handleClose = () => {
    handleCloseForm()
  }

  return (
    <Dialog
      sx={{
        // '& .MuiDialogContent-root': {
        //   overflowY: 'visible',
        // },
        '& .MuiDialog-paper': {
          overflowY: 'unset',
          minWidth: '20vw',
        },
      }}
      open={true}
      onClose={handleClose}
      onKeyDown={e => {
        if (e.key === 'Enter') e.preventDefault()
      }}
    >
      <DialogTitle
          sx={{
            backgroundColor: '#f0f8ff',
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            maxHeight: 'calc(100vh - 208px)',
          }}
        >
          <Paper elevation={0}>{children}</Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}

export default InfoDialog

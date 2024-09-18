import * as React from 'react'
import { Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

interface FormDialogProps {
  title: string
  form: React.ReactNode
  submitLable: string
  isLoading: boolean
  handleCloseForm: () => void
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined
}

const FormDialog = ({ title, form, submitLable, isLoading, handleCloseForm, handleSubmit }: FormDialogProps) => {
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
        },
      }}
      open={true}
      onClose={handleClose}
      onKeyDown={e => {
        if (e.key === 'Enter') e.preventDefault()
      }}
    >
      <form onSubmit={handleSubmit}>
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
          <Paper elevation={0}>{form}</Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            variant='contained'
            type='submit'
            color={['Delete'].indexOf(submitLable) >= 0 ? 'error' : 'primary'}
            // className='form-button'
            disabled={isLoading}
            loading={isLoading}
            loadingIndicator={submitLable + '...'}
          >
            {submitLable}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FormDialog

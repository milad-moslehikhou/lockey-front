import * as React from 'react'
import {
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'


interface IFormDialogProps {
  title: string,
  form: React.ReactNode,
  submitLable: string,
  isLoading: boolean,
  handleCloseForm: () => void,
  handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined
}

const FormDialog = ({ title, form, submitLable, isLoading, handleCloseForm, handleSubmit }: IFormDialogProps) => {
  const handleClose = () => {
    handleCloseForm()
  }

  return (
    <Dialog open={true} onClose={handleClose} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{
          backgroundColor: '#f0f8ff'
        }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0}  >
            {form}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            variant="contained"
            type="submit"
            className="form-button"
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
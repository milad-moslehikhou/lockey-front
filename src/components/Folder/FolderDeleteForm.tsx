import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useDeleteFolderMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { folderActions } from '../../features/folderSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import { FolderType } from '../../types/folder'
import { credentialActions } from '../../features/credentialSlice'

interface FolderDeleteFormProps {
  folder: FolderType
}

interface DeleteFolderForm {
  name: string
}

const FolderDeleteForm = ({ folder }: FolderDeleteFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [del, { isLoading: deleteFolderIsLoading }] = useDeleteFolderMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeleteFolderForm>()

  const handleCloseForm = () => {
    dispatch(folderActions.setShowForms({ delete: false }))
  }

  const onSubmit = async (data: DeleteFolderForm) => {
    if (folder.name.toLowerCase() !== data.name) {
      setError('name', {
        type: 'server',
        message: 'Name is not match',
      })
    } else {
      try {
        await del(folder.id).unwrap()
        openSnackbar({
          severity: 'success',
          message: `Folder with id ${folder.id} delete successfully.`,
        })
      } catch (e) {
        handleException(e, openSnackbar, setError)
      } finally {
        handleCloseForm()
        dispatch(credentialActions.setSelected([]))
      }
    }
  }

  const form = (
    <>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <label>
          Please enter{' '}
          <code
            style={{
              padding: '0 3px',
              borderRadius: '3px',
              backgroundColor: '#f5f5f5',
              color: '#e0143c',
            }}
          >
            {folder.name.toLowerCase()}
          </code>{' '}
          to confirm!
        </label>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='name'
          label='Name'
          variant='standard'
          className='form-control'
          autoComplete='off'
          error={'name' in errors}
          helperText={errors.name && (errors.name.message as string)}
          {...register('name', { setValueAs: setStringOrNull })}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Delete Folder'
      form={form}
      submitLable='Delete'
      isLoading={deleteFolderIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default FolderDeleteForm

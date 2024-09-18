import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useDeleteCredentialMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { credentialActions } from '../../features/credentialSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import { CredentialType } from '../../types/credential'

interface CredentialDeleteFormProps {
  credential: CredentialType
}

interface DeleteCredentialForm {
  name: string
}

const CredentialDeleteForm = ({ credential }: CredentialDeleteFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [del, { isLoading: deleteCredentialIsLoading }] = useDeleteCredentialMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeleteCredentialForm>()

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForm({ delete: false }))
  }

  const onSubmit = async (data: DeleteCredentialForm) => {
    if (credential.name != data.name) {
      setError('name', {
        type: 'server',
        message: 'Name is not match',
      })
    } else {
      try {
        await del(credential.id).unwrap()
        handleCloseForm()
        dispatch(credentialActions.setSelected([]))
        openSnackbar({
          severity: 'success',
          message: `Credential with id ${credential.id} delete successfuly.`,
        })
      } catch (e) {
        const msg = handleError(e, setError)
        if (msg) {
          openSnackbar({
            severity: 'error',
            message: msg,
          })
        }
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
            {credential.name.toLowerCase()}
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
      title='Delete Credential'
      form={form}
      submitLable='Delete'
      isLoading={deleteCredentialIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialDeleteForm

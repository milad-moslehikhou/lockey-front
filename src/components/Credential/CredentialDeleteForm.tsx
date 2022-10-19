import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  TextField,
  FormControl
} from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useDeleteCredentialMutation } from '../../features/api/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import {
  selectCredentials,
  selectSelectedCredentials,
  setCredentials,
  setSelectedCredentials,
  setCredentialFormsState,
} from '../../features/credential/credentialSlice'
import { setStringOrNull, handleError } from '../../helpers/form'


interface IDeleteCredentialForm {
  name: string
}

const CredentialDeleteForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const credentials = useSelector(selectCredentials)
  const selectedCredentials = useSelector(selectSelectedCredentials)
  const selectedCredential = credentials.filter(c => c.id === _.toInteger(selectedCredentials[0]))[0]
  const [del, { isLoading }] = useDeleteCredentialMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<IDeleteCredentialForm>()

  const handleCloseForm = () => {
    dispatch(setCredentialFormsState({ delete: false }))
  }

  const onSubmit = async (data: IDeleteCredentialForm) => {
    if (data.name != selectedCredential.name) {
      setError('name', {
        type: 'server',
        message: 'Name is not match'
      })
    } else {
      try {
        await del(selectedCredential.id).unwrap()
        handleCloseForm()
        dispatch(setCredentials(credentials.filter(c => c.id !== selectedCredential.id)))
        dispatch(setSelectedCredentials([]))
      } catch (e) {
        const msg = handleError(e, setError)
        if (msg) {
          openSnackbar({
            severity: 'error',
            message: msg
          })
        }
      }
    }


  }

  const form = (
    <>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <label >Please enter <code style={{
          padding: '0 3px',
          borderRadius: '3px',
          backgroundColor: '#f5f5f5',
          color: '#e0143c'
        }}
        >
          {selectedCredential.name.toLowerCase()}
        </code> to confirm!</label>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          id="name"
          label="Name"
          variant="standard"
          className="form-control"
          error={'name' in errors}
          helperText={errors.name && errors.name.message as string}
          {...register('name', { setValueAs: setStringOrNull })}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog title="Delete Credential"
      form={form}
      submitLable="Delete"
      isLoading={isLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialDeleteForm
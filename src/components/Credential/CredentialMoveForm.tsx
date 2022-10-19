import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useEditCredentialMutation, useGetFoldersQuery } from '../../features/api/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { CredentialType } from '../../types/credential'
import {
  selectCredentials,
  selectSelectedCredentials,
  setCredentials,
  setSelectedCredentials,
  setCredentialFormsState,
} from '../../features/credential/credentialSlice'
import { handleError } from '../../helpers/form'
import { selectCurrentUser } from '../../features/auth/authSlice'


const CredentialMoveForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const currentUser = useSelector(selectCurrentUser)
  const credentials = useSelector(selectCredentials)
  const selectedCredentials = useSelector(selectSelectedCredentials)
  const { data: folders } = useGetFoldersQuery()
  const [edit, { isLoading }] = useEditCredentialMutation()
  const {
    handleSubmit,
    control,
    setError
  } = useForm<Partial<CredentialType>>({
    defaultValues: {
      folder: -1
    }
  })

  const handleCloseForm = () => {
    dispatch(setCredentialFormsState({ edit: false }))
  }

  const onSubmit = async (data: Partial<CredentialType>) => {
    data = {
      // eslint-disable-next-line camelcase
      modified_by: currentUser?.id,
      folder: data.folder === -1 ? null : data.folder
    }

    try {
      let tempCredentials = [...credentials]
      selectedCredentials.forEach(async credentialId => {
        const selectedCredential = credentials.filter(c => c.id === _.toInteger(credentialId))[0]
        try {
          const credential = await edit({ id: selectedCredential.id, data }).unwrap()
          tempCredentials = [...(tempCredentials.filter(c => c.id !== selectedCredential.id)), credential]
        } catch (e) {
          const msg = handleError(e, setError)
          if (msg) {
            openSnackbar({
              severity: 'error',
              message: msg
            })
          }
        }
      })
      handleCloseForm()
      dispatch(setCredentials(tempCredentials))
      dispatch(setSelectedCredentials([]))
    } catch (e) {
      openSnackbar({
        severity: 'error',
        message: 'Somthing has wrong!'
      })
    }
  }

  const form = (
    <>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="folder-label">Folder</InputLabel>
        <Controller
          name="folder"
          control={control}
          render={({ field }) => (
            <Select
              id="folder"
              label="Folder"
              labelId="folder-label"
              fullWidth
              {...field}
            >
              <MenuItem value={-1}>--</MenuItem>
              {folders && folders.map(folder => <MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>)}
            </Select>
          )}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title={
        selectedCredentials.length > 1 ?
          `Move ${selectedCredentials.length} credentials into` :
          'Move credential into'
      }
      form={form}
      submitLable="Apply"
      isLoading={isLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialMoveForm
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import InputChips from '../InputChips/InputChips'
import { useAddCredentialMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { CredentialType } from '../../types/credential'
import { credentialActions } from '../../features/credentialSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { folderActions, selectFolderHovered } from '../../features/folderSlice'

const CredentialAddForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loggedInUser = useLoggedInUser()
  const folderHovered = useSelector(selectFolderHovered)
  const [add, { isLoading: addCredentialIsLoading }] = useAddCredentialMutation()
  const [tags, setTags] = React.useState<string[]>([])
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Partial<CredentialType>>({
    defaultValues: {
      importancy: 'LOW',
      // eslint-disable-next-line camelcase
      auto_genpass: false,
    },
  })

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ add: false }))
  }

  const onSubmit = async (data: Partial<CredentialType>) => {
    data = {
      ...data,
      tags: tags.join(','),
      // eslint-disable-next-line camelcase
      created_by: loggedInUser?.id,
      // eslint-disable-next-line camelcase
      modified_by: loggedInUser?.id,
      folder: folderHovered === -1 ? null : folderHovered,
    }
    try {
      const addedCredential = await add(data).unwrap()
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      dispatch(folderActions.setHovered(-1))
      openSnackbar({
        severity: 'success',
        message: `Credential with id ${addedCredential.id} successfully added.`,
      })
    } catch (e) {
      handleException(e, openSnackbar, setError)
    }
  }

  const form = (
    <>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='name'
          label='Name'
          variant='standard'
          className='form-control'
          error={'name' in errors}
          helperText={errors.name && (errors.name.message as string)}
          {...register('name', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='username'
          label='Username'
          variant='standard'
          className='form-control'
          error={'username' in errors}
          helperText={errors.username && (errors.username.message as string)}
          {...register('username', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='ip'
          label='IP'
          variant='standard'
          className='form-control'
          error={'ip' in errors}
          helperText={errors.ip && (errors.ip.message as string)}
          {...register('ip', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='uri'
          label='URI'
          variant='standard'
          className='form-control'
          error={'uri' in errors}
          helperText={errors.uri && (errors.uri.message as string)}
          {...register('uri', { setValueAs: setStringOrNull })}
        />
      </FormControl>

      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <InputLabel id='importancy-label'>Importancy</InputLabel>
        <Controller
          name='importancy'
          control={control}
          render={({ field }) => (
            <Select
              id='importancy'
              label='Importancy'
              labelId='importancy-label'
              {...field}
            >
              <MenuItem value='HIGH'>High</MenuItem>
              <MenuItem value='MEDIUM'>Medium</MenuItem>
              <MenuItem value='LOW'>Low</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <FormControl
        fullWidth
        sx={{ mt: 2, flexDirection: 'row' }}
      >
        <FormControlLabel
          label='Auto generate'
          control={
            <Controller
              name='auto_genpass'
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                />
              )}
            />
          }
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='description'
          label='Description'
          variant='standard'
          fullWidth
          error={'description' in errors}
          helperText={errors.description && (errors.description.message as string)}
          {...register('description', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <InputChips
          inputLable='Tags'
          chips={tags}
          setChips={setTags}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Create Credential'
      form={form}
      submitLable='Create'
      isLoading={addCredentialIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialAddForm

import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import {
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import InputChips from '../InputChips/InputChips'
import { useAddCredentialMutation, useGetFoldersQuery } from '../../features/api/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { CredentialType } from '../../types/credential'
import {
  selectCredentials,
  setCredentials,
  setCredentialFormsState,
} from '../../features/credential/credentialSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import { selectCurrentUser } from '../../features/auth/authSlice'


const CredentialAddForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const currentUser = useSelector(selectCurrentUser)
  const credentials = useSelector(selectCredentials)
  const { data: folders } = useGetFoldersQuery()
  const [add, { isLoading }] = useAddCredentialMutation()
  const [tags, setTags] = React.useState<string[]>([])
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors }
  } = useForm<Partial<CredentialType>>({
    defaultValues: {
      importancy: 'LOW',
      // eslint-disable-next-line camelcase
      auto_genpass: false,
      // eslint-disable-next-line camelcase
      is_public: false,
      folder: -1,
    }
  })

  const handleCloseForm = () => {
    dispatch(setCredentialFormsState({ add: false }))
  }

  const onSubmit = async (data: Partial<CredentialType>) => {
    data = {
      ...data,
      tags: tags.join(','),
      team: currentUser?.team,
      // eslint-disable-next-line camelcase
      created_by: currentUser?.id,
      // eslint-disable-next-line camelcase
      modified_by: currentUser?.id,
      folder: data.folder === -1 ? null : data.folder
    }

    try {
      const credential = await add(data).unwrap()
      handleCloseForm()
      dispatch(setCredentials([...credentials, credential]))
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

  const form = (
    <>
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
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          id="username"
          label="Username"
          variant="standard"
          className="form-control"
          error={'username' in errors}
          helperText={errors.username && errors.username.message as string}
          {...register('username', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          id="ip"
          label="IP"
          variant="standard"
          className="form-control"
          error={'ip' in errors}
          helperText={errors.ip && errors.ip.message as string}
          {...register('ip', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          id="uri"
          label="URI"
          variant="standard"
          className="form-control"
          error={'uri' in errors}
          helperText={errors.uri && errors.uri.message as string}
          {...register('uri', { setValueAs: setStringOrNull })}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="importancy-label">Importancy</InputLabel>
        <Controller
          name="importancy"
          control={control}
          render={({ field }) => (
            <Select
              id="importancy"
              label="Importancy"
              labelId="importancy-label"
              {...field}
            >
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2, flexDirection: 'row' }}>
        <FormControlLabel
          label="Public"
          control={
            <Controller
              name="is_public"
              control={control}
              render={({ field }) => (
                <Switch {...field} />
              )}
            />
          }
        />
        <FormControlLabel
          label="Auto generate"
          control={
            <Controller
              name="auto_genpass"
              control={control}
              render={({ field }) => (
                <Switch {...field} />
              )}
            />
          }
        />
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          id="description"
          label="Description"
          variant="standard"
          fullWidth
          error={'description' in errors}
          helperText={errors.description && errors.description.message as string}
          {...register('description', { setValueAs: setStringOrNull })}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputChips inputLable="Tags" chips={tags} setChips={setTags} />
      </FormControl>
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
    <FormDialog title="Create Credential"
      form={form}
      submitLable="Create"
      isLoading={isLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialAddForm
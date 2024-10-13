import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControlLabel, Switch, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useAddFolderMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { FolderType } from '../../types/folder'
import { credentialActions } from '../../features/credentialSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { folderActions, selectFolderHovered } from '../../features/folderSlice'
import ColorPickerField from '../ColorPickerField/ColorPickerField'

const FolderAddForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loggedInUser = useLoggedInUser()
  const folderHovered = useSelector(selectFolderHovered)
  const [add, { isLoading: addFolderIsLoading }] = useAddFolderMutation()
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<FolderType>>({
    defaultValues: {
      // eslint-disable-next-line camelcase
      is_public: false,
      color: '#000',
    },
  })

  const colorPickerValue = watch('color')

  const handleColorPickerChange = (color: string) => {
    setValue('color', color)
  }

  const handleCloseForm = () => {
    dispatch(folderActions.setShowForms({ add: false }))
  }

  const onSubmit = async (data: Partial<FolderType>) => {
    data = {
      ...data,
      parent: folderHovered === -1 ? null : folderHovered,
      user: loggedInUser?.id,
    }
    try {
      const addedFolder = await add(data).unwrap()
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Folder with id ${addedFolder.id} successfully added.`,
      })
    } catch (e) {
      handleException(e, openSnackbar, setError)
    }
  }

  React.useEffect(() => {
    register('color')
  }, [register])

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
        <ColorPickerField
          id='color'
          label='Color'
          variant='standard'
          className='form-control'
          value={colorPickerValue}
          error={'color' in errors}
          helperText={errors.color && (errors.color.message as string)}
          onColorChange={handleColorPickerChange}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2, flexDirection: 'row' }}
      >
        <FormControlLabel
          label='Public'
          control={
            <Controller
              name='is_public'
              control={control}
              render={({ field }) => <Switch {...field} />}
            />
          }
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Create Folder'
      form={form}
      submitLable='Create'
      isLoading={addFolderIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default FolderAddForm

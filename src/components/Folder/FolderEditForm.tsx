import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControlLabel, Switch, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useEditFolderMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { FolderType } from '../../types/folder'
import { folderActions } from '../../features/folderSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import ColorPickerField from '../ColorPickerField/ColorPickerField'
import { credentialActions } from '../../features/credentialSlice'

interface FolderEditFormProps {
  folder: FolderType
}

const FolderEditForm = ({ folder }: FolderEditFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [edit, { isLoading: editFolderIsLoading }] = useEditFolderMutation()
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
      ...folder,
    },
  })

  const handleCloseForm = () => {
    dispatch(folderActions.setShowForms({ edit: false }))
  }

  const onSubmit = async (data: Partial<FolderType>) => {
    data = {
      ...data,
    }

    try {
      await edit({ id: folder.id, data }).unwrap()
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Folder with id ${folder.id} update successfully.`,
      })
    } catch (e) {
      handleException(e, openSnackbar, setError)
    }
  }

  const colorPickerValue = watch('color')
  const handleColorPickerChange = (color: string) => {
    setValue('color', color)
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
    </>
  )

  return (
    <FormDialog
      title='Edit Folder'
      form={form}
      submitLable='Apply'
      isLoading={editFolderIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default FolderEditForm

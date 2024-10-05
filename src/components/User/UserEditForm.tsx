import * as React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControlLabel, Switch, FormControl, Box, Button, Avatar } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useEditUserMutation, useGetGroupsQuery } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType } from '../../types/user'
import { userActions } from '../../features/userSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField'
import { AutoCompleteFieldOptionsType } from '../../types/component'
import styled from '@emotion/styled'

interface UserEditFormPropsType {
  user: UserType
}
interface UserEditFromType extends UserType {
  groupsOption: AutoCompleteFieldOptionsType[]
}

const UserEditForm = ({ user }: UserEditFormPropsType) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loggedInUser = useLoggedInUser()
  const { data: groups, isLoading: groupsIsLoading } = useGetGroupsQuery()
  const [groupOptions, setGroupOptions] = React.useState<AutoCompleteFieldOptionsType[]>([])
  const [edit, { isLoading: editUserIsLoading }] = useEditUserMutation()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Partial<UserEditFromType>>({
    defaultValues: {
      ...user,
    },
  })
  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ edit: false }))
  }
  const handleOnAutoCompleteValueChange = (newValue: AutoCompleteFieldOptionsType[]) => {
    if (groups) {
      const selectOptions = newValue.map(v => v.value)
      const filteredUsers = groups.filter(
        u => !(loggedInUser && u.id === loggedInUser.id) && !selectOptions.includes(u.id)
      )
      setGroupOptions(
        filteredUsers.map(g => {
          return { label: g.name, value: g.id }
        })
      )
    }
    setValue('groupsOption', newValue)
  }
  const handleOnGroupChange = (event: React.SyntheticEvent, newValue: AutoCompleteFieldOptionsType[]) => {
    handleOnAutoCompleteValueChange(newValue)
  }

  const handleOnAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      setValue('avatar', event.target.files[0])
    }
  }

  const onSubmit = async (data: Partial<UserType>) => {
    data = {
      ...data,
      groups: groupOptions.map(g => g.value),
    }

    try {
      if (typeof data.avatar === 'string') delete data.avatar
      const editedUser = await edit({ id: user.id, data }).unwrap()
      handleCloseForm()
      dispatch(userActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `User with id ${editedUser.id} update successfully.`,
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

  React.useEffect(() => {
    register('groups')
    register('avatar')
  }, [register])

  React.useEffect(() => {
    setGroupOptions(
      groups
        ? groups.map(g => {
            return { label: g.name, value: g.id }
          })
        : []
    )
  }, [groups])

  const groupsSelectedValue = watch('groups')
  const avatarValue = watch('avatar', user.avatar) || ''

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })
  const form = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          margin: '16px',
          alignItems: 'center',
        }}
      >
        <Box>
          <Button
            component='label'
            role={undefined}
            tabIndex={-1}
            sx={{
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'unset',
              },
            }}
          >
            <Avatar
              src={typeof avatarValue === 'string' ? avatarValue : URL.createObjectURL(avatarValue)}
              sx={{
                width: '128px',
                height: '128px',
              }}
            />
            <VisuallyHiddenInput
              type='file'
              accept='image/png, image/jpeg'
              onChange={handleOnAvatarChange}
            />
          </Button>
        </Box>
      </Box>

      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='username'
          label='Username'
          variant='standard'
          className='form-control'
          disabled={true}
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
          id='firstName'
          label='First Name'
          variant='standard'
          className='form-control'
          error={'first_name' in errors}
          helperText={errors.first_name && (errors.first_name.message as string)}
          {...register('first_name', { setValueAs: _.upperFirst })}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='latName'
          label='Last Name'
          variant='standard'
          className='form-control'
          error={'profile.last_name' in errors}
          helperText={errors.last_name && (errors.last_name.message as string)}
          {...register('last_name', { setValueAs: _.upperFirst })}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2, flexDirection: 'row' }}
      >
        <FormControlLabel
          label='Active'
          control={
            <Controller
              name='is_active'
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
        <AutoCompleteField
          label='Group'
          value={groupsSelectedValue}
          error={'groups' in errors}
          helperText={errors.groups && (errors.groups.message as string)}
          options={groupOptions}
          onChange={handleOnGroupChange}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Edit User'
      form={form}
      submitLable='Apply'
      isLoading={editUserIsLoading || groupsIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserEditForm

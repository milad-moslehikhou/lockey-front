import * as React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { TextField, FormControlLabel, Switch, FormControl, Box, Button, Avatar } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useAddUserMutation, useGetGroupsQuery, useGetPermissionsQuery } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType } from '../../types/user'
import { userActions } from '../../features/userSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField'
import { AutoCompleteFieldOptionsType } from '../../types/component'
import styled from '@emotion/styled'

const UserAddForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const { data: groups, isLoading: groupsIsLoading } = useGetGroupsQuery()
  const { data: perms, isLoading: permsIsLoading } = useGetPermissionsQuery()
  const [groupOptions, setGroupOptions] = React.useState<AutoCompleteFieldOptionsType[]>([])
  const [permOptions, setPermOptions] = React.useState<AutoCompleteFieldOptionsType[]>([])
  const [add, { isLoading: addUserIsLoading }] = useAddUserMutation()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Partial<UserType>>({
    defaultValues: {
      is_active: false,
      groups: [],
      user_permissions: [],
    },
  })
  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ add: false }))
  }
  const handleOnGroupsValueChange = (newValue: AutoCompleteFieldOptionsType[]) => {
    if (groups) {
      const selectOptions = newValue.map(v => v.value)
      const filteredGroups = groups.filter(g => !selectOptions.includes(g.id))
      setGroupOptions(
        filteredGroups.map(g => {
          return { label: g.name, value: g.id }
        })
      )
    }
    setValue('groups', newValue)
  }
  const handleOnPermsValueChange = (newValue: AutoCompleteFieldOptionsType[]) => {
    if (perms) {
      const selectOptions = newValue.map(v => v.value)
      const filteredPerms = perms.filter(p => !selectOptions.includes(p.id))
      setPermOptions(
        filteredPerms.map(p => {
          return { label: p.codename, value: p.id }
        })
      )
    }
    setValue('user_permissions', newValue)
  }
  const handleOnGroupChange = (event: React.SyntheticEvent, newValue: AutoCompleteFieldOptionsType[]) => {
    handleOnGroupsValueChange(newValue)
  }
  const handleOnPermChange = (event: React.SyntheticEvent, newValue: AutoCompleteFieldOptionsType[]) => {
    handleOnPermsValueChange(newValue)
  }
  const handleOnAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      setValue('avatar', event.target.files[0])
    }
  }

  const onSubmit = async (data: Partial<UserType>) => {
    data = {
      ...data,
      groups: data.groups && data.groups.map(g => (typeof g === 'number' ? g : g.value)),
      user_permissions: data.user_permissions && data.user_permissions.map(p => (typeof p === 'number' ? p : p.value)),
    }
    try {
      const addedUser = await add(data).unwrap()
      handleCloseForm()
      dispatch(userActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `User with id ${addedUser.id} successfully added.`,
      })
    } catch (e) {
      handleException(e, openSnackbar, setError)
    }
  }

  React.useEffect(() => {
    register('groups')
    register('user_permissions')
    register('avatar')
  }, [register])

  React.useEffect(() => {
    if (!groupsIsLoading) handleOnGroupsValueChange([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups])

  React.useEffect(() => {
    if (!permsIsLoading) handleOnPermsValueChange([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perms])

  const groupsSelectedValue = watch('groups')
  const permsSelectedValue = watch('user_permissions')
  const avatarValue = watch('avatar')

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
              src={avatarValue && typeof avatarValue !== 'string' ? URL.createObjectURL(avatarValue) : ''}
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
          id='password'
          label='Password'
          variant='standard'
          type='password'
          autoComplete='new-password'
          className='form-control'
          error={'password' in errors}
          helperText={errors.password && (errors.password.message as string)}
          {...register('password', { setValueAs: setStringOrNull })}
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
          error={'last_name' in errors}
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
              render={({ field }) => <Switch {...field} />}
            />
          }
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <AutoCompleteField
          label='Permissions'
          value={permsSelectedValue}
          error={'user_permissions' in errors}
          helperText={errors.user_permissions && (errors.user_permissions.message as string)}
          options={permOptions}
          onChange={handleOnPermChange}
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
      title='Create User'
      form={form}
      submitLable='Create'
      isLoading={addUserIsLoading || groupsIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserAddForm

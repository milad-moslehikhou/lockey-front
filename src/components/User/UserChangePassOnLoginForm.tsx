import * as React from 'react'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useChangeUserPassMutation, useLogoutMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType, UserChangePassFormType } from '../../types/user'
import { handleException } from '../../helpers/form'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getEmptyAuthState } from '../../helpers/auth'

interface UserChangePassOnLoginFormPropsType {
  user: UserType
}

const UserChangePassOnLoginForm = ({ user }: UserChangePassOnLoginFormPropsType) => {
  const navigate = useNavigate()
  const openSnackbar = useSnackbar()
  const [logout] = useLogoutMutation()
  const [, setAuth] = useAuth()
  const [changeUserPass, { isLoading: changeUserPassIsLoading }] = useChangeUserPassMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<UserChangePassFormType>>()

  const handleCloseForm = async () => {
    try {
      await logout().unwrap()
      setAuth(getEmptyAuthState())
      navigate('/auth')
    } catch {
      openSnackbar({
        severity: 'error',
        message: 'Somthing has wrong!',
      })
    }
  }

  const onSubmit = async (data: Partial<UserChangePassFormType>) => {
    try {
      await changeUserPass({ id: user.id, data }).unwrap()
      openSnackbar({
        severity: 'success',
        message: `Password change successfully.`,
      })
      handleCloseForm()
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
          id='old_password'
          label='Current Password'
          variant='standard'
          type='password'
          autoComplete='current-password'
          className='form-control'
          error={'old_password' in errors}
          helperText={errors.old_password && (errors.old_password.message as string)}
          {...register('old_password')}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='new-password1'
          label='New Password'
          variant='standard'
          type='password'
          autoComplete='new-password'
          className='form-control'
          error={'new_password1' in errors}
          helperText={errors.new_password1 && (errors.new_password1.message as string)}
          {...register('new_password1')}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='new_password2'
          label='Re-type Password'
          variant='standard'
          type='password'
          autoComplete='retype-password'
          className='form-control'
          error={'new_password2' in errors}
          helperText={errors.new_password2 && (errors.new_password2.message as string)}
          {...register('new_password2')}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Change Password'
      form={form}
      submitLable='Apply'
      isLoading={changeUserPassIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserChangePassOnLoginForm

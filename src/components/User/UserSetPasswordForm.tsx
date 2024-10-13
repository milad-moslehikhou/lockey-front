import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useResetUserPassMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType, UserSetPassFromType } from '../../types/user'
import { userActions } from '../../features/userSlice'
import { handleException } from '../../helpers/form'

interface UserSetPassFormPropsType {
  user: UserType
}

const UserSetPasswordForm = ({ user }: UserSetPassFormPropsType) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [resetUserPass, { isLoading: resetUserPassIsLoading }] = useResetUserPassMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<UserSetPassFromType>>()
  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ resetPass: false }))
  }

  const onSubmit = async (data: Partial<UserSetPassFromType>) => {
    try {
      await resetUserPass({ id: user.id, data }).unwrap()
      handleCloseForm()
      dispatch(userActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Password set successfully.`,
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
      isLoading={resetUserPassIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserSetPasswordForm

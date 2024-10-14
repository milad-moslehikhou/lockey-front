import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useChangeUserPassMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType, UserChangePassFormType } from '../../types/user'
import { userActions } from '../../features/userSlice'
import { handleException } from '../../helpers/form'
import TextWithLineBreaks from '../TextWithLineBreaks/TextWithLineBreaks'

interface UserChangePassFormPropsType {
  user: UserType
}

const UserChangePassForm = ({ user }: UserChangePassFormPropsType) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [changeUserPass, { isLoading: changeUserPassIsLoading }] = useChangeUserPassMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<UserChangePassFormType>>()
  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ changePass: false }))
  }

  const onSubmit = async (data: Partial<UserChangePassFormType>) => {
    try {
      await changeUserPass({ id: user.id, data }).unwrap()
      handleCloseForm()
      openSnackbar({
        severity: 'success',
        message: `Password change successfully.`,
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
          id='old_password'
          label='Current Password'
          variant='standard'
          type='password'
          autoComplete='current-password'
          className='form-control'
          error={'old_password' in errors}
          helperText={errors.old_password && <TextWithLineBreaks text={errors.old_password.message} />}
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
          helperText={errors.new_password1 && <TextWithLineBreaks text={errors.new_password1.message} />}
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
          helperText={errors.new_password2 && <TextWithLineBreaks text={errors.new_password2.message} />}
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

export default UserChangePassForm

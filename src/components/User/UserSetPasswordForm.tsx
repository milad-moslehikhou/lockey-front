import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useSetUserPassMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType } from '../../types/user'
import { userActions } from '../../features/userSlice'
import { handleError } from '../../helpers/form'

interface UserSetPassFormPropsType {
  user: UserType
}
interface UserSetPassFromType extends UserType {
  password: string
  password2: string
}

const UserSetPasswordForm = ({ user }: UserSetPassFormPropsType) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [setUserPass, { isLoading: setUserPassIsLoading }] = useSetUserPassMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<UserSetPassFromType>>({
    defaultValues: {
      ...user,
    },
  })
  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ setPass: false }))
  }

  const onSubmit = async (data: Partial<UserSetPassFromType>) => {
    if (data.password !== data.password2) {
      setError('password2', { message: 'Entered passwords do not match.' })
      return
    }

    try {
      await setUserPass({ id: user.id, data: { password: data.password } }).unwrap()
      handleCloseForm()
      dispatch(userActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `User with id ${user.id} set password successfully.`,
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

  const form = (
    <>
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
          {...register('password')}
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='password2'
          label='Re-type'
          variant='standard'
          type='password'
          autoComplete='retype-password'
          className='form-control'
          error={'password2' in errors}
          helperText={errors.password2 && (errors.password2.message as string)}
          {...register('password2')}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Set Password'
      form={form}
      submitLable='Apply'
      isLoading={setUserPassIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserSetPasswordForm

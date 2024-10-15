import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import useSnackbar from '../../hooks/useSnackbar'
import type { UserType, UserSetPassFormType } from '../../types/user'
import { userActions } from '../../features/userSlice'
import { handleException } from '../../helpers/form'
import TextWithLineBreaks from '../TextWithLineBreaks/TextWithLineBreaks'
import { useSetUserPassMutation } from '../../features/apiSlice'

interface UserSetPassFormPropsType {
  user: UserType
}

const UserSetPassForm = ({ user }: UserSetPassFormPropsType) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [setUserPass, { isLoading: setUserPassIsLoading }] = useSetUserPassMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<UserSetPassFormType>>({
    defaultValues: {
      force_change_pass: !user.is_superuser,
    },
  })
  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ setPass: false }))
  }

  const onSubmit = async (data: Partial<UserSetPassFormType>) => {
    try {
      await setUserPass({ id: user.id, data }).unwrap()
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
      title='Set Password'
      form={form}
      submitLable='Apply'
      isLoading={setUserPassIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserSetPassForm

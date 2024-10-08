import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useDeleteUserMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { userActions } from '../../features/userSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import { UserType } from '../../types/user'

interface UserDeleteFormProps {
  user: UserType
}

interface DeleteUserForm {
  username: string
}

const UserDeleteForm = ({ user }: UserDeleteFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [deleteUser, { isLoading: deleteUserIsLoading }] = useDeleteUserMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeleteUserForm>()

  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ delete: false }))
  }

  const onSubmit = async (data: DeleteUserForm) => {
    if (user.username !== data.username) {
      setError('username', {
        type: 'server',
        message: 'Username is not match',
      })
    } else {
      try {
        await deleteUser(user.id).unwrap()
        openSnackbar({
          severity: 'success',
          message: `User with id ${user.id} delete successfully.`,
        })
      } catch (e) {
        const msg = handleError(e, setError)
        if (msg) {
          openSnackbar({
            severity: 'error',
            message: msg,
          })
        }
      } finally {
        handleCloseForm()
        dispatch(userActions.setSelected([]))
      }
    }
  }

  const form = (
    <>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <label>
          Please enter{' '}
          <code
            style={{
              padding: '0 3px',
              borderRadius: '3px',
              backgroundColor: '#f5f5f5',
              color: '#e0143c',
            }}
          >
            {user.username.toLowerCase()}
          </code>{' '}
          to confirm!
        </label>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='username'
          label='Username'
          variant='standard'
          className='form-control'
          autoComplete='off'
          error={'username' in errors}
          helperText={errors.username && (errors.username.message as string)}
          {...register('username', { setValueAs: setStringOrNull })}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Delete User'
      form={form}
      submitLable='Delete'
      isLoading={deleteUserIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default UserDeleteForm

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

const UserDeleteForm = ({ user }: UserDeleteFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [del, { isLoading: deleteUserIsLoading }] = useDeleteUserMutation()
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<UserType>>()

  const handleCloseForm = () => {
    dispatch(userActions.setShowForms({ delete: false }))
  }

  const onSubmit = async () => {
    try {
      await del(user.id).unwrap()
      handleCloseForm()
      dispatch(userActions.setSelected([]))
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
    }
  }

  const form = (
    <>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <label>
          You want to delete the user{' '}
          <code
            style={{
              padding: '0 3px',
              borderRadius: '3px',
              backgroundColor: '#f5f5f5',
              color: '#e0143c',
            }}
          >
            {user.username}
          </code>
          {'. '}
          are you sure?
        </label>
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

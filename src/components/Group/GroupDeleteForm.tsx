import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useDeleteGroupMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { groupActions } from '../../features/groupSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import { GroupType } from '../../types/group'

interface GroupDeleteFormProps {
  group: GroupType
}

interface DeleteGroupForm {
  name: string
}

const GroupDeleteForm = ({ group }: GroupDeleteFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [deleteGroup, { isLoading: deleteGroupIsLoading }] = useDeleteGroupMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeleteGroupForm>()

  const handleCloseForm = () => {
    dispatch(groupActions.setShowForms({ delete: false }))
  }

  const onSubmit = async (data: DeleteGroupForm) => {
    if (group.name !== data.name) {
      setError('name', {
        type: 'server',
        message: 'Name is not match',
      })
    } else {
      try {
        await deleteGroup(group.id).unwrap()
        openSnackbar({
          severity: 'success',
          message: `Group with id ${group.id} delete successfully.`,
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
        dispatch(groupActions.setSelected([]))
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
            {group.name.toLowerCase()}
          </code>{' '}
          to confirm!
        </label>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <TextField
          id='name'
          label='Name'
          variant='standard'
          className='form-control'
          autoComplete='off'
          error={'name' in errors}
          helperText={errors.name && (errors.name.message as string)}
          {...register('name', { setValueAs: setStringOrNull })}
        />
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Delete Group'
      form={form}
      submitLable='Delete'
      isLoading={deleteGroupIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default GroupDeleteForm

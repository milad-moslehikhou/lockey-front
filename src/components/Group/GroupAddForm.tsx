import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl, Box } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useAddGroupMutation, useEditGroupMemberMutation, useGetUsersQuery } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { groupActions } from '../../features/groupSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import { AutoCompleteFieldOptionsType } from '../../types/component'
import { GroupMemberType } from '../../types/group'
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField'

const GroupAddForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const { data: users, isLoading: usersIsLoading } = useGetUsersQuery()
  const [userOptions, setUserOptions] = React.useState<AutoCompleteFieldOptionsType[]>([])
  const [addGroup, { isLoading: addGroupIsLoading }] = useAddGroupMutation()
  const [editGroupMembers, { isLoading: editGroupMembersIsLoading }] = useEditGroupMemberMutation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Partial<GroupMemberType>>({
    defaultValues: {
      members: [],
    },
  })
  const handleCloseForm = () => {
    dispatch(groupActions.setShowForms({ add: false }))
  }

  const handleOnAutoCompleteValueChange = (newValue: AutoCompleteFieldOptionsType[]) => {
    if (users) {
      const selectOptions = newValue.map(v => v.value)
      const filteredUsers = users.filter(u => !selectOptions.includes(u.id))
      setUserOptions(
        filteredUsers.map(f => {
          return { label: f.username, value: f.id }
        })
      )
    }
    setValue('members', newValue)
  }

  const handleOnUserChange = (event: React.SyntheticEvent, newValue: AutoCompleteFieldOptionsType[]) => {
    handleOnAutoCompleteValueChange(newValue)
  }

  const onSubmit = async (data: Partial<GroupMemberType>) => {
    try {
      const addedGroup = await addGroup(data).unwrap()
      const newData = {
        ...data,
        members: data.members && data.members.map(m => (typeof m === 'number' ? m : m.value)),
      } as Partial<GroupMemberType>
      await editGroupMembers({ id: addedGroup.id, data: newData }).unwrap()
      handleCloseForm()
      dispatch(groupActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Group with id ${addedGroup.id} successfully added.`,
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
    if (!usersIsLoading) handleOnAutoCompleteValueChange([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users])

  React.useEffect(() => {
    register('members')
  }, [register])

  const usersSelectedValue = watch('members')

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
        <FormControl
          fullWidth
          sx={{ mt: 2 }}
        >
          <TextField
            id='name'
            label='Name'
            variant='standard'
            className='form-control'
            error={'name' in errors}
            helperText={errors.name && (errors.name.message as string)}
            {...register('name', { setValueAs: setStringOrNull })}
          />
        </FormControl>
        <FormControl
          fullWidth
          sx={{ mt: 2 }}
        >
          <AutoCompleteField
            label='Members'
            value={usersSelectedValue}
            error={'members' in errors}
            helperText={errors.members && (errors.members.message as string)}
            options={userOptions}
            onChange={handleOnUserChange}
          />
        </FormControl>
      </Box>
    </>
  )

  return (
    <FormDialog
      title='Create Group'
      form={form}
      submitLable='Create'
      isLoading={addGroupIsLoading || usersIsLoading || editGroupMembersIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default GroupAddForm

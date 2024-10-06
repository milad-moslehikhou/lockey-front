import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { TextField, FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import {
  useEditGroupMemberMutation,
  useEditGroupMutation,
  useGetGroupMemberByIdQuery,
  useGetUsersQuery,
} from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { GroupType, GroupMemberType } from '../../types/group'
import { groupActions } from '../../features/groupSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField'
import { AutoCompleteFieldOptionsType } from '../../types/component'

interface GroupEditFormProps {
  group: GroupType
}

const GroupEditForm = ({ group }: GroupEditFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const { data: users, isLoading: usersIsLoading } = useGetUsersQuery()
  const { data: members, isLoading: membersIsLoading } = useGetGroupMemberByIdQuery(group.id)
  const [userOptions, setUserOptions] = React.useState<AutoCompleteFieldOptionsType[]>([])
  const [editGroup, { isLoading: editGroupIsLoading }] = useEditGroupMutation()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Partial<GroupMemberType>>({
    defaultValues: {
      ...group,
      members: [],
    },
  })

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

  const handleCloseForm = () => {
    dispatch(groupActions.setShowForms({ edit: false }))
  }

  const onSubmit = async (data: Partial<GroupMemberType>) => {
    data = {
      ...data,
      members: data.members && data.members.map(m => (typeof m === 'number' ? m : m.value)),
    }
    try {
      await editGroup({ id: group.id, data }).unwrap()
      handleCloseForm()
      dispatch(groupActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Group with id ${group.id} update successfully.`,
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
    if (!membersIsLoading && !usersIsLoading)
      handleOnAutoCompleteValueChange(members ? members.map(m => ({ label: m.username, value: m.id })) : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members])

  React.useEffect(() => {
    register('members')
  }, [register])

  const usersSelectedValue = watch('members')

  const form = (
    <>
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
    </>
  )

  return (
    <FormDialog
      title='Edit Group'
      form={form}
      submitLable='Apply'
      isLoading={editGroupIsLoading || usersIsLoading || membersIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default GroupEditForm

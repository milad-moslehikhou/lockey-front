import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { FormControl } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import FormDialog from '../FormDialog/FormDialog'
import {
  useEditCredentialShareMutation,
  useGetCredentialSharesByIdQuery,
  useGetUsersQuery,
} from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { credentialActions } from '../../features/credentialSlice'
import { handleError } from '../../helpers/form'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField'
import { AutoCompleteFieldOptionsType } from '../../types/component'
import { CredentialType, CredentialShareType } from '../../types/credential'
import moment, { Moment } from 'moment'

interface CredentialShareFormProps {
  credential: CredentialType
}

interface CredentialShareFormType {
  id: number
  credential: number
  until: Moment | null
  shared_by: number
  shared_with: AutoCompleteFieldOptionsType[]
}

const CredentialShareForm = ({credential}: CredentialShareFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const {data: users, isLoading: usersIsLoading} = useGetUsersQuery()
  const loggedInUser = useLoggedInUser()
  const [edit, { isLoading: editCredentialShareIsLoading }] = useEditCredentialShareMutation()
  const {data: credentialShare, isLoading: credentialShareIsLoading} = useGetCredentialSharesByIdQuery(credential.id)
  const [userOptions, setUserOptions] = React.useState<AutoCompleteFieldOptionsType[]>([])
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<CredentialShareFormType>>({
    defaultValues: {
      until: moment(),
      shared_with: [],
    },
  })

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ share: false }))
  }

  const handleOnAutoCompleteValueChange = (newValue: AutoCompleteFieldOptionsType[]) => {
    if(users) {
      const selectOptions = newValue.map(v => v.value)
      const filteredUsers = users.filter(u => !(loggedInUser && u.id === loggedInUser.id) && !selectOptions.includes(u.id))
      setUserOptions(filteredUsers.map(f =>{ return { label: f.username, value: f.id } }))
    }
    setValue('shared_with', newValue)
  }

  const handleOnUserChange = (event: React.SyntheticEvent, newValue: AutoCompleteFieldOptionsType[]) => {
    handleOnAutoCompleteValueChange(newValue)
  }

  const handelOnDateTimeChange = (newValue: Moment | null) => {
    setValue('until', newValue)
  }
  
  React.useEffect(() => {
    register('shared_with')
    register('until')
  }, [register])

  React.useEffect(() => {
    setUserOptions(users? users.filter(u => !(loggedInUser && u.id === loggedInUser.id)).map(u => {
        return { label: u.username, value: u.id }
      }): 
    [])
  }, [users, loggedInUser])

  React.useEffect(() => {
    if(!usersIsLoading) {
      const ops: AutoCompleteFieldOptionsType[] = []
      credentialShare?.forEach(s => {
        if(typeof s.shared_with === 'number') {
          const filteredUser = users?.find(u => u.id === s.shared_with)
          filteredUser && ops.push({label: filteredUser.username, value: filteredUser.id} as AutoCompleteFieldOptionsType)
        }
      })
      handleOnAutoCompleteValueChange(ops)
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, credentialShare])

  const usersSelectedValue = watch('shared_with')
  const dateTimePickerValue = watch('until')

  const onSubmit = async (data: Partial<CredentialShareFormType>) => {
    data = {
      ...data,
      credential: credential.id,
      shared_by: loggedInUser?.id,
    }
    
    let newData: CredentialShareType[] = []
    if(typeof data.shared_with !== 'number') {
      data.shared_with?.forEach(s => {
        newData.push({
          id: data.id,
          credential: credential.id,
          until: data.until?.toDate(),
          shared_by: loggedInUser?.id,
          shared_with: s.value,
        } as CredentialShareType)
      })
    }

    try {
      await edit({id: credential.id, data: newData}).unwrap()
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Credential with id ${credential.id} share successfully.`,
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
        <AutoCompleteField
          label='User'
          value={usersSelectedValue}
          error={'shared_with' in errors}
          helperText={errors.shared_with && (errors.shared_with.message as string)}
          options={userOptions}
          onChange={handleOnUserChange}
        />
      </FormControl>

      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            disablePast
            ampm={false}
            label='Share Until'
            value={dateTimePickerValue}
            onChange={handelOnDateTimeChange}
            slotProps={{
              textField : {
                error: 'until' in errors,
                helperText: errors.until && (errors.until.message as string)
              }
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Share Credential'
      form={form}
      submitLable='Apply'
      isLoading={editCredentialShareIsLoading || usersIsLoading || credentialShareIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialShareForm

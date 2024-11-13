import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useAddCredentialSecretMutation } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { CredentialSecretType, CredentialType } from '../../types/credential'
import { credentialActions } from '../../features/credentialSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface CredentialNewSecretFormProps {
  credential: CredentialType
}

interface CredentialAddSecretFormType {
  id: number
  credential: number
  password: string
  expire_at: Moment | null
  created_by: number | null
  created_at: Moment | null
}

const CredentialNewSecretForm = ({ credential }: CredentialNewSecretFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loggedInUser = useLoggedInUser()
  const [showPassword, setShowPassword] = React.useState(false)
  const [add, { isLoading: editCredentialIsLoading }] = useAddCredentialSecretMutation()
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<Partial<CredentialAddSecretFormType>>({
    defaultValues: {
      expire_at: moment().add(90, 'days'),
    },
  })

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ addSecret: false }))
  }

  const dateTimePickerValue = watch('expire_at')

  const onSubmit = async (data: Partial<CredentialAddSecretFormType>) => {
    const newData: Partial<CredentialSecretType> = {
      credential: credential.id,
      password: data.password,
      expire_at: data.expire_at?.toDate(),
      created_by: loggedInUser ? loggedInUser.id : -1,
    }
    try {
      await add({ id: credential.id, data: newData }).unwrap()
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Secret add successfully.`,
      })
    } catch (e) {
      handleException(e, openSnackbar, setError)
    }
  }

  const handelOnDateTimeChange = (newValue: Moment | null) => {
    setValue('expire_at', newValue)
  }

  React.useEffect(() => {
    register('expire_at')
  }, [register])

  const form = (
    <>
      <FormControl
        fullWidth
        variant='standard'
        sx={{ mt: 2 }}
      >
        <InputLabel htmlFor='password'>Secret</InputLabel>
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          autoComplete='new-password'
          error={'password' in errors}
          aria-describedby='password-error-text'
          {...register('password', { setValueAs: setStringOrNull })}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label={showPassword ? 'hide the password' : 'display the password'}
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id='password-error-text'>
          {errors.password && (errors.password.message as string)}
        </FormHelperText>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            disablePast
            ampm={false}
            label='Expire At'
            value={dateTimePickerValue}
            onChange={handelOnDateTimeChange}
            slotProps={{
              textField: {
                error: 'expired_at' in errors,
                helperText: errors.expire_at && (errors.expire_at.message as string),
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </>
  )

  return (
    <FormDialog
      title='Add New Secret'
      form={form}
      submitLable='Apply'
      isLoading={editCredentialIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialNewSecretForm

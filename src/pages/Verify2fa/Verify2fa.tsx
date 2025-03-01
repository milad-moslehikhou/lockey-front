import * as React from 'react'
import { useForm } from 'react-hook-form'
import LoadingButton from '@mui/lab/LoadingButton'
import useSnackbar from '../../hooks/useSnackbar'
import { useVerify2faMutation } from '../../features/apiSlice'
import useAuth from '../../hooks/useAuth'
import { setStringOrNull, handleException } from '../../helpers/form'
import { Verify2faRequestType } from '../../types/auth'
import TextField from '@mui/material/TextField'
import { getEmptyAuthState } from '../../helpers/auth'



const Verify2fa = () => {
  const [auth, setAuth] = useAuth()
  const openSnackbar = useSnackbar()
  const [verify2fa, { isLoading }] = useVerify2faMutation()
  const helperText = "Enter the code from your two-factore authenticator app."
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Verify2faRequestType>()

  const onSubmit = handleSubmit(async (data: Verify2faRequestType) => {
    try {
      data.otp_session = auth.otp_session || ""
      const response = await verify2fa(data).unwrap()
      setAuth({
        ...auth,
        'token': response.access_token,
      })
      if (auth.user?.force_change_pass)
        setAuth({ ...auth, state: 'change-password' })
    } catch (e: any) {
      if (e.status === 400) {
        openSnackbar({
          severity: 'error',
          message: "Session is timed out, login again."
        })
        setAuth(getEmptyAuthState())
      } else {
        handleException(e, openSnackbar, setError)
      }
    }
  })


  return (
    <>
      <div className='form-header'>Two-factore Authentication</div>
      <form onSubmit={onSubmit}>
        <TextField
          id='otp_code'
          label='Verification code'
          variant='standard'
          type='password'
          className='form-control'
          autoComplete='off'
          error={'otp_code' in errors}
          helperText={errors.otp_code ? (errors.otp_code.message as string) : helperText}
          {...register('otp_code', { setValueAs: setStringOrNull })}
        />

        <LoadingButton
          variant='contained'
          type='submit'
          className='form-button'
          disabled={isLoading}
          loading={isLoading}
          loadingIndicator='VERIFY...'
        >
          VERIFY
        </LoadingButton>
      </form>
    </>
  )
}

export default Verify2fa

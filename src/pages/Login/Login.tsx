import * as React from 'react'
import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '../../features/apiSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import useSnackbar from '../../hooks/useSnackbar'
import useAuth from '../../hooks/useAuth'
import type { LoginRequestType } from '../../types/auth'
import Captcha from '../../components/Captcha/Captcha'
import useOfflineCaptcha from 'use-offline-captcha'

interface LoginFormType extends LoginRequestType {
  captcha: string
}
const Login = () => {
  const [, setAuth] = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const openSnackbar = useSnackbar()
  const [captchaValue, setCaptchaValue] = React.useState<string>('')
  const captchaRef = React.useRef<HTMLDivElement>(null)
  const { gen, validate } = useOfflineCaptcha(captchaRef, {
    type: 'mixed',
    length: 4,
    sensitive: false,
    width: 150,
    height: 35,
    background: 'rgba(255, 255, 255, 1)',
  })
  const [login, { isLoading }] = useLoginMutation()
  const {
    clearErrors,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormType>()
  const handleOnCaptchaRefresh = () => {
    gen()
  }

  React.useEffect(() => {
    if (gen) gen()
  }, [gen])

  const onSubmit = handleSubmit(async (data: LoginRequestType) => {
    if (validate(captchaValue.toLowerCase())) {
      try {
        const response = await login(data).unwrap()
        setAuth({ ...response, state: 'verify2fa' })
      } catch (e: any) {
        if (e.status === 406) {
          setAuth({ ...(e.data), state: 'enable2fa' })
        } else {
          handleOnCaptchaRefresh()
          handleException(e, openSnackbar, setError)
        }
      }
    } else {
      handleOnCaptchaRefresh()
      setError('captcha', { message: 'Incorrect CAPTCHA.' })
    }
  })

  return (
    <>
      <div className='form-header'>Welcome Back!</div>
      <form onSubmit={onSubmit}>
        <TextField
          id='username'
          label='Username'
          variant='standard'
          className='form-control'
          error={'username' in errors}
          helperText={errors.username && (errors.username.message as string)}
          {...register('username', { setValueAs: setStringOrNull })}
        />
        <TextField
          id='password'
          label='Password'
          variant='standard'
          type='password'
          className='form-control'
          autoComplete='current-password'
          error={'password' in errors}
          helperText={errors.password && (errors.password.message as string)}
          {...register('password', { setValueAs: setStringOrNull })}
        />
        <Captcha
          value={captchaValue}
          captchaRef={captchaRef}
          error={'captcha' in errors}
          helperText={errors.captcha && (errors.captcha.message as string)}
          onRefresh={handleOnCaptchaRefresh}
          onChange={e => {
            setCaptchaValue(e.target.value)
            clearErrors('captcha')
          }}
        />
        <LoadingButton
          variant='contained'
          type='submit'
          className='form-button'
          disabled={isLoading}
          loading={isLoading}
          loadingIndicator='LOGIN...'
        >
          LOGIN
        </LoadingButton>
      </form>
    </>
  )
}

export default Login

import './Login.css'
import * as React from 'react'
import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiSlice, useLoginMutation } from '../../features/apiSlice'
import { setStringOrNull, handleException } from '../../helpers/form'
import useSnackbar from '../../hooks/useSnackbar'
import useAuth from '../../hooks/useAuth'
import type { LoginRequestType } from '../../types/auth'
import Captcha from '../../components/Captcha/Captcha'
import useOfflineCaptcha from 'use-offline-captcha'
import { useDispatch } from 'react-redux'

interface LoginFormType extends LoginRequestType {
  captcha: string
}
const Login = () => {
  const [auth, setAuth] = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
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

  React.useEffect(() => {
    dispatch(apiSlice.util.resetApiState())
  })

  const onSubmit = handleSubmit(async (data: LoginRequestType) => {
    if (validate(captchaValue.toLowerCase())) {
      try {
        const auth = await login(data).unwrap()
        setAuth(auth)
        if (auth.user?.force_change_pass) navigate('/change-password', { state: { from: location } })
        else navigate('/app/credentials', { replace: true })
      } catch (e) {
        handleOnCaptchaRefresh()
        handleException(e, openSnackbar, setError)
      }
    } else {
      handleOnCaptchaRefresh()
      setError('captcha', { message: 'Incorrect CAPTCHA.' })
    }
  })

  let loginPage = <></>
  if (auth && auth.user)
    loginPage = (
      <Navigate
        to='/app/credentials'
        state={{ from: location }}
      />
    )
  else
    loginPage = (
      <div className='login-wraper'>
        <div className='logo-wraper'>
          <img
            src={window.location.origin + '/logo-sm.svg'}
            alt='logo'
          />
          <p className='logo-header'>Lockey secure secret store</p>
          <p className='logo-desc'>safely store important secrets in a safe place.</p>
        </div>
        <div className='form-wraper'>
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
          <div className='form-footer'>v1.0</div>
        </div>
      </div>
    )
  return loginPage
}

export default Login

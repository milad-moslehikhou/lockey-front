import * as React from 'react'
import { useDispatch } from 'react-redux'
import { TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '../../features/api/apiSlice'
import { setStringOrNull, handleError } from '../../helpers/form'
import useSnackbar from '../../hooks/useSnackbar'
import { setAuthState } from '../../features/auth/authSlice'

import './Login.css'


type FormInputsType = {
  username: string,
  password: string
}

export const Login: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const openSnackbar = useSnackbar()
  const [login, { isLoading }] = useLoginMutation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormInputsType>()

  const onSubmit = handleSubmit(async (data: FormInputsType) => {
    try {
      console.log('form', data)
      const auth = await login(data).unwrap()
      dispatch(setAuthState(auth))
      navigate('/dashboard')
    } catch (e) {
      const msg = handleError(e, setError)
      if (msg) {
        openSnackbar({
          severity: 'error',
          message: msg
        })
      }
    }
  })

  return (
    <div className="login-wraper">
      <div className="logo-wraper">
        <img src={window.location.origin + '/logo512.png'} alt="logo" />
        <p className="logo-header">Lockey secure pass store</p>
        <p className="logo-desc">safely store important passwords in a safe place.</p>
      </div>
      <div className="form-wraper">
        <div className="form-header">Welcome Back!</div>
        <form onSubmit={onSubmit}>
          <TextField
            id="username"
            label="Username"
            variant="standard"
            className="form-control"
            error={'username' in errors}
            helperText={errors.username && errors.username.message as string}
            {...register('username', { setValueAs: setStringOrNull })} />
          <TextField
            id="password"
            label="Password"
            variant="standard"
            type="password"
            className="form-control"
            autoComplete="current-password"
            error={'password' in errors}
            helperText={errors.password && errors.password.message as string}
            {...register('password', { setValueAs: setStringOrNull })} />
          <LoadingButton
            variant="contained"
            type="submit"
            className="form-button"
            disabled={isLoading}
            loading={isLoading}
            loadingIndicator="LOGIN..."
          >LOGIN
          </LoadingButton>
        </form>
        <div className="form-footer">
          <p>Developed by
            <a href="mailto:gh_mirasgari@isc.co.ir">Reza Mirasgari</a> and
            <a href="mailto:m_moslehikhou@isc.co.ir">Milad Moslehikhou</a> &copy; 2021
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

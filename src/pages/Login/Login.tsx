import * as React from 'react'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../features/auth/authSlice'
import { useLoginMutation } from '../../app/services/auth'
import { LoginRequest } from '../../types/auth'
import useSnackbar from '../../hooks/useSnackbar'

import './Login.css'


export function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const openSnackbar = useSnackbar()
  const [formState, setFormState] = React.useState<LoginRequest>({
    username: '',
    password: '',
  })

  const [login, { isLoading }] = useLoginMutation()

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const user = await login(formState).unwrap()
      dispatch(setCredentials(user))
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
      openSnackbar({
        severity: 'error',
        message: 'A problem has occurd!'
      })
    }
  }

  const clearError = async (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
  }

  return (
    <div className="login-wraper">
      <div className="logo-wraper">
        <img src={window.location.origin + '/logo512.png'} alt="logo" />
        <p className="logo-header">Lockey secure pass store</p>
        <p className="logo-desc">safely store important passwords in a safe place.</p>
      </div>
      <div className="form-wraper">
        <div className="form-header">Welcome Back!</div>
        <form>
          <TextField id="username"
            label="Username"
            variant="standard"
            className="form-control"
            onChange={handleChange}
            onFocus={clearError} />
          <TextField id="password"
            label="Password"
            variant="standard"
            type="password"
            className="form-control"
            autoComplete="current-password"
            onChange={handleChange}
            onFocus={clearError} />
          <Button
            variant="contained"
            type="submit"
            className="form-button"
            disabled={isLoading}
            onClick={handleSubmit}
          >Login</Button>
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

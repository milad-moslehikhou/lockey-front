import * as React from 'react'
import QRCode from 'react-qr-code'
import LoadingButton from '@mui/lab/LoadingButton'
import useSnackbar from '../../hooks/useSnackbar'
import { useEnable2faMutation } from '../../features/apiSlice'
import useAuth from '../../hooks/useAuth'
import { Enable2faResponseType } from '../../types/auth'
import { getEmptyAuthState } from '../../helpers/auth'



const Enable2fa = () => {
  const [auth, setAuth] = useAuth()
  const openSnackbar = useSnackbar()
  const [enable2fa, { isLoading }] = useEnable2faMutation()
  const [otp, setOtp] = React.useState<Enable2faResponseType>()

  const enabel2faFunction = async () => {
    try {
      const response = await enable2fa({ "otp_session": auth.otp_session }).unwrap()
      setOtp(response)

    } catch (e: any) {
      if (e.status === 400) {
        setAuth(getEmptyAuthState())
      } else {
        openSnackbar({ severity: 'error', message: e.detail })
      }
    }
  }

  React.useEffect(() => {
    enabel2faFunction()
  }, [])

  return (
    <>
      {isLoading ? "loading..." : (
        otp && <>
          <div className='form-header'>Two-factore Authentication</div>
          <div style={{ justifySelf: 'center', margin: '1rem' }}>
            <QRCode value={otp.otp_uri} size={128} />
          </div>
          <div style={{ textAlign: 'center' }}>
            Scan QR code or manually enter this key <strong>{otp.otp_secret}</strong>
          </div>
          <LoadingButton
            variant='contained'
            type='button'
            className='form-button'
            disabled={isLoading}
            loading={isLoading}
            loadingIndicator='OK...'
            onClick={() => { setAuth({ ...auth, state: 'verify2fa' }) }}
          >
            OK
          </LoadingButton>
        </>
      )
      }
    </>
  )
}

export default Enable2fa

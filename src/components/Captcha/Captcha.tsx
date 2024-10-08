import './Captcha.css'
import * as React from 'react'
import { Box, Stack, TextField, TextFieldProps, Tooltip } from '@mui/material'

interface CaptchaProps {
  captchaRef: React.RefObject<HTMLDivElement>
  onRefresh: () => void
}

const Captcha = React.forwardRef<HTMLDivElement, TextFieldProps & CaptchaProps>(function Captcha(inProps, ref) {
  const { captchaRef, onRefresh, ...rest } = inProps
  return (
    <>
      <Stack
        direction='row'
        spacing={1}
      >
        <TextField
          label='Captcha'
          variant='standard'
          className='form-control'
          placeholder='Captcha'
          autoComplete='off'
          ref={ref}
          sx={{
            flexGrow: '2',
          }}
          {...rest}
        />
        <Tooltip title='Click to refresh CAPTCHA'>
          <Box
            ref={captchaRef}
            sx={{
              marginTop: '1.7rem !important',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={onRefresh}
          ></Box>
        </Tooltip>
      </Stack>
    </>
  )
})

export default Captcha

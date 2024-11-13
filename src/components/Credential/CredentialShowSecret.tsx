import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { credentialActions, selectCredentialSecret } from '../../features/credentialSlice'
import InfoDialog from '../InfoDialog/InfoDialog'
import { formatDate } from '../../helpers/common'
import { IconButton, Tooltip } from '@mui/material'
import { FileCopy } from '@mui/icons-material'
import useSnackbar from '../../hooks/useSnackbar'

const CredentialShowSecret = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const secret = useSelector(selectCredentialSecret)

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ showSecret: false }))
  }

  const handleOnCopySecret = (event: React.MouseEvent<HTMLButtonElement>, secret: string) => {
    try {
      navigator.clipboard.writeText(secret)
      openSnackbar({
        severity: 'success',
        message: 'Secret copied successfully.',
      })
    } catch {
      openSnackbar({
        severity: 'error',
        message: 'Something went wrong.',
      })
    }
  }

  return (
    <InfoDialog
      title='Warning! The secret is being shown'
      handleCloseForm={handleCloseForm}
    >
      <>
        {secret.map(s => {
          return (
            <div
              key={s.id}
              style={{
                width: '100%',
                margin: '32px 0',
              }}
            >
              {formatDate(s.created_at, 'YYYY-MM-DD')}:{' '}
              <code
                style={{
                  padding: '0 3px',
                  borderRadius: '3px',
                  backgroundColor: '#f5f5f5',
                  color: '#e0143c',
                }}
              >
                {s.password}
              </code>
              <div style={{ float: 'right' }}>
                <Tooltip title='Copy to clipboard'>
                  <IconButton
                    aria-label='copy'
                    size='small'
                    color='primary'
                    onClick={event => handleOnCopySecret(event, s.password)}
                  >
                    <FileCopy fontSize='inherit' />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )
        })}
      </>
    </InfoDialog>
  )
}

export default CredentialShowSecret

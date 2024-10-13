import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { credentialActions, selectCredentialSecret } from '../../features/credentialSlice'
import InfoDialog from '../InfoDialog/InfoDialog'
import { formatDate } from '../../helpers/common'

const CredentialShowSecret = () => {
  const dispatch = useDispatch()
  const secret = useSelector(selectCredentialSecret)

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ showSecret: false }))
  }

  return (
    <InfoDialog
      title='Warning! The secret is being shown.'
      handleCloseForm={handleCloseForm}
    >
      <>
        {secret.map(s => {
          return (
            <p
              key={s.id}
              style={{
                width: '100%',
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
            </p>
          )
        })}
      </>
    </InfoDialog>
  )
}

export default CredentialShowSecret

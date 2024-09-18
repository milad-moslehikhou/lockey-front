import * as React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { selectCredentialSelected, selectCredentialShowForm } from '../../features/credentialSlice'
import CredentialDetail from '../../components/Credential/CredentialDetail'
import { useGetCredentialByIdQuery } from '../../features/apiSlice'
import CredentialAddForm from './CredentialAddForm'
import CredentialEditForm from './CredentialEditForm'
import CredentialDeleteForm from './CredentialDeleteForm'
import CredentialMoveForm from './CredentialMoveForm'

const CredentialActionSelector = () => {
  const credentialSelected = useSelector(selectCredentialSelected)
  const credentialShowForm = useSelector(selectCredentialShowForm)
  const {
    data: credential,
    isUninitialized,
    isFetching,
  } = useGetCredentialByIdQuery(_.toInteger(credentialSelected[0]), {
    skip: credentialSelected.length === 1 ? false : true,
  })

  const credentialIsValid = credential && !isUninitialized && !isFetching

  return (
    <>
      {credentialShowForm.detail && credentialIsValid ? <CredentialDetail credential={credential} /> : ''}
      {credentialShowForm.edit && credentialIsValid ? <CredentialEditForm credential={credential} /> : ''}
      {credentialShowForm.delete && credentialIsValid ? <CredentialDeleteForm credential={credential} /> : ''}
      {credentialShowForm.move ? <CredentialMoveForm /> : ''}
      {credentialShowForm.add ? <CredentialAddForm /> : ''}
    </>
  )
}

export default CredentialActionSelector

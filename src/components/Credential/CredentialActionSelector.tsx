import * as React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { selectCredentialSelected, selectCredentialShowForms } from '../../features/credentialSlice'
import CredentialDetail from '../../components/Credential/CredentialDetail'
import { useGetCredentialByIdQuery } from '../../features/apiSlice'
import CredentialAddForm from './CredentialAddForm'
import CredentialEditForm from './CredentialEditForm'
import CredentialDeleteForm from './CredentialDeleteForm'
import CredentialMoveForm from './CredentialMoveForm'

const CredentialActionSelector = () => {
  const credentialSelected = useSelector(selectCredentialSelected)
  const credentialShowForms = useSelector(selectCredentialShowForms)
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
      {credentialShowForms.detail && credentialIsValid ? <CredentialDetail credential={credential} /> : ''}
      {credentialShowForms.edit && credentialIsValid ? <CredentialEditForm credential={credential} /> : ''}
      {credentialShowForms.delete && credentialIsValid ? <CredentialDeleteForm credential={credential} /> : ''}
      {credentialShowForms.move ? <CredentialMoveForm /> : ''}
      {credentialShowForms.add ? <CredentialAddForm /> : ''}
    </>
  )
}

export default CredentialActionSelector

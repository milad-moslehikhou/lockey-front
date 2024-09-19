import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useEditCredentialMutation, useGetFoldersQuery } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { CredentialType } from '../../types/credential'
import { credentialActions, selectCredentialSelected } from '../../features/credentialSlice'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import FolderTreeView from '../FolderTreeView/FolderTreeView'
import useLoading from '../../hooks/useLoading'

const CredentialMoveForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loading = useLoading()
  const loggedInUser = useLoggedInUser()
  const credentialsId = useSelector(selectCredentialSelected)
  const [folderId, setFolderId] = React.useState(-1)
  const [selected, setSelected] = React.useState('')
  const { data: folders, isLoading: foldersIsLoading } = useGetFoldersQuery()
  const [edit, { isLoading: editCredentialIsLoading }] = useEditCredentialMutation()
  const { handleSubmit } = useForm<Partial<CredentialType>>({
    defaultValues: {
      folder: -1,
    },
  })

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ move: false }))
  }

  const onSubmit = async (data: Partial<CredentialType>) => {
    data = {
      // eslint-disable-next-line camelcase
      modified_by: loggedInUser?.id,
      folder: folderId === -1 ? null : folderId,
    }
    const notMovedCredenrialIds: string[] = []

    try {
      credentialsId.forEach(async id => {
        try {
          await edit({ id: _.toInteger(id), data }).unwrap()
        } catch (e) {
          notMovedCredenrialIds.push(id)
        }
      })
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: 'Credentials moved successfully.',
      })
    } catch (e) {
      openSnackbar({
        severity: 'error',
        message: `Somthing has wrong!, could not move credential with id(s) ${notMovedCredenrialIds.join(', ')}`,
      })
    }
  }

  const handleOnNodeSelect = (e: React.SyntheticEvent, nodeId: string) => {
    setFolderId(_.toInteger(nodeId))
    setSelected(nodeId)
  }

  const form = (
    <>
      <FormControl
        fullWidth
        sx={{ mt: 2 }}
      >
        {folders && (
          <FolderTreeView
            folders={folders}
            selected={selected}
            onNodeSelect={handleOnNodeSelect}
          />
        )}
      </FormControl>
    </>
  )

  React.useEffect(() => {
    loading(foldersIsLoading)
  }, [foldersIsLoading])

  return (
    <FormDialog
      title={credentialsId.length > 1 ? `Move ${credentialsId.length} credentials into` : 'Move credential into'}
      form={form}
      submitLable='Apply'
      isLoading={editCredentialIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialMoveForm

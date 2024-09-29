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
import { handleError } from '../../helpers/form'

const CredentialMoveForm = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loading = useLoading()
  const loggedInUser = useLoggedInUser()
  const credentialsId = useSelector(selectCredentialSelected)
  const [folderId, setFolderId] = React.useState(-1)
  const [selected, setSelected] = React.useState('')
  const [movedCredenrialIds, setMovedCredenrialIds] = React.useState<string[]>([])
  const [notMovedCredenrialIds, setNotMovedCredenrialIds] = React.useState<string[]>([])
  const { data: folders, isLoading: foldersIsLoading } = useGetFoldersQuery()
  const [edit, { isLoading: editCredentialIsLoading }] = useEditCredentialMutation()
  const { handleSubmit, setError } = useForm<Partial<CredentialType>>({
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

    try {
      credentialsId.forEach(async id => {
        try {
          await edit({ id: _.toInteger(id), data }).unwrap()
          setMovedCredenrialIds([
            ...movedCredenrialIds,
            id
          ])
        } catch (e) {
          setNotMovedCredenrialIds([
            ...notMovedCredenrialIds,
            id
          ])
        }
      })
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      if (notMovedCredenrialIds.length > 0)
        openSnackbar({
          severity: 'error',
          message: `Could not move credential(s) with id ${notMovedCredenrialIds.join(', ')}`,
        })
      openSnackbar({
        severity: 'success',
        message: `Credential(s) with id ${movedCredenrialIds.join(', ')} moved successfully.`,
      })
    } catch (e) {
      const msg = handleError(e, setError)
      openSnackbar({
        severity: 'error',
        message: msg,
      })
    }
  }

  const handleOnSelectedItemsChange = (e: React.SyntheticEvent, itemId: string | null) => {
    itemId && setFolderId(_.toInteger(itemId))
    itemId && setSelected(itemId)
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
            onSelectedItemsChange={handleOnSelectedItemsChange}
          />
        )}
      </FormControl>
    </>
  )

  React.useEffect(() => {
    loading(foldersIsLoading)
  }, [loading, foldersIsLoading])

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

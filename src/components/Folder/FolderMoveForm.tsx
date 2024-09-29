import * as React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { FormControl } from '@mui/material'
import FormDialog from '../FormDialog/FormDialog'
import { useEditFolderMutation, useGetFoldersQuery } from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import type { FolderType } from '../../types/folder'
import { folderActions } from '../../features/folderSlice'
import FolderTreeView from '../FolderTreeView/FolderTreeView'
import useLoading from '../../hooks/useLoading'

interface FolderMoveFormProps {
  folder: FolderType
}

const FolderMoveForm = ({ folder }: FolderMoveFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loading = useLoading()
  const [selected, setSelected] = React.useState('')
  const { data: folders, isLoading: foldersIsLoading } = useGetFoldersQuery()
  const [edit, { isLoading: editFolderIsLoading }] = useEditFolderMutation()
  const { handleSubmit } = useForm<Partial<FolderType>>()

  const handleCloseForm = () => {
    dispatch(folderActions.setShowForms({ move: false }))
  }

  const onSubmit = async (data: Partial<FolderType>) => {
    data = {
      ...folder,
      parent: _.toInteger(selected),
    }

    try {
      await edit({ id: folder.id, data }).unwrap()
      openSnackbar({
        severity: 'success',
        message: 'Folders moved successfully.',
      })
    } catch (e) {
      openSnackbar({
        severity: 'error',
        message: 'Somthing has wrong!, could not move folder',
      })
    } finally {
      handleCloseForm()
      dispatch(folderActions.setHovered(-1))
    }
  }

  const handleOnSelectedItemsChange = (e: React.SyntheticEvent, itemId: string | null) => {
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
            disabledItem={folder.id}
            onSelectedItemsChange={handleOnSelectedItemsChange}
          />
        )}
      </FormControl>
    </>
  )

  React.useEffect(() => {
    loading(foldersIsLoading)
  }, [foldersIsLoading, loading])

  return (
    <FormDialog
      title={'Move folder into'}
      form={form}
      submitLable='Apply'
      isLoading={editFolderIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default FolderMoveForm

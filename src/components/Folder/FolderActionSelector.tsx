import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectFolderShowForms, selectFolderHovered } from '../../features/folderSlice'
import FolderAddForm from './FolderAddForm'
import { useGetFolderByIdQuery } from '../../features/apiSlice'
import FolderEditForm from './FolderEditForm'
import FolderDeleteForm from './FolderDeleteForm'
import FolderMoveForm from './FolderMoveForm'

const FolderActionSelector = () => {
  const folderHovered = useSelector(selectFolderHovered)
  const folderShowForms = useSelector(selectFolderShowForms)
  const {
    data: folder,
    isUninitialized,
    isFetching,
  } = useGetFolderByIdQuery(folderHovered, {
    skip: folderHovered == -1,
  })

  const folderIsValid = folder && !isUninitialized && !isFetching

  return (
    <>
      {folderShowForms.edit && folderIsValid ? <FolderEditForm folder={folder} /> : ''}
      {folderShowForms.delete && folderIsValid ? <FolderDeleteForm folder={folder} /> : ''}
      {folderShowForms.move && folderIsValid ? <FolderMoveForm folder={folder} /> : ''}
      {folderShowForms.add ? <FolderAddForm /> : ''}
    </>
  )
}

export default FolderActionSelector

import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectFolderShowForms, selectHoveredFolder } from '../../features/folderSlice'
import FolderAddForm from './FolderAddForm'
import { useGetFolderByIdQuery } from '../../features/apiSlice'
import FolderEditForm from './FolderEditForm'

const FolderActionSelector = () => {
  const folderHovered = useSelector(selectHoveredFolder)
  const folderShowForm = useSelector(selectFolderShowForms)
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
      {folderShowForm.edit && folderIsValid ? <FolderEditForm folder={folder} /> : ''}
      {folderShowForm.add ? <FolderAddForm /> : ''}
    </>
  )
}

export default FolderActionSelector

import * as React from 'react'
import { useSelector } from 'react-redux'
import { selectFolderShowForms } from '../../features/folderSlice'
import FolderAddForm from './FolderAddForm'

const FolderActionSelector = () => {
  const folderShowForm = useSelector(selectFolderShowForms)

  return <>{folderShowForm.add ? <FolderAddForm /> : ''}</>
}

export default FolderActionSelector

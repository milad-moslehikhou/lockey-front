import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FolderIcon from '@mui/icons-material/Folder'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import { useGetFoldersQuery } from '../../features/apiSlice'
import useLoading from '../../hooks/useLoading'
import { folderActions, selectFolderShowForms } from '../../features/folderSlice'
import { selectCredentialShowForms } from '../../features/credentialSlice'
import { FolderType } from '../../types/folder'

interface FolderTreeItemProps {
  folder: FolderType
  disabledItem?: number
  menuItems: React.ReactNode
}

const FolderTreeItem = ({ folder, disabledItem, menuItems }: FolderTreeItemProps) => {
  const loading = useLoading()
  const dispatch = useDispatch()
  const { data: folders, isLoading: getFoldersIsLoading } = useGetFoldersQuery()
  const folderShowForms = useSelector(selectFolderShowForms)
  const credentialShowForms = useSelector(selectCredentialShowForms)
  const folderChildren = folders && folders.filter(f => f.parent === folder.id)

  React.useEffect(() => {
    loading(getFoldersIsLoading)
  })

  return folder ? (
    <IconicTreeItem
      itemId={`${folder.id}`}
      labelIcon={folder.is_public ? FolderSharedIcon : FolderIcon}
      labelText={folder.name}
      color={folder.color}
      disabled={folder.id === disabledItem ? true : false}
      menuItems={menuItems}
      onMouseEnter={() => {
        if (!(folderShowForms.move || credentialShowForms.move)) dispatch(folderActions.setHovered(folder.id))
      }}
      onMouseLeave={() => {
        if (
          !(
            folderShowForms.add ||
            folderShowForms.edit ||
            folderShowForms.delete ||
            folderShowForms.move ||
            credentialShowForms.add
          )
        )
          dispatch(folderActions.setHovered(-1))
      }}
    >
      {folderChildren &&
        folderChildren.map(f => {
          return (
            <FolderTreeItem
              key={f.id}
              folder={f}
              disabledItem={disabledItem}
              menuItems={menuItems}
            />
          )
        })}
    </IconicTreeItem>
  ) : (
    <></>
  )
}

export default FolderTreeItem

import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FolderIcon from '@mui/icons-material/Folder'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import { useGetFolderByIdQuery, useGetFoldersQuery } from '../../features/apiSlice'
import useLoading from '../../hooks/useLoading'
import { folderActions } from '../../features/folderSlice'
import { selectCredentialShowForms } from '../../features/credentialSlice'

interface FolderTreeItemProps {
  folderId: number
  menuItems: React.ReactNode
}

const FolderTreeItem = ({ folderId, menuItems }: FolderTreeItemProps) => {
  const loading = useLoading()
  const dispatch = useDispatch()
  const { data: folder, isLoading: getFolderIsLoading } = useGetFolderByIdQuery(folderId)
  const { data: folders, isLoading: getFoldersIsLoading } = useGetFoldersQuery()
  const credentialShowForms = useSelector(selectCredentialShowForms)
  const folderChildren = folders && folders.filter(f => f.parent == folderId)

  React.useEffect(() => {
    loading(getFolderIsLoading || getFoldersIsLoading)
  })

  return folder ? (
    <IconicTreeItem
      nodeId={`${folder.id}`}
      labelIcon={folder.is_public ? FolderSharedIcon : FolderIcon}
      labelText={folder.name}
      color={folder.color}
      menuItems={menuItems}
      onMouseEnter={() => dispatch(folderActions.setHovered(folder.id))}
      onMouseLeave={() => {
        if (!credentialShowForms.add) dispatch(folderActions.setHovered(-1))
      }}
    >
      {folderChildren &&
        folderChildren.map(f => {
          return (
            <FolderTreeItem
              key={f.id}
              folderId={f.id}
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

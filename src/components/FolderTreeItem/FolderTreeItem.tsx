import * as React from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import { useGetFolderByIdQuery, useGetFoldersQuery } from '../../features/apiSlice'
import useLoading from '../../hooks/useLoading'

interface FolderTreeItemProps {
  folderId: number
  menuItems: React.ReactNode
}

const FolderTreeItem = ({ folderId, menuItems }: FolderTreeItemProps) => {
  const loading = useLoading()
  const { data: folder, isLoading: getFolderIsLoading } = useGetFolderByIdQuery(folderId)
  const { data: folders, isLoading: getFoldersIsLoading } = useGetFoldersQuery()
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

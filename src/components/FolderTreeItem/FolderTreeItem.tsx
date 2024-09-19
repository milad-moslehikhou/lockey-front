import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FolderIcon from '@mui/icons-material/Folder'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import { useGetFolderByIdQuery, useGetFoldersQuery } from '../../features/apiSlice'
import useLoading from '../../hooks/useLoading'
import { folderActions, selectFolderShowForms } from '../../features/folderSlice'
import { selectCredentialShowForms } from '../../features/credentialSlice'

interface FolderTreeItemProps {
  folderId: number
  disabledNode?: number
  menuItems: React.ReactNode
}

const FolderTreeItem = ({ folderId, disabledNode, menuItems }: FolderTreeItemProps) => {
  const loading = useLoading()
  const dispatch = useDispatch()
  const { data: folder, isLoading: getFolderIsLoading } = useGetFolderByIdQuery(folderId)
  const { data: folders, isLoading: getFoldersIsLoading } = useGetFoldersQuery()
  const folderShowForms = useSelector(selectFolderShowForms)
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
      disabled={folder.id == disabledNode ? true : false}
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
              folderId={f.id}
              disabledNode={disabledNode}
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

import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { TreeView } from '@mui/lab'
import FolderIcon from '@mui/icons-material/Folder'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { BREADCRUMBS_BASE_PATH } from '../../constant'
import { useGetFoldersQuery } from '../../features/api/apiSlice'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import { setSelectedItem, selectBreadcrumbs } from '../../features/breadcrumbs/breadcrumbsSlice'
import type { BreadcrumbsType } from '../../types/component'
import type { FolderType } from '../../types/folder'


const FolderTreeView = () => {
  const dispatch = useDispatch()
  const [prevSelectedNodeId, setPrevSelectedNodeId] = React.useState(0)
  const breadcrumbs = useSelector(selectBreadcrumbs)
  const { data: folders } = useGetFoldersQuery()

  const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const pathString = event.currentTarget.parentElement?.parentElement?.attributes.getNamedItem('data-path')?.value
    if (pathString) {
      const path = JSON.parse(pathString) as BreadcrumbsType[]
      dispatch(setSelectedItem([BREADCRUMBS_BASE_PATH, ...path]))
    }
    const selectedNodeId = _.toInteger(nodeId.split(':')[1])
    if (selectedNodeId != 0 && prevSelectedNodeId != selectedNodeId) {
      setPrevSelectedNodeId(selectedNodeId)
    }
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleNodeSelect}
      selected={breadcrumbs.path[breadcrumbs.path.length - 1].id}
      sx={{
        height: 'calc(100vh - 3rem - 6rem - 4rem - 2rem - 176px - 16px)',
        flexGrow: 1,
        overflow: 'auto',
        padding: '8px 0'
      }}
    >
      <IconicTreeItem
        nodeId="folders"
        labelIcon={FolderIcon}
        labelText={<b>Folders</b>}
      >
        {folders && folders.map(folder => {
          if (folder.parent == null)
            return <Tree
              key={folder.id}
              folder={folder}
              folders={folders}
              path={[{ id: `folder:${folder.id}`, text: folder.name }]}
            />
        })}
      </IconicTreeItem>
    </TreeView>


  )
}

interface ITreeProps {
  folder: FolderType,
  folders: FolderType[],
  path: BreadcrumbsType[]
}

const Tree = ({ folder, folders, path }: ITreeProps) => {
  const folderChildren = getChildren(folders, folder.id)
  return (
    <IconicTreeItem
      nodeId={`folder:${folder.id}`}
      labelIcon={folder.is_public? FolderSharedIcon: FolderIcon}
      labelText={folder.name}
      color={folder.color}
      data-path={JSON.stringify(path)}
    >
      {folderChildren.map(f => {
        return <Tree
          key={f.id}
          folder={f}
          folders={folders}
          path={[...path, { id: `folder:${f.id}`, text: f.name }]} />
      })}
    </IconicTreeItem>
  )
}

const getChildren = (folders: FolderType[], id: number) => {
  return folders.filter(folder => folder.parent === id)
}

export default FolderTreeView
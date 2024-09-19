import * as React from 'react'
import { TreeView } from '@mui/lab'
import FolderIcon from '@mui/icons-material/Folder'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import FolderTreeItem from '../FolderTreeItem/FolderTreeItem'
import { FolderType } from '../../types/folder'

interface FolderTreeViewProps {
  folders: FolderType[]
  menuItems?: React.ReactNode
  selected: string
  disabledNode?: number
  onNodeSelect: (e: React.SyntheticEvent, nodeId: string) => void
}

const FolderTreeView = ({ folders, menuItems, selected, disabledNode, onNodeSelect }: FolderTreeViewProps) => {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={onNodeSelect}
      selected={selected}
      sx={{
        height: 'calc(100vh - 3rem - 6rem - 4rem - 2rem - 176px - 16px)',
        flexGrow: 1,
        overflow: 'auto',
        padding: '8px 0',
      }}
    >
      <IconicTreeItem
        id='folders'
        nodeId='folders'
        labelIcon={FolderIcon}
        labelText={<b>Folders</b>}
      >
        {folders &&
          folders.map(f => {
            if (f.parent == null)
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
    </TreeView>
  )
}

export default FolderTreeView

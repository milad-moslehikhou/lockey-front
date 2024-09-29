import * as React from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import IconicTreeItem from '../IconicTreeItem/IconicTreeItem'
import FolderTreeItem from '../FolderTreeItem/FolderTreeItem'
import { FolderType } from '../../types/folder'
import { SimpleTreeView } from '@mui/x-tree-view'

interface FolderTreeViewProps {
  folders: FolderType[]
  menuItems?: React.ReactNode
  selected: string
  disabledItem?: number
  onSelectedItemsChange: (e: React.SyntheticEvent, itemIds: string | null) => void
}

const FolderTreeView = ({ folders, menuItems, selected, disabledItem, onSelectedItemsChange }: FolderTreeViewProps) => {
  return (
    <SimpleTreeView
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selected}
      sx={{
        height: 'calc(100vh - 3rem - 6rem - 4rem - 2rem - 176px - 16px)',
        flexGrow: 1,
        overflow: 'auto',
        padding: '8px 0',
      }}
    >
      <IconicTreeItem
        id='folders'
        key={'folders'}
        itemId='folders'
        labelIcon={FolderIcon}
        labelText={<b>Folders</b>}
      >
        {folders &&
          folders.map(f => {
            if (f.parent == null)
              return (
                <FolderTreeItem
                  key={f.id}
                  folder={f}
                  disabledItem={disabledItem}
                  menuItems={menuItems}
                />
              )
            return <></>
          })}
      </IconicTreeItem>
    </SimpleTreeView>
  )
}

export default FolderTreeView

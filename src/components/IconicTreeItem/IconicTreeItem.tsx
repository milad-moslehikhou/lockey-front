import * as React from 'react'
import Box from '@mui/material/Box'
import TreeItem, { TreeItemProps, useTreeItem, TreeItemContentProps } from '@mui/lab/TreeItem'
import { Typography, IconButton, Menu } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import clsx from 'clsx'

const TreeItemContext = React.createContext<React.ReactNode>(undefined)

const CustomContent = React.forwardRef(function CustomContent(props: TreeItemContentProps, ref) {
  const { classes, className, label, nodeId, icon: iconProp, expansionIcon, displayIcon } = props

  const { disabled, expanded, selected, handleExpansion, handleSelection, preventSelection } = useTreeItem(nodeId)
  const menuItems = React.useContext(TreeItemContext)

  const icon = iconProp || expansionIcon || displayIcon
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [showButton, setShowButton] = React.useState(false)
  const openMenu = Boolean(anchorEl)

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setShowButton(false)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event)
  }

  const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event)
  }

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleSelection(event)
  }

  return (
    <div
      id={nodeId}
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      style={{ position: 'relative', padding: '0 1rem' }}
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseEnter={() => {
        setShowButton(true)
      }}
      onMouseLeave={() => {
        setShowButton(false)
      }}
    >
      <div
        onClick={handleExpansionClick}
        className={classes.iconContainer}
      >
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component='div'
        className={classes.label}
        sx={{
          '&.MuiTreeItem-label': {
            padding: 0,
          },
        }}
      >
        {label}
      </Typography>
      {menuItems && (
        <>
          <IconButton
            onClick={handleClickMore}
            sx={{
              display: showButton ? 'block' : 'none',
              padding: 0,
              height: '1.5rem',
              marginRight: '1rem',
              position: 'absolute',
              top: 0,
              right: 0,
              '&:hover': {
                color: '#1976d2',
                backgroundColor: 'unset',
              },
            }}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            {menuItems}
          </Menu>
        </>
      )}
    </div>
  )
})

const CustomTreeItem = (props: TreeItemProps) => {
  return (
    <TreeItem
      ContentComponent={CustomContent}
      {...props}
    />
  )
}

interface IconicTreeItemProps {
  nodeId: string
  labelIcon: any
  labelText: string | React.ReactNode
  color?: string
  menuItems?: React.ReactNode
  children?: React.ReactNode
}

const IconicTreeItem = ({
  nodeId,
  labelIcon: LabelIcon,
  labelText,
  color,
  menuItems,
  ...other
}: TreeItemProps & IconicTreeItemProps) => {
  return (
    <div>
      <TreeItemContext.Provider value={menuItems}>
        <CustomTreeItem
          nodeId={nodeId}
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component={LabelIcon}
                color={color}
                sx={{
                  marginRight: '4px',
                  fontSize: '1.2rem',
                }}
              />
              <Typography>{labelText}</Typography>
            </Box>
          }
          {...other}
        />
      </TreeItemContext.Provider>
    </div>
  )
}

export default IconicTreeItem

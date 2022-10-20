import * as React from 'react'
import Box from '@mui/material/Box'
import TreeItem, {
  TreeItemProps,
  useTreeItem,
  TreeItemContentProps,
} from '@mui/lab/TreeItem'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'


const CustomContent = React.forwardRef(function CustomContent(props: TreeItemContentProps, ref,) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props

  const {
    disabled,
    expanded,
    selected,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId)

  const icon = iconProp || expansionIcon || displayIcon

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event)
  }

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event)
  }

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event)
  }

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      style={{ padding: '0 1rem' }}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
        sx={{
          '&.MuiTreeItem-label': {
            padding: 0,
          }
        }}
      >
        {label}
      </Typography>
    </div>
  )
})

const CustomTreeItem = (props: TreeItemProps) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
)

interface IIconicTreeItemProps {
  nodeId: string,
  labelIcon: any,
  labelText: string | React.ReactNode,
  color?: string,
  children?: React.ReactNode
}

const IconicTreeItem = ({
  nodeId,
  labelIcon: LabelIcon,
  labelText,
  color,
  ...other }: IIconicTreeItemProps) => {

  return (
    <CustomTreeItem
      nodeId={nodeId}
      label={
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <Box
            component={LabelIcon}
            color={color}
            sx={{
              marginRight: '4px',
              fontSize: '1.2rem',
            }}
          />
          <Typography>
            {labelText}
          </Typography>
        </Box>
      }
      {...other}
    />
  )
}

export default IconicTreeItem
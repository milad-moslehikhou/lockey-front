import * as React from 'react'
import { Box, Avatar, Typography, Button, Menu, MenuItem } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { stringToColor } from '../../helpers/common'
import useLoggedInUser from '../../hooks/useLoggedInUser'

const AvatarMenu = () => {
  const loggedInUser = useLoggedInUser()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        id='avatar-menu-button'
        aria-controls={open ? 'avatar-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          bgcolor: 'background.paper',
          color: 'grey.900',
          borderRadius: open ? '4px 4px 0 0' : '4px',
          padding: '6px 12px',
          minWidth: '250px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'grey.300',
          ':hover': {
            bgcolor: 'background.paper',
            boxShadow: '2px 2px 4px rgb(0 0 0 / 10%)',
          },
          '&[aria-expanded=true]': {
            borderWidth: 0,
          },
        }}
      >
        {loggedInUser && loggedInUser.profile.avatar ? (
          <Avatar
            src={loggedInUser.profile.avatar}
            alt={loggedInUser.username}
          />
        ) : (
          <Avatar sx={{ bgcolor: stringToColor(loggedInUser?.username || '') }}>
            {loggedInUser?.profile.first_name[0].concat(loggedInUser?.profile.last_name[0])}
          </Avatar>
        )}
        <Box
          sx={{
            marginLeft: 2,
            flexGrow: 1,
          }}
        >
          <Typography
            fontWeight={900}
            textTransform='lowercase'
            textAlign='left'
          >
            {loggedInUser?.profile.first_name + ' ' + loggedInUser?.profile.last_name}
          </Typography>
          <Typography
            fontSize='small'
            textTransform='lowercase'
            textAlign='left'
          >
            {loggedInUser?.username}
          </Typography>
        </Box>
        <ExpandMoreIcon fontSize='small' />
      </Button>
      <Menu
        id='avatar-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'avatar-menu-button',
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '0 0 4px 4px',
            boxShadow: '0px 4px 4px -4px rgb(0 0 0 / 10%)',
          },
          '& .MuiMenu-list': {
            width: anchorEl && anchorEl.clientWidth + 2,
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Theme</MenuItem>
      </Menu>
    </>
  )
}

export default AvatarMenu

import * as React from 'react'
import { Box, Avatar, Typography, Button, Menu, MenuItem } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { stringToColor } from '../../helpers/common'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserShowForms, userActions } from '../../features/userSlice'
import UserChangePasswordForm from '../User/UserChangePasswordForm'

const AvatarMenu = () => {
  const loggedInUser = useLoggedInUser()
  const dispatch = useDispatch()
  const userShowForms = useSelector(selectUserShowForms)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOnChangePassowrd = () => {
    handleClose()
    dispatch(userActions.setShowForms({ changePass: true }))
  }

  let displayName = '  '
  let displayShortName = '  '
  if (loggedInUser) {
    if (loggedInUser.first_name && loggedInUser.last_name) {
      displayName = `${loggedInUser.first_name} ${loggedInUser.last_name}`
      displayShortName = `${loggedInUser.first_name[0]}${loggedInUser.last_name[0]}`
    } else {
      displayName = loggedInUser.username
      displayShortName = loggedInUser.username[0]
    }
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
        {loggedInUser &&
          (loggedInUser.avatar ? (
            <Avatar
              src={typeof loggedInUser.avatar === 'string' ? loggedInUser.avatar : ''}
              alt={loggedInUser.username}
            />
          ) : (
            <Avatar sx={{ bgcolor: stringToColor(loggedInUser.username || '') }}>{displayShortName}</Avatar>
          ))}
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
            {displayName}
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
        <MenuItem onClick={handleOnChangePassowrd}>Change Password</MenuItem>
      </Menu>
      {userShowForms.changePass && loggedInUser ? <UserChangePasswordForm user={loggedInUser} /> : ''}
    </>
  )
}

export default AvatarMenu

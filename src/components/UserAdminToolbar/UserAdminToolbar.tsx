import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, IconButton, Tooltip, Stack, Typography } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ToolbarContainer from '../ToolbarContainer/ToolbarContainer'
import { selectUserSelected, selectUserShowForms, userActions } from '../../features/userSlice'
import Password from '@mui/icons-material/Password'

const UserAdminToolbar = () => {
  const dispatch = useDispatch()
  const userShowForms = useSelector(selectUserShowForms)
  const userSelected = useSelector(selectUserSelected)
  const boxShadow = userShowForms.detail
    ? 'inset 0.1rem 0.1rem 0.2rem #c8d0e7, inset -0.1rem -0.1rem 1rem #fff'
    : 'unset'

  return (
    <ToolbarContainer>
      <Box></Box>
      <Stack
        direction='row'
        spacing='1rem'
        sx={{
          width: 'calc(100% - 300px - 24px - 10px)',
          alignItems: 'center',
          position: 'absolute',
          left: '300px',
        }}
      >
        <Button
          variant='outlined'
          size='small'
          startIcon={<AddCircleIcon />}
          onClick={() => dispatch(userActions.setShowForms({ add: true }))}
        >
          Add
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<EditIcon />}
          disabled={userSelected.length !== 1}
          onClick={() => dispatch(userActions.setShowForms({ edit: true }))}
        >
          Edit
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<Password />}
          disabled={userSelected.length !== 1}
          onClick={() => dispatch(userActions.setShowForms({ resetPass: true }))}
        >
          Set Password
        </Button>
        <Button
          variant='outlined'
          size='small'
          color='error'
          startIcon={<DeleteIcon />}
          disabled={userSelected.length !== 1}
          onClick={() => dispatch(userActions.setShowForms({ delete: true }))}
        >
          Delete
        </Button>
        {userSelected.length > 0 ? (
          <Typography>{`${userSelected.length} row${userSelected.length > 1 ? 's' : ''} selected`}</Typography>
        ) : (
          ''
        )}
      </Stack>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          marginRight: '1rem',
        }}
      >
        <Tooltip title={userShowForms.detail ? 'Hide details' : 'Show details'}>
          <IconButton
            color='primary'
            component='label'
            disabled={userSelected.length !== 1}
            onClick={() => dispatch(userActions.setShowDetail(!userShowForms.detail))}
            sx={{
              padding: '3px',
              boxShadow: boxShadow,
              borderRadius: '4px',
            }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </ToolbarContainer>
  )
}

export default UserAdminToolbar

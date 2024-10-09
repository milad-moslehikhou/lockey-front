import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, IconButton, Tooltip, Stack, Typography, Menu, MenuItem } from '@mui/material'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import PasswordIcon from '@mui/icons-material/Password'
import ShieldIcon from '@mui/icons-material/Shield'
import { credentialActions, selectCredentialShowForms, selectCredentialSelected } from '../../features/credentialSlice'
import { folderActions } from '../../features/folderSlice'
import ToolbarContainer from '../ToolbarContainer/ToolbarContainer'

const CredentialToolbar = () => {
  const dispatch = useDispatch()
  const credentialShowForms = useSelector(selectCredentialShowForms)
  const credentialSelected = useSelector(selectCredentialSelected)
  const boxShadow = credentialShowForms.detail
    ? 'inset 0.1rem 0.1rem 0.2rem #c8d0e7, inset -0.1rem -0.1rem 1rem #fff'
    : 'unset'
  const handleMenuClick = (isFolder: boolean) => {
    if (isFolder) dispatch(folderActions.setShowForms({ add: true }))
    else dispatch(credentialActions.setShowForms({ add: true }))
  }

  return (
    <ToolbarContainer>
      <Box>
        <PopupState variant='popover'>
          {popupState => (
            <React.Fragment>
              <Button
                variant='contained'
                size='small'
                startIcon={<AddCircleIcon />}
                sx={{
                  marginRight: '1rem',
                }}
                {...bindTrigger(popupState)}
              >
                Create
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    popupState.close()
                    handleMenuClick(true)
                  }}
                >
                  Folder
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close()
                    handleMenuClick(false)
                  }}
                >
                  Credential
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      </Box>
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
          startIcon={<EditIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForms({ edit: true }))}
        >
          Edit
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<DriveFileMoveIcon />}
          disabled={credentialSelected.length <= 0}
          onClick={() => dispatch(credentialActions.setShowForms({ move: true }))}
        >
          Move
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<ShieldIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForms({ grant: true }))}
        >
          Grant
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<ShareIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForms({ share: true }))}
        >
          Share
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<PasswordIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForms({ addSecret: true }))}
        >
          Add Secret
        </Button>
        <Button
          variant='outlined'
          size='small'
          color='error'
          startIcon={<DeleteIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForms({ delete: true }))}
        >
          Delete
        </Button>
        {credentialSelected.length > 0 ? (
          <Typography>
            {`${credentialSelected.length} row${credentialSelected.length > 1 ? 's' : ''} selected`}
          </Typography>
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
        <Tooltip title={credentialShowForms.detail ? 'Hide details' : 'Show details'}>
          <IconButton
            color='primary'
            component='label'
            disabled={credentialSelected.length !== 1}
            onClick={() => dispatch(credentialActions.setShowDetail(!credentialShowForms.detail))}
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

export default CredentialToolbar

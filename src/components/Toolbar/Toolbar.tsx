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
import { credentialActions, selectCredentialShowForm, selectCredentialSelected } from '../../features/credentialSlice'
import { folderActions } from '../../features/folderSlice'

const Toolbar = () => {
  const dispatch = useDispatch()
  const credentialShowForm = useSelector(selectCredentialShowForm)
  const credentialSelected = useSelector(selectCredentialSelected)
  const boxShadow = credentialShowForm.detail
    ? 'inset 0.1rem 0.1rem 0.2rem #c8d0e7, inset -0.1rem -0.1rem 1rem #fff'
    : 'unset'
  const handleMenuClick = (isFolder: boolean) => {
    if (isFolder) dispatch(folderActions.setShowForm({ add: true }))
    else dispatch(credentialActions.setShowForm({ add: true }))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '3rem',
        padding: '1rem',
        backgroundColor: 'grey.100',
        borderBottomColor: 'grey.300',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        zIndex: 1000,
      }}
    >
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
          width: 'calc(100% - 320px - 24px - 10px)',
          alignItems: 'center',
          position: 'absolute',
          left: '320px',
        }}
      >
        <Button
          variant='outlined'
          size='small'
          startIcon={<DriveFileMoveIcon />}
          disabled={credentialSelected.length <= 0}
          onClick={() => dispatch(credentialActions.setShowForm({ move: true }))}
        >
          Move
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<ShareIcon />}
          disabled={credentialSelected.length <= 0}
        >
          Share
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<EditIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForm({ edit: true }))}
        >
          Edit
        </Button>
        <Button
          variant='outlined'
          size='small'
          color='error'
          startIcon={<DeleteIcon />}
          disabled={credentialSelected.length !== 1}
          onClick={() => dispatch(credentialActions.setShowForm({ delete: true }))}
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
        <Tooltip title={credentialShowForm.detail ? 'Hide details' : 'Show details'}>
          <IconButton
            color='primary'
            component='label'
            disabled={credentialSelected.length !== 1}
            onClick={() => dispatch(credentialActions.setShowDetail(!credentialShowForm.detail))}
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
    </Box>
  )
}

export default Toolbar

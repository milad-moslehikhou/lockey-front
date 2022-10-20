import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Typography,
} from '@mui/material'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import {
  selectCredentialFormsState,
  selectSelectedCredentials,
  setCredentialFormsState
} from '../../features/credential/credentialSlice'


const Toolbar = () => {
  const dispatch = useDispatch()
  const selectedCredentials = useSelector(selectSelectedCredentials)
  const formsState = useSelector(selectCredentialFormsState)
  const boxShadow = formsState.detail ? 'inset 0.1rem 0.1rem 0.2rem #c8d0e7, inset -0.1rem -0.1rem 1rem #fff' : 'unset'

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      minHeight: '3rem',
      padding: '1rem',
      backgroundColor: 'grey.100',
      borderBottomColor: 'grey.300',
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      zIndex: 1000,
    }}>
      <Box>
        <Button
          variant="contained"
          size='small'
          startIcon={<AddCircleIcon />}
          sx={{
            marginRight: '1rem'
          }}
          onClick={() => dispatch(setCredentialFormsState({ add: true }))}
        >
          Create
        </Button>
      </Box>
      <Stack
        direction='row'
        spacing='1rem'
        sx={{
          width: 'calc(100% - 320px - 24px - 10px)',
          alignItems: 'center',
          position: 'absolute',
          left: '320px'
        }}>
        <Button
          variant="outlined"
          size='small'
          startIcon={<DriveFileMoveIcon />}
          disabled={selectedCredentials.length <= 0}
          onClick={() => dispatch(setCredentialFormsState({ move: true }))}
        >
          Move
        </Button>
        <Button
          variant="outlined"
          size='small'
          startIcon={<ShareIcon />}
          disabled={selectedCredentials.length <= 0}
        >
          Share
        </Button>
        <Button
          variant="outlined"
          size='small'
          startIcon={<EditIcon />}
          disabled={selectedCredentials.length !== 1}
          onClick={() => dispatch(setCredentialFormsState({ edit: true }))}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size='small'
          color='error'
          startIcon={<DeleteIcon />}
          disabled={selectedCredentials.length !== 1}
          onClick={() => dispatch(setCredentialFormsState({ delete: true }))}
        >
          Delete
        </Button>
        {selectedCredentials.length > 0 ?
          <Typography>
            {`${selectedCredentials.length} row${selectedCredentials.length > 1 ? 's' : ''} selected`}
          </Typography> : ''}
      </Stack>
      <Box sx={{
        position: 'absolute',
        right: 0,
        marginRight: '1rem'
      }}>
        <Tooltip title={formsState.detail ? 'Hide details' : 'Show details'}>
          <IconButton
            color="primary"
            component="label"
            disabled={selectedCredentials.length !== 1}
            onClick={() => dispatch(setCredentialFormsState({ detail: !formsState.detail }))}
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
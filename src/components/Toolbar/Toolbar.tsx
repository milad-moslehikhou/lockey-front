import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  IconButton,
} from '@mui/material'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { selectCredentialFormsState, selectSelectedCredentials, setCredentialFormsState } from '../../features/credential/credentialSlice'


const Toolbar = () => {
  const dispatch = useDispatch()
  const selectedCredentials = useSelector(selectSelectedCredentials)
  const formsState = useSelector(selectCredentialFormsState)

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
      zIndex: 2000,
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
      <Box sx={{
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
          sx={{
            marginRight: '1rem'
          }}
        >
          Move
        </Button>
        <Button
          variant="outlined"
          size='small'
          startIcon={<ShareIcon />}
          disabled={selectedCredentials.length <= 0}
          sx={{
            marginRight: '1rem'
          }}
        >
          Share
        </Button>
        <Button
          variant="outlined"
          size='small'
          startIcon={<EditIcon />}
          disabled={selectedCredentials.length !== 1}
          onClick={() => dispatch(setCredentialFormsState({ edit: true }))}
          sx={{
            marginRight: '1rem'
          }}
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
          sx={{
            marginRight: '1rem'
          }}
        >
          Delete
        </Button>
      </Box>
      <Box sx={{
        position: 'absolute',
        right: 0,
        marginRight: '.5rem'
      }}>
        <IconButton
          color="primary"
          component="label"
          disabled={selectedCredentials.length !== 1}
          onClick={() => dispatch(setCredentialFormsState({ detail: !formsState.detail }))}
        >
          <InfoIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Toolbar
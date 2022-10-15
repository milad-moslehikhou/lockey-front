import * as React from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  Button,
} from '@mui/material'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShareIcon from '@mui/icons-material/Share'
import { setFormsState } from '../../features/credential/credentialSlice'


const Toolbar = () => {
  const dispatch = useDispatch()

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
    }}>
      <Box>
        <Button
          variant="contained"
          size='small'
          startIcon={<AddCircleIcon />}
          sx={{
            marginRight: '1rem'
          }}
          onClick={() => dispatch(setFormsState({ add: true }))}
        >
          Create
        </Button>
      </Box>
      <Box sx={{
        width: 'calc(100% - 320px - 24px)',
        alignItems: 'center',
        position: 'absolute',
        left: '320px'
      }}>
        <Button
          variant="contained"
          size='small'
          startIcon={<DriveFileMoveIcon />}
          sx={{
            marginRight: '1rem'
          }}
        >
          Move
        </Button>
        <Button
          variant="contained"
          size='small'
          startIcon={<ShareIcon />}
          sx={{
            marginRight: '1rem'
          }}
        >
          Share
        </Button>
      </Box>
    </Box>
  )
}

export default Toolbar
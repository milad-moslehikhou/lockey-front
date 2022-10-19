import * as React from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
} from '@mui/material'
import {
  selectCredentials,
  selectSelectedCredentials,
} from '../../features/credential/credentialSlice'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import ForwardIcon from '@mui/icons-material/Forward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { formatDate } from '../../helpers/common'
import { useGetFoldersQuery, useGetUserByIdQuery } from '../../features/api/apiSlice'


const CredentialDetail = () => {
  const { data: folders } = useGetFoldersQuery()
  const credentials = useSelector(selectCredentials)
  const selectedCredentials = useSelector(selectSelectedCredentials)
  const selectedCredential = credentials.filter(c => c.id === _.toInteger(selectedCredentials[0]))[0]

  const DetailRow = ({ title, value }: { title: string, value: any }) => {

    const ValueElement = () => {
      if (typeof value === 'boolean') {
        if (value)
          return <CheckCircleIcon fontSize='small' color='success' sx={{ marginLeft: '.2rem' }} />
        else
          return <CancelIcon fontSize='small' color='error' sx={{ marginLeft: '.2rem' }} />
      } else {
        return <Typography>{_.toString(value)}</Typography>
      }
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          margin: '.1rem 0',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            width: '7rem',
            marginRight: '3rem',
          }}
        >
          {title}
        </Typography>
        <ValueElement />
      </Box>
    )
  }

  const getLocation = (id: number, location: string[] = []) => {
    let tempLocation = [...location]
    const parent = folders && folders.filter(f => f.id === id)[0]
    if (parent) {

      tempLocation = [...tempLocation, parent.name]
      if (parent.parent)
        tempLocation = [...getLocation(parent.parent, tempLocation)]
    }
    return tempLocation
  }

  const location = '/' + getLocation(selectedCredential.folder || -1).reverse().join('/')
  const { data: createdBy } = useGetUserByIdQuery(selectedCredential.created_by)
  const { data: modifiedBy } = useGetUserByIdQuery(selectedCredential.modified_by)
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: '1rem',
        zIndex: 1000,
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 0 1rem 0 rgba(0,0,0,.3)',
        minWidth: '20rem',
        overflowY: 'scroll',
      }}
    >
      <Box sx={{
        padding: '1rem',
        height: '100%',
      }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        >
          <VpnKeyIcon
            sx={{
              color: 'grey.500',
              backgroundColor: 'grey.100',
              borderRadius: '2rem',
              padding: '.3rem',
              width: '2rem',
              height: '2rem',
            }}
          />
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginLeft: '1rem',
            }}
          >
            {selectedCredential.name}
          </Typography>
        </Box>

        <Divider sx={{ margin: '1rem 0', }} />
        <DetailRow title='ID' value={selectedCredential.id} />
        <DetailRow title='Username' value={selectedCredential.username} />
        <DetailRow title='IP Address' value={selectedCredential.ip} />
        <DetailRow title='URI' value={selectedCredential.uri} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            margin: '.1rem 0',
            alignItems: 'center',
          }}>
          <Typography
            sx={{
              width: '7rem',
              marginRight: '3rem',
            }}
          >
            Importancy
          </Typography>
          {selectedCredential.importancy === 'HIGH' ?
            <Chip
              label='High'
              variant='outlined'
              size='small'
              icon={<ForwardIcon sx={{ fontSize: '1.2rem', transform: 'rotateZ(270deg)' }} />}
              sx={{
                '& .MuiChip-icon': {
                  color: '#d32f2f'
                }
              }}

            />
            : ''
          }
          {selectedCredential.importancy === 'MEDIUM' ?
            <Chip
              label='Medium'
              variant='outlined'
              size='small'
              icon={<ForwardIcon sx={{ fontSize: '1.2rem' }} />}
              sx={{
                '& .MuiChip-icon': {
                  color: '#ed6c02'
                }
              }}
            />
            : ''
          }
          {selectedCredential.importancy === 'LOW' ?
            <Chip
              label='Low'
              variant='outlined'
              size='small'
              icon={<ForwardIcon sx={{ fontSize: '1.2rem', transform: 'rotateZ(90deg)' }} />}
              sx={{
                '& .MuiChip-icon': {
                  color: '#2e7d32'
                }
              }}
            />
            : ''
          }
        </Box>
        <DetailRow title='Public' value={selectedCredential.is_public} />
        <DetailRow title='Auto generate' value={selectedCredential.auto_genpass} />
        <DetailRow title='Location' value={location} />
        <DetailRow title='Description' value={selectedCredential.description} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            margin: '.1rem 0',
            alignItems: 'center',
          }}>
          <Typography
            sx={{
              width: '7rem',
              marginRight: '3rem',
            }}
          >
            Tags
          </Typography>
          <Stack
            direction="row"
            spacing={.5}
          >
            {selectedCredential.tags && selectedCredential.tags.split(',').map(t => {
              return <Chip
                key={t}
                label={t}
                size='small'
                variant='outlined'
              />
            })}
          </Stack>
        </Box>
        <Divider sx={{ margin: '1rem 0', }} />
        <DetailRow title='Modified' value={formatDate(selectedCredential.modified_at)} />
        <DetailRow title='Modified by ' value={modifiedBy?.username} />
        <DetailRow title='Created' value={formatDate(selectedCredential.created_at)} />
        <DetailRow title='Created by' value={createdBy?.username} />
      </Box>
    </Box>
  )
}

export default CredentialDetail
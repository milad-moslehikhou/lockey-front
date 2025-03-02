import * as React from 'react'
import { Box, Typography, Divider, Stack, Chip } from '@mui/material'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import ForwardIcon from '@mui/icons-material/Forward'
import { formatDate } from '../../helpers/common'
import {
  useGetCredentialGrantsByIdQuery,
  useGetFoldersQuery,
  useGetGroupsQuery,
  useGetUsersQuery,
} from '../../features/apiSlice'
import type { CredentialType } from '../../types/credential'
import DetailRow from '../DetailRow/DetailRow'

interface CredentialDetailProps {
  credential: CredentialType
}

const CredentialDetail = ({ credential }: CredentialDetailProps) => {
  const { data: folders, isLoading: foldersIsLoading } = useGetFoldersQuery()
  const { data: users } = useGetUsersQuery()
  const { data: groups } = useGetGroupsQuery()
  const { data: credentialGrants } = useGetCredentialGrantsByIdQuery(credential.id)

  const getLocation = (id: number, location: string[] = []) => {
    let tempLocation = [...location]
    const parent = folders && folders.filter(f => f.id === id)[0]
    if (parent) {
      tempLocation = [...tempLocation, parent.name]
      if (parent.parent) tempLocation = [...getLocation(parent.parent, tempLocation)]
    }
    return tempLocation
  }

  const location =
    '/' +
    getLocation(credential.folder || -1)
      .reverse()
      .join('/')

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: '1rem',
        zIndex: 900,
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 0 1rem 0 rgba(0,0,0,.3)',
        minWidth: '20rem',
        overflowY: 'scroll',
      }}
    >
      <Box
        sx={{
          padding: '1rem',
          height: '100%',
        }}
      >
        <Box
          sx={{
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
            {credential.name}
          </Typography>
        </Box>

        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='ID'
          value={credential.id}
        />
        <DetailRow
          title='Username'
          value={credential.username}
        />
        <DetailRow
          title='IP Address'
          value={credential.ip}
        />
        <DetailRow
          title='URI'
          value={credential.uri}
        />
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
            Importancy
          </Typography>
          {credential.importancy === 'HIGH' ? (
            <Chip
              label='High'
              variant='outlined'
              size='small'
              icon={<ForwardIcon sx={{ fontSize: '1.2rem', transform: 'rotateZ(270deg)' }} />}
              sx={{
                '& .MuiChip-icon': {
                  color: '#d32f2f',
                },
              }}
            />
          ) : (
            ''
          )}
          {credential.importancy === 'MEDIUM' ? (
            <Chip
              label='Medium'
              variant='outlined'
              size='small'
              icon={<ForwardIcon sx={{ fontSize: '1.2rem' }} />}
              sx={{
                '& .MuiChip-icon': {
                  color: '#ed6c02',
                },
              }}
            />
          ) : (
            ''
          )}
          {credential.importancy === 'LOW' ? (
            <Chip
              label='Low'
              variant='outlined'
              size='small'
              icon={<ForwardIcon sx={{ fontSize: '1.2rem', transform: 'rotateZ(90deg)' }} />}
              sx={{
                '& .MuiChip-icon': {
                  color: '#2e7d32',
                },
              }}
            />
          ) : (
            ''
          )}
        </Box>
        <DetailRow
          title='Auto generate'
          value={credential.auto_genpass}
        />
        <DetailRow
          title='Location'
          value={foldersIsLoading ? 'loading...' : location}
        />
        <DetailRow
          title='Description'
          value={credential.description}
        />
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
            Tags
          </Typography>
          <Stack
            direction='row'
            spacing={0.5}
          >
            {credential.tags &&
              credential.tags.split(',').map(t => {
                return (
                  <Chip
                    key={t}
                    label={t}
                    size='small'
                    variant='outlined'
                  />
                )
              })}
          </Stack>
        </Box>
        {groups && credentialGrants && credentialGrants.length > 0 && (
          <>
            <Divider sx={{ margin: '1rem 0' }} />
            <DetailRow
              title='Grants'
              value={credentialGrants
                .map(cg => {
                  let ret = ''
                  const groupName = groups && groups.find(g => g.id === cg.group)?.name
                  if (groupName) ret = ret.concat(`${groupName}(${cg.action.toLowerCase()})`)
                  const userName = users && users.find(u => u.id === cg.user)?.username
                  if (userName) ret = ret.concat(`${userName}(${cg.action.toLowerCase()})`)
                  return ret
                })
                .join('\n')}
            />
          </>
        )}
        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='Modified'
          value={formatDate(credential.modified_at)}
        />
        <DetailRow
          title='Modified by '
          value={users && users.find(u => u.id === credential.modified_by)?.username}
        />
        <DetailRow
          title='Created'
          value={formatDate(credential.created_at)}
        />
        <DetailRow
          title='Created by'
          value={users && users.find(u => u.id === credential.created_by)?.username}
        />
      </Box>
    </Box>
  )
}

export default CredentialDetail

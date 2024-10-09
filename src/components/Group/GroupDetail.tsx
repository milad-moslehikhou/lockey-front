import * as React from 'react'
import { Box, Typography, Divider } from '@mui/material'
import Groups from '@mui/icons-material/Groups'
import type { GroupType } from '../../types/group'
import { useGetGroupMemberByIdQuery, useGetPermissionsQuery } from '../../features/apiSlice'
import DetailRow from '../DetailRow/DetailRow'

interface GroupDetailProps {
  group: GroupType
}

const GroupDetail = ({ group }: GroupDetailProps) => {
  const { data: members, isLoading: membersIsLoading } = useGetGroupMemberByIdQuery(group.id)
  const { data: perms, isLoading: permsIsLoading } = useGetPermissionsQuery()

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
          <Groups
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
            {group.name}
          </Typography>
        </Box>

        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='ID'
          value={group.id}
        />
        <DetailRow
          title='Name'
          value={group.name}
        />
        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='Permissions'
          value={
            perms
              ? permsIsLoading
                ? 'loading...'
                : group.permissions.map(gp => perms.find(p => p.id === gp)?.codename).join('\n')
              : ''
          }
        />
        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='Members'
          value={members ? (membersIsLoading ? 'loading...' : members.map(m => m.username).join(', ')) : ''}
        />
      </Box>
    </Box>
  )
}

export default GroupDetail

import * as React from 'react'
import { Box, Divider, Avatar } from '@mui/material'
import { formatDate } from '../../helpers/common'
import type { UserType } from '../../types/user'
import { useGetGroupsQuery, useGetPermissionsQuery } from '../../features/apiSlice'
import DetailRow from '../DetailRow/DetailRow'

interface UserDetailProps {
  user: UserType
}

const UserDetail = ({ user }: UserDetailProps) => {
  const { data: groups, isLoading: groupsIsLoading } = useGetGroupsQuery()
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
            justifyContent: 'center',
          }}
        >
          <Avatar
            src={typeof user.avatar === 'string' ? user.avatar : ''}
            sx={{
              width: '128px',
              height: '128px',
            }}
          />
        </Box>

        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='ID'
          value={user.id}
        />
        <DetailRow
          title='Username'
          value={user.username}
        />
        <DetailRow
          title='First Name'
          value={user.first_name}
        />
        <DetailRow
          title='Last Name'
          value={user.last_name}
        />
        <DetailRow
          title='Superuser'
          value={user.is_superuser}
        />
        <DetailRow
          title='Active'
          value={user.is_active}
        />
        <DetailRow
          title='Last Login'
          value={formatDate(user.last_login)}
        />
        <DetailRow
          title='Date Joined'
          value={formatDate(user.date_joined)}
        />
        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='Groups'
          value={
            user.groups.length > 0
              ? groupsIsLoading
                ? 'loading...'
                : groups &&
                  user.groups
                    .map(ug => {
                      return groups.find(g => g.id === ug)?.name
                    })
                    .join(', ')
              : ''
          }
        />
        <Divider sx={{ margin: '1rem 0' }} />
        <DetailRow
          title='Permissions'
          value={
            perms
              ? permsIsLoading
                ? 'loading...'
                : user.user_permissions.map(up => perms.find(p => p.id === up)?.codename).join(', ')
              : ''
          }
        />
      </Box>
    </Box>
  )
}

export default UserDetail

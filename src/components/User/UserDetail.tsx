import * as React from 'react'
import _ from 'lodash'
import { Box, Typography, Divider, Avatar } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { formatDate } from '../../helpers/common'
import type { UserType } from '../../types/user'
import { Person } from '@mui/icons-material'
import { useGetGroupsQuery } from '../../features/apiSlice'

interface UserDetailProps {
  user: UserType
}

const UserDetail = ({ user }: UserDetailProps) => {
  const { data: groups, isLoading: groupsIsLoading } = useGetGroupsQuery()
  const DetailRow = ({ title, value }: { title: string; value: any }) => {
    const ValueElement = () => {
      if (typeof value === 'boolean') {
        if (value)
          return (
            <CheckCircleIcon
              fontSize='small'
              color='primary'
            />
          )
        else
          return (
            <CancelIcon
              fontSize='small'
              color='disabled'
            />
          )
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
        {user.groups.length > 0 && (
          <>
            <Divider sx={{ margin: '1rem 0' }} />
            <DetailRow
              title='Groups'
              value={
                groupsIsLoading
                  ? 'loading...'
                  : user.groups
                      .map(ug => {
                        return groups && groups.find(g => g.id === ug)
                      })
                      .join(', ')
              }
            />
          </>
        )}
        <Divider sx={{ margin: '1rem 0' }} />
        {user.groups.length > 0 && (
          <>
            <Divider sx={{ margin: '1rem 0' }} />
            <DetailRow
              title='Permissions'
              value={user.user_permissions.join(', ')}
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default UserDetail

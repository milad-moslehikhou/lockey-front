import * as React from 'react'
import _ from 'lodash'
import { Box, Typography, Divider } from '@mui/material'
import Groups from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import type { GroupType } from '../../types/group'
import { useGetGroupMemberByIdQuery } from '../../features/apiSlice'

interface GroupDetailProps {
  group: GroupType
}

const GroupDetail = ({ group }: GroupDetailProps) => {
  const { data: members, isLoading: membersIsLoading } = useGetGroupMemberByIdQuery(group.id)

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
          value={group.permissions.join(', ')}
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

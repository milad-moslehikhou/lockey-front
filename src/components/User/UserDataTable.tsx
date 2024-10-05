import * as React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { formatDate, getComparator } from '../../helpers/common'
import { userActions, selectUserSearch, selectUserSelected } from '../../features/userSlice'
import useLoading from '../../hooks/useLoading'
import type { OrderType } from '../../types/component'
import { useGetUsersQuery } from '../../features/apiSlice'
import { UserType } from '../../types/user'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'

interface DataTableHeaderType {
  id: string
  label: string
  type: 'string' | 'number' | 'boolean'
}

const UsersDataTable = () => {
  const dispatch = useDispatch()
  const loading = useLoading()
  const userSearch = useSelector(selectUserSearch)
  const userSelected = useSelector(selectUserSelected)
  const searchUser = (users: UserType[]) => {
    return users.filter(
      s =>
        (s.username && s.username.toLowerCase().includes(userSearch)) ||
        (s.first_name && s.first_name.toLowerCase().includes(userSearch)) ||
        (s.last_name && s.last_name.toLowerCase().includes(userSearch))
    )
  }
  const filterOrSearchUsers = (users: UserType[]) => {
    if (userSearch && userSearch !== '') return searchUser(users)
    else return users
  }
  const { users, usersIsLoading } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      usersIsLoading: isLoading,
      users: (data && filterOrSearchUsers(data)) ?? [],
    }),
  })
  const [order, setOrder] = React.useState<OrderType>('asc')
  const [orderBy, setOrderBy] = React.useState<string>('id')
  const headers: DataTableHeaderType[] = [
    {
      id: 'id',
      label: 'ID',
      type: 'string',
    },
    {
      id: 'username',
      label: 'Username',
      type: 'string',
    },
    {
      id: 'first_name',
      label: 'First Name',
      type: 'string',
    },
    {
      id: 'last_name',
      label: 'Last Name',
      type: 'string',
    },
    {
      id: 'is_superuser',
      label: 'Superuser',
      type: 'boolean',
    },
    {
      id: 'is_active',
      label: 'Active',
      type: 'boolean',
    },
    {
      id: 'last_login',
      label: 'Last Login',
      type: 'string',
    },
    {
      id: 'date_joined',
      label: 'Date Joined',
      type: 'string',
    },
  ]

  const handleOnSort = (e: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: string) => (e: React.MouseEvent<unknown>) => {
    handleOnSort(e, property)
  }

  const handleOnSelect = (e: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = userSelected.indexOf(id)
    let newSelected: string[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(userSelected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(userSelected.slice(1))
    } else if (selectedIndex === userSelected.length - 1) {
      newSelected = newSelected.concat(userSelected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(userSelected.slice(0, selectedIndex), userSelected.slice(selectedIndex + 1))
    }
    dispatch(userActions.setSelected(newSelected))
  }

  const handleOnSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = users.map(n => _.toString(n.id))
      dispatch(userActions.setSelected(newSelected))
      return
    }
    dispatch(userActions.setSelected([]))
  }

  const isSelected = (id: string) => userSelected.indexOf(id) !== -1

  React.useEffect(() => {
    loading(usersIsLoading)
  }, [loading, usersIsLoading])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <TableContainer>
          <Table
            aria-labelledby='tableTitle'
            size='small'
          >
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    color='primary'
                    indeterminate={userSelected.length > 0 && userSelected.length < users.length}
                    checked={users.length > 0 && userSelected.length === users.length}
                    onChange={handleOnSelectAll}
                  />
                </TableCell>
                {headers.map(header => (
                  <TableCell
                    key={header.id}
                    padding={header.type === 'boolean' ? 'checkbox' : 'normal'}
                    align={header.type === 'number' ? 'right' : 'left'}
                    sortDirection={orderBy === header.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === header.id}
                      direction={orderBy === header.id ? order : 'asc'}
                      onClick={createSortHandler(header.id)}
                    >
                      {header.label}
                      {orderBy === header.id ? (
                        <Box
                          component='span'
                          sx={visuallyHidden}
                        >
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {users
                .slice()
                .sort(getComparator(order, orderBy))
                .map(row => {
                  const itemIsSelected = isSelected(_.toString(row.id))

                  return (
                    <TableRow
                      key={row.id}
                      role='checkbox'
                      aria-checked={itemIsSelected}
                      tabIndex={-1}
                      selected={itemIsSelected}
                      hover
                    >
                      <TableCell
                        padding='checkbox'
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        <Checkbox
                          color='primary'
                          checked={itemIsSelected}
                          onClick={event => handleOnSelect(event, _.toString(row.id))}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.username}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.first_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.last_name}
                      </TableCell>
                      <TableCell
                        padding='checkbox'
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.is_superuser ? (
                          <CheckCircle
                            color='success'
                            fontSize='inherit'
                          />
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell
                        padding='checkbox'
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.is_active ? (
                          <CheckCircle
                            color='success'
                            fontSize='inherit'
                          />
                        ) : (
                          <Cancel
                            color='error'
                            fontSize='inherit'
                          />
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {formatDate(row.last_login)}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {formatDate(row.date_joined)}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default UsersDataTable

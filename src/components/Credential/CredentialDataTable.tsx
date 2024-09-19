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
  Tooltip,
  Chip,
  Stack,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ForwardIcon from '@mui/icons-material/Forward'
import GroupsIcon from '@mui/icons-material/Groups'
import LockResetIcon from '@mui/icons-material/LockReset'
import { getComparator, humanizeDate } from '../../helpers/common'
import {
  credentialActions,
  selectCredentialFilter,
  selectCredentialSearch,
  selectCredentialSelected,
} from '../../features/credentialSlice'
import {
  useAddCredentialFavoriteMutation,
  useDeleteCredentialFavoriteMutation,
  useGetCredentialsQuery,
} from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import useLoading from '../../hooks/useLoading'
import type { CredentialImportancyType, CredentialType } from '../../types/credential'
import type { DataTableHeaderType, OrderType } from '../../types/component'
import useLoggedInUser from '../../hooks/useLoggedInUser'

const CredentialsDataTable = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loading = useLoading()
  const loggedInUser = useLoggedInUser()
  const credentialSearch = useSelector(selectCredentialSearch)
  const credentialFilter = useSelector(selectCredentialFilter)
  const credentialSelected = useSelector(selectCredentialSelected)
  const searchCredential = (credentials: CredentialType[]) => {
    return credentials.filter(
      c =>
        (c.name && c.name.toLowerCase().includes(credentialSearch)) ||
        (c.username && c.username.toLowerCase().includes(credentialSearch)) ||
        (c.tags && c.tags.toLowerCase().includes(credentialSearch))
    )
  }
  const filterCredential = (credentials: CredentialType[]) => {
    switch (credentialFilter) {
      case 'list:all_items':
        return credentials
      case 'list:favorites':
        return credentials.filter(c => c.is_favorite)
      case 'list:owned_by_me':
        return credentials.filter(c => loggedInUser && c.created_by === loggedInUser.id)
      case 'list:shared_by_me':
        return credentials.filter(c => c.is_favorite)
      case 'list:shared_with_me':
        return credentials.filter(c => c.is_favorite)
      default:
        return credentials.filter(c => c.folder === _.toNumber(credentialFilter))
    }
  }
  const filterOrSearchCredentials = (credentials: CredentialType[]) => {
    if (credentialSearch && credentialSearch !== '') return searchCredential(credentials)
    else return filterCredential(credentials)
  }
  const { credentials, credentialsIsLoading } = useGetCredentialsQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      credentialsIsLoading: isLoading,
      credentials: (data && filterOrSearchCredentials(data)) ?? [],
    }),
  })
  const [addFavoritre, { isLoading: addFavoriteIsLoading }] = useAddCredentialFavoriteMutation()
  const [delFavoritre, { isLoading: delFavoriteIsLoading }] = useDeleteCredentialFavoriteMutation()
  const [order, setOrder] = React.useState<OrderType>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof CredentialType>('id')
  const headers: DataTableHeaderType[] = [
    {
      id: 'id',
      label: 'ID',
      type: 'string',
    },
    {
      id: 'name',
      label: 'Name',
      type: 'string',
    },
    {
      id: 'username',
      label: 'Username',
      type: 'string',
    },
    {
      id: 'ip',
      label: 'IP',
      type: 'string',
    },
    {
      id: 'uri',
      label: 'URI',
      type: 'string',
    },
    {
      id: 'modified_at',
      label: 'Modified',
      type: 'string',
    },
  ]

  const Importancy = ({ level }: { level: CredentialImportancyType }) => {
    let ImportancyIcon
    switch (level) {
      case 'HIGH':
        ImportancyIcon = (
          <ForwardIcon
            color='error'
            sx={{
              fontSize: '1.2rem',
              transform: 'rotateZ(270deg)',
            }}
          />
        )
        break
      case 'MEDIUM':
        ImportancyIcon = (
          <ForwardIcon
            color='warning'
            sx={{
              fontSize: '1.2rem',
            }}
          />
        )
        break
      case 'LOW':
        ImportancyIcon = (
          <ForwardIcon
            color='success'
            sx={{
              fontSize: '1.2rem',
              transform: 'rotateZ(90deg)',
            }}
          />
        )
        break
    }
    return <Tooltip title={`${level} importancy`}>{ImportancyIcon}</Tooltip>
  }

  const handleOnSort = (e: React.MouseEvent<unknown>, property: keyof CredentialType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: keyof CredentialType) => (e: React.MouseEvent<unknown>) => {
    handleOnSort(e, property)
  }

  const handleOnSelect = (e: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = credentialSelected.indexOf(id)
    let newSelected: string[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(credentialSelected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(credentialSelected.slice(1))
    } else if (selectedIndex === credentialSelected.length - 1) {
      newSelected = newSelected.concat(credentialSelected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        credentialSelected.slice(0, selectedIndex),
        credentialSelected.slice(selectedIndex + 1)
      )
    }
    dispatch(credentialActions.setSelected(newSelected))
  }

  const handleOnSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = credentials.map(n => _.toString(n.id))
      dispatch(credentialActions.setSelected(newSelected))
      return
    }
    dispatch(credentialActions.setSelected([]))
  }

  const handleOnFavorite = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    try {
      if (e.target.checked) {
        await addFavoritre(id).unwrap()
      } else {
        await delFavoritre(id).unwrap()
      }
      openSnackbar({
        severity: 'success',
        message: 'Set favorite successfully.',
      })
    } catch {
      openSnackbar({
        severity: 'error',
        message: 'Set favorite failed.',
      })
    }
  }

  const isSelected = (id: string) => credentialSelected.indexOf(id) !== -1
  const numFavorited = credentials.filter(item => item.is_favorite == true).length

  React.useEffect(() => {
    credentialsIsLoading || addFavoriteIsLoading || delFavoriteIsLoading ? loading(true) : loading(false)
  }, [credentialsIsLoading, addFavoriteIsLoading, delFavoriteIsLoading])

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
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size='small'
          >
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    color='primary'
                    indeterminate={credentialSelected.length > 0 && credentialSelected.length < credentials.length}
                    checked={credentials.length > 0 && credentialSelected.length === credentials.length}
                    onChange={handleOnSelectAll}
                  />
                </TableCell>
                <TableCell padding='checkbox'>
                  <Checkbox
                    icon={<StarBorderIcon />}
                    checkedIcon={<StarIcon color='action' />}
                    indeterminateIcon={<StarHalfIcon color='action' />}
                    color='primary'
                    indeterminate={numFavorited > 0 && numFavorited < credentials.length}
                    checked={credentials.length > 0 && numFavorited === credentials.length}
                  />
                </TableCell>
                {headers.map(header => (
                  <TableCell
                    key={header.id}
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
                <TableCell padding='checkbox'></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {credentials
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
                        padding='checkbox'
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        <Checkbox
                          icon={<StarBorderIcon />}
                          checkedIcon={<StarIcon color='action' />}
                          color='primary'
                          checked={row.is_favorite}
                          onChange={event => handleOnFavorite(event, row.id)}
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
                        {row.name}
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
                        {row.ip}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {row.uri}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                      >
                        {humanizeDate(row.modified_at)}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: 0,
                          fontSize: '.5rem',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Chip
                            variant='outlined'
                            sx={{
                              '& .MuiChip-label': {
                                display: 'flex',
                                alignItems: 'center',
                              },
                            }}
                            label={
                              <Stack
                                direction='row'
                                spacing={0.1}
                                alignItems='center'
                              >
                                <Importancy level={row.importancy} />
                                <Tooltip title={row.is_public ? 'Public' : 'Private'}>
                                  <GroupsIcon color={row.is_public ? 'primary' : 'disabled'} />
                                </Tooltip>
                                <Tooltip
                                  title={
                                    row.auto_genpass
                                      ? 'Auto generate password is active'
                                      : 'Auto generate password is not active'
                                  }
                                >
                                  <LockResetIcon color={row.auto_genpass ? 'primary' : 'disabled'} />
                                </Tooltip>
                              </Stack>
                            }
                          />
                        </Box>
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

export default CredentialsDataTable

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
  Stack,
  IconButton,
  Chip,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { getComparator } from '../../helpers/common'
import {
  credentialActions,
  selectCredentialFilter,
  selectCredentialSearch,
  selectCredentialSelected,
} from '../../features/credentialSlice'
import {
  useAddCredentialFavoriteMutation,
  useDeleteCredentialFavoriteMutation,
  useGetCredentialSharesQuery,
  useGetCredentialsQuery,
  useLazyGetCredentialSecretByIdQuery,
} from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import useLoading from '../../hooks/useLoading'
import type { CredentialType } from '../../types/credential'
import type { DataTableHeaderType, OrderType } from '../../types/component'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { FileCopy, Visibility } from '@mui/icons-material'
import Share from '@mui/icons-material/Share'

const CredentialsDataTable = () => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const loading = useLoading()
  const loggedInUser = useLoggedInUser()
  const credentialSearch = useSelector(selectCredentialSearch)
  const credentialFilter = useSelector(selectCredentialFilter)
  const credentialSelected = useSelector(selectCredentialSelected)
  const { data: credentialShares, isLoading: credentialSharesIsLoading } = useGetCredentialSharesQuery(undefined, {
    refetchOnFocus: true,
  })
  const [trigger, { data: credentialSecret, isLoading: credentialSecretIsLoading }] =
    useLazyGetCredentialSecretByIdQuery()
  const [selectedCredential, setSelectedCredential] = React.useState<number>()
  const [copyToClipboard, setCopyToClipboard] = React.useState<boolean>(false)
  const [showSecret, setShowSecret] = React.useState<boolean>(false)
  const headers: DataTableHeaderType[] = [
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
      id: 'tags',
      label: 'Tags',
      type: 'string',
    },
  ]
  const searchCredential = (credentials: CredentialType[]) => {
    let searchField = ''
    let searchValue = credentialSearch
    if (searchValue.startsWith('=')) {
      const phrase = credentialSearch.replace('=', '').split(':')
      if (phrase.length === 2) {
        searchField = phrase[0]
        searchValue = phrase[1]
      }
    }
    switch (searchField) {
      case 'name':
        return credentials.filter(c => c.name && c.name.toLowerCase().includes(searchValue))
      case 'username':
        return credentials.filter(c => c.username && c.username.toLowerCase().includes(searchValue))
      case 'ip':
        return credentials.filter(c => c.ip && c.ip.includes(searchValue))
      case 'tags':
        return credentials.filter(c => c.tags.split(',').every(t => searchValue.split(',').includes(t)))
      default:
        return credentials.filter(
          c =>
            (c.name && c.name.toLowerCase().includes(credentialSearch)) ||
            (c.username && c.username.toLowerCase().includes(credentialSearch)) ||
            (c.ip && c.ip.includes(searchValue)) ||
            (c.tags && c.tags.toLowerCase().includes(credentialSearch))
        )
    }
  }

  const filterCredential = (credentials: CredentialType[]) => {
    switch (credentialFilter) {
      case 'list:all_items':
        return credentials
      case 'folders':
        return credentials
      case 'list:favorites':
        return credentials.filter(c => c.is_favorite)
      case 'list:owned_by_me':
        return credentials.filter(c => loggedInUser && c.created_by === loggedInUser.id)
      case 'list:shared_by_me':
        const sharedByMeIds = credentialShares?.filter(s => s.shared_by === loggedInUser?.id).map(s => s.credential)
        return credentials.filter(c => sharedByMeIds?.includes(c.id))
      case 'list:shared_with_me':
        const sharedWithMeIds = credentialShares?.filter(s => s.shared_with === loggedInUser?.id).map(s => s.credential)
        return credentials.filter(c => sharedWithMeIds?.includes(c.id))
      default:
        return credentials.filter(c => c.folder === _.toNumber(credentialFilter))
    }
  }

  const filterOrSearchCredentials = (credentials: CredentialType[]) => {
    if (credentialSearch && credentialSearch !== '') return searchCredential(credentials)
    else return filterCredential(credentials)
  }

  const { credentials, credentialsIsLoading } = useGetCredentialsQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => {
      document.getElementById('datatable')?.scrollIntoView()
      return {
        credentialsIsLoading: isLoading,
        credentials: (data && filterOrSearchCredentials(data)) ?? [],
      }
    },
  })

  const [addFavoritre, { isLoading: addFavoriteIsLoading }] = useAddCredentialFavoriteMutation()
  const [delFavoritre, { isLoading: delFavoriteIsLoading }] = useDeleteCredentialFavoriteMutation()
  const [order, setOrder] = React.useState<OrderType>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof CredentialType>('name')

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

  const showSecretDialog = () => {
    setShowSecret(false)
    if (credentialSecret)
      if (credentialSecret.length > 0) {
        dispatch(credentialActions.setSecret(credentialSecret))
        dispatch(credentialActions.setShowForms({ showSecret: true }))
      } else {
        openSnackbar({
          severity: 'info',
          message: 'This credential does not have any secret.',
        })
      }
  }

  let timer: any = null
  const copyToClipboardFn = () => {
    setCopyToClipboard(false)
    if (credentialSecret)
      if (credentialSecret.length > 0) {
        navigator.clipboard.writeText(credentialSecret[0].password)
        openSnackbar({
          severity: 'success',
          message: 'Secret copied successfully. it will remove from clipbaord after 30s!',
        })
        clearTimeout(timer)
        timer = setTimeout(() => {
          navigator.clipboard.writeText('').catch(e => {})
        }, 30000)
      } else {
        openSnackbar({
          severity: 'error',
          message: 'This credential does not have any secret.',
        })
      }
    return timer
  }

  const handleOnShowSecret = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    if (selectedCredential !== id) setSelectedCredential(id)
    else showSecretDialog()
    setShowSecret(true)
  }

  const handleOnCopySecret = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    if (selectedCredential !== id) setSelectedCredential(id)
    else copyToClipboardFn()
    setCopyToClipboard(true)
  }

  const isShared = (credentialId: number) => {
    const sharedIds = credentialShares?.map(s => s.credential)
    return sharedIds?.includes(credentialId)
  }
  const isSelected = (id: string) => credentialSelected.indexOf(id) !== -1
  const numFavorited = credentials.filter(item => item.is_favorite === true).length

  React.useEffect(() => {
    loading(
      credentialsIsLoading ||
        addFavoriteIsLoading ||
        delFavoriteIsLoading ||
        credentialSharesIsLoading ||
        credentialSecretIsLoading
    )
  }, [
    loading,
    credentialsIsLoading,
    addFavoriteIsLoading,
    delFavoriteIsLoading,
    credentialSharesIsLoading,
    credentialSecretIsLoading,
  ])

  React.useEffect(() => {
    if (selectedCredential) trigger(selectedCredential)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCredential])

  React.useEffect(() => {
    let timer: any = null

    if (showSecret) {
      showSecretDialog()
    } else if (copyToClipboard) {
      timer = copyToClipboardFn()
    }
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentialSecret])

  return (
    <Box
      id='datatable'
      sx={{
        width: '100%',
        height: 'calc(100vh - 300px)',
        overflowY: 'auto',
      }}
    >
      <TableContainer>
        <Table
          stickyHeader
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
              <TableCell padding='checkbox'>#</TableCell>
              <TableCell padding='checkbox' />
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
              <TableCell padding='checkbox' />
            </TableRow>
          </TableHead>

          <TableBody>
            {credentials
              .slice()
              .sort(getComparator(order, orderBy))
              .map((row, index) => {
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
                      padding='checkbox'
                      sx={{
                        borderBottom: 0,
                      }}
                    >
                      {isShared(row.id) ? (
                        <Share
                          fontSize='inherit'
                          sx={{ marginTop: '5px' }}
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
                      {index}
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
                      <Stack
                        direction='row'
                        spacing={0.5}
                      >
                        {row.tags &&
                          row.tags.split(',').map(t => {
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
                    </TableCell>
                    <TableCell
                      padding='checkbox'
                      sx={{
                        borderBottom: 0,
                      }}
                    >
                      <Stack direction='row'>
                        <Tooltip title='Show secret'>
                          <IconButton
                            aria-label='reveal'
                            size='small'
                            color='primary'
                            onClick={event => handleOnShowSecret(event, row.id)}
                          >
                            <Visibility fontSize='inherit' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Copy to clipboard'>
                          <IconButton
                            aria-label='copy'
                            size='small'
                            color='primary'
                            onClick={event => handleOnCopySecret(event, row.id)}
                          >
                            <FileCopy fontSize='inherit' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CredentialsDataTable

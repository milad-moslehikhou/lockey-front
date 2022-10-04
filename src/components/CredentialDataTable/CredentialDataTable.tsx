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
  Paper,
  Checkbox,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ForwardIcon from '@mui/icons-material/Forward'
import { getComparator, humanizeDate } from '../../helpers/common'
import type { CredentialType } from '../../types/credential'
import type { DataTableHeaderType, OrderType } from '../../types/component'
import { selectCredentials, setCredentials } from '../../features/credential/credentialSlice'
import { useAddCredentialFavoriteMutation, useDeleteCredentialFavoriteMutation } from '../../features/api/apiSlice'


const CredentialsDataTable = () => {
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const [addFavoritre, { isLoading: addFavoriteIsLoading }] = useAddCredentialFavoriteMutation()
  const [delFavoritre, { isLoading: delFavoriteIsLoading }] = useDeleteCredentialFavoriteMutation()
  const [order, setOrder] = React.useState<OrderType>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof CredentialType>('id')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const headers: DataTableHeaderType[] = [
    {
      id: 'id',
      label: 'ID',
      type: 'string',
    },
    {
      id: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      id: 'username',
      label: 'Username',
      type: 'string'
    },
    {
      id: 'ip',
      label: 'IP',
      type: 'string'
    },
    {
      id: 'uri',
      label: 'URI',
      type: 'string'
    },
    {
      id: 'modified_at',
      label: 'Modified',
      type: 'string'
    }
  ]

  const handleOnSort = (event: React.MouseEvent<unknown>, property: keyof CredentialType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property: keyof CredentialType) => (event: React.MouseEvent<unknown>) => {
    handleOnSort(event, property)
  }

  const handleOnSelect = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const handleOnSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = credentials.map((n) => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleOnFavorite = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (event.target.checked) {
      addFavoritre(id)
      // eslint-disable-next-line camelcase
      dispatch(setCredentials(credentials.map(c => c.id == id ? { ...c, is_favorite: true } : c)))
    } else {
      delFavoritre(id)
      // eslint-disable-next-line camelcase
      dispatch(setCredentials(credentials.map(c => c.id == id ? { ...c, is_favorite: false } : c)))
    }
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1
  const numFavorited = credentials.filter(item => item.is_favorite == true).length
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    >
      <Paper sx={{
        width: '100%',
        height: '100%'
      }}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < credentials.length}
                    checked={credentials.length > 0 && selected.length === credentials.length}
                    onChange={handleOnSelectAll}
                  />
                </TableCell>
                <TableCell padding="checkbox">
                  <Checkbox
                    icon={<StarBorderIcon />}
                    checkedIcon={<StarIcon color='action' />}
                    indeterminateIcon={<StarHalfIcon color='action' />}
                    color="primary"
                    indeterminate={numFavorited > 0 && numFavorited < credentials.length}
                    checked={credentials.length > 0 && numFavorited === credentials.length}
                  />
                </TableCell>
                {headers.map((header) => (
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
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {credentials.slice().sort(getComparator(order, orderBy)).map((row) => {
                const itemIsSelected = isSelected(_.toString(row.id))

                return (
                  <TableRow
                    key={row.id}
                    role="checkbox"
                    aria-checked={itemIsSelected}
                    tabIndex={-1}
                    selected={itemIsSelected}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={itemIsSelected}
                        onClick={(event) => handleOnSelect(event, _.toString(row.id))}
                      />
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Checkbox
                        icon={<StarBorderIcon />}
                        checkedIcon={<StarIcon color='action' />}
                        color="primary"
                        checked={row.is_favorite}
                        onChange={(event) => handleOnFavorite(event, row.id)}
                      />
                    </TableCell>

                    <TableCell>
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.importancy === 'HIGH' ? <ForwardIcon
                          sx={{ fontSize: '1.2rem', transform: 'rotateZ(270deg)' }} color='error' /> : ''}
                        {row.importancy === 'MEDIUM' ? <ForwardIcon
                          sx={{ fontSize: '1.2rem' }} color='warning' /> : ''}
                        {row.importancy === 'LOW' ? <ForwardIcon
                          sx={{ fontSize: '1.2rem', transform: 'rotateZ(90deg)' }} color='success' /> : ''}
                        {row.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {row.username}
                    </TableCell>
                    <TableCell>
                      {row.ip}
                    </TableCell>
                    <TableCell>
                      {row.uri}
                    </TableCell>
                    <TableCell>
                      {humanizeDate(row.modified_at)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default CredentialsDataTable
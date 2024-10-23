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
import { getComparator } from '../../helpers/common'
import { groupActions, selectGroupSearch, selectGroupSelected } from '../../features/groupSlice'
import useLoading from '../../hooks/useLoading'
import type { OrderType } from '../../types/component'
import { useGetGroupsQuery } from '../../features/apiSlice'
import { GroupType } from '../../types/group'

interface DataTableHeaderType {
  id: string
  label: string
  type: 'string' | 'number' | 'boolean'
}

const GroupsDataTable = () => {
  const dispatch = useDispatch()
  const loading = useLoading()
  const groupSearch = useSelector(selectGroupSearch)
  const groupSelected = useSelector(selectGroupSelected)
  const searchGroup = (groups: GroupType[]) => {
    return groups.filter(g => g.name && g.name.toLowerCase().includes(groupSearch))
  }
  const filterOrSearchGroups = (groups: GroupType[]) => {
    if (groupSearch && groupSearch !== '') return searchGroup(groups)
    else return groups
  }
  const { groups, groupsIsLoading } = useGetGroupsQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      groupsIsLoading: isLoading,
      groups: (data && filterOrSearchGroups(data)) ?? [],
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
      id: 'name',
      label: 'Name',
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
    const selectedIndex = groupSelected.indexOf(id)
    let newSelected: string[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(groupSelected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(groupSelected.slice(1))
    } else if (selectedIndex === groupSelected.length - 1) {
      newSelected = newSelected.concat(groupSelected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(groupSelected.slice(0, selectedIndex), groupSelected.slice(selectedIndex + 1))
    }
    dispatch(groupActions.setSelected(newSelected))
  }

  const handleOnSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = groups.map(n => _.toString(n.id))
      dispatch(groupActions.setSelected(newSelected))
      return
    }
    dispatch(groupActions.setSelected([]))
  }

  const isSelected = (id: string) => groupSelected.indexOf(id) !== -1

  React.useEffect(() => {
    loading(groupsIsLoading)
  }, [loading, groupsIsLoading])

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 300px)',
        overflowY: 'auto',
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
                  indeterminate={groupSelected.length > 0 && groupSelected.length < groups.length}
                  checked={groups.length > 0 && groupSelected.length === groups.length}
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
            {groups
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
                      {row.name}
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

export default GroupsDataTable

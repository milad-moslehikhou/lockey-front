import * as React from 'react'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FormDialog from '../FormDialog/FormDialog'
import {
  useEditCredentialGrantMutation,
  useGetCredentialGrantsByIdQuery,
  useGetGroupsQuery,
  useGetUsersQuery,
} from '../../features/apiSlice'
import useSnackbar from '../../hooks/useSnackbar'
import { credentialActions } from '../../features/credentialSlice'
import { handleError } from '../../helpers/form'
import { CredentialType, CredentialGrantType } from '../../types/credential'

interface CredentialGrantFormProps {
  credential: CredentialType
}

interface CredentialGrantFormType extends CredentialGrantType {}

const CredentialGrantForm = ({ credential }: CredentialGrantFormProps) => {
  const dispatch = useDispatch()
  const openSnackbar = useSnackbar()
  const [group, setGroup] = React.useState<number>(-1)
  const [user, setUser] = React.useState<number>(-1)
  const [action, setAction] = React.useState<'VIEW' | 'MODIFY'>('VIEW')
  const [grants, setGrants] = React.useState<CredentialGrantType[]>([])
  const { data: groups, isLoading: groupsIsLoading } = useGetGroupsQuery()
  const { data: users, isLoading: usersIsLoading } = useGetUsersQuery()
  const { data: credentialGrants } = useGetCredentialGrantsByIdQuery(credential.id)
  const [editCredentialGrant, { isLoading: editCredentialGrantIsLoading }] = useEditCredentialGrantMutation()
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Partial<CredentialGrantFormType>>({
    defaultValues: {},
  })

  const handleCloseForm = () => {
    dispatch(credentialActions.setShowForms({ grant: false }))
  }

  const handleAddItem = () => {
    const addedItem = grants.find(g => g.group === group && g.user === user)
    if (addedItem) {
      openSnackbar({
        severity: 'error',
        message: `This grant is already in the list.`,
      })
      return
    }
    if (group === -1 && user === -1) {
      openSnackbar({
        severity: 'error',
        message: `You must select at least a group or user.`,
      })
      return
    }

    const tempGrant: any = {
      credential: credential.id,
      action: action,
    }
    if (group !== -1) tempGrant['group'] = group
    if (user !== -1) tempGrant['user'] = user

    setGrants([...grants, tempGrant])
  }
  const handleOnDeleteRow = (group: number | undefined, user: number | undefined) => {
    const filteredGrants = grants.filter(g => !(g.group === group && g.user === user))
    setGrants(filteredGrants)
  }
  const onSubmit = async () => {
    const data: Partial<CredentialGrantType>[] = []
    grants.forEach(g => {
      data.push({
        credential: credential.id,
        group: g.group,
        user: g.user,
        action: g.action,
      })
    })

    try {
      await editCredentialGrant({ id: credential.id, data }).unwrap()
      handleCloseForm()
      dispatch(credentialActions.setSelected([]))
      openSnackbar({
        severity: 'success',
        message: `Credential with id ${credential.id} grant successfully.`,
      })
    } catch (e) {
      const msg = handleError(e, setError)
      if (msg) {
        openSnackbar({
          severity: 'error',
          message: msg,
        })
      }
    }
  }

  React.useEffect(() => {
    credentialGrants && setGrants(credentialGrants)
  }, [credentialGrants])

  React.useEffect(() => {
    if (errors) {
      openSnackbar({
        severity: 'error',
        message: 'Something has wrong.',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])

  const form = (
    <>
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'end',
        }}
      >
        <FormControl sx={{ margin: 1, minWidth: 140 }}>
          <InputLabel id='groupLabel'>Group</InputLabel>
          <Select
            labelId='groupLabel'
            id='group'
            label='Group'
            variant='standard'
            value={group}
            disabled={user !== -1}
            onChange={event => setGroup(_.toNumber(event.target.value))}
          >
            <MenuItem value={-1}>&nbsp;</MenuItem>
            {groups &&
              groups.map(g => (
                <MenuItem
                  key={g.id}
                  value={g.id}
                >
                  {g.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Typography sx={{ margin: '0 6px' }}>OR</Typography>
        <FormControl sx={{ margin: 1, minWidth: 140 }}>
          <InputLabel id='userLabel'>User</InputLabel>
          <Select
            labelId='userLabel'
            id='user'
            label='User'
            variant='standard'
            value={user}
            disabled={group !== -1}
            onChange={event => setUser(_.toNumber(event.target.value))}
          >
            <MenuItem value={-1}>&nbsp;</MenuItem>
            {users &&
              users.map(u => (
                <MenuItem
                  key={u.id}
                  value={u.id}
                >
                  {u.username}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl sx={{ margin: 1, minWidth: 140 }}>
          <InputLabel id='actionLabel'>Action</InputLabel>
          <Select
            labelId='actionLabel'
            id='action'
            label='Action'
            variant='standard'
            value={action}
            onChange={event => setAction(event.target.value === 'VIEW' ? 'VIEW' : 'MODIFY')}
          >
            <MenuItem value='VIEW'>View</MenuItem>
            <MenuItem value='MODIFY'>Modify</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant='text'
          onClick={handleAddItem}
        >
          ADD
        </Button>
      </div>

      <TableContainer
        component={Paper}
        sx={{ marginTop: '32px' }}
      >
        <Table
          aria-label='grants-table'
          size='small'
        >
          <TableHead>
            <TableRow>
              <TableCell>Group</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell padding='checkbox'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grants.map(row => (
              <TableRow
                key={`${row.group}${row.user}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component='th'
                  scope='row'
                >
                  {groups && groups.find(g => g.id === row.group)?.name}
                </TableCell>
                <TableCell>{users && users.find(u => u.id === row.user)?.username}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell padding='checkbox'>
                  <IconButton
                    aria-label='delete'
                    size='small'
                    color='error'
                    onClick={() => handleOnDeleteRow(row.group, row.user)}
                  >
                    <Tooltip title='Delete Item'>
                      <DeleteIcon fontSize='inherit'></DeleteIcon>
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )

  return (
    <FormDialog
      title='Grant Credential'
      form={form}
      submitLable='Apply'
      isLoading={groupsIsLoading || usersIsLoading || editCredentialGrantIsLoading}
      handleSubmit={handleSubmit(onSubmit)}
      handleCloseForm={handleCloseForm}
    />
  )
}

export default CredentialGrantForm

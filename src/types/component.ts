import { AlertColor } from '@mui/lab'
import { CredentialType } from './credential'


export type AlertStateType = {
  open?: boolean,
  severity?: AlertColor,
  message?: string,
}

export type SnackbarContextType = {
  openSnackbar: ({ severity, message }: AlertStateType) => void,
}

export type OrderType = 'asc' | 'desc'

export type BreadcrumbsType = {
  id: string,
  text: string,
}

export type BreadcrumbsStateType = {
  path: BreadcrumbsType[]
}

export type DataTableHeaderType = {
  id: keyof CredentialType,
  label: string,
  type: 'string' | 'number'
}
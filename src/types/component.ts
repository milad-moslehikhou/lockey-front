import { AlertColor } from '@mui/lab'
import { CredentialType } from './credential'

export type AlertStateType = {
  open?: boolean
  severity?: AlertColor
  message?: string
}

export type SnackbarContextType = {
  openSnackbar: ({ severity, message }: AlertStateType) => void
}

export type LoadingContextType = {
  showLoading: (show: boolean) => void
}

export type OrderType = 'asc' | 'desc'

export type DataTableHeaderType = {
  id: keyof CredentialType
  label: string
  type: 'string' | 'number'
}

export type FormsStateType = {
  add?: boolean
  edit?: boolean
  delete?: boolean
  move?: boolean
  detail?: boolean
  share?: boolean
}

export type BreadcrumbsItemType = {
  id: string
  name: string
}

export type AutoCompleteFieldOptionsType = {
  label: string
  value: any
}

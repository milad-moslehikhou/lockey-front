import { AutoCompleteFieldOptionsType, FormsStateType } from './component'

export type UserType = {
  id: number
  username: string
  password: string
  first_name: string
  last_name: string
  avatar: string | File
  is_superuser: boolean
  is_active: boolean
  groups: number[] | AutoCompleteFieldOptionsType[]
  user_permissions: Array<any>
  last_login: Date
  date_joined: Date
}

export type UserStateType = {
  selected: string[]
  forms: FormsStateType
  search: string
  filter: string
}

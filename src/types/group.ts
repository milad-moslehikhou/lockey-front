import { AutoCompleteFieldOptionsType, FormsStateType } from './component'

export type GroupType = {
  id: number
  name: string
  permissions: number[] | AutoCompleteFieldOptionsType[]
}

export type GroupStateType = {
  selected: string[]
  forms: FormsStateType
  search: string
  filter: string
}

export interface GroupMemberType extends GroupType {
  members: number[] | AutoCompleteFieldOptionsType[]
}

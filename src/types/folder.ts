import { FormsStateType } from './component'

export type FolderType = {
  id: number
  name: string
  color?: string
  is_public?: boolean
  parent?: number | null
  user: number
}

export type FolderStateType = {
  selected: string
  hovered: number
  forms: FormsStateType
}

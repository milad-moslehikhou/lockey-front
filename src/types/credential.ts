import { FormsStateType } from './component'

export type CredentialImportancyType = 'HIGH' | 'MEDIUM' | 'LOW'

export type CredentialType = {
  id: number
  name: string
  username: string
  ip: string | null
  uri: string | null
  importancy: CredentialImportancyType
  is_public: boolean
  is_favorite: boolean
  auto_genpass: boolean
  tags: string
  description: string
  folder: number | null
  created_by: number
  created_at: Date
  modified_by: number
  modified_at: Date
  team: number
}

export type CredentialStateType = {
  selected: string[]
  forms: FormsStateType
  search: string
  filter: string
}

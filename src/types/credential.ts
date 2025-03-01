import { FormsStateType } from './component'

export type CredentialImportancyType = 'HIGH' | 'MEDIUM' | 'LOW'

export type CredentialType = {
  id: number
  name: string
  username: string
  ip: string | null
  uri: string | null
  importancy: CredentialImportancyType
  is_favorite: boolean
  auto_genpass: boolean
  tags: string
  description: string
  folder: number | null
  created_by: number
  created_at: Date
  modified_by: number
  modified_at: Date
}

export type CredentialStateType = {
  selected: string[]
  forms: FormsStateType
  search: string
  filter: string
  secret: CredentialSecretType[]
}

export type CredentialSecretType = {
  id: number
  credential: number
  password: string
  expire_at: Date
  created_by: number
  created_at: Date
}

export type CredentialGrantType = {
  id: number
  credential: number
  group?: number
  user?: number
  action: 'VIEW' | 'MODIFY'
}

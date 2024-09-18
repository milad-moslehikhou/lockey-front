export type UserType = {
  id: number
  username: string
  is_superuser: boolean
  is_active: boolean
  team: number
  groups: Array<number>
  user_permissions: Array<any>
  last_login: string
  date_joined: string
  profile: UserProfileType
}

export type UserProfileType = {
  first_name: string
  last_name: string
  avatar: string
}

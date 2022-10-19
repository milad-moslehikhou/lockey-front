import { UserType } from './user'


export type LoginRequestType = {
  username: string,
  password: string
}

export type LoginResponseType = {
  user: UserType
  token: string
  expiry: Date
}

export type AuthStateType = {
  user: UserType | null
  token: {
    token: string,
    expiry: Date
  } | null
}
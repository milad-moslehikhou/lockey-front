import { User } from './user'


export type LoginResponseType = {
  user: User
  token: string
  expiry: Date
}

export type AuthStateType = {
  user: User | null
  token: {
    token: string,
    expiry: Date
  } | null
}
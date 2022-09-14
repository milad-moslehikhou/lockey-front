import { User } from './user'

export type UserResponse = {
  user: User
  token: string
}

export type LoginRequest = {
  username: string
  password: string
}

export type AuthState = {
  user: User | null
  token: string | null
}
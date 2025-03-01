import { UserType } from './user'

export type LoginRequestType = {
  username: string
  password: string
}

export type LoginResponseType = {
  user: UserType
  otp_session: string
}

export type Enable2faRequestType = {
  otp_session: string | null
}

export type Enable2faResponseType = {
  otp_secret: string
  otp_uri: string
}

export type Verify2faRequestType = {
  otp_session: string
  otp_code: string
}

export type Verify2faResponseType = {
  access_token: string
}

export type AuthStateType = {
  user: UserType | null
  otp_session: string | null
  token: string | null
}

export type AuthType = {
  user: UserType | null
  otp_session: string | null
  token: string | null
  state: string | null
}

export type AuthContextType = {
  auth: AuthType
  setAuth: (auth: AuthType) => void
}

import * as React from 'react'
import type { AuthContextType, AuthType } from '../types/auth'

const initState = {
  user: null,
  token: null,
  expiry: null,
}

const AuthContext = React.createContext<AuthContextType>({
  auth: initState,
  setAuth: () => {},
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuthState] = React.useState<AuthType>(() => {
    let authState = initState as AuthType
    const authString = sessionStorage.getItem('auth')
    if (authString) {
      const auth = JSON.parse(authString) as AuthType
      const now = new Date()
      const exp = new Date(auth.expiry || '')
      if (exp < now) sessionStorage.removeItem('auth')
      else authState = auth
    }
    return authState
  })

  const setAuth = (auth: AuthType) => {
    sessionStorage.setItem('auth', JSON.stringify(auth))
    setAuthState(auth)
  }

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

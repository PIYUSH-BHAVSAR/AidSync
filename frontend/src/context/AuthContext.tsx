import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, NGO } from '../types'

interface AuthState {
  user: User | null
  ngo: NGO | null
  token: string | null
}

interface AuthContextType extends AuthState {
  setAuth: (user: User, ngo: NGO, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('aidsync_auth')
    return stored ? JSON.parse(stored) : { user: null, ngo: null, token: null }
  })

  const setAuth = (user: User, ngo: NGO, token: string) => {
    const state = { user, ngo, token }
    setAuthState(state)
    localStorage.setItem('aidsync_auth', JSON.stringify(state))
  }

  const logout = () => {
    setAuthState({ user: null, ngo: null, token: null })
    localStorage.removeItem('aidsync_auth')
  }

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

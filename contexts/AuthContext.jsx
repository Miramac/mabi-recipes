'use client'

import { createContext, useContext } from 'react'
import { authClient } from '../lib/authClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, isPending: authLoading } = authClient.useSession()
  const user = session?.user ?? null

  async function signIn(emailOrUsername, password) {
    let email = emailOrUsername
    if (!emailOrUsername.includes('@')) {
      const res = await fetch('/api/auth/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: emailOrUsername }),
      })
      if (!res.ok) throw new Error('User not found')
      const data = await res.json()
      email = data.email
    }
    const { error } = await authClient.signIn.email({ email, password })
    if (error) throw new Error(error.message ?? 'Login failed')
  }

  async function signUp(name, email, password) {
    const res = await fetch('/api/auth/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name }),
    })
    if (res.ok) throw new Error('USERNAME_TAKEN')
    const { error } = await authClient.signUp.email({ name, email, password })
    if (error) throw new Error(error.message ?? 'Registration failed')
  }

  async function signOut() {
    await authClient.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

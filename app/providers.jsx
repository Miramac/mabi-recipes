'use client'

import { LangProvider } from '../contexts/LangContext'
import { AuthProvider } from '../contexts/AuthContext'
import { RecipesProvider } from '../contexts/RecipesContext'

export function Providers({ children }) {
  return (
    <LangProvider>
      <AuthProvider>
        <RecipesProvider>
          {children}
        </RecipesProvider>
      </AuthProvider>
    </LangProvider>
  )
}

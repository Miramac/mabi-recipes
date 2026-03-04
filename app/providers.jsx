'use client'

import { LangProvider } from '../contexts/LangContext'
import { RecipesProvider } from '../contexts/RecipesContext'

export function Providers({ children }) {
  return (
    <LangProvider>
      <RecipesProvider>
        {children}
      </RecipesProvider>
    </LangProvider>
  )
}

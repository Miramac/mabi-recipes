'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LangContext = createContext({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem('mabi-lang')
    if (stored) setLang(stored)
    else if (process.env.NEXT_PUBLIC_DEFAULT_LANG) setLang(process.env.NEXT_PUBLIC_DEFAULT_LANG)
  }, [])

  useEffect(() => {
    localStorage.setItem('mabi-lang', lang)
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../lib/i18n'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputClass = 'w-full px-3 py-2.5 pr-10 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04]'
  const labelClass = 'block text-sm font-medium text-stone-700 mb-1.5'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== passwordConfirm) {
      setError(t(lang, 'errorPasswordMismatch'))
      return
    }
    setLoading(true)
    try {
      await signUp(name, email, password)
      router.push('/')
    } catch (err) {
      if (err.message === 'USERNAME_TAKEN') setError(t(lang, 'errorUsernameTaken'))
      else if (err.message.toLowerCase().includes('user already exists')) setError(t(lang, 'errorEmailTaken'))
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function PasswordToggle() {
    return (
      <button
        type="button"
        onClick={() => setShowPassword(v => !v)}
        aria-label={showPassword ? t(lang, 'hidePassword') : t(lang, 'showPassword')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#e85d04] transition-colors"
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">{t(lang, 'registerTitle')}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>{t(lang, 'labelName')}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04]"
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label className={labelClass}>{t(lang, 'labelEmail')}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04]"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelClass}>{t(lang, 'labelPassword')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClass}
              required
              autoComplete="new-password"
            />
            <PasswordToggle />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t(lang, 'labelPasswordConfirm')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className={inputClass}
              required
              autoComplete="new-password"
            />
            <PasswordToggle />
          </div>
        </div>
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e85d04] hover:bg-[#d04e00] text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t(lang, 'registerSubmit')}
        </button>
        <p className="text-center text-sm text-stone-500">
          <Link href="/login" className="text-[#e85d04] hover:underline">
            {t(lang, 'loginLink')}
          </Link>
        </p>
      </form>
    </div>
  )
}

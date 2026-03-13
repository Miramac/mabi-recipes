'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../lib/i18n'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputClass = 'w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04]'
  const labelClass = 'block text-sm font-medium text-stone-700 mb-1.5'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(name, email, password)
      router.push('/')
    } catch (err) {
      setError(err.message === 'USERNAME_TAKEN' ? t(lang, 'errorUsernameTaken') : err.message)
    } finally {
      setLoading(false)
    }
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
            className={inputClass}
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
            className={inputClass}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelClass}>{t(lang, 'labelPassword')}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClass}
            required
            autoComplete="new-password"
          />
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LangContext'
import { t } from '../../lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { lang } = useLang()
  const [emailOrUsername, setEmailOrUsername] = useState('')
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
      await signIn(emailOrUsername, password)
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">{t(lang, 'loginTitle')}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>{t(lang, 'labelEmailOrUsername')}</label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={e => setEmailOrUsername(e.target.value)}
            className={inputClass}
            required
            autoComplete="username"
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
            autoComplete="current-password"
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
          {t(lang, 'loginSubmit')}
        </button>
        <p className="text-center text-sm text-stone-500">
          <Link href="/register" className="text-[#e85d04] hover:underline">
            {t(lang, 'registerLink')}
          </Link>
        </p>
      </form>
    </div>
  )
}

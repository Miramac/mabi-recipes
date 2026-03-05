'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'
import { t } from '../lib/i18n'

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.432z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  )
}

export default function Layout({ children }) {
  const { lang, setLang } = useLang()
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const navLinkClass = (href, exact = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href)
    return `flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
      isActive ? 'text-[#e85d04]' : 'text-stone-400 hover:text-stone-700'
    }`
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-stone-100 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍳</span>
          <span className="text-xl font-bold text-stone-800 tracking-tight">{t(lang, 'appName')}</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-[#e85d04]' : 'text-stone-500 hover:text-stone-800'}`}
          >
            {t(lang, 'allRecipes')}
          </Link>
          <Link
            href="/recipes/add"
            className="flex items-center gap-1.5 bg-[#e85d04] hover:bg-[#d04e00] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            {t(lang, 'addRecipe')}
          </Link>
          {user ? (
            <>
              <span className="text-sm text-stone-500">{user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors"
              >
                {t(lang, 'logoutButton')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
                {t(lang, 'loginTitle')}
              </Link>
              <Link href="/register" className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
                {t(lang, 'registerTitle')}
              </Link>
            </>
          )}
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors"
            title={lang === 'en' ? 'Auf Deutsch wechseln' : 'Switch to English'}
          >
            {lang === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}
          </button>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-100 z-10">
        <div className="flex justify-around items-center h-16 px-4">
          <Link href="/" className={navLinkClass('/', true)}>
            <HomeIcon />
            <span>{t(lang, 'navRecipes')}</span>
          </Link>
          <Link href="/recipes/add" className={navLinkClass('/recipes/add')}>
            <div className="bg-[#e85d04] rounded-full p-2 -mt-6 shadow-lg ring-4 ring-[#fafaf9]">
              <PlusIcon />
            </div>
            <span className="mt-1">{t(lang, 'navAdd')}</span>
          </Link>
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="flex flex-col items-center gap-0.5 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors"
            title={lang === 'en' ? 'Auf Deutsch wechseln' : 'Switch to English'}
          >
            <span className="text-xl">{lang === 'de' ? '🇩🇪' : '🇬🇧'}</span>
            <span>{lang === 'de' ? 'DE' : 'EN'}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

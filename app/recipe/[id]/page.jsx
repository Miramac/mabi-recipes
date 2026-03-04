'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { t, CATEGORY_KEYS } from '../../../lib/i18n'
import { useLang } from '../../../contexts/LangContext'
import { useRecipes } from '../../../contexts/RecipesContext'

const categoryColors = {
  Breakfast: 'bg-amber-100 text-amber-700',
  Lunch:     'bg-green-100 text-green-700',
  Dinner:    'bg-blue-100 text-blue-700',
  Dessert:   'bg-pink-100 text-pink-700',
  Snack:     'bg-purple-100 text-purple-700',
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { lang } = useLang()
  const { getRecipe, deleteRecipe, loading } = useRecipes()
  const recipe = getRecipe(id)

  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = sessionStorage.getItem(`checked-ing-${id}`)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })
  const [checkedSteps, setCheckedSteps] = useState(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = sessionStorage.getItem(`checked-steps-${id}`)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    sessionStorage.setItem(`checked-ing-${id}`, JSON.stringify([...checkedIngredients]))
  }, [checkedIngredients, id])

  useEffect(() => {
    sessionStorage.setItem(`checked-steps-${id}`, JSON.stringify([...checkedSteps]))
  }, [checkedSteps, id])

  function toggle(setter, i) {
    setter(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  if (!recipe) {
    if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-stone-400">Loading…</div>
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-lg font-semibold text-stone-700">{t(lang, 'recipeNotFound')}</p>
        <Link href="/" className="mt-4 inline-block text-[#e85d04] font-medium text-sm">{t(lang, 'backToRecipes')}</Link>
      </div>
    )
  }

  const categoryClass = categoryColors[recipe.category] || 'bg-stone-100 text-stone-600'
  const timeLabel = recipe.time < 60
    ? `${recipe.time} min`
    : `${Math.floor(recipe.time / 60)}h ${recipe.time % 60 ? `${recipe.time % 60}m` : ''}`

  async function handleDelete() {
    if (window.confirm(t(lang, 'deleteConfirm', recipe.title))) {
      await deleteRecipe(id)
      router.push('/')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-stone-100">
          {recipe.image
            ? <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-6xl text-stone-300">🍳</div>
          }
        </div>
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-stone-800 leading-tight">{recipe.title}</h1>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/edit/${recipe.id}`}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <EditIcon />
              {t(lang, 'edit')}
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryClass}`}>
            {t(lang, CATEGORY_KEYS[recipe.category] ?? recipe.category)}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-600">
            ⏱ {timeLabel}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 text-stone-600">
            🍽 {recipe.servings} {t(lang, 'servings')}
          </span>
        </div>

        <p className="text-stone-600 leading-relaxed mb-8">{recipe.description}</p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-stone-800 mb-3">{t(lang, 'ingredients')}</h2>
          <ul className="space-y-1">
            {recipe.ingredients.map((item, i) => {
              const checked = checkedIngredients.has(i)
              return (
                <li key={i}>
                  <button
                    onClick={() => toggle(setCheckedIngredients, i)}
                    className="w-full flex items-center gap-3 py-2 text-left rounded-xl active:bg-stone-50 transition-colors"
                  >
                    <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checked ? 'bg-[#e85d04] border-[#e85d04] text-white' : 'border-stone-300'
                    }`}>
                      {checked && <CheckIcon />}
                    </span>
                    <span className={`text-sm leading-relaxed transition-colors ${
                      checked ? 'line-through text-stone-400' : 'text-stone-700'
                    }`}>
                      {item}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">{t(lang, 'instructions')}</h2>
          <ol className="space-y-2">
            {recipe.steps.map((step, i) => {
              const checked = checkedSteps.has(i)
              return (
                <li key={i}>
                  <button
                    onClick={() => toggle(setCheckedSteps, i)}
                    className="w-full flex items-start gap-4 py-2 text-left rounded-xl active:bg-stone-50 transition-colors"
                  >
                    <span className={`shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${
                      checked ? 'bg-green-500' : 'bg-[#e85d04]'
                    }`}>
                      {checked ? <CheckIcon /> : i + 1}
                    </span>
                    <p className={`text-sm leading-relaxed pt-1 transition-colors ${
                      checked ? 'line-through text-stone-400' : 'text-stone-700'
                    }`}>
                      {step}
                    </p>
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}

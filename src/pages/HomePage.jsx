import { useState, useMemo } from 'react'
import RecipeCard from '../components/RecipeCard'
import { t, CATEGORY_KEYS } from '../i18n'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-stone-400">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
  )
}

export default function HomePage({ recipes, lang }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return recipes.filter(r => {
      const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      const matchesCategory = category === 'All' || r.category === category
      return matchesSearch && matchesCategory
    })
  }, [recipes, search, category])

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">{t(lang, 'heroTitle')}</h1>
        <p className="text-stone-500 text-sm">{t(lang, 'recipeCount', recipes.length)}</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          placeholder={t(lang, 'searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04]"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-[#e85d04] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {t(lang, CATEGORY_KEYS[cat])}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">{t(lang, 'noRecipesFound')}</p>
          <p className="text-sm mt-1">{t(lang, 'noRecipesHint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}

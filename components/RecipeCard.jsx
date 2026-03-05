'use client'

import Link from 'next/link'
import { t, CATEGORY_KEYS } from '../lib/i18n'
import { categoryColors, formatTime } from '../lib/utils'

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  )
}

export default function RecipeCard({ recipe, lang }) {
  const categoryClass = categoryColors[recipe.category] || 'bg-stone-100 text-stone-600'
  const timeLabel = formatTime(recipe.time)
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100"
    >
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        {recipe.image
          ? <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          : <div className="w-full h-full flex items-center justify-center text-4xl text-stone-300">🍳</div>
        }
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-stone-800 leading-snug line-clamp-2">
            {recipe.title}
          </h2>
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${categoryClass}`}>
            {t(lang, CATEGORY_KEYS[recipe.category] ?? recipe.category)}
          </span>
        </div>
        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-stone-400 mt-auto pt-1">
          <ClockIcon />
          <span>{timeLabel}</span>
          <span className="mx-1">·</span>
          <span>{recipe.servings} {t(lang, 'servings')}</span>
        </div>
      </div>
    </Link>
  )
}

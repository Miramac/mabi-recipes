import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { improveText, generateRecipe } from '../services/ai'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
  )
}

function SparkleButton({ loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Fix with AI"
      className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-[#e85d04] hover:bg-orange-50 transition-colors disabled:opacity-40"
      disabled={loading}
    >
      {loading
        ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.683a1 1 0 01.633.633l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z"/></svg>
      }
    </button>
  )
}

const empty = {
  title: '',
  description: '',
  image: '',
  category: 'Dinner',
  time: '',
  servings: '',
  ingredients: [''],
  steps: [''],
}

export default function FormPage({ getRecipe, addRecipe, updateRecipe }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [aiLoading, setAiLoading] = useState({})
  const [generateLoading, setGenerateLoading] = useState(false)

  useEffect(() => {
    if (isEditing && getRecipe) {
      const recipe = getRecipe(id)
      if (recipe) {
        setForm({
          ...recipe,
          time: String(recipe.time),
          servings: String(recipe.servings),
        })
      }
    }
  }, [id, isEditing, getRecipe])

  async function handleGenerate() {
    if (!form.title.trim()) return
    setGenerateLoading(true)
    try {
      const recipe = await generateRecipe(form.title)
      setForm(f => ({
        ...f,
        description: recipe.description ?? f.description,
        category: recipe.category ?? f.category,
        time: recipe.time != null ? String(recipe.time) : f.time,
        servings: recipe.servings != null ? String(recipe.servings) : f.servings,
        ingredients: recipe.ingredients?.length ? recipe.ingredients : f.ingredients,
        steps: recipe.steps?.length ? recipe.steps : f.steps,
      }))
    } catch { /* silently ignore */ }
    finally { setGenerateLoading(false) }
  }

  async function fixWithAI(key, text, type) {
    if (!text.trim()) return
    setAiLoading(prev => ({ ...prev, [key]: true }))
    try {
      const improved = await improveText(text, type)
      if (key === 'description') {
        setField('description', improved)
      } else if (key.startsWith('ing-')) {
        setListItem('ingredients', Number(key.slice(4)), improved)
      } else if (key.startsWith('step-')) {
        setListItem('steps', Number(key.slice(5)), improved)
      }
    } catch { /* silently ignore */ }
    finally { setAiLoading(prev => ({ ...prev, [key]: false })) }
  }

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function setListItem(field, index, value) {
    setForm(f => {
      const arr = [...f[field]]
      arr[index] = value
      return { ...f, [field]: arr }
    })
  }

  function addListItem(field) {
    setForm(f => ({ ...f, [field]: [...f[field], ''] }))
  }

  function removeListItem(field, index) {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) return setError('Title is required.')
    if (!form.time || isNaN(Number(form.time)) || Number(form.time) <= 0)
      return setError('Please enter a valid time in minutes.')
    if (!form.servings || isNaN(Number(form.servings)) || Number(form.servings) <= 0)
      return setError('Please enter a valid number of servings.')

    const cleanIngredients = form.ingredients.filter(i => i.trim())
    const cleanSteps = form.steps.filter(s => s.trim())
    if (cleanIngredients.length === 0) return setError('Add at least one ingredient.')
    if (cleanSteps.length === 0) return setError('Add at least one step.')

    const data = {
      ...form,
      time: Number(form.time),
      servings: Number(form.servings),
      ingredients: cleanIngredients,
      steps: cleanSteps,
    }

    if (isEditing) {
      updateRecipe(id, data)
      navigate(`/recipe/${id}`)
    } else {
      const newId = addRecipe(data)
      navigate(`/recipe/${newId}`)
    }
  }

  const inputClass = "w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/30 focus:border-[#e85d04]"
  const labelClass = "block text-sm font-medium text-stone-700 mb-1.5"

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
        <h1 className="text-2xl font-bold text-stone-800">
          {isEditing ? 'Edit Recipe' : 'New Recipe'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            placeholder="e.g. Spaghetti Carbonara"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            className={inputClass}
          />
          {!isEditing && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!form.title.trim() || generateLoading}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-orange-50 text-[#e85d04] border border-orange-200 hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {generateLoading
                ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.683a1 1 0 01.633.633l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z"/></svg>
              }
              {generateLoading ? 'Generating…' : 'Generate with AI'}
            </button>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <div className="relative">
            <textarea
              placeholder="A short description of the dish..."
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none pr-10`}
            />
            <div className="absolute bottom-2 right-2">
              <SparkleButton
                loading={!!aiLoading['description']}
                onClick={() => fixWithAI('description', form.description, 'description')}
              />
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className={labelClass}>Image URL</label>
          <input
            type="url"
            placeholder="https://..."
            value={form.image}
            onChange={e => setField('image', e.target.value)}
            className={inputClass}
          />
          {form.image && (
            <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-stone-100">
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          )}
        </div>

        {/* Category / Time / Servings row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={e => setField('category', e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Time (min) *</label>
            <input
              type="number"
              placeholder="30"
              min="1"
              value={form.time}
              onChange={e => setField('time', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Servings *</label>
            <input
              type="number"
              placeholder="4"
              min="1"
              value={form.servings}
              onChange={e => setField('servings', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className={labelClass}>Ingredients *</label>
          <div className="space-y-2">
            {form.ingredients.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ingredient ${i + 1}`}
                  value={item}
                  onChange={e => setListItem('ingredients', i, e.target.value)}
                  className={inputClass}
                />
                <SparkleButton
                  loading={!!aiLoading[`ing-${i}`]}
                  onClick={() => fixWithAI(`ing-${i}`, item, 'ingredient')}
                />
                {form.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('ingredients', i)}
                    className="shrink-0 p-2 text-stone-400 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <RemoveIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('ingredients')}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#e85d04] hover:text-[#d04e00] transition-colors"
          >
            <PlusIcon />
            Add ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className={labelClass}>Instructions *</label>
          <div className="space-y-2">
            {form.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#e85d04] text-white text-xs font-bold flex items-center justify-center mt-2.5">
                  {i + 1}
                </span>
                <textarea
                  placeholder={`Step ${i + 1}`}
                  value={step}
                  onChange={e => setListItem('steps', i, e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-none flex-1`}
                />
                <SparkleButton
                  loading={!!aiLoading[`step-${i}`]}
                  onClick={() => fixWithAI(`step-${i}`, step, 'step')}
                />
                {form.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('steps', i)}
                    className="shrink-0 p-2 text-stone-400 hover:text-red-500 transition-colors mt-1"
                    aria-label="Remove"
                  >
                    <RemoveIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('steps')}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#e85d04] hover:text-[#d04e00] transition-colors"
          >
            <PlusIcon />
            Add step
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#e85d04] hover:bg-[#d04e00] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {isEditing ? 'Save Changes' : 'Save Recipe'}
        </button>
      </form>
    </div>
  )
}

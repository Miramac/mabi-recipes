'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const RecipesContext = createContext({})

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => { setRecipes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function addRecipe(data) {
    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const recipe = await res.json()
    setRecipes(prev => [recipe, ...prev])
    return recipe.id
  }

  async function updateRecipe(id, data) {
    const res = await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setRecipes(prev => prev.map(r => r.id === id ? updated : r))
  }

  async function deleteRecipe(id) {
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  function getRecipe(id) {
    return recipes.find(r => r.id === id)
  }

  return (
    <RecipesContext.Provider value={{ recipes, loading, addRecipe, updateRecipe, deleteRecipe, getRecipe }}>
      {children}
    </RecipesContext.Provider>
  )
}

export const useRecipes = () => useContext(RecipesContext)

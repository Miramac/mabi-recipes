import { useState, useEffect } from 'react'
import { seedRecipes } from '../data/seeds'

const STORAGE_KEY = 'mabi-recipes'

function loadRecipes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore parse errors
  }
  return seedRecipes
}

function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

export function useRecipes() {
  const [recipes, setRecipes] = useState(loadRecipes)

  useEffect(() => {
    saveRecipes(recipes)
  }, [recipes])

  function addRecipe(data) {
    const recipe = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
    setRecipes(prev => [recipe, ...prev])
    return recipe.id
  }

  function updateRecipe(id, data) {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r))
  }

  function deleteRecipe(id) {
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  function getRecipe(id) {
    return recipes.find(r => r.id === id)
  }

  return { recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe }
}

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRecipes } from './hooks/useRecipes'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import FormPage from './pages/FormPage'

export default function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe } = useRecipes()
  const [lang, setLang] = useState(() => localStorage.getItem('mabi-lang') || import.meta.env.VITE_DEFAULT_LANG || 'en')

  useEffect(() => {
    localStorage.setItem('mabi-lang', lang)
  }, [lang])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout lang={lang} setLang={setLang} />}>
          <Route index element={<HomePage recipes={recipes} lang={lang} />} />
          <Route
            path="recipe/:id"
            element={<DetailPage getRecipe={getRecipe} deleteRecipe={deleteRecipe} lang={lang} />}
          />
          <Route
            path="add"
            element={<FormPage addRecipe={addRecipe} getRecipe={getRecipe} updateRecipe={updateRecipe} lang={lang} />}
          />
          <Route
            path="edit/:id"
            element={<FormPage addRecipe={addRecipe} getRecipe={getRecipe} updateRecipe={updateRecipe} lang={lang} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

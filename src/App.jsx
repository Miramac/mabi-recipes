import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRecipes } from './hooks/useRecipes'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import FormPage from './pages/FormPage'

export default function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe } = useRecipes()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage recipes={recipes} />} />
          <Route
            path="recipe/:id"
            element={<DetailPage getRecipe={getRecipe} deleteRecipe={deleteRecipe} />}
          />
          <Route
            path="add"
            element={<FormPage addRecipe={addRecipe} getRecipe={getRecipe} updateRecipe={updateRecipe} />}
          />
          <Route
            path="edit/:id"
            element={<FormPage addRecipe={addRecipe} getRecipe={getRecipe} updateRecipe={updateRecipe} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

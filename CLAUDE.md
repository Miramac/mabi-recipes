# Mabi Recipes — Claude Instructions

## Stack
- Vite + React 19 + Tailwind CSS v4 + react-router-dom v7
- Tailwind configured via `@tailwindcss/vite` plugin (no tailwind.config.js)
- `@import "tailwindcss"` in `src/index.css`
- Brand color: `#e85d04` (orange) via CSS var `--color-brand`

## Project structure
```
src/
  data/seeds.js          # 6 seed recipes, loaded once on first visit
  hooks/useRecipes.js    # localStorage: recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe
  services/ai.js         # callClaude() helper, improveText(), generateRecipe()
  components/
    Layout.jsx           # Top nav (desktop) + bottom nav (mobile) + <Outlet />
    RecipeCard.jsx       # Card with image, title, category badge, time
  pages/
    HomePage.jsx         # Grid + search + category filter
    DetailPage.jsx       # Full recipe view + checkable ingredients/steps
    FormPage.jsx         # Add & Edit form — AI generate button + per-field sparkle buttons
  App.jsx                # Routes + state passed as props
  main.jsx
  index.css
```

## Data model
```js
{ id, title, description, image, category, time (min), servings, ingredients[], steps[], createdAt }
```
- `ingredients` and `steps` are plain string arrays — do not change to objects
- Categories: `Breakfast | Lunch | Dinner | Dessert | Snack`

## AI service (`src/services/ai.js`)
- `callClaude({ system, prompt, maxTokens = 256 })` — shared fetch helper, reads `VITE_ANTHROPIC_API_KEY`
- `improveText(text, type)` — fixes spelling/grammar for `description | ingredient | step`
- `generateRecipe(title)` — returns full recipe object as parsed JSON (maxTokens: 1024)
- Model: `claude-haiku-4-5-20251001`
- Requires `.env` with `VITE_ANTHROPIC_API_KEY=sk-ant-...`

## Key conventions
- No context/Redux — props passed down from App.jsx
- Seed data auto-loaded to localStorage on first visit (empty check in useRecipes)
- Checked ingredients/steps persist in sessionStorage (reset on tab close)
- `npm run dev` to start dev server

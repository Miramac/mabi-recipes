# Mabi Recipes — Claude Instructions

## Stack
- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- Tailwind configured via `@tailwindcss/postcss` (no tailwind.config.js)
- `@import "tailwindcss"` in `app/globals.css`
- Brand color: `#e85d04` (orange) via CSS var `--color-brand`

## Project structure
```
app/
  layout.js              # Root layout — imports Providers + Layout
  page.jsx               # HomePage: grid + search + category filter
  providers.jsx          # Wraps LangProvider + RecipesProvider
  globals.css            # Tailwind import + @theme vars
  add/page.jsx           # Renders <RecipeForm />
  edit/[id]/page.jsx     # Renders <RecipeForm />
  recipe/[id]/page.jsx   # DetailPage: full view + checkable ingredients/steps
  api/
    recipes/route.js           # GET list, POST create
    recipes/[id]/route.js      # GET, PUT, DELETE by id
    ai/improve/route.js        # POST — server-side text improvement
    ai/generate/route.js       # POST — server-side recipe generation
components/
  Layout.jsx             # Top nav (desktop) + bottom nav (mobile) + {children}
  RecipeCard.jsx         # Card with image, title, category badge, time
  RecipeForm.jsx         # Add & Edit form — AI generate + per-field sparkle buttons
contexts/
  LangContext.jsx        # useLang() — lang state + setLang
  RecipesContext.jsx     # useRecipes() — recipes CRUD via fetch
lib/
  db.js                  # better-sqlite3 CRUD: getAll, getById, insert, update, remove
  seeds.js               # 6 seed recipes (inserted on first run)
  i18n.js                # t(lang, key, ...args) helper — EN + DE strings
  ai.js                  # Client-side helpers: improveText(), generateRecipe()
```

## Data model
```js
{ id, title, description, image, category, time (min), servings, ingredients[], steps[], lang, createdAt }
```
- `ingredients` and `steps` are plain string arrays — do not change to objects
- Categories: `Breakfast | Lunch | Dinner | Dessert | Snack`
- `lang`: `'en'` or `'de'` — stored per recipe

## AI service
- Client helpers in `lib/ai.js` call `/api/ai/improve` and `/api/ai/generate`
- Server routes in `app/api/ai/` call Anthropic directly using `process.env.ANTHROPIC_API_KEY`
- Model: `claude-haiku-4-5-20251001`
- AI errors have `.aiType` (`overloaded | auth | network | generic`) for i18n mapping

## Environment variables
```
ANTHROPIC_API_KEY=sk-ant-...          # Server-side only (no NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_DEFAULT_LANG=en           # Baked at build time — default UI language
```

## Key conventions
- All interactive components have `'use client'` directive
- Language and recipes state via React Context (LangContext, RecipesContext)
- Seed data auto-inserted into SQLite on first run (empty table check in db.js)
- SQLite file at `.sqlite/recipes.db` (dir created at startup; ignored by git)
- Checked ingredients/steps persist in sessionStorage (reset on tab close)
- `npm run dev` to start dev server (port 3000)

## Docker
- `Dockerfile`: multi-stage (builder on `node:20-alpine` + runner on `node:20-alpine`)
- `docker-compose.yml`: mounts `sqlite_data` volume at `/app/.sqlite`
- `next.config.js` has `output: 'standalone'` for optimized image
- `NEXT_PUBLIC_DEFAULT_LANG` is a build ARG (baked at image build time)
- `ANTHROPIC_API_KEY` is injected at runtime — never baked into image

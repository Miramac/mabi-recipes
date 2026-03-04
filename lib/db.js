import Database from 'better-sqlite3'
import { seedRecipes } from './seeds.js'
import { mkdirSync } from 'fs'

mkdirSync('.sqlite', { recursive: true })
const db = new Database('.sqlite/recipes.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    category TEXT DEFAULT 'Dinner',
    time INTEGER DEFAULT 30,
    servings INTEGER DEFAULT 4,
    ingredients TEXT DEFAULT '[]',
    steps TEXT DEFAULT '[]',
    lang TEXT DEFAULT 'en',
    createdAt INTEGER
  )
`)

const { n } = db.prepare('SELECT COUNT(*) as n FROM recipes').get()
if (n === 0) {
  const insert = db.prepare(`
    INSERT INTO recipes (id, title, description, image, category, time, servings, ingredients, steps, lang, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const r of seedRecipes) {
    insert.run(
      r.id, r.title, r.description ?? '', r.image ?? '',
      r.category, r.time, r.servings,
      JSON.stringify(r.ingredients), JSON.stringify(r.steps),
      r.lang ?? 'en', r.createdAt
    )
  }
}

function parse(row) {
  return { ...row, ingredients: JSON.parse(row.ingredients), steps: JSON.parse(row.steps) }
}

export const getAll = () =>
  db.prepare('SELECT * FROM recipes ORDER BY createdAt DESC').all().map(parse)

export const getById = (id) => {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id)
  return row ? parse(row) : null
}

export const insert = (r) =>
  db.prepare(`
    INSERT INTO recipes (id, title, description, image, category, time, servings, ingredients, steps, lang, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    r.id, r.title, r.description ?? '', r.image ?? '',
    r.category, r.time, r.servings,
    JSON.stringify(r.ingredients), JSON.stringify(r.steps),
    r.lang ?? 'en', r.createdAt
  )

export const update = (id, r) =>
  db.prepare(`
    UPDATE recipes
    SET title=?, description=?, image=?, category=?, time=?, servings=?, ingredients=?, steps=?, lang=?
    WHERE id=?
  `).run(
    r.title, r.description ?? '', r.image ?? '',
    r.category, r.time, r.servings,
    JSON.stringify(r.ingredients), JSON.stringify(r.steps),
    r.lang ?? 'en', id
  )

export const remove = (id) =>
  db.prepare('DELETE FROM recipes WHERE id = ?').run(id)

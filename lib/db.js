import Database from 'better-sqlite3'
import { seedRecipes } from './seeds.js'
import { migrations } from './migrations.js'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const dbPath = process.env.SQLITE_PATH ?? '.sqlite/recipes.db'
if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true })
const db = new Database(dbPath)

// Run pending migrations using PRAGMA user_version as the version counter
const currentVersion = db.pragma('user_version', { simple: true })
for (let v = currentVersion; v < migrations.length; v++) {
  db.transaction(() => {
    for (const sql of [migrations[v]].flat()) db.exec(sql)
    db.pragma(`user_version = ${v + 1}`)
  })()
}

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
  db.prepare('SELECT * FROM recipes WHERE deletedAt IS NULL ORDER BY createdAt DESC').all().map(parse)

export const getById = (id) => {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ? AND deletedAt IS NULL').get(id)
  return row ? parse(row) : null
}

export const insert = (r) =>
  db.prepare(`
    INSERT INTO recipes (id, title, description, image, category, time, servings, ingredients, steps, lang, createdAt, updatedAt, createdBy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    r.id, r.title, r.description ?? '', r.image ?? '',
    r.category, r.time, r.servings,
    JSON.stringify(r.ingredients), JSON.stringify(r.steps),
    r.lang ?? 'en', r.createdAt, r.updatedAt ?? null, r.createdBy ?? null
  )

export const update = (id, r) =>
  db.prepare(`
    UPDATE recipes
    SET title=?, description=?, image=?, category=?, time=?, servings=?, ingredients=?, steps=?, lang=?, updatedAt=?, updatedBy=?
    WHERE id=?
  `).run(
    r.title, r.description ?? '', r.image ?? '',
    r.category, r.time, r.servings,
    JSON.stringify(r.ingredients), JSON.stringify(r.steps),
    r.lang ?? 'en', r.updatedAt ?? null, r.updatedBy ?? null, id
  )

export const remove = (id) =>
  db.prepare('UPDATE recipes SET deletedAt = ? WHERE id = ?').run(Date.now(), id)

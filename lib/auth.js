import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const dbPath = process.env.SQLITE_PATH ?? '.sqlite/recipes.db'
if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true })

const db = new Database(dbPath)

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
})

// Run after betterAuth() so the user table exists; wrapped in try/catch for build time
try {
  db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_user_name_unique ON "user" (name)')
} catch {}

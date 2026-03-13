import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const dbPath = process.env.SQLITE_PATH ?? '.sqlite/recipes.db'
if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true })

export async function POST(request) {
  const { username } = await request.json()
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })

  const db = new Database(dbPath)
  const row = db.prepare('SELECT email FROM "user" WHERE name = ? LIMIT 1').get(username)
  db.close()

  if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ email: row.email })
}

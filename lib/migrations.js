// Each entry corresponds to a schema version (index + 1).
// Migrations run in order, exactly once, tracked via PRAGMA user_version.
// To add a new migration: append an SQL string (or array of strings) to this list.
export const migrations = [
  // v1 — initial schema
  `CREATE TABLE IF NOT EXISTS recipes (
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
    createdAt INTEGER,
    updatedAt INTEGER DEFAULT NULL,
    createdBy TEXT DEFAULT NULL,
    updatedBy TEXT DEFAULT NULL,
    deletedAt INTEGER DEFAULT NULL
  )`,
]

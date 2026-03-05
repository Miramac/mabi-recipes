import { describe, it, expect, beforeEach, vi } from 'vitest'

// better-sqlite3 requires a native binary not compiled on this machine.
// We replace it with a functional JS implementation that mirrors the same API.
const mockRecords = new Map()

class MockStatement {
  constructor(sql) {
    this._sql = sql.trim()
  }

  get(...args) {
    if (this._sql.includes('COUNT(*)')) return { n: mockRecords.size }
    if (this._sql.includes('WHERE id = ?')) {
      const row = mockRecords.get(args[0]) ?? null
      if (row && this._sql.includes('deletedAt IS NULL') && row.deletedAt) return null
      return row
    }
    return null
  }

  all() {
    return [...mockRecords.values()]
      .filter((r) => !r.deletedAt)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  run(...args) {
    if (this._sql.startsWith('INSERT')) {
      // INSERT (id, title, description, image, category, time, servings, ingredients, steps, lang, createdAt, updatedAt, createdBy)
      const [id, title, description, image, category, time, servings, ingredients, steps, lang, createdAt, updatedAt, createdBy] = args
      mockRecords.set(id, { id, title, description, image, category, time, servings, ingredients, steps, lang, createdAt, updatedAt, createdBy, deletedAt: null })
    } else if (this._sql.includes('SET deletedAt')) {
      const [deletedAt, id] = args
      if (mockRecords.has(id)) mockRecords.set(id, { ...mockRecords.get(id), deletedAt })
    } else if (this._sql.startsWith('UPDATE')) {
      // UPDATE SET title=?, description=?, image=?, category=?, time=?, servings=?, ingredients=?, steps=?, lang=?, updatedAt=?, updatedBy=? WHERE id=?
      const [title, description, image, category, time, servings, ingredients, steps, lang, updatedAt, updatedBy, id] = args
      if (mockRecords.has(id)) {
        mockRecords.set(id, { ...mockRecords.get(id), title, description, image, category, time, servings, ingredients, steps, lang, updatedAt, updatedBy })
      }
    }
  }
}

vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => ({
    exec: vi.fn(),
    pragma: vi.fn().mockReturnValue(0), // 0 = no migrations run yet; returning length skips all
    transaction: vi.fn((fn) => fn),     // returns fn; caller does transaction(fn)()
    prepare: vi.fn((sql) => new MockStatement(sql)),
  })),
}))

// Import after mock is set up (vi.mock is hoisted, so this is safe)
const { getAll, getById, insert, update, remove } = await import('../lib/db.js')

beforeEach(() => mockRecords.clear())

function makeRecipe(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'Test Recipe',
    description: 'A description',
    image: '',
    category: 'Dinner',
    time: 30,
    servings: 4,
    ingredients: JSON.stringify(['salt', 'pepper']),
    steps: JSON.stringify(['Mix', 'Cook']),
    lang: 'en',
    createdAt: Date.now(),
    ...overrides,
  }
}

describe('insert() + getById()', () => {
  it('retrieves an inserted recipe by id', () => {
    const r = makeRecipe()
    insert({ ...r, ingredients: ['salt', 'pepper'], steps: ['Mix', 'Cook'] })
    const found = getById(r.id)
    expect(found).not.toBeNull()
    expect(found.id).toBe(r.id)
    expect(found.title).toBe('Test Recipe')
  })

  it('parses ingredients and steps back to arrays', () => {
    const r = makeRecipe()
    insert({ ...r, ingredients: ['flour', 'water'], steps: ['mix', 'bake'] })
    const found = getById(r.id)
    expect(found.ingredients).toEqual(['flour', 'water'])
    expect(found.steps).toEqual(['mix', 'bake'])
  })

  it('returns null for unknown id', () => {
    expect(getById('non-existent-id')).toBeNull()
  })
})

describe('getAll()', () => {
  it('returns empty array when no records', () => {
    expect(getAll()).toEqual([])
  })

  it('includes inserted recipes', () => {
    const r = makeRecipe({ title: 'Unique Title XYZ' })
    insert({ ...r, ingredients: [], steps: [] })
    const all = getAll()
    expect(all.some((x) => x.id === r.id)).toBe(true)
  })

  it('returns records ordered by createdAt DESC', () => {
    const older = makeRecipe({ createdAt: 1000 })
    const newer = makeRecipe({ createdAt: 9000 })
    insert({ ...older, ingredients: [], steps: [] })
    insert({ ...newer, ingredients: [], steps: [] })
    const all = getAll()
    const olderIdx = all.findIndex((x) => x.id === older.id)
    const newerIdx = all.findIndex((x) => x.id === newer.id)
    expect(newerIdx).toBeLessThan(olderIdx)
  })
})

describe('update()', () => {
  it('modifies recipe fields', () => {
    const r = makeRecipe()
    insert({ ...r, ingredients: [], steps: [] })
    update(r.id, { ...r, title: 'Updated Title', time: 60, ingredients: [], steps: [] })
    const found = getById(r.id)
    expect(found.title).toBe('Updated Title')
    expect(found.time).toBe(60)
  })

  it('preserves array fields after update', () => {
    const r = makeRecipe()
    insert({ ...r, ingredients: [], steps: [] })
    update(r.id, { ...r, ingredients: ['a', 'b', 'c'], steps: ['x'] })
    const found = getById(r.id)
    expect(found.ingredients).toEqual(['a', 'b', 'c'])
    expect(found.steps).toEqual(['x'])
  })
})

describe('remove() — soft delete', () => {
  it('makes the recipe invisible to getById', () => {
    const r = makeRecipe()
    insert({ ...r, ingredients: [], steps: [] })
    expect(getById(r.id)).not.toBeNull()
    remove(r.id)
    expect(getById(r.id)).toBeNull()
  })

  it('makes the recipe invisible to getAll', () => {
    const r = makeRecipe()
    insert({ ...r, ingredients: [], steps: [] })
    remove(r.id)
    expect(getAll().some((x) => x.id === r.id)).toBe(false)
  })

  it('does not throw when removing non-existent id', () => {
    expect(() => remove('ghost-id')).not.toThrow()
  })
})

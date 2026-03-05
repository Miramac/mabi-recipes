import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, opts) => ({ data, status: opts?.status ?? 200 })),
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
}))

vi.mock('../lib/db.js', () => ({
  getAll: vi.fn(),
  insert: vi.fn(),
}))

vi.mock('../lib/auth.js', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

const { GET, POST } = await import('../app/api/recipes/route.js')
const { getAll, insert } = await import('../lib/db.js')
const { auth } = await import('../lib/auth.js')

beforeEach(() => vi.clearAllMocks())

function mockRequest(body) {
  return { json: vi.fn().mockResolvedValue(body) }
}

describe('GET /api/recipes', () => {
  it('returns all recipes from db', async () => {
    const recipes = [{ id: '1', title: 'Pasta' }, { id: '2', title: 'Salad' }]
    getAll.mockReturnValue(recipes)

    const res = await GET()
    expect(res.data).toEqual(recipes)
    expect(res.status).toBe(200)
  })

  it('returns empty array when no recipes exist', async () => {
    getAll.mockReturnValue([])

    const res = await GET()
    expect(res.data).toEqual([])
  })

  it('calls getAll() exactly once', async () => {
    getAll.mockReturnValue([])

    await GET()
    expect(getAll).toHaveBeenCalledTimes(1)
  })
})

describe('POST /api/recipes', () => {
  const sessionUser = { user: { name: 'Alice' } }

  it('returns 401 when no session exists', async () => {
    auth.api.getSession.mockResolvedValue(null)

    const res = await POST(mockRequest({}))
    expect(res.status).toBe(401)
    expect(res.data).toEqual({ error: 'Unauthorized' })
  })

  it('does not call insert when unauthorized', async () => {
    auth.api.getSession.mockResolvedValue(null)

    await POST(mockRequest({}))
    expect(insert).not.toHaveBeenCalled()
  })

  it('creates a recipe and returns 201 when authenticated', async () => {
    auth.api.getSession.mockResolvedValue(sessionUser)
    const input = { title: 'Pasta', category: 'Dinner', time: 20 }

    const res = await POST(mockRequest(input))
    expect(res.status).toBe(201)
    expect(res.data.title).toBe('Pasta')
  })

  it('auto-generates id and createdAt on the new recipe', async () => {
    auth.api.getSession.mockResolvedValue(sessionUser)

    const res = await POST(mockRequest({ title: 'Soup' }))
    expect(typeof res.data.id).toBe('string')
    expect(res.data.id.length).toBeGreaterThan(0)
    expect(typeof res.data.createdAt).toBe('number')
  })

  it('sets createdBy to the session user name', async () => {
    auth.api.getSession.mockResolvedValue(sessionUser)

    const res = await POST(mockRequest({ title: 'Soup' }))
    expect(res.data.createdBy).toBe('Alice')
  })

  it('calls insert() with the new recipe', async () => {
    auth.api.getSession.mockResolvedValue(sessionUser)
    const input = { title: 'Pasta', time: 30 }

    await POST(mockRequest(input))
    expect(insert).toHaveBeenCalledTimes(1)
    const inserted = insert.mock.calls[0][0]
    expect(inserted.title).toBe('Pasta')
  })
})

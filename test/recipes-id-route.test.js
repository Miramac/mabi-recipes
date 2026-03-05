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
  getById: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

vi.mock('../lib/auth.js', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

const { GET, PUT, DELETE } = await import('../app/api/recipes/[id]/route.js')
const { getById, update, remove } = await import('../lib/db.js')
const { auth } = await import('../lib/auth.js')

beforeEach(() => vi.clearAllMocks())

const params = (id) => ({ params: Promise.resolve({ id }) })

function mockRequest(body) {
  return { json: vi.fn().mockResolvedValue(body) }
}

const RECIPE = { id: 'abc', title: 'Pasta', category: 'Dinner', time: 20 }
const SESSION = { user: { name: 'Bob' } }

describe('GET /api/recipes/[id]', () => {
  it('returns the recipe when found', async () => {
    getById.mockReturnValue(RECIPE)

    const res = await GET(mockRequest(null), params('abc'))
    expect(res.data).toEqual(RECIPE)
    expect(res.status).toBe(200)
  })

  it('returns 404 when recipe does not exist', async () => {
    getById.mockReturnValue(null)

    const res = await GET(mockRequest(null), params('missing'))
    expect(res.status).toBe(404)
    expect(res.data).toEqual({ error: 'Not found' })
  })

  it('returns 404 for soft-deleted recipes (getById returns null)', async () => {
    // db.getById already returns null for soft-deleted records
    getById.mockReturnValue(null)

    const res = await GET(mockRequest(null), params('deleted-id'))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/recipes/[id]', () => {
  it('returns 401 when no session', async () => {
    auth.api.getSession.mockResolvedValue(null)

    const res = await PUT(mockRequest({ title: 'Updated' }), params('abc'))
    expect(res.status).toBe(401)
    expect(res.data).toEqual({ error: 'Unauthorized' })
  })

  it('does not call update when unauthorized', async () => {
    auth.api.getSession.mockResolvedValue(null)

    await PUT(mockRequest({ title: 'Updated' }), params('abc'))
    expect(update).not.toHaveBeenCalled()
  })

  it('returns 404 when recipe not found', async () => {
    auth.api.getSession.mockResolvedValue(SESSION)
    getById.mockReturnValue(null)

    const res = await PUT(mockRequest({ title: 'Updated' }), params('missing'))
    expect(res.status).toBe(404)
    expect(res.data).toEqual({ error: 'Not found' })
  })

  it('calls update and returns updated recipe', async () => {
    auth.api.getSession.mockResolvedValue(SESSION)
    const updated = { ...RECIPE, title: 'Updated Pasta' }
    getById.mockReturnValueOnce(RECIPE).mockReturnValueOnce(updated)

    const res = await PUT(mockRequest({ title: 'Updated Pasta' }), params('abc'))
    expect(update).toHaveBeenCalledTimes(1)
    expect(res.data.title).toBe('Updated Pasta')
  })

  it('sets updatedBy to session user name', async () => {
    auth.api.getSession.mockResolvedValue(SESSION)
    getById.mockReturnValue(RECIPE)

    await PUT(mockRequest({ title: 'New Title' }), params('abc'))

    const [, updatedData] = update.mock.calls[0]
    expect(updatedData.updatedBy).toBe('Bob')
  })

  it('stamps updatedAt as a numeric timestamp', async () => {
    auth.api.getSession.mockResolvedValue(SESSION)
    getById.mockReturnValue(RECIPE)
    const before = Date.now()

    await PUT(mockRequest({ title: 'New Title' }), params('abc'))

    const [, updatedData] = update.mock.calls[0]
    expect(typeof updatedData.updatedAt).toBe('number')
    expect(updatedData.updatedAt).toBeGreaterThanOrEqual(before)
  })
})

describe('DELETE /api/recipes/[id]', () => {
  it('returns 401 when no session', async () => {
    auth.api.getSession.mockResolvedValue(null)

    const res = await DELETE(mockRequest(null), params('abc'))
    expect(res.status).toBe(401)
    expect(res.data).toEqual({ error: 'Unauthorized' })
  })

  it('does not call remove when unauthorized', async () => {
    auth.api.getSession.mockResolvedValue(null)

    await DELETE(mockRequest(null), params('abc'))
    expect(remove).not.toHaveBeenCalled()
  })

  it('calls remove() with the correct id', async () => {
    auth.api.getSession.mockResolvedValue(SESSION)

    await DELETE(mockRequest(null), params('abc'))
    expect(remove).toHaveBeenCalledWith('abc')
  })

  it('returns 204 with no body on success', async () => {
    auth.api.getSession.mockResolvedValue(SESSION)

    const res = await DELETE(mockRequest(null), params('abc'))
    // The route returns `new Response(null, { status: 204 })`
    expect(res.status).toBe(204)
  })
})

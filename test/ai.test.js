import { describe, it, expect, vi, afterEach } from 'vitest'
import { improveText, generateRecipe } from '../lib/ai.js'

function mockFetch(ok, body) {
  const json = vi.fn().mockResolvedValue(body)
  return vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json })
}

afterEach(() => vi.unstubAllGlobals())

describe('improveText()', () => {
  it('returns result on success', async () => {
    vi.stubGlobal('fetch', mockFetch(true, { result: 'improved text' }))
    const result = await improveText('raw text', 'description', 'en')
    expect(result).toBe('improved text')
  })

  it('throws with aiType on error response', async () => {
    vi.stubGlobal('fetch', mockFetch(false, { error: 'overloaded' }))
    await expect(improveText('text', 'description')).rejects.toMatchObject({
      aiType: 'overloaded',
    })
  })

  it('falls back to "unknown" when error body is malformed', async () => {
    const json = vi.fn().mockRejectedValue(new Error('bad json'))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json }))
    await expect(improveText('text', 'description')).rejects.toMatchObject({
      aiType: 'unknown',
    })
  })

  it('sends correct request body', async () => {
    const fetchMock = mockFetch(true, { result: 'ok' })
    vi.stubGlobal('fetch', fetchMock)
    await improveText('hello', 'title', 'de')
    const [, options] = fetchMock.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({ text: 'hello', type: 'title', lang: 'de' })
  })
})

describe('generateRecipe()', () => {
  it('returns parsed JSON on success', async () => {
    const recipe = { title: 'Pasta', ingredients: [], steps: [] }
    vi.stubGlobal('fetch', mockFetch(true, recipe))
    const result = await generateRecipe('Pasta', 'en', [])
    expect(result).toEqual(recipe)
  })

  it('throws with aiType on error response', async () => {
    vi.stubGlobal('fetch', mockFetch(false, { error: 'auth' }))
    await expect(generateRecipe('Pasta')).rejects.toMatchObject({ aiType: 'auth' })
  })

  it('falls back to "unknown" when error body is malformed', async () => {
    const json = vi.fn().mockRejectedValue(new Error('bad json'))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json }))
    await expect(generateRecipe('Pasta')).rejects.toMatchObject({ aiType: 'unknown' })
  })

  it('sends correct request body', async () => {
    const fetchMock = mockFetch(true, { title: 'Pasta' })
    vi.stubGlobal('fetch', fetchMock)
    await generateRecipe('Pasta', 'de', ['egg'])
    const [, options] = fetchMock.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({
      title: 'Pasta',
      lang: 'de',
      existingIngredients: ['egg'],
    })
  })
})

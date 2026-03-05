import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, opts) => ({ data, status: opts?.status ?? 200 })),
  },
}))

afterEach(() => vi.unstubAllGlobals())

function mockAnthropicFetch(ok, responseBody) {
  const bodyText = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    text: vi.fn().mockResolvedValue(bodyText),
    json: vi.fn().mockResolvedValue(typeof responseBody === 'string' ? null : responseBody),
  })
}

function anthropicSuccess(text) {
  return mockAnthropicFetch(true, { content: [{ text }] })
}

function mockRequest(body) {
  return { json: vi.fn().mockResolvedValue(body) }
}

const { POST } = await import('../app/api/ai/generate/route.js')

const VALID_RECIPE = JSON.stringify({
  title: 'Pasta',
  description: 'A classic dish',
  category: 'Dinner',
  time: 20,
  servings: 4,
  ingredients: ['pasta', 'sauce'],
  steps: ['boil', 'mix'],
})

describe('POST /api/ai/generate — JSON parsing', () => {
  it('returns parsed recipe JSON from plain response', async () => {
    vi.stubGlobal('fetch', anthropicSuccess(VALID_RECIPE))
    const res = await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))
    expect(res.data.title).toBe('Pasta')
    expect(res.data.ingredients).toEqual(['pasta', 'sauce'])
  })

  it('strips ```json ... ``` fences from AI response', async () => {
    vi.stubGlobal('fetch', anthropicSuccess('```json\n' + VALID_RECIPE + '\n```'))
    const res = await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))
    expect(res.data.title).toBe('Pasta')
  })

  it('strips ``` ... ``` fences without language tag', async () => {
    vi.stubGlobal('fetch', anthropicSuccess('```\n' + VALID_RECIPE + '\n```'))
    const res = await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))
    expect(res.data.title).toBe('Pasta')
  })

  it('returns 500 with error "invalid_response" when JSON is unparseable', async () => {
    vi.stubGlobal('fetch', anthropicSuccess('this is not json'))
    const res = await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))
    expect(res.data).toEqual({ error: 'invalid_response' })
    expect(res.status).toBe(500)
  })
})

describe('POST /api/ai/generate — error handling', () => {
  it('returns Anthropic error type when API call fails', async () => {
    const errorBody = { error: { type: 'overloaded_error' } }
    vi.stubGlobal('fetch', mockAnthropicFetch(false, errorBody))
    const res = await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))
    expect(res.data).toEqual({ error: 'overloaded_error' })
    expect(res.status).toBe(500)
  })

  it('falls back to "unknown" when error body is not valid JSON', async () => {
    vi.stubGlobal('fetch', mockAnthropicFetch(false, 'gateway timeout'))
    const res = await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))
    expect(res.data).toEqual({ error: 'unknown' })
  })
})

describe('POST /api/ai/generate — request construction', () => {
  it('includes German instruction for lang "de"', async () => {
    const fetchMock = anthropicSuccess(VALID_RECIPE)
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ title: 'Pasta', lang: 'de', existingIngredients: [] }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.system).toContain('German')
  })

  it('omits German instruction for lang "en"', async () => {
    const fetchMock = anthropicSuccess(VALID_RECIPE)
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.system).not.toContain('German')
  })

  it('includes existing ingredients hint when provided', async () => {
    const fetchMock = anthropicSuccess(VALID_RECIPE)
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: ['egg', 'flour'] }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('egg')
    expect(body.messages[0].content).toContain('flour')
  })

  it('filters whitespace-only existing ingredients', async () => {
    const fetchMock = anthropicSuccess(VALID_RECIPE)
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: ['egg', '  ', ''] }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('egg')
    expect(body.messages[0].content).not.toContain('  ')
  })

  it('omits ingredients hint when list is empty', async () => {
    const fetchMock = anthropicSuccess(VALID_RECIPE)
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).not.toContain('already has these ingredients')
  })

  it('sends to correct Anthropic endpoint with correct model', async () => {
    const fetchMock = anthropicSuccess(VALID_RECIPE)
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ title: 'Pasta', lang: 'en', existingIngredients: [] }))

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(JSON.parse(options.body).model).toBe('claude-haiku-4-5-20251001')
  })
})

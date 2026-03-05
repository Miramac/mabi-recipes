import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, opts) => ({ data, status: opts?.status ?? 200 })),
  },
}))

afterEach(() => vi.unstubAllGlobals())

function mockAnthropicFetch(ok, responseBody) {
  const bodyText = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)
  const jsonMock = typeof responseBody === 'string'
    ? vi.fn().mockRejectedValue(new SyntaxError('Unexpected token'))
    : vi.fn().mockResolvedValue(responseBody)
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    text: vi.fn().mockResolvedValue(bodyText),
    json: jsonMock,
  })
}

function mockRequest(body) {
  return { json: vi.fn().mockResolvedValue(body) }
}

const { POST } = await import('../app/api/ai/improve/route.js')

describe('POST /api/ai/improve', () => {
  it('returns trimmed result on success', async () => {
    const anthropicResponse = { content: [{ text: '  improved text  ' }] }
    vi.stubGlobal('fetch', mockAnthropicFetch(true, anthropicResponse))

    const res = await POST(mockRequest({ text: 'raw', type: 'description', lang: 'en' }))
    expect(res.data).toEqual({ result: 'improved text' })
    expect(res.status).toBe(200)
  })

  it('returns error with status when Anthropic fails', async () => {
    const errorBody = { error: { type: 'overloaded_error' } }
    vi.stubGlobal('fetch', mockAnthropicFetch(false, errorBody))

    const res = await POST(mockRequest({ text: 'raw', type: 'description', lang: 'en' }))
    expect(res.data).toEqual({ error: 'overloaded_error' })
    expect(res.status).toBe(500)
  })

  it('falls back to "unknown" error type when Anthropic error body is not JSON', async () => {
    vi.stubGlobal('fetch', mockAnthropicFetch(false, 'not json at all'))

    const res = await POST(mockRequest({ text: 'raw', type: 'description', lang: 'en' }))
    expect(res.data).toEqual({ error: 'unknown' })
  })

  it('selects the description prompt for type "description"', async () => {
    const fetchMock = mockAnthropicFetch(true, { content: [{ text: 'ok' }] })
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ text: 'desc', type: 'description', lang: 'en' }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('description')
  })

  it('selects the ingredient prompt for type "ingredient"', async () => {
    const fetchMock = mockAnthropicFetch(true, { content: [{ text: 'ok' }] })
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ text: '2 eggs', type: 'ingredient', lang: 'en' }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('ingredient')
  })

  it('selects the step prompt for type "step"', async () => {
    const fetchMock = mockAnthropicFetch(true, { content: [{ text: 'ok' }] })
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ text: 'mix it', type: 'step', lang: 'en' }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.messages[0].content).toContain('step')
  })

  it('includes German language instruction for lang "de"', async () => {
    const fetchMock = mockAnthropicFetch(true, { content: [{ text: 'gut' }] })
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ text: 'text', type: 'description', lang: 'de' }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.system).toContain('German')
  })

  it('includes English language instruction for lang "en"', async () => {
    const fetchMock = mockAnthropicFetch(true, { content: [{ text: 'good' }] })
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ text: 'text', type: 'description', lang: 'en' }))

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.system).toContain('English')
  })

  it('sends request to Anthropic with correct model and version', async () => {
    const fetchMock = mockAnthropicFetch(true, { content: [{ text: 'ok' }] })
    vi.stubGlobal('fetch', fetchMock)

    await POST(mockRequest({ text: 'text', type: 'description', lang: 'en' }))

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    const body = JSON.parse(options.body)
    expect(body.model).toBe('claude-haiku-4-5-20251001')
    expect(options.headers['anthropic-version']).toBe('2023-06-01')
  })
})

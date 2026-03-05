import { describe, it, expect } from 'vitest'
import { AI_MODEL, AI_API_VERSION } from '../lib/aiConfig.js'

describe('aiConfig', () => {
  it('AI_MODEL is the expected haiku model', () => {
    expect(AI_MODEL).toBe('claude-haiku-4-5-20251001')
  })

  it('AI_API_VERSION is the expected Anthropic API version', () => {
    expect(AI_API_VERSION).toBe('2023-06-01')
  })

  it('AI_MODEL is a non-empty string', () => {
    expect(typeof AI_MODEL).toBe('string')
    expect(AI_MODEL.length).toBeGreaterThan(0)
  })

  it('AI_API_VERSION matches date format YYYY-MM-DD', () => {
    expect(AI_API_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

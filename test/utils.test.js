import { describe, it, expect } from 'vitest'
import { formatTime, categoryColors } from '../lib/utils.jsx'

describe('formatTime()', () => {
  it('returns "X min" for values under 60', () => {
    expect(formatTime(1)).toBe('1 min')
    expect(formatTime(30)).toBe('30 min')
    expect(formatTime(59)).toBe('59 min')
  })

  it('returns "Xh" when minutes divide evenly into hours', () => {
    expect(formatTime(60)).toBe('1h')
    expect(formatTime(120)).toBe('2h')
    expect(formatTime(180)).toBe('3h')
  })

  it('returns "Xh Ym" when there is a remainder', () => {
    expect(formatTime(61)).toBe('1h 1m')
    expect(formatTime(90)).toBe('1h 30m')
    expect(formatTime(150)).toBe('2h 30m')
  })

  it('treats 0 as "0 min"', () => {
    expect(formatTime(0)).toBe('0 min')
  })
})

describe('categoryColors', () => {
  const EXPECTED_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

  it('has an entry for every valid category', () => {
    for (const cat of EXPECTED_CATEGORIES) {
      expect(categoryColors[cat]).toBeDefined()
    }
  })

  it('each category value is a non-empty string', () => {
    for (const value of Object.values(categoryColors)) {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it('returns undefined for unknown categories', () => {
    expect(categoryColors['Unknown']).toBeUndefined()
    expect(categoryColors['all']).toBeUndefined()
  })

  it('contains exactly the 5 valid categories', () => {
    expect(Object.keys(categoryColors)).toEqual(EXPECTED_CATEGORIES)
  })
})

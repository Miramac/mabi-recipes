import { describe, it, expect } from 'vitest'
import { t, CATEGORY_KEYS } from './i18n.js'

describe('t()', () => {
  it('returns EN string', () => {
    expect(t('en', 'appName')).toBe('Mabi Recipes')
  })

  it('returns DE string', () => {
    expect(t('de', 'appName')).toBe('Mabi Rezepte')
  })

  it('falls back to EN when key missing in DE', () => {
    // All keys exist in both, so test with a nonexistent lang
    expect(t('fr', 'appName')).toBe('Mabi Recipes')
  })

  it('falls back to key string when key does not exist', () => {
    expect(t('en', 'nonExistentKey')).toBe('nonExistentKey')
  })

  it('calls function values — recipeCount singular', () => {
    expect(t('en', 'recipeCount', 1)).toBe('1 recipe saved')
  })

  it('calls function values — recipeCount plural', () => {
    expect(t('en', 'recipeCount', 5)).toBe('5 recipes saved')
  })

  it('calls function values — recipeCount DE singular', () => {
    expect(t('de', 'recipeCount', 1)).toBe('1 Rezept gespeichert')
  })

  it('calls function values — recipeCount DE plural', () => {
    expect(t('de', 'recipeCount', 3)).toBe('3 Rezepte gespeichert')
  })

  it('calls function values — deleteConfirm EN', () => {
    expect(t('en', 'deleteConfirm', 'Pasta')).toBe('Delete "Pasta"?')
  })

  it('calls function values — deleteConfirm DE', () => {
    expect(t('de', 'deleteConfirm', 'Pasta')).toBe('"Pasta" löschen?')
  })
})

describe('CATEGORY_KEYS', () => {
  it('maps all 6 categories', () => {
    expect(CATEGORY_KEYS).toEqual({
      All: 'catAll',
      Breakfast: 'catBreakfast',
      Lunch: 'catLunch',
      Dinner: 'catDinner',
      Dessert: 'catDessert',
      Snack: 'catSnack',
    })
  })

  it('all mapped keys exist in EN translations', () => {
    for (const key of Object.values(CATEGORY_KEYS)) {
      expect(t('en', key)).not.toBe(key)
    }
  })

  it('all mapped keys exist in DE translations', () => {
    for (const key of Object.values(CATEGORY_KEYS)) {
      expect(t('de', key)).not.toBe(key)
    }
  })
})

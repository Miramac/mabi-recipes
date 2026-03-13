// Client-side helpers — call our own Next.js API routes (keeps API key server-side)

function aiErrFromResponse(status, errorType) {
  const err = new Error(errorType)
  err.aiType = errorType
  err.status = status
  return err
}

export async function improveText(text, type, lang = 'en') {
  const res = await fetch('/api/ai/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, type, lang }),
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'unknown' }))
    throw aiErrFromResponse(res.status, error)
  }
  const { result } = await res.json()
  return result
}

export async function generateRecipe(title, lang = 'en', existingIngredients = [], description = '') {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, lang, existingIngredients, description }),
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'unknown' }))
    throw aiErrFromResponse(res.status, error)
  }
  return res.json()
}

import { NextResponse } from 'next/server'

export async function POST(request) {
  const { title, lang = 'en', existingIngredients = [] } = await request.json()
  const langInstruction = lang === 'de'
    ? ' Write all recipe content (title, description, ingredients, steps) in German.'
    : ''
  const filledIngredients = existingIngredients.filter(i => i.trim())
  const ingredientsHint = filledIngredients.length
    ? `\nThe user already has these ingredients: ${filledIngredients.join(', ')}. Incorporate them if it makes sense.`
    : ''

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a helpful cooking assistant. Return ONLY valid JSON, no markdown, no explanation.${langInstruction}`,
      messages: [{
        role: 'user',
        content: `Generate a complete recipe for "${title}".${ingredientsHint}\nReturn JSON with exactly these keys:\n{"title":"...","description":"...","category":"Breakfast|Lunch|Dinner|Dessert|Snack","time":30,"servings":4,"ingredients":["..."],"steps":["..."]}`,
      }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    let error = 'unknown'
    try { error = JSON.parse(body).error?.type ?? 'unknown' } catch {}
    return NextResponse.json({ error }, { status: res.status })
  }

  const data = await res.json()
  const text = data.content[0].text.trim()
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return NextResponse.json(JSON.parse(clean))
}

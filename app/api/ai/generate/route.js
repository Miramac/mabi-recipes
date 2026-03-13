import { NextResponse } from 'next/server'
import { AI_MODEL, AI_API_VERSION } from '../../../../lib/aiConfig'

export async function POST(request) {
  const { title, lang = 'en', existingIngredients = [], description = '' } = await request.json()
  const langInstruction = lang === 'de'
    ? ' Write all recipe content (title, description, ingredients, steps) in German.'
    : ''
  const filledIngredients = existingIngredients.filter(i => i.trim())
  const ingredientsHint = filledIngredients.length
    ? `\nThe user already has these ingredients: ${filledIngredients.join(', ')}. Incorporate them if it makes sense.`
    : ''
  const descriptionHint = description.trim()
    ? `\nThe user describes the dish as: "${description.trim()}". Use this as inspiration for the recipe.`
    : ''

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': AI_API_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 2048,
      system: `You are a helpful cooking assistant. Return ONLY valid JSON, no markdown, no explanation.${langInstruction}`,
      messages: [{
        role: 'user',
        content: `Generate a complete recipe for "${title}".${ingredientsHint}${descriptionHint}\nReturn JSON with exactly these keys:\n{"title":"...","description":"...","category":"Breakfast|Lunch|Dinner|Dessert|Snack","time":30,"servings":4,"ingredients":["..."],"steps":["..."]}`,
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
  try {
    return NextResponse.json(JSON.parse(clean))
  } catch {
    return NextResponse.json({ error: 'invalid_response' }, { status: 500 })
  }
}

const PROMPTS = {
  description: 'Fix spelling, grammar and improve the style of this recipe description:',
  ingredient:  'Fix spelling and grammar of this ingredient line. Keep it concise:',
  step:        'Fix spelling, grammar and improve the clarity of this cooking step:',
}

async function callClaude({ system, prompt, maxTokens = 256 }) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) {
    console.error('[AI] No API key — add VITE_ANTHROPIC_API_KEY to your .env file')
    throw new Error('No API key')
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[AI] Request failed ${res.status}:`, body)
    throw new Error(`AI request failed: ${res.status}`)
  }

  const data = await res.json()
  return data.content[0].text.trim()
}

export async function improveText(text, type, lang = 'en') {
  console.log(`[AI] Improving ${type}:`, text)
  const langInstruction = lang === 'de'
    ? ' Respond in German.'
    : ' Respond in English.'
  const result = await callClaude({
    system: `You are a helpful cooking assistant. Fix spelling, grammar and improve clarity. Return ONLY the corrected text, no explanation, no quotes, no extra formatting.${langInstruction}`,
    prompt: `${PROMPTS[type]}\n\n${text}`,
  })
  console.log('[AI] Result:', result)
  return result
}

export async function generateRecipe(title, lang = 'en', existingIngredients = []) {
  console.log('[AI] Generating recipe for:', title, `(lang: ${lang})`)
  const langInstruction = lang === 'de'
    ? ' Write all recipe content (title, description, ingredients, steps) in German.'
    : ''
  const filledIngredients = existingIngredients.filter(i => i.trim())
  const ingredientsHint = filledIngredients.length
    ? `\nThe user already has these ingredients: ${filledIngredients.join(', ')}. Incorporate them if it makes sense.`
    : ''
  const text = await callClaude({
    system: `You are a helpful cooking assistant. Return ONLY valid JSON, no markdown, no explanation.${langInstruction}`,
    prompt: `Generate a complete recipe for "${title}".${ingredientsHint}\nReturn JSON with exactly these keys:\n{"title":"...","description":"...","category":"Breakfast|Lunch|Dinner|Dessert|Snack","time":30,"servings":4,"ingredients":["..."],"steps":["..."]}`,
    maxTokens: 1024,
  })
  console.log('[AI] Generated:', text)
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(clean)
}

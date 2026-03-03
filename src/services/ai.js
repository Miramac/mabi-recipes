const SYSTEM = `You are a helpful cooking assistant. Fix spelling, grammar and improve clarity. Return ONLY the corrected text, no explanation, no quotes, no extra formatting.`

const PROMPTS = {
  description: 'Fix spelling, grammar and improve the style of this recipe description:',
  ingredient:  'Fix spelling and grammar of this ingredient line. Keep it concise:',
  step:        'Fix spelling, grammar and improve the clarity of this cooking step:',
}

export async function improveText(text, type) {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) {
    console.error('[AI] No API key — add VITE_ANTHROPIC_API_KEY to your .env file')
    throw new Error('No API key')
  }

  console.log(`[AI] Improving ${type}:`, text)

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
      max_tokens: 512,
      system: SYSTEM,
      messages: [{ role: 'user', content: `${PROMPTS[type]}\n\n${text}` }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[AI] Request failed ${res.status}:`, body)
    throw new Error(`AI request failed: ${res.status}`)
  }

  const data = await res.json()
  const result = data.content[0].text.trim()
  console.log(`[AI] Result:`, result)
  return result
}

import { NextResponse } from 'next/server'

const PROMPTS = {
  description: 'Fix spelling, grammar and improve the style of this recipe description:',
  ingredient:  'Fix spelling and grammar of this ingredient line. Keep it concise:',
  step:        'Fix spelling, grammar and improve the clarity of this cooking step:',
}

export async function POST(request) {
  const { text, type, lang = 'en' } = await request.json()
  const langInstruction = lang === 'de' ? ' Respond in German.' : ' Respond in English.'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: `You are a helpful cooking assistant. Fix spelling, grammar and improve clarity. Return ONLY the corrected text, no explanation, no quotes, no extra formatting.${langInstruction}`,
      messages: [{ role: 'user', content: `${PROMPTS[type]}\n\n${text}` }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    let error = 'unknown'
    try { error = JSON.parse(body).error?.type ?? 'unknown' } catch {}
    return NextResponse.json({ error }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json({ result: data.content[0].text.trim() })
}
